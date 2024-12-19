from typing import Dict, List

from api.controllers.base_controller import BaseController
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
    AppSchema,
    AutoBuildScreenRequestSchema,
    AutoBuildScreenResponseSchema,
    AutoUpdateScreenRequestSchema,
    AutoUpdateScreenResponseSchema,
    CloneAppResponseSchema,
    CloneAppSchema,
    CreateAppRequestSchema,
    CreateAppResponseSchema,
    DeleteAppResponseSchema,
    GetSimulatorOutputRequestSchema,
    ProgressBarRequestSchema,
    ProgressBarResponseSchema,
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
    UserAppSchema,
)
from api.schemas.generic_schema import DataResponseSchema, MessageResponseSchema
from api.services.apps.app_service import AppService
from fastapi import Request, Response


class AppController(BaseController):
    def create_app(self, user_id: int, request_data: CreateAppRequestSchema) -> CreateAppResponseSchema:
        with AppService() as app_service:
            new_app_id = app_service.create_app(user_id, request_data)
            app_service.link_app_to_project(new_app_id, request_data.__dict__)
            return {"status": "success", "app_id": new_app_id}

    def get_app_config(
        self, app_id: int, app_user: AppUser, platform_user: dict, user_id: int
    ) -> AppConfigResponseSchema:
        with AppService() as app_service:
            response = app_service.get_app_config(app_id, app_user, platform_user, user_id)
            return response

    def update_app_overview(
        self, user_id: int, app_id: int, request_data: AppOverviewUpdateRequestSchema
    ) -> AppOverviewUpdateResponseSchema:
        with AppService() as app_service:
            response = app_service.update_app_overview(user_id, app_id, request_data)
            return response

    def get_app_kpi_list(self, request: Request, access_token: str, app_id: int, limit: int) -> AppKpisResponseSchema:
        with AppService() as app_service:
            return app_service.get_app_kpi_list(request, access_token, app_id, limit)

    def save_app_modules(self, request_data: AppModulesRequestSchema, app_id: int) -> GenericResponseSchema:
        with AppService() as app_service:
            response = app_service.save_app_modules(request_data, app_id)
            return self.get_serialized_data(GenericResponseSchema, response)

    def get_app_logo(self, app_id: int) -> AppLogoResponseSchema:
        with AppService() as app_service:
            response = app_service.get_app_logo(app_id)
            return response

    def get_user_access(self) -> UserAccessResponseSchema:
        with AppService() as app_service:
            return app_service.get_user_access()

    def get_user_apps(self, email_address: str) -> List[UserAppSchema]:
        with AppService() as app_service:
            response = app_service.get_user_apps(email_address)
            return response

    def update_user_apps(
        self, user_id: int, email_address: str, request_data: UpdateUserAppsRequestData
    ) -> GenericResponseSchema:
        with AppService() as app_service:
            response = app_service.update_user_apps(user_id, email_address, request_data)
            return self.get_serialized_data(GenericResponseSchema, response)

    def apply_app_theme(self, app_id: int, request_data: ApplyThemeRequestSchema) -> GenericResponseSchema:
        with AppService() as app_service:
            return app_service.apply_app_theme(app_id, request_data)

    def update_app_details(
        self, app_id: int, user_id: int, request_data: UpdateAppDetailsRequestSchema
    ) -> MessageResponseSchema:
        with AppService() as app_service:
            return app_service.update_app_details(app_id, user_id, request_data)

    def get_apps(self, query_params: Dict) -> AppResponseSchema:
        with AppService() as app_service:
            response = app_service.get_apps(query_params)
            response["data"] = self.get_serialized_list(AppSchema, response["data"])
            return response

    def get_user_app_ids(self, logged_in_email: str) -> UserAppIdsSchema:
        with AppService() as app_service:
            response = app_service.get_user_app_ids(logged_in_email)
            return response

    def download_app(self, app_id: int) -> Response:
        with AppService() as app_service:
            response = app_service.download_app(app_id)
            return response

    async def import_app(self, request: Request, form: Dict) -> CloneAppResponseSchema:
        with AppService() as app_service:
            response = await app_service.import_app(request, form)
            if "app_id" in response and response["app_id"]:
                app_service.link_app_to_project(response["app_id"], form, "app_data")
            return response

    def clone_app(self, request_data: CloneAppSchema, user_id: int) -> CloneAppResponseSchema:
        with AppService() as app_service:
            response = app_service.clone_app(request_data, user_id)
            if "app_id" in response and response["app_id"]:
                app_service.link_app_to_project(response["app_id"], request_data.__dict__)
            return response

    def reset_app(self, app_id: int, user_id: int) -> GenericResponseSchema:
        with AppService() as app_service:
            response = app_service.reset_app(app_id, user_id)
            response = self.get_serialized_data(GenericResponseSchema, response)
            return response

    def replicate_app(self, request_data: ReplicateAppRequestSchema, user_id: int) -> ReplicateAppResponseSchema:
        with AppService() as app_service:
            response = app_service.replicate_app(request_data, user_id)
            return response

    def setup_app_project(self, request_data: SetupAppRequestSchema, app_id: int) -> SetupAppResponseSchema:
        with AppService() as app_service:
            response = app_service.setup_app_project(request_data, app_id)
            return response

    def get_simulator_output(
        self,
        app_id: int,
        access_token: str,
        user_info: Dict,
        logged_in_email: str,
        request_data: GetSimulatorOutputRequestSchema,
    ) -> DataResponseSchema:
        with AppService() as app_service:
            response = app_service.get_simulator_output(app_id, access_token, user_info, logged_in_email, request_data)
            return response

    def auto_build_screen(
        self, app_id: int, request_data: AutoBuildScreenRequestSchema, user_id: int
    ) -> AutoBuildScreenResponseSchema:
        with AppService() as app_service:
            response = app_service.auto_build_screen(app_id, request_data, user_id)
            return response

    async def auto_update_screen_widgets(
        self, app_id: int, request_data: AutoUpdateScreenRequestSchema, user_id: int
    ) -> AutoUpdateScreenResponseSchema:
        with AppService() as app_service:
            response = await app_service.auto_update_screen_widgets(app_id, request_data, user_id)
            return response

    def update_widget_order(
        self, app_id: int, screen_id: int, user_id: int, request_data: RearrangeWidgetsRequestSchema
    ) -> RearrangeWidgetsResponseSchema:
        with AppService() as app_service:
            response = app_service.update_widget_order(app_id, screen_id, user_id, request_data)
            return response

    def get_progress_bar(self, app_id: int, screen_id: int, user_id: int) -> ProgressBarResponseSchema:
        with AppService() as app_service:
            response = app_service.get_progress_bar(app_id, screen_id, user_id)
            return response

    async def progress_bar_update(
        self,
        app_id: int,
        screen_id: int,
        user_id: int,
        request_data: ProgressBarRequestSchema,
    ) -> MessageResponseSchema:
        with AppService() as app_service:
            response = await app_service.progress_bar_update(app_id, screen_id, user_id, request_data)
            return response

    def delete_app(self, app_id: int, user_id: int) -> DeleteAppResponseSchema:
        with AppService() as app_service:
            response = app_service.delete_app(app_id, user_id)
            return response
