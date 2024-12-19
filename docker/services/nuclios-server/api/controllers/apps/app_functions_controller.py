from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.apps.app_functions_schema import (
    AddAppFunctionRequestSchema,
    AddAppFunctionResponseSchema,
    GetAppFunctionResponseSchema,
    GetAppFunctionsListResponseSchema,
    TestAppFunctionRequestSchema,
    TestAppFunctionResponseSchema,
    UpdateAppFunctionResponseSchema,
)
from api.services.apps.app_functions_service import AppFunctionService
from fastapi import Request


class AppFunctionsController(BaseController):
    def get_app_functions_list(self, app_id: int) -> List[GetAppFunctionsListResponseSchema]:
        with AppFunctionService() as app_functions_service:
            return app_functions_service.get_app_functions_list(app_id)

    def add_app_functions_value(
        self, app_id: int, key: str, request_data: AddAppFunctionRequestSchema
    ) -> AddAppFunctionResponseSchema:
        with AppFunctionService() as app_functions_service:
            return app_functions_service.add_app_functions_value(app_id, key, request_data)

    def update_app_function_value(
        self, app_id: int, key: str, request_data: AddAppFunctionRequestSchema
    ) -> UpdateAppFunctionResponseSchema:
        with AppFunctionService() as app_functions_service:
            return app_functions_service.update_app_function_value(app_id, key, request_data)

    def delete_app_function_value(self, app_id: int, key: str) -> UpdateAppFunctionResponseSchema:
        with AppFunctionService() as app_functions_service:
            return app_functions_service.delete_app_function_value(app_id, key)

    def get_app_function_value(self, app_id: int, key: str) -> GetAppFunctionResponseSchema:
        with AppFunctionService() as app_functions_service:
            app_function = app_functions_service.get_app_function_value(app_id, key)
            return self.get_serialized_data(GetAppFunctionResponseSchema, app_function)

    def test_app_function_value(
        self, access_token: str, app_id: int, key: str, request_data: TestAppFunctionRequestSchema, request: Request
    ) -> TestAppFunctionResponseSchema:
        with AppFunctionService() as app_functions_service:
            test_app_function = app_functions_service.test_app_function_value(
                access_token, app_id, key, request_data, request
            )
            return self.get_serialized_data(TestAppFunctionResponseSchema, test_app_function)
