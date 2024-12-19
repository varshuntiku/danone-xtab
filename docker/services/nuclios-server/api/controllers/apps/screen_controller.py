from typing import List

from api.controllers.base_controller import BaseController
from api.schemas import (
    CommentStateResponseSchema,
    GenericDataResponseSchema,
    GenericResponseSchema,
)
from api.schemas.apps.screen_schema import (
    CreateAppScreenRequestSchema,
    CreateAppScreenResponseSchema,
    CreateScreenRequestSchema,
    GetLayoutOptionsResponse,
    GetScreenListSchema,
    GetScreensSchema,
    GetSystemWidgetResponseSchema,
    GetUserGuideResponseSchema,
    InsertLayoutOptionsRequestResponse,
    SaveUserGuideRequestSchema,
    ScreenOverviewDetailSchema,
    UpdateLayoutOptionsRequestResponse,
    UpdateScreenComment,
    UpdateScreenRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.apps.screen_service import ScreenService


class ScreenController(BaseController):
    def get_screens(self, app_id: int) -> List[GetScreenListSchema]:
        with ScreenService() as screen_service:
            response = screen_service.get_screens(app_id)
            return self.get_serialized_list(GetScreenListSchema, response)

    def get_overview_detail(self, app_id, screen_id) -> dict:
        with ScreenService() as screen_service:
            overview = screen_service.get_overview_detail(app_id, screen_id)
            return self.get_serialized_data(ScreenOverviewDetailSchema, overview)

    def get_screen_config(self, app_id: int, user_id: int) -> GetScreensSchema:
        with ScreenService() as screen_service:
            response = screen_service.get_screen_config(app_id, user_id)
            return response

    def save_screen_config(
        self, user_id: int, app_id: int, request_data: CreateScreenRequestSchema
    ) -> GenericResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.save_screen_config(user_id, app_id, request_data)
            return response

    def save_screen_overview(
        self,
        user_id: int,
        app_id: int,
        screen_id: int,
        request_data: CreateScreenRequestSchema,
    ) -> GenericResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.save_screen_overview(user_id, app_id, screen_id, request_data)
            return self.get_serialized_data(GenericResponseSchema, response)

    def update_comment_state(
        self,
        user_id: int,
        app_id: int,
        screen_id: int,
        request_data: UpdateScreenComment,
    ) -> CommentStateResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.update_comment_state(user_id, app_id, screen_id, request_data)
            return response

    def get_system_widgets(self, app_id: int) -> GetSystemWidgetResponseSchema:
        with ScreenService() as screen_service:
            return screen_service.get_system_widgets(app_id)

    def get_layout_options(self, app_id: int) -> List[GetLayoutOptionsResponse]:
        with ScreenService() as screen_service:
            response = screen_service.get_layout_options(app_id)
            return response

    def update_layout_options(self, request_data: UpdateLayoutOptionsRequestResponse) -> dict:
        with ScreenService() as screen_service:
            response = screen_service.update_layout_options(request_data)
            return response

    def insert_layout_options(self, request_data: InsertLayoutOptionsRequestResponse) -> dict:
        with ScreenService() as screen_service:
            response = screen_service.insert_layout_options(request_data)
            return response

    def get_guide(self, app_id: int, screen_id: int) -> GetUserGuideResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.get_guide(app_id, screen_id)
            return response

    def save_guide(
        self, app_id: int, screen_id: int, request_data: SaveUserGuideRequestSchema
    ) -> GenericResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.save_guide(app_id, screen_id, request_data)
            return self.get_serialized_data(GenericResponseSchema, response)

    def update_guide(self, app_id: int, screen_id: int, request_data) -> GenericResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.update_guide(app_id, screen_id, request_data)
            return self.get_serialized_data(GenericResponseSchema, response)

    def get_system_widget_documentation(self, path: str, md_file_name: str) -> GenericDataResponseSchema:
        with ScreenService() as screen_service:
            return screen_service.get_system_widget_documentation(path, md_file_name)

    def delete_screen(self, app_id: int, screen_id: int, user_id: int) -> MessageResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.delete_screen(app_id, screen_id, user_id)
            return response

    def update_screen(
        self, app_id: int, screen_id: int, user_id: int, request_data: UpdateScreenRequestSchema
    ) -> MessageResponseSchema:
        with ScreenService() as screen_service:
            response = screen_service.update_screen(app_id, screen_id, user_id, request_data)
            return response

    async def create_screen(
        self, app_id: int, user_id: int, request_data: CreateAppScreenRequestSchema
    ) -> CreateAppScreenResponseSchema:
        with ScreenService() as screen_service:
            response = await screen_service.create_screen(app_id, user_id, request_data)
            return response
