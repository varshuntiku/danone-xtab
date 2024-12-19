import logging
from typing import Dict, List

from api.constants.apps.execution_env_error_messages import ExecutionEnvErrors
from api.constants.error_messages import GeneralErrors
from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.dtos.apps.execution_env_dto import (
    CreateDynamicExecEnvDTO,
    DynamicExecutionEnvByAppDTO,
    DynamicExecutionEnvDTO,
)
from api.dtos.generic_dto import DataDeleteDTO
from api.helpers.apps.execution_env_helper import ExecutionEnvDynamicViz
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.execution_env_schema import (
    CreateDynamicExecutionEnvRequestSchema,
    DefaultExecutionEnvSchema,
    UpdateDynamicExecEnvDetailRequestSchema,
    UpdateDynamicExecutionEnvRequestSchema,
)
from api.schemas.generic_schema import StatusResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class ExecutionEnvService(BaseService):
    def __init__(self):
        super().__init__()
        self.execution_env_dao = ExecutionEnvDao(self.db_session)
        self.dynamic_execution_env_helper = ExecutionEnvDynamicViz()

    def get_dynamic_execution_env_list(self) -> List[DynamicExecutionEnvDTO]:
        data = self.execution_env_dao.get_dynamic_execution_env_list()
        env_list = [DynamicExecutionEnvDTO(row) for row in data]
        return env_list

    def get_dynamic_execution_env_by_app_id(self, app_id: int) -> DynamicExecutionEnvByAppDTO:
        data = self.execution_env_dao.get_app_dynamic_execution_env_by_app_id(app_id)
        response = DynamicExecutionEnvByAppDTO(data, app_id)
        return response

    def update_app_env_id(self, request_data: UpdateDynamicExecutionEnvRequestSchema) -> DynamicExecutionEnvByAppDTO:
        app_id = request_data.app_id
        execution_environment_id = request_data.exec_env_id
        app_execution_environment = self.execution_env_dao.update_dynamic_execution_env_id(
            app_id, execution_environment_id
        )
        return DynamicExecutionEnvByAppDTO(app_execution_environment, app_id)

    def create_dynamic_execution_environments(
        self, request_data: CreateDynamicExecutionEnvRequestSchema
    ) -> CreateDynamicExecEnvDTO:
        execution_env = self.execution_env_dao.create_dynamic_execution_environments(request_data)
        return CreateDynamicExecEnvDTO(execution_env)

    def start_dynamic_execution_environments(self, access_token: str, execution_environment_id: int) -> Dict:
        item = self.execution_env_dao.get_dynamic_execution_env_by_id(execution_environment_id)
        try:
            response = self.dynamic_execution_env_helper.create_env(
                item.name,
                execution_environment_id,
                access_token,
                item.py_version if item.py_version else False,
                item.requirements if item.requirements else False,
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ExecutionEnvErrors.START_APP_DYNAMIC_EXEC_ENV_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return response

    def delete_dynamic_execution_environments(self, execution_environment_id: int):
        self.execution_env_dao.delete_dynamic_execution_env_by_id(execution_environment_id)
        return DataDeleteDTO(1)

    def default_pylist(self) -> List[DefaultExecutionEnvSchema]:
        env_list = self.execution_env_dao.default_pylist()
        return env_list

    def update_dynamic_execution_env(
        self, execution_environment_id: int, request_data: UpdateDynamicExecEnvDetailRequestSchema
    ) -> StatusResponseSchema:
        execution_environment = self.execution_env_dao.get_dynamic_execution_env_by_id(execution_environment_id)
        if execution_environment is None:
            raise GeneralException(status.HTTP_404_NOT_FOUND, message={"error": GeneralErrors.NOT_FOUND_ERROR.value})
        self.execution_env_dao.update_dynamic_exec_env_details(execution_environment_id, request_data)
        return {"status": True}
