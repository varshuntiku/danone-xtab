import json
import logging
from typing import List

from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.app_functions_error_messages import AppFunctionsErrors
from api.constants.apps.app_variables_error_messages import AppVariablesErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    App,
    AppContainer,
    AppProjectMapping,
    ContainerMapping,
)
from api.schemas.apps.app_schema import (
    AppOverviewUpdateRequestSchema,
    CreateAppRequestSchema,
)
from fastapi import status
from sqlalchemy.sql import func


class AppDao(BaseDao):
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
            self.perform_rollback()
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
            self.perform_rollback()
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
            logging.exception(e)
            self.perform_rollback()
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
            logging.exception(e)
            self.perform_rollback()
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
                        "nac_collaboration": (
                            request_data.get.nac_collaboration if "nac_collaboration" in request_data else False
                        )
                    }
                ),
                app_creator_id=user_id,
                is_connected_systems_app=(
                    request_data.get.is_connected_systems_app if "is_connected_systems_app" in request_data else False
                ),
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
            self.perform_rollback()
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
            self.perform_rollback()
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
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_CONTAINER_MAPPINGS_ERROR.value},
            )

    def add_container_mapping(self, industry_id: int, function_id: int, container_id: int) -> None:
        try:
            container_mappings = self.get_container_mappings_by_container_id(container_id=container_id)
            new_container_mapping = ContainerMapping(
                industry_id=industry_id, function_id=function_id, container_id=container_id
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
            logging.exception(e)
            self.perform_rollback()
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
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_PARENT_CONTAINER_APPS_ERROR.value},
            )

    def update_app_overview(self, user_id: int, app: App, request_data: AppOverviewUpdateRequestSchema) -> None:
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

            self.add_container_mapping(request_data.industry_id, request_data.function_id, app.container_id)

            self.db_session.commit()

        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.APP_OVERVIEW_UPDATE_ERROR.value},
            )

    def get_app_project_mapping(self, app_id: int) -> AppProjectMapping:
        try:
            return self.db_session.query(AppProjectMapping).filter_by(app_id=app_id, deleted_at=None).first()
        except Exception as e:
            self.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.GET_APP_PROJECT_MAPPING_ERROR.value},
            )
