import json
import logging
import math
from typing import Dict, List

from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.app_functions_error_messages import AppFunctionsErrors
from api.constants.apps.app_variables_error_messages import AppVariablesErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    App,
    AppContainer,
    AppProjectMapping,
    AppUser,
    ContainerMapping,
    ProgressBar,
)
from api.schemas.apps.app_schema import (
    ApplyThemeRequestSchema,
    AppOverviewUpdateRequestSchema,
    CreateAppRequestSchema,
    ProgressBarRequestSchema,
)
from fastapi import status
from sqlalchemy import and_, asc, or_
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class AppDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def link_app_to_project(self, app_id: int, project_id: int) -> None:
        """
        Link app to project

        Args:
            app_id: app's id
            project_id: project's id
        """
        try:
            app_project_mapping = AppProjectMapping(app_id=app_id, project_id=project_id, is_active=True)
            self.db_session.add(app_project_mapping)
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.LINK_APP_TO_PROJECT_ERROR.value},
            )

    def check_app_by_id(self, app_id: int) -> int:
        """
        Check if app for given id exists

        Args:
            app_id: app's id

        Returns:
            Count of apps with given id
        """
        try:
            return self.db_session.query(App).filter_by(id=app_id, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.CHECK_APP_EXISTS_ERROR.value},
            )

    def get_app_by_id(self, app_id: int) -> App:
        """
        Gets the app details given app id

        Args:
            app_id: app's id

        Returns:
            App details
        """
        try:
            return self.db_session.query(App).filter_by(id=app_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_APP_ERROR.value},
            )

    def add_app_variables(self, variables: str, app_id: int) -> App:
        """
        Add variable to an app

        Args:
            app_id: app's id
            variable: variable to be added to the app

        Returns:
            Updated App details
        """
        try:
            app = self.db_session.query(App).filter_by(id=app_id).first()
            app.variables = variables
            self.db_session.commit()
            return app
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppVariablesErrors.CREATE_APP_VARIABLE_ERROR.value},
            )

    def add_app_functions(self, function_defns: str, app_id: int) -> App:
        """
        Add function to an app
        Args:
            app_id: app's id
            function_defns: function definition to be added to the app
        Returns:
            Updated App details
        """
        try:
            app = self.db_session.query(App).filter_by(id=app_id).first()
            app.function_defns = function_defns
            self.db_session.commit()
            return app
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppFunctionsErrors.CREATE_APP_FUNCTION_ERROR.value},
            )

    def create_app(self, user_id: int, request_data: CreateAppRequestSchema) -> App:
        try:
            new_app = App(
                name=request_data.app_name,
                contact_email=request_data.contact_email,
                modules=json.dumps(
                    {
                        "nac_collaboration": getattr(request_data, "nac_collaboration", False),
                        "top_navbar": getattr(request_data, "top_navbar", False),
                    }
                ),
                app_creator_id=user_id,
                is_connected_systems_app=getattr(request_data, "is_connected_systems_app", False),
                created_by=user_id,
            )
            new_app.problem = request_data.app_name
            new_app.environment = "preview"

            new_app_container = self.create_app_container(orderby=0, problem=request_data.app_name)
            new_app.container_id = new_app_container.id

            self.db_session.add(new_app)
            self.add_container_mapping(request_data.industry_id, request_data.function_id, new_app.container_id)
            self.db_session.commit()
            return new_app
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.CREATE_APP_ERROR.value},
            )

    def create_app_from_source_app(self, user_id: int, request_data: CreateAppRequestSchema) -> App:
        """
        Create app with given source app id

        Args:
            user_id: int,
            request_data: CreateAppRequestSchema

        Returns:
            Newly created App
        """
        try:
            source_app = self.get_app_by_id(request_data.source_app_id)

            new_app = App(
                name=source_app.name,
                contact_email=source_app.contact_email,
                modules=source_app.modules,
                app_creator_id=user_id,
                is_connected_systems_app=source_app.is_connected_systems_app,
                created_by=user_id,
            )

            if source_app.container_id:
                new_app.container_id = source_app.container_id
            else:
                new_app_container: AppContainer = self.create_app_container(
                    orderby=source_app.orderby, problem=request_data.app_name
                )
                source_app.container_id = new_app_container.id
                new_app.container_id = new_app_container.id

            new_app.problem = source_app.problem
            new_app.environment = request_data.env_key
            new_app.source_app_id = source_app.id

            self.db_session.add(new_app)
            self.db_session.commit()

            return new_app

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.CREATE_APP_ERROR.value},
            )

    def create_app_container(self, orderby: int, problem: str) -> AppContainer:
        """
        Create app container

        Args:
            orderby: int
            problem: str

        Returns:
            Newly created App Container
        """
        try:
            new_app_container = AppContainer(orderby=orderby, problem=problem)
            self.db_session.add(new_app_container)
            self.db_session.commit()
            return new_app_container
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_CONTAINER_CREATE_ERROR.value},
            )

    def create_app_container_import_app(self, orderby: int, problem: str) -> AppContainer:
        """
        Create app container

        Args:
            orderby: int
            problem: str

        Returns:
            Newly created App Container
        """
        try:
            new_app_container = AppContainer(orderby=orderby, problem=problem)
            return new_app_container
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_CONTAINER_CREATE_ERROR.value},
            )

    def get_container_mappings_by_container_id(self, container_id: int) -> List[ContainerMapping]:
        """
        Get all container mappings for given container id

        Args:
            container_id: int

        Returns:
            List of container mappings for given container id
        """
        try:
            return self.db_session.query(ContainerMapping).filter_by(container_id=container_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_CONTAINER_MAPPINGS_ERROR.value},
            )

    def add_container_mapping(self, industry_id: int, function_id: int, container_id: int) -> None:
        try:
            container_mappings = self.get_container_mappings_by_container_id(container_id=container_id)
            new_container_mapping = ContainerMapping(
                industry_id=industry_id,
                function_id=function_id,
                container_id=container_id,
            )
            if container_mappings:
                __mapping_exists__ = False
                for mapping in container_mappings:
                    if mapping.industry_id == industry_id and mapping.function_id == function_id:
                        __mapping_exists__ = True
                        break
                    else:
                        self.db_session.delete(mapping)

                if not __mapping_exists__:
                    self.db_session.add(new_container_mapping)
            else:
                self.db_session.add(new_container_mapping)

            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.CREATE_CONTAINER_MAPPING_ERROR.value},
            )

    def get_apps_under_same_container(self, parent_container: AppContainer) -> List[App]:
        """
        Get all apps under given parent container

        Args:
            parent_container: parent container of an app

        Returns:
            List of apps under given parent container
        """
        try:
            return self.db_session.query(App).filter_by(parent_container=parent_container).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_PARENT_CONTAINER_APPS_ERROR.value},
            )

    def update_app_overview(
        self,
        user_id: int,
        app: App,
        request_data: AppOverviewUpdateRequestSchema,
        modules: dict,
    ) -> None:
        """
        Update app overview

        Args:
            user_id: id of the user updating the app overview
            app: app being updated
            request_data: data to be updated

        Returns:
            Updated app overview details
        """
        try:
            app.name = request_data.app_name
            app.contact_email = request_data.contact_email
            app.logo_blob_name = request_data.logo_blob_name
            app.small_logo_blob_name = request_data.small_logo_blob_name
            app.description = request_data.description
            app.problem = request_data.problem_area
            app.updated_at = func.now()
            app.updated_by = user_id
            app.modules = json.dumps(modules)

            self.add_container_mapping(request_data.industry_id, request_data.function_id, app.container_id)

            self.db_session.commit()

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_OVERVIEW_UPDATE_ERROR.value},
            )

    def save_app_modules(self, modules: dict, app_id: int) -> App:
        """
        Add modules to an app

        Args:
            app_id: app's id
            module: module object to be added to the app

        Returns:
            Updated App details
        """
        try:
            app = self.db_session.query(App).filter_by(id=app_id).first()
            app.modules = json.dumps(modules)
            self.db_session.commit()
            return app
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_MODULES_ERROR.value},
            )

    def get_all_applications(
        self,
        industry_ids: List[int],
        function_ids: List[int],
        app_environments: List[str] = [],
    ) -> List:
        """
        Gets list of all the applications with the given industry and function ids under the passed environment

        Args:
            industry_ids: industry ids list
            function_ids: function ids list
            app_environments: app environments list

        Returns:
            List of applications
        """
        try:
            return (
                self.db_session.query(ContainerMapping)
                .filter(
                    or_(
                        ContainerMapping.function_id.in_(function_ids),
                        ContainerMapping.industry_id.in_(industry_ids),
                    )
                )
                .join(
                    App,
                    and_(
                        App.container_id == ContainerMapping.container_id,
                        (App.environment.in_(app_environments) if len(app_environments) else True),
                    ),
                )
                .add_columns(
                    App.id,
                    App.name,
                    ContainerMapping.industry_id,
                    ContainerMapping.function_id,
                    App.color,
                    App.description,
                )
                .filter_by(deleted_at=None)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_APPS_ERROR.value},
            )

    def get_all_apps_by_function_id(self, function_id: int) -> List:
        """
        Gets all applications with the given function id

        Args:
            function_id: function id

        Returns
            List of applications
        """
        try:
            return (
                self.db_session.query(ContainerMapping)
                .filter_by(function_id=function_id)
                .join(
                    App,
                    and_(
                        App.container_id == ContainerMapping.container_id,
                        App.environment == "prod",
                    ),
                )
                .add_columns(
                    App.id,
                    App.name,
                    ContainerMapping.industry_id,
                    ContainerMapping.function_id,
                    App.color,
                    App.description,
                )
                .filter_by(deleted_at=None)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_APPS_ERROR.value},
            )

    def update_app_details(
        self,
        app: App,
        user_id: int,
        industry_id: int,
        function_id: int,
        name: str,
        description: str,
        blueprint_link: str,
        orderby: int,
        config_link: str,
        small_logo_blob_name: str,
        logo_blob_name: str,
        modules: str,
        is_connected_systems_app: bool,
    ) -> Dict:
        """
        Updates passed app details

        Args:
            app: App object to update
            user_id: user's id updating the app
            industry_id: industry id
            function_id: function id
            name: app name
            description: app description
            blueprint_link: blueprint link
            orderby: the order by value
            config_link: app config link
            small_logo_blob_name: small logo blob name
            logo_blob_name: app logo blob name
            modules: app modules deatils
            is_connected_systems_app: flag whether its connected systems app

        Returns:
            Success message
        """
        try:
            app.name = name
            app.description = description
            app.blueprint_link = blueprint_link
            app.orderby = orderby
            app.config_link = config_link
            app.logo_blob_name = logo_blob_name
            app.small_logo_blob_name = small_logo_blob_name
            app.modules = modules
            app.is_connected_systems_app = is_connected_systems_app
            app.updated_at = func.now()
            app.updated_by = user_id

            self.add_container_mapping(industry_id, function_id, app.container_id)

            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_OVERVIEW_UPDATE_ERROR.value},
            )

    def get_apps_list(self, query_params: Dict) -> Dict:
        """
        Gets applications with pagination details

        Args:
            None

        Returns:
            Applications with pagination details
        """
        try:
            page = query_params["page"]
            page_size = query_params["pageSize"]
            filtered = query_params["filtered"]
            data_per_page = page_size if page_size <= 100 else 100
            project_id = query_params.get("project_id", None)
            if project_id:
                query = (
                    self.db_session.query(App)
                    .join(AppProjectMapping, App.id == AppProjectMapping.app_id)
                    .filter(AppProjectMapping.project_id == project_id)
                )
            else:
                query = self.db_session.query(App)
            app_list = query.filter_by(deleted_at=None).order_by(asc(App.name))
            total = query.filter_by(deleted_at=None).count()

            if filtered:
                filter_request = filtered
                filter_data = []
                if len(filter_request):
                    if filter_request["value"] and filter_request["id"]:
                        filter_data.append(
                            App.__getattribute__(App, filter_request["id"]).ilike("%" + filter_request["value"] + "%")
                        )
                if len(filter_data):
                    filter_query = tuple(filter_data)
                    app_list = app_list.filter(and_(*filter_query))

            result = app_list.offset(page * data_per_page).limit(data_per_page).all()
            return {
                "data": result,
                "page": page,
                "pages": math.ceil(total / data_per_page),
                "count": total,
                "pageSize": data_per_page,
                "hasNext": bool(total - (page * data_per_page)),
            }
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_APPS_ERROR.value},
            )

    def apply_app_theme(self, app_id: int, request_data: ApplyThemeRequestSchema) -> Dict:
        """
        Update theme_id for the respective app_id

        Args:
            app_id: app's id
            request_data: data to be updated

        Returns:
            Success dict
        """
        try:
            application = self.get_app_by_id(app_id)
            application.theme_id = request_data.theme_id
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_THEME_UPDATE_ERROR.value},
            )

    def get_user_apps_by_email(self, email_address: str) -> List:
        """
        Gets apps by the given user email address

        Args:
            email_address: email address of the user

        Returns:
            List of user apps
        """
        try:
            return (
                self.db_session.query(AppUser)
                .filter_by(user_email=email_address, deleted_at=None)
                .join(App, App.id == AppUser.app_id)
                .add_columns(AppUser.app_id, App.name, AppUser.id)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.USER_APPS_ERROR.value},
            )

    def get_container_mappings_by_container_ids(self, container_ids: List[int]) -> List[ContainerMapping]:
        """
        Get all container mappings for the given list of container ids

        Args:
            container_ids: list of container ids

        Returns:
            List of container mappings for given container ids list
        """
        try:
            return (
                self.db_session.query(ContainerMapping).filter(ContainerMapping.container_id.in_(container_ids)).all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_CONTAINER_MAPPINGS_ERROR.value},
            )

    def create_import_app(
        self,
        user_id: int,
        name: str,
        contact_email: str,
        is_connected_systems_app: bool,
        modules: str = None,
        theme_id: int = None,
        variables: str = None,
    ) -> App:
        try:
            new_app = App(
                name=name,
                contact_email=contact_email,
                modules=modules,
                theme_id=theme_id,
                app_creator_id=user_id,
                is_connected_systems_app=is_connected_systems_app,
                created_by=user_id,
                variables=variables,
            )
            return new_app
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.CREATE_APP_ERROR.value},
            )

    def reset_app(self, user_id: int, app: App) -> None:
        """
        Reset app overview

        Args:
            user_id: id of the user updating the app overview
            app: app being reset

        Returns:
            Reset app details
        """
        try:
            app.modules = "{}"
            app.variables = None
            app.updated_at = func.now()
            app.updated_by = user_id
            app.blueprint_link = None
            app.function_defns = None

            self.db_session.flush()

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.RESET_APP_ERROR.value},
            )

    def get_progress_bar(self, app_id: int, screen_id: int, user_id: int) -> ProgressBar:
        """
        Get Progress bar by app, screen and user ids

        Args:
            app_id: app id
            screen_id: screen id
            user_id: user id

        Returns:
            ProgessBar object
        """
        try:
            progress_bar = (
                self.db_session.query(ProgressBar)
                .filter_by(app_id=app_id, screen_id=screen_id, user_id=user_id)
                .first()
            )
            return progress_bar
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.PROGRESS_BAR_FETCH_ERROR.value},
            )

    def update_progress_bar(
        self, progress_bar: ProgressBar, request_data: ProgressBarRequestSchema, user_id: int
    ) -> None:
        """
        Update Progress Bar

        Args:
            progress_bar: progress bar to be updated
            request_data: data to be updated
            user_id: user's id

        Returns:
            None
        """
        try:
            # progress_bar.stage = request_data.stage
            progress_bar.message = request_data.message
            # progress_bar.status = request_data.status
            # progress_bar.total_stages = request_data.total_stages
            progress_bar.completed = request_data.completed
            progress_bar.stage_percentage = request_data.stage_percentage
            if getattr(request_data, "type"):
                progress_bar.type = request_data.type
            # if getattr(request_data, "title"):
            #     progress_bar.title = request_data.title
            # if getattr(request_data, "stage_descriptions"):
            #     progress_bar.stage_descriptions = request_data.stage_descriptions
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.PROGRESS_BAR_UPDATE_ERROR.value},
            )

    def create_progress_bar(
        self, request_data: ProgressBarRequestSchema, app_id: int, screen_id: int, user_id: int
    ) -> None:
        """
        Create Progress Bar

        Args:
            request_data: data to be updated
            app_id: app id
            screen_id: screen id
            user_id: user id

        Returns:
            None
        """
        try:
            progress_bar = ProgressBar(
                app_id=app_id,
                user_id=user_id,
                screen_id=screen_id,
                # stage=request_data.stage,
                message=request_data.message,
                # status=request_data.status,
                # total_stages=request_data.total_stages,
                completed=request_data.completed,
                # stage_descriptions=request_data.stage_descriptions,
                # title=request_data.title,
                stage_percentage=request_data.stage_percentage,
                type=getattr(request_data, "type", "create"),
            )
            self.db_session.add(progress_bar)
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.PROGRESS_BAR_UPDATE_ERROR.value},
            )

    def delete_app(self, app: App, user_id: int) -> None:
        """
        Delete app

        Args:
            app: app being deleted
            user_id: id of the user deleting the app

        Returns:
            None
        """
        try:
            app.deleted_at = func.now()
            app.deleted_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.DELETE_APP_ERROR.value},
            )

    def delete_app_project_link(self, app_id: int, user_id: int) -> None:
        """
        Delete app project link

        Args:
            app_id: app's id
            user_id: id of the user deleting the app

        Returns:
            None
        """
        try:
            app_project_mapping = (
                self.db_session.query(AppProjectMapping).filter_by(app_id=app_id, is_active=True).first()
            )
            if app_project_mapping:
                app_project_mapping.deleted_at = func.now()
                app_project_mapping.deleted_by = user_id
                app_project_mapping.is_active = False
                self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
