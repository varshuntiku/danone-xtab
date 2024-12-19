import json
import logging
from typing import Dict, List

from api.configs.settings import AppSettings, get_app_settings
from api.constants.apps.app_error_messages import AppErrors
from api.constants.apps.app_success_messages import AppSuccess
from api.constants.apps.screen_error_messages import ScreenErrors
from api.constants.error_messages import GeneralErrors
from api.daos.apps.app_dao import AppDao
from api.daos.apps.notification_subscription_dao import NotificationSubscriptionDao
from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from api.daos.stories.story_dao import StoryDao
from api.daos.users.app_users_dao import AppUsersDao
from api.daos.users.users_dao import UsersDao
from api.dtos import GenericResponseDTO
from api.dtos.apps.app_dto import (
    AppDTO,
    AppOverviewDTO,
    AppOverviewScreenDTO,
    ExportAppDTO,
    ProgressBarDTO,
    UserAppDTO,
)
from api.dtos.apps.widget_dto import WidgetDTO
from api.helpers.apps.app_helper import AppHelper
from api.helpers.apps.notification_subscripiton_helper import (
    NotificationSubscripitonHelper,
)
from api.helpers.generic_helpers import GenericHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import AppUser
from api.schemas import GenericResponseSchema
from api.schemas.apps.app_schema import (
    AppConfigResponseSchema,
    AppKpisResponseSchema,
    AppLogoResponseSchema,
    ApplyThemeRequestSchema,
    AppModulesRequestSchema,
    AppOverviewUpdateRequestSchema,
    AppOverviewUpdateResponseSchema,
    AppResponseSchema,
    AutoBuildScreenRequestSchema,
    AutoBuildScreenResponseSchema,
    AutoUpdateScreenRequestSchema,
    AutoUpdateScreenResponseSchema,
    CloneAppResponseSchema,
    CloneAppSchema,
    CreateAppRequestSchema,
    DeleteAppResponseSchema,
    GetSimulatorOutputRequestSchema,
    ProgressBarRequestSchema,
    RearrangeWidgetsRequestSchema,
    RearrangeWidgetsResponseSchema,
    ReplicateAppRequestSchema,
    ReplicateAppResponseSchema,
    SetupAppRequestSchema,
    SetupAppResponseSchema,
    UpdateAppDetailsRequestSchema,
    UpdateUserAppsRequestData,
    UserAccessResponseSchema,
    UserAppIdsSchema,
)
from api.schemas.generic_schema import DataResponseSchema, MessageResponseSchema
from api.services.base_service import BaseService
from api.utils.alerts_notifications.notifications import (
    on_progress_loader,
    on_widgets_update,
)
from api.utils.app.app import execute_code_string, sanitize_content
from api.utils.app.screen_filters import get_dynamic_filters_helper
from api.utils.app.widget import generate_layout_details, generate_widget_code
from cryptography.fernet import Fernet
from fastapi import Request, status
from fastapi.responses import Response

settings = get_app_settings()


