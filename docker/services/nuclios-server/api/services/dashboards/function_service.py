from typing import List

from api.constants.dashboards.function_error_messages import FunctionErrors
from api.constants.dashboards.function_success_messages import FunctionSuccess
from api.daos.dashboards.function_dao import FunctionDao
from api.dtos.dashboards.function_dto import CreateFunctionDTO, FunctionDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.dashboards.function_schema import (
    FunctionCreateRequestSchema,
    FunctionCreateResponseSchema,
    FunctionDeleteResponseSchema,
)
from api.services.base_service import BaseService
from fastapi import status


class FunctionService(BaseService):
    def __init__(self):
        super().__init__()
        self.function_dao = FunctionDao(self.db_session)

    def get_functions(self) -> List[FunctionDTO]:
        functions = self.function_dao.get_functions()
        transformed_functions = []
        for function in functions:
            parent_function_name = (
                self.function_dao.get_function_by_id(function.parent_function_id).function_name
                if function.parent_function_id
                else None
            )
            transformed_functions.append(FunctionDTO(function, parent_function_name))
        return transformed_functions

    def create_function(self, user_id: int, request_data: FunctionCreateRequestSchema) -> FunctionCreateResponseSchema:
        function_name_exists = self.function_dao.check_function_name_exists_for_industry_id(
            request_data.function_name, request_data.industry_id
        )
        if function_name_exists > 0:
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message={"error": FunctionErrors.FUNCTION_NAME_ALREADY_EXISTS_ERROR.value},
            )

        new_function = self.function_dao.create_function(user_id, request_data)
        return {
            "message": FunctionSuccess.FUNCTION_CREATE_SUCCESS.value,
            "function_data": CreateFunctionDTO(new_function).__dict__,
        }

    def update_function(
        self, user_id: int, function_id: int, request_data: FunctionCreateRequestSchema
    ) -> FunctionCreateResponseSchema:
        function_exists = self.function_dao.check_function_exists(function_id)
        if function_exists == 0:
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message={"error": FunctionErrors.FUNCTION_NOT_FOUND_ERROR.value},
            )

        function_name_exists = self.function_dao.check_function_name_exists_for_industry_id_update(
            request_data.function_name, request_data.industry_id, function_id
        )
        if function_name_exists > 0:
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message={"error": FunctionErrors.FUNCTION_NAME_ALREADY_EXISTS_ERROR.value},
            )

        updated_function = self.function_dao.update_function(user_id, function_id, request_data)
        return {
            "message": FunctionSuccess.FUNCTION_UPDATE_SUCCESS.value,
            "function_data": CreateFunctionDTO(updated_function).__dict__,
        }

    def delete_function(self, user_id: int, function_id: int) -> FunctionDeleteResponseSchema:
        function_exists = self.function_dao.check_function_exists(function_id)
        if function_exists == 0:
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message={"error": FunctionErrors.FUNCTION_NOT_FOUND_ERROR.value},
            )

        self.function_dao.delete_function(user_id, function_id)
        return {"message": FunctionSuccess.FUNCTION_DELETE_SUCCESS.value}
