from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.dashboards.function_schema import (
    FunctionCreateRequestSchema,
    FunctionCreateResponseSchema,
    FunctionDeleteResponseSchema,
    FunctionSchema,
)
from api.services.dashboards.function_service import FunctionService


class FunctionController(BaseController):
    def get_functions(self) -> List[FunctionSchema]:
        with FunctionService() as function_service:
            functions = function_service.get_functions()
            return functions

    def create_function(self, user_id: int, request_data: FunctionCreateRequestSchema) -> FunctionCreateResponseSchema:
        with FunctionService() as function_service:
            response = function_service.create_function(user_id, request_data)
            return response

    def update_function(
        self, user_id: int, function_id: int, request_data: FunctionCreateRequestSchema
    ) -> FunctionCreateResponseSchema:
        with FunctionService() as function_service:
            response = function_service.update_function(user_id, function_id, request_data)
            return response

    def delete_function(self, user_id: int, function_id: int) -> FunctionDeleteResponseSchema:
        with FunctionService() as function_service:
            response = function_service.delete_function(user_id, function_id)
            return response