class AppService(BaseService):
    def __init__(self):
        super().__init__()

        self.app_dao = AppDao(self.db_session)
        self.users_dao = UsersDao(self.db_session)
        self.screen_dao = ScreenDao(self.db_session)
        self.story_dao = StoryDao(self.db_session)
        self.app_helper = AppHelper(self.db_session)
        self.widget_dao = WidgetDao(self.db_session)
        self.app_users_dao = AppUsersDao(self.db_session)
        self.generic_helper = GenericHelper()
        self.app_settings = AppSettings()
        self.notification_subscription_dao = NotificationSubscriptionDao(self.db_session)
        self.notification_subscription_helper = NotificationSubscripitonHelper(self.db_session)

    def link_app_to_project(self, app_id: int, request: dict, key: str = "") -> GenericResponseDTO:
        project_id = None
        if key == "app_data":
            app_data = json.loads((request["app_data"]))
            project_id = app_data.get("project_id")
        else:
            project_id = request.get("project_id")
        if project_id:
            try:
                self.app_dao.link_app_to_project(app_id, project_id)
            except Exception as e:
                logging.exception(e)
                raise GeneralException(
                    message={"error": AppErrors.LINK_APP_TO_PROJECT_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return GenericResponseDTO("success")

    def create_app(self, user_id: int, request_data: CreateAppRequestSchema) -> int:
        if request_data.env_key is not None and request_data.source_app_id:
            source_app_exists = self.app_dao.check_app_by_id(request_data.source_app_id)

            if source_app_exists == 0:
                raise GeneralException(
                    message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            new_app = self.app_dao.create_app_from_source_app(user_id, request_data)

            return new_app.id
        else:
            new_app = self.app_dao.create_app(user_id, request_data)

            return new_app.id

    def get_app_config(
        self, app_id: int, app_user: AppUser, platform_user: dict, user_id: int
    ) -> AppConfigResponseSchema:
        app_exists = self.app_dao.check_app_by_id(app_id)
        if app_exists == 0:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        app = self.app_dao.get_app_by_id(app_id)

        container_mapping_details = self.app_dao.get_container_mappings_by_container_id(app.container_id)

        apps_under_same_container = self.app_dao.get_apps_under_same_container(app.parent_container)

        env_apps = [{"id": el.id, "environment": el.environment} for el in apps_under_same_container]

        app_screens = self.screen_dao.get_screens_by_app_id(app_id=app.id)

        app_modules = json.loads(app.modules) if app.modules else {}
        user_mgmt = app_modules.get("user_mgmt", False)
        story_enabled = app_modules.get("data_story", False)
        story_count = 0
        if story_enabled:
            story_count = self.story_dao.get_stories_by_app_id_count(app.id)

        screens = []
        if user_mgmt and not platform_user.get("feature_access", {}).get("app_publish", False):
            if app_user:
                screens, app_screens = self.app_helper.update_app_screens_for_app_user(screens, app_screens, app_user)
            else:
                app_screens = []

        return AppOverviewDTO(
            app=app,
            env_apps=env_apps,
            app_screens=app_screens,
            app_modules=app_modules,
            story_count=story_count,
            app_user=app_user,
            screens=screens,
            container_mapping_details=container_mapping_details,
            app_helper=self.app_helper,
            generic_helper=self.generic_helper,
            screen_dao=self.screen_dao,
            user_id=user_id,
            notification_subscription_dao=self.notification_subscription_dao,
            notification_subscription_helper=self.notification_subscription_helper,
        )

    def update_app_overview(
        self, user_id: int, app_id: int, request_data: AppOverviewUpdateRequestSchema
    ) -> AppOverviewUpdateResponseSchema:
        app_exists = self.app_dao.check_app_by_id(app_id)
        if app_exists == 0:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        app = self.app_dao.get_app_by_id(app_id)
        modules = json.loads(app.modules)
        modules["nac_collaboration"] = getattr(request_data, "nac_collaboration", False)
        modules["top_navbar"] = getattr(request_data, "top_navbar", False)
        self.app_dao.update_app_overview(user_id, app, request_data, modules)

        return {"status": "success"}

    def get_app_kpi_list(
        self, request: Request, access_token: str, app_id: int, limit: int
    ) -> List[AppKpisResponseSchema]:
        app_exists = self.app_dao.check_app_by_id(app_id)
        if app_exists == 0:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        kpi_list = []
        try:
            widget_value = self.widget_dao.get_widget_value(app_id, limit)
        except Exception as e:
            logging.exception(e)
            return kpi_list
        for el in widget_value:
            try:
                data = json.loads(el[0])
                widget_config = json.loads(el[2]) if el[2] else None
                if data.get("is_dynamic", False):
                    try:
                        (
                            selected_filters,
                            selected_filter_logs,
                            error_lineno,
                        ) = get_dynamic_filters_helper(request, app_id, el[4], access_token, el[3])
                        code = data.get("code", False)
                        code = (
                            code
                            + """
code_outputs = dynamic_outputs
            """
                        )
                        file_prefix = f"widget_code_{app_id}_{el[5]}_{request.state.logged_in_email}_"
                        code_string_response = execute_code_string(
                            app_id=app_id,
                            code_string=code,
                            injected_vars={
                                "simulator_inputs": {},
                                "selected_filters": (
                                    selected_filters
                                    if isinstance(selected_filters, bool)
                                    else selected_filters.get("defaultValues", None)
                                ),
                                "user_info": request.state.user_info,
                            },
                            access_token=access_token,
                            file_prefix=file_prefix,
                        )
                        data = json.loads(code_string_response["code_string_output"]["code_outputs"])
                    except Exception as error_msg:
                        logging.exception(error_msg)
                        data = None
                kpi_list.append({"name": el[1], "data": data, "config": widget_config})
            except Exception as error_msg:
                logging.exception(error_msg, log_exception=False)
                kpi_list.append({"name": el[1], "data": el[0], "config": widget_config})
        return kpi_list

    def save_app_modules(self, request_data: AppModulesRequestSchema, app_id: int) -> GenericResponseDTO:
        app = self.app_dao.get_app_by_id(app_id)
        if app is None:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        if app.modules:
            app_modules = json.loads(app.modules)
        else:
            app_modules = {}
        existing_responsibilities = app_modules.get("responsibilities", [])
        if request_data.responsibilities:
            app_modules["responsibilities"] = request_data.responsibilities
            app.modules = self.app_dao.save_app_modules(app_modules, app_id)
        else:
            requested_modules = request_data.modules
            requested_modules["responsibilities"] = existing_responsibilities
            app.modules = self.app_dao.save_app_modules(requested_modules, app_id)
        return GenericResponseDTO("success")

    def get_app_logo(self, app_id: int) -> AppLogoResponseSchema:
        app = self.app_dao.get_app_by_id(app_id)

        if not app:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return {"logo_url": (self.generic_helper.get_blob(app.logo_blob_name) if app.logo_blob_name else False)}

    def get_user_access(self) -> UserAccessResponseSchema:
        return {
            "status": "success",
            "special_access_urls": {"special_links": [{"link": "/marketing-dashboard", "component": "MarketingDemo"}]},
        }

    def apply_app_theme(self, app_id: int, request_data: ApplyThemeRequestSchema) -> GenericResponseSchema:
        app = self.app_dao.get_app_by_id(app_id)

        if not app:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        self.app_dao.apply_app_theme(app_id, request_data)

        return {"status": "success"}

    def update_app_details(
        self, app_id: int, user_id: int, request_data: UpdateAppDetailsRequestSchema
    ) -> MessageResponseSchema:
        app = self.app_dao.get_app_by_id(app_id)
        if app is None:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        modules = json.loads(app.modules or "{}")
        modules["nac_collaboration"] = getattr(request_data, "nac_collaboration", False)

        self.app_dao.update_app_details(
            app=app,
            user_id=user_id,
            industry_id=getattr(request_data, "industry_id"),
            function_id=getattr(request_data, "function_id"),
            name=getattr(request_data, "name", None),
            description=getattr(request_data, "description", None),
            blueprint_link=getattr(request_data, "blueprint_link", None),
            orderby=(getattr(request_data, "orderby", None) if getattr(request_data, "orderby") else 0),
            config_link=getattr(request_data, "config_link", None),
            small_logo_blob_name=getattr(request_data, "small_logo_url", None),
            logo_blob_name=getattr(request_data, "logo_url", None),
            modules=json.dumps(modules),
            is_connected_systems_app=getattr(request_data, "is_connected_systems_app", False),
        )

        return {"message": AppSuccess.APP_DETAILS_SUCCESS.value}

    def get_apps(self, query_params: Dict) -> AppResponseSchema:
        result = self.app_dao.get_apps_list(query_params)
        result_data = []
        for app in result["data"]:
            container_mapping_details = self.app_helper.container_mapping_details(app.container_id)
            industry_str = self.app_helper.industry_names(app.container_id)
            function_str = self.app_helper.function_names(app.container_id)
            result_data.append(AppDTO(app, container_mapping_details, industry_str, function_str))
        result["data"] = result_data
        return result

    def get_user_apps(self, email_address: str) -> List[UserAppDTO]:
        user_apps = self.app_dao.get_user_apps_by_email(email_address.lower())
        return [UserAppDTO(user_app) for user_app in user_apps]

    def update_user_apps(
        self, user_id: int, email_address: str, request_data: UpdateUserAppsRequestData
    ) -> GenericResponseDTO:
        try:
            request_data_default_apps = getattr(request_data, "default_apps")
            request_data_user_apps = getattr(request_data, "user_apps")
            default_apps = (
                set(request_data_default_apps)
                if request_data_default_apps
                and all(isinstance(i, int) for i in request_data_default_apps)
                and len(request_data_default_apps) != 0
                else set()
            )
            user_apps = (
                set(request_data_user_apps)
                if request_data_user_apps
                and all(isinstance(i, int) for i in request_data_user_apps)
                and len(request_data_user_apps) != 0
                else set()
            )
            removable_apps = default_apps - user_apps
            create_apps = user_apps - default_apps
            if len(removable_apps) != 0:
                # Loop for Deleting Apps
                for application_id in removable_apps:
                    app_user = self.app_users_dao.get_app_user_by_email_app_id(
                        email_address=email_address.lower(), app_id=application_id
                    )
                    if app_user is None:
                        raise GeneralException(
                            message={"error": AppErrors.USER_APP_NOT_FOUND_ERROR.value},
                            status_code=status.HTTP_404_NOT_FOUND,
                        )
                    else:
                        self.app_users_dao.delete_app_user(
                            app_user,
                            app_user_id=app_user.id,
                            user_id=user_id,
                            flush_only=True,
                        )
            if len(create_apps) != 0:
                # Loop for creation of Apps
                for application in create_apps:
                    app_user = self.app_users_dao.get_app_user_by_email_app_id(
                        email_address=email_address.lower(), app_id=application
                    )
                    if app_user is not None:
                        raise GeneralException(
                            message={"error": AppErrors.USER_APP_EXISTS_ERROR.value},
                            status_code=status.HTTP_404_NOT_FOUND,
                        )
                    else:
                        self.app_users_dao.create_app_user(
                            app_id=application,
                            first_name=getattr(request_data, "first_name", None),
                            last_name=getattr(request_data, "last_name", None),
                            email_address=email_address.lower(),
                            user_roles=[],
                            permissions=None,
                            user_id=user_id,
                            flush_only=True,
                        )
            self.app_users_dao.perform_commit()
            return GenericResponseDTO("success")
        except Exception as e:
            self.app_users_dao.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AppErrors.USER_APPS_UPDATE_ERROR.value},
            )

    def get_user_app_ids(self, logged_in_email: str) -> UserAppIdsSchema:
        accessible_apps = []
        landing_url = ""
        user_apps = self.app_users_dao.get_all_user_apps_by_email(logged_in_email)
        accessible_apps = [app.app_id for app in user_apps]

        if len(accessible_apps) > 1:
            landing_url = "/my-dashboard"

        app_ids = accessible_apps if len(accessible_apps) >= 1 else False
        return {
            "status": "success",
            "app_id": accessible_apps[0] if len(accessible_apps) == 1 else app_ids,
            "landing_url": landing_url,
        }

    def download_app(self, app_id: int) -> Response:
        CODX_APP_VERSION = self.app_settings.API_VERSION
        source_app = self.app_dao.get_app_by_id(app_id)

        app_screens_to_be_replicated = self.screen_dao.get_screens_by_app_id(app_id)
        app_screen_widgets_to_be_replicated = self.widget_dao.get_widgets_by_app_id(app_id)
        app_screen_widget_value_to_be_replicated = self.widget_dao.get_widget_values_by_app_id(app_id)

        for app_widget_values in app_screen_widget_value_to_be_replicated:
            __widget_value__ = json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
            if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                raise GeneralException(
                    message={"error": AppErrors.CANNOT_REPLICATE_APP_ERROR.value},
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                )

        complete_app_info = ExportAppDTO(
            CODX_APP_VERSION=CODX_APP_VERSION,
            CLIENT_HTTP_ORIGIN=self.app_settings.CLIENT_HTTP_ORIGIN,
            source_app=source_app,
            app_screens_to_be_replicated=app_screens_to_be_replicated,
            app_screen_widgets_to_be_replicated=app_screen_widgets_to_be_replicated,
            app_screen_widget_value_to_be_replicated=app_screen_widget_value_to_be_replicated,
        ).__dict__

        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)

        encoded_app_info = fernet.encrypt(json.dumps(complete_app_info).encode())

        headers = {
            "Content-Disposition": f"attachment;filename = {source_app.name}.txt",
            "Content-Type": "text/plain",
        }
        return Response(encoded_app_info, headers=headers)

    async def import_app(self, request: Request, form: Dict) -> CloneAppResponseSchema:
        app_data = json.loads((form["app_data"]))
        fernet = Fernet(self.app_settings.CRYPTO_ENCRYPTION_KEY)
        source_file_data = await form["source_file"].read()
        try:
            srouce_app_data = json.loads(fernet.decrypt(source_file_data).decode())
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                {"error": AppErrors.IMPORT_FILE_READ_ERROR.value}, status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        app_data["source_app_data"] = srouce_app_data
        return self.app_helper.handle_clone_app(app_data, user_id=request.state.user.id)

    def clone_app(self, request_data: CloneAppSchema, user_id: int) -> CloneAppResponseSchema:
        return self.app_helper.handle_clone_app(request_data.__dict__, user_id=user_id)

    def reset_app(self, app_id: int, user_id: int) -> GenericResponseSchema:
        app_to_be_reset = self.app_dao.get_app_by_id(app_id=app_id)
        self.app_dao.reset_app(user_id=user_id, app=app_to_be_reset)

        self.screen_dao.delete_screens_by_app_id(app_id=app_id, user_id=user_id)
        self.widget_dao.delete_widgets_by_app_id(app_id=app_id, user_id=user_id)
        self.widget_dao.delete_widget_values_by_app_id(app_id=app_id, user_id=user_id)
        self.screen_dao.delete_filter_values_by_app_id(app_id=app_id, user_id=user_id)

        self.db_session.commit()

        return GenericResponseDTO("success")

    def replicate_app(self, request_data: ReplicateAppRequestSchema, user_id: int) -> ReplicateAppResponseSchema:
        return self.app_helper.handle_replicate_app(request_data.__dict__, user_id=user_id)

    def setup_app_project(self, request_data: SetupAppRequestSchema, app_id: int) -> SetupAppResponseSchema:
        app = self.app_dao.get_app_by_id(app_id)
        if app is None:
            raise GeneralException(
                message={"error": AppErrors.APP_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        app.blueprint_link = "/projects/" + str(request_data.project_id) + "/design"
        self.db_session.commit()
        return {"status": "success", "blueprint_link": app.blueprint_link}

    def get_simulator_output(
        self,
        app_id: int,
        access_token: str,
        user_info: Dict,
        logged_in_email: str,
        request_data: GetSimulatorOutputRequestSchema,
    ) -> DataResponseSchema:
        try:
            inputs = request_data.inputs
            selected_filters = request_data.selected_filters
            code = (
                request_data.code
                + """
code_outputs = json.loads(json.dumps(simulator_outputs,cls=plotly.utils.PlotlyJSONEncoder))
"""
            )
            file_prefix = f"execute_code_{app_id}_{logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "simulator_inputs": inputs,
                    "selected_filters": selected_filters,
                    "user_info": user_info,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )
            return {"data": sanitize_content(code_string_response["code_string_output"]["code_outputs"])}
        except Exception as error_msg:
            logging.exception(error_msg)
            raise GeneralException(
                message={"error": GeneralErrors.CODE_EXECUTION_ERROR.value},
                status_code=status.HTTP_400_BAD_REQUEST,
            )

    def auto_build_screen(
        self, app_id: int, request_data: AutoBuildScreenRequestSchema, user_id: int
    ) -> AutoBuildScreenResponseSchema:
        try:
            DEFAULT_INNOVATION_APP_ID = 1329
            DEFAULT_APP_SCREEN_NAME = "Screen One"
            app_id = app_id if app_id else DEFAULT_INNOVATION_APP_ID
            screen_name = getattr(request_data, "screen_name", DEFAULT_APP_SCREEN_NAME)

            existing_screen = self.screen_dao.check_app_screen_exist_by_name(
                app_id=app_id,
                screen_name=screen_name,
                screen_id=getattr(request_data, "screen_id", None),
            )
            if existing_screen:
                if existing_screen.hidden:
                    raise GeneralException(
                        status.HTTP_409_CONFLICT,
                        message={"error": ScreenErrors.SCREEN_NAME_EXISTS_HIDDEN.value},
                    )
                else:
                    raise GeneralException(
                        status.HTTP_409_CONFLICT,
                        message={"error": ScreenErrors.SCREEN_NAME_EXISTS.value},
                    )

            final_widgets = list(
                filter(lambda widget: widget.get("component_type") != "filter", getattr(request_data, "widgets"))
            )
            max_screen_index = self.screen_dao.get_max_screen_index(app_id)
            horizontal, graph_type, graph_width, graph_height = generate_layout_details(getattr(request_data, "layout"))
            filters = list(
                filter(lambda widget: widget.get("component_type") == "filter", getattr(request_data, "widgets"))
            )
            screen_filters_value = None
            if len(filters) and filters[0].get("full_code", None):
                screen_filters_value = {
                    "code": generate_widget_code("filter", filters[0].get("full_code", None)),
                    "is_dynamic": True,
                }
            custom_layout = {
                "app_id": app_id,
                "layout_options": {
                    "graph_height": graph_height,
                    "graph_type": graph_type,
                    "graph_width": graph_width,
                    "horizontal": horizontal,
                    "custom_layout": True,
                    "no_graphs": len(list(filter(lambda widget: widget.get("component_type") != "kpi", final_widgets))),
                    "no_labels": len(list(filter(lambda widget: widget.get("component_type") == "kpi", final_widgets))),
                },
            }
            self.screen_dao.update_custom_layouts(custom_layout)
            if getattr(request_data, "screen_id"):
                screen = self.screen_dao.get_screen_by_id(id=getattr(request_data, "screen_id"))
                if not screen:
                    raise GeneralException(
                        message={"error": AppErrors.APP_SCREEN_NOT_FOUND_ERROR.value},
                        status_code=status.HTTP_404_NOT_FOUND,
                    )
                self.screen_dao.update_app_screen(
                    app_screen=screen,
                    user_id=user_id,
                    screen_filters_value=json.dumps(screen_filters_value) if screen_filters_value else None,
                    horizontal=horizontal,
                    graph_type=graph_type,
                    graph_width=graph_width,
                    graph_height=graph_height,
                    screen_name=screen_name,
                )
            else:
                screen = self.screen_dao.auto_create_screen(
                    user_id=user_id,
                    app_id=app_id,
                    screen_index=max_screen_index + 1,
                    screen_details={"name": screen_name, "hidden": False},
                    screen_item={"level": 0},
                    screen_filters_value=json.dumps(screen_filters_value) if screen_filters_value else None,
                    horizontal=horizontal,
                    graph_type=graph_type,
                    graph_width=graph_width,
                    graph_height=graph_height,
                )
            widget_ids_mapping = {}
            screen_id = screen.id
            app_screen_name = screen.screen_name
            for index, widget in enumerate(final_widgets):
                config = {"title": widget["title"], "sub_title": "", "prefix": "", "metric_factor": "", "code": ""}
                screen_widget = self.widget_dao.add_widget(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_index=index,
                    widget_key=widget["title"],
                    is_label=widget.get("component_type") == "kpi",
                    config=json.dumps(config),
                    user_id=user_id,
                    flush_only=True,
                )
                if widget.get("full_code"):
                    incoming_widget_value = {
                        "is_dynamic": True,
                        "code": generate_widget_code(widget.get("component_type"), widget.get("full_code", None)),
                    }
                    self.widget_dao.add_widget_value(
                        app_id=app_id,
                        screen_id=screen.id,
                        widget_id=screen_widget.id,
                        user_id=user_id,
                        widget_value_code=json.dumps(incoming_widget_value),
                        widget_simulated_value=None,
                        widget_filter_value_code=None,
                        flush_only=True,
                    )
                    widget_ids_mapping[widget.get("id")] = screen_widget.id
            self.app_dao.perform_commit()
            return {
                "message": AppSuccess.APP_SCREEN_SUCCESS.value,
                "url": f"{settings.CLIENT_HTTP_ORIGIN}/app/{app_id}/{app_screen_name.lower().replace(' ', '-')}",
                "screen_id": screen_id,
                "widget_ids_mapping": widget_ids_mapping,
            }
        except Exception as e:
            self.app_dao.perform_rollback()
            logging.exception(e)
            message = AppErrors.AUTO_BUILD_SCREEN_ERROR.value
            if hasattr(e, "exception_type") and e.exception_type == "General Exception":
                message = e.message["error"]
            return {
                "message": message,
                "url": None,
                "screen_id": None,
                "widget_ids_mapping": None,
            }

    async def auto_update_screen_widgets(
        self, app_id: int, request_data: AutoUpdateScreenRequestSchema, user_id: int
    ) -> AutoUpdateScreenResponseSchema:
        try:
            updated_widgets_ids = []
            is_filters_updated = False
            screen_id = getattr(request_data, "screen_id")
            filters = list(
                filter(lambda widget: widget.get("component_type") == "filter", getattr(request_data, "widgets"))
            )
            if len(filters) and filters[0].get("full_code", None):
                is_filters_updated = True
                screen_filters_value = {
                    "code": generate_widget_code("filter", filters[0].get("full_code", None)),
                    "is_dynamic": True,
                }
                self.screen_dao.update_app_screen_filters(
                    screen_id=screen_id, user_id=user_id, screen_filters_value=json.dumps(screen_filters_value)
                )
            widgets = list(
                filter(lambda widget: widget.get("component_type") != "filter", getattr(request_data, "widgets"))
            )
            for widget in widgets:
                updated_widgets_ids.append(widget.get("widget_id"))
                widget_details = self.widget_dao.get_widget_by_id(id=widget.get("widget_id"))
                if widget_details:
                    current_title = json.loads(widget_details.config)["title"]
                    if current_title != widget.get("title"):
                        self.widget_dao.update_widget(
                            id=widget.get("widget_id"),
                            config=json.dumps(
                                {
                                    "title": widget["title"],
                                    "sub_title": "",
                                    "prefix": "",
                                    "metric_factor": "",
                                    "code": "",
                                }
                            ),
                            widget_key=widget["title"],
                            user_id=user_id,
                            flush_only=True,
                        )
                    if widget.get("full_code"):
                        incoming_widget_value = {
                            "is_dynamic": True,
                            "code": generate_widget_code(widget.get("component_type"), widget.get("full_code", None)),
                        }
                        self.widget_dao.update_widget_value(
                            app_id=app_id,
                            screen_id=screen_id,
                            widget_id=widget.get("widget_id"),
                            user_id=user_id,
                            widget_value_code=json.dumps(incoming_widget_value),
                            widget_filter_value_code=None,
                            flush_only=True,
                        )
            self.widget_dao.perform_commit()
            widgets_update_payload = {
                "updated_widgets_ids": updated_widgets_ids,
                "is_filters_updated": is_filters_updated,
            }
            await on_widgets_update(widgets_update_payload, user_id, app_id, screen_id)
            # return {"message": AppSuccess.APP_SCREEN_WIDGETS_UPDATE_SUCCESS.value}
            return {
                "message": AppSuccess.APP_SCREEN_WIDGETS_UPDATE_SUCCESS.value,
                "extra_info": {
                    **widgets_update_payload,
                },
            }

        except Exception as e:
            self.widget_dao.perform_rollback()
            logging.exception(e)
            return {"message": AppErrors.AUTO_SCREEN_WIDGETS_UPDATE_ERROR.value}

    def update_widget_order(
        self, app_id: int, screen_id: int, user_id: int, request_data: RearrangeWidgetsRequestSchema
    ) -> RearrangeWidgetsResponseSchema:
        try:
            widgets = getattr(request_data, "widgets", [])

            for widget in widgets:
                widget_id = widget["id"]
                new_index = widget["widget_index"]
                existing_widget = self.widget_dao.get_widget_by_id(widget_id)
                if existing_widget and existing_widget.screen_id == screen_id:
                    self.widget_dao.update_widget_index(widget_id=widget_id, new_index=new_index, user_id=user_id)

            self.widget_dao.perform_commit()
            widget_list, _ = self.widget_dao.get_widgets_by_app_screen_ids(app_id, screen_id)
            result = [WidgetDTO(widget).__dict__ for widget in widget_list]
            return {"message": AppSuccess.APP_SCREEN_WIDGETS_ORDER_SUCCESS.value, "widgets": result}

        except Exception as e:
            self.widget_dao.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AppErrors.SCREEN_WIDGETS_ORDER_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_progress_bar(self, app_id: int, screen_id: int, user_id: int) -> ProgressBarDTO:
        progress_bar = self.app_dao.get_progress_bar(app_id, screen_id, user_id)
        if not progress_bar:
            raise GeneralException(status_code=status.HTTP_404_NOT_FOUND, message={"error": "Progress bar not found"})
        app_screen = self.screen_dao.get_screen_by_id(screen_id)
        app_screens = self.screen_dao.get_screens_by_app_id(app_id=app_id)
        return ProgressBarDTO(
            progress_bar,
            app_screen,
            app_screens,
            self.screen_dao,
            self.notification_subscription_dao,
            self.notification_subscription_helper,
        )

    async def progress_bar_update(
        self,
        app_id: int,
        screen_id: int,
        user_id: int,
        request_data: ProgressBarRequestSchema,
    ) -> MessageResponseSchema:
        found_progress_bar = self.app_dao.get_progress_bar(app_id, screen_id, user_id)
        if found_progress_bar:
            self.app_dao.update_progress_bar(found_progress_bar, request_data, user_id)
        else:
            self.app_dao.create_progress_bar(request_data, app_id, screen_id, user_id)

        app_screen = self.screen_dao.get_screen_by_id(screen_id)
        app_screens = self.screen_dao.get_screens_by_app_id(app_id=app_id)
        socket_payload = request_data.__dict__
        socket_payload["screen_id"] = screen_id
        socket_payload["screen_name"] = app_screen.screen_name
        socket_payload["screens"] = (
            [
                AppOverviewScreenDTO(
                    screen,
                    self.screen_dao,
                    self.notification_subscription_dao,
                    app_id,
                    user_id,
                    self.notification_subscription_helper,
                ).__dict__
                for screen in app_screens
            ],
        )
        await on_progress_loader(socket_payload, user_id, app_id, screen_id)
        # return {"message": "Success"}
        return {"message": "Success", "extra_info": {**socket_payload}}

    def delete_app(self, app_id: int, user_id: int) -> DeleteAppResponseSchema:
        app = self.app_dao.get_app_by_id(app_id)
        if app is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        self.app_dao.delete_app(app, user_id)
        self.app_dao.delete_app_project_link(app_id, user_id)
        return {"app_deleted": 1}
