from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.models.base_models import User
from api.schemas.apps.widget_schema import (
    GeneralWidgetResponseSchema,
    GetArchivedUiacListResponseSchema,
    GetMultiWidgetRequestSchema,
    GetMultiWidgetResponseSchema,
    GetWidgetResponseSchema,
    GetWidgetUiacResponseSchema,
    SaveWidgetConfigRequestSchema,
    SaveWidgetRequestSchema,
    SaveWidgetResponseSchema,
    SaveWidgetUiacRequestSchema,
    TestWidgetVisualizationRequestSchema,
    TestWidgetVisualizationResponseSchema,
    UpdateWidgetConnSystemIdentifierRequestSchema,
    WidgetResponseSchema,
)
from api.schemas.generic_schema import StatusDataResponseSchema, SuccessResponseSchema
from api.services.apps.widget_service import WidgetService
from fastapi import Request, Response


class WidgetController(BaseController):
    def get_widgets(self, app_id: int, screen_id: int, response: Response) -> List[WidgetResponseSchema]:
        with WidgetService() as widget_service:
            response = widget_service.get_widgets(app_id, screen_id, response)
            return response

    def save_widgets(
        self, user_id: int, app_id: int, screen_id: int, request_data: SaveWidgetRequestSchema
    ) -> SaveWidgetResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.save_widgets(user_id, app_id, screen_id, request_data)
            return response

    def save_widget_config(
        self, user_id: int, widget_id: int, request_data: SaveWidgetConfigRequestSchema
    ) -> GeneralWidgetResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.save_widget_config(user_id, widget_id, request_data)
            return response

    def test_visualization(
        self, app_id: int, request_data: TestWidgetVisualizationRequestSchema, request: Request
    ) -> TestWidgetVisualizationResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.test_visualization(app_id, request_data, request)
            return response

    def save_widget_uiac(
        self, user_id: int, app_id: int, screen_id: int, widget_id: int, request_data: SaveWidgetUiacRequestSchema
    ) -> GeneralWidgetResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.save_widget_uiac(user_id, app_id, screen_id, widget_id, request_data)
            return response

    def get_archived_uiacs(self, app_id: int) -> List[GetArchivedUiacListResponseSchema]:
        with WidgetService() as widget_service:
            archived_uiac_list = widget_service.get_archived_uiacs(app_id)
            return self.get_serialized_list(GetArchivedUiacListResponseSchema, archived_uiac_list)

    async def get_multi_widget(
        self, app_id: int, screen_id: int, access_token: str, request_data, request
    ) -> GetMultiWidgetResponseSchema:
        with WidgetService() as widget_service:
            return await widget_service.get_multi_widget(app_id, screen_id, access_token, request_data, request)

    async def get_widget(
        self,
        app_id: int,
        screen_id: int,
        access_token: str,
        request_data: GetMultiWidgetRequestSchema,
        user: User,
        request: Request,
    ) -> GetWidgetResponseSchema:
        with WidgetService() as widget_service:
            return await widget_service.get_widget(app_id, screen_id, access_token, request_data, user, request)

    def get_widget_uiac(self, app_id: int, screen_id: int, widget_id: int) -> GetWidgetUiacResponseSchema | Dict:
        with WidgetService() as widget_service:
            response = widget_service.get_widget_uiac(app_id, screen_id, widget_id)
            return response

    def get_screen_widget(self, app_id: int, screen_id: int, widget_id: int) -> StatusDataResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.get_screen_widget(app_id, screen_id, widget_id)
            return response

    def update_widget_conn_systems_identifier(
        self, app_id: int, widget_id: int, request_data: UpdateWidgetConnSystemIdentifierRequestSchema
    ) -> SuccessResponseSchema:
        with WidgetService() as widget_service:
            response = widget_service.update_widget_conn_systems_identifier(app_id, widget_id, request_data)
            return response

    def get_widget_dynamic_filters(
        self,
        request: Request,
        token: str,
        app_id: int,
        screen_id: int,
        widget_id: int,
        request_data: dict,
    ) -> Dict | bool:
        with WidgetService() as widget_service:
            response = widget_service.get_widget_dynamic_filters(
                request=request,
                token=token,
                app_id=app_id,
                screen_id=screen_id,
                widget_id=widget_id,
                request_data=request_data,
            )
            return response
