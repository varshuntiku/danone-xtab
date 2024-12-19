from typing import Dict

from api.controllers.base_controller import BaseController
from api.schemas.apps.screen_actions_schema import (
    AppScreenActionHandlerRequestSchema,
    AppScreenActionsCodeStringRequestSchema,
    AppScreenActionsOutputResponseSchema,
    AppScreenActionsRequestSchema,
    AppScreenActionsResponseSchema,
    AppScreenDynamicActionsRequestSchema,
    AppScreenGetActionsResponseSchema,
    AppScreenResponseSchema,
    ExecuteDynamicActionsRequestSchema,
)
from api.services.apps.screen_actions_service import ScreenActionsService
from fastapi import Request


class ScreenActionsController(BaseController):
    def save_actions(
        self, user_id: int, screen_id: int, request_data: AppScreenActionsRequestSchema
    ) -> AppScreenResponseSchema:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.save_actions(user_id, screen_id, request_data)
            return response

    def test_actions(
        self, app_id: int, request: Request, request_data: AppScreenActionsCodeStringRequestSchema
    ) -> AppScreenActionsResponseSchema:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.test_actions(app_id, request, request_data)
            return response

    def get_actions(self, app_id: int, screen_id: str) -> AppScreenGetActionsResponseSchema:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.get_actions(app_id, screen_id)
            return response

    def preview_actions(
        self, app_id: int, request: Request, request_data: AppScreenActionsRequestSchema
    ) -> AppScreenActionsOutputResponseSchema | Dict | bool:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.preview_actions(app_id, request, request_data)
            return response

    def get_dynamic_actions(
        self, app_id: int, screen_id: int, request: Request, request_data: AppScreenDynamicActionsRequestSchema
    ) -> AppScreenActionsOutputResponseSchema | Dict | bool:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.get_dynamic_actions(app_id, screen_id, request, request_data)
            return response

    def preview_actions_handler(
        self, app_id: int, request: Request, request_data: AppScreenActionsCodeStringRequestSchema
    ) -> AppScreenActionsResponseSchema:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.preview_actions_handler(app_id, request, request_data)
            return response

    def action_handler(
        self, app_id: int, screen_id: str, request_data: AppScreenActionHandlerRequestSchema, request: Request
    ) -> AppScreenActionsOutputResponseSchema:
        with ScreenActionsService() as screen_actions_service:
            response = screen_actions_service.action_handler(app_id, screen_id, request_data, request)
            return response

    def get_dynamic_action_response(
        self,
        user_info: Dict,
        logged_in_email: str,
        app_id: int,
        screen_id: int,
        request_data: ExecuteDynamicActionsRequestSchema,
        access_token: str,
    ) -> Dict:
        with ScreenActionsService() as screen_actions_service:
            return screen_actions_service.get_dynamic_action_response(
                user_info, logged_in_email, app_id, screen_id, request_data, access_token
            )
