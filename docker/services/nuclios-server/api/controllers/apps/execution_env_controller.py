from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.schemas.apps.execution_env_schema import (
    CreateDynamicExecutionEnvRequestSchema,
    CreateDynamicExecutionEnvResponseSchema,
    DefaultExecutionEnvSchema,
    GetDynamicExecutionEnvByAppSchema,
    GetDynamicExecutionEnvListSchema,
    UpdateDynamicExecEnvDetailRequestSchema,
    UpdateDynamicExecutionEnvRequestSchema,
    UpdateDynamicExecutionEnvResponseSchema,
)
from api.schemas.generic_schema import DataDeleteResponseSchema, StatusResponseSchema
from api.services.apps.execution_env_service import ExecutionEnvService


class ExecutionEnvController(BaseController):
    def get_dynamic_execution_env_list(self) -> List[GetDynamicExecutionEnvListSchema]:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.get_dynamic_execution_env_list()
            return self.get_serialized_list(GetDynamicExecutionEnvListSchema, data)

    def get_dynamic_execution_env_by_app_id(self, app_id: int) -> GetDynamicExecutionEnvByAppSchema:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.get_dynamic_execution_env_by_app_id(app_id)
            return self.get_serialized_data(GetDynamicExecutionEnvByAppSchema, data)

    def update_app_env_id(
        self, request_data: UpdateDynamicExecutionEnvRequestSchema
    ) -> UpdateDynamicExecutionEnvResponseSchema:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.update_app_env_id(request_data)
            return self.get_serialized_data(UpdateDynamicExecutionEnvResponseSchema, data)

    def create_dynamic_execution_environments(
        self, request_data: CreateDynamicExecutionEnvRequestSchema
    ) -> CreateDynamicExecutionEnvResponseSchema:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.create_dynamic_execution_environments(request_data)
            return self.get_serialized_data(CreateDynamicExecutionEnvResponseSchema, data)

    def start_dynamic_execution_environments(self, access_token: str, execution_environment_id: int) -> Dict:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.start_dynamic_execution_environments(access_token, execution_environment_id)
            return data

    def delete_dynamic_execution_environments(self, execution_environment_id: int) -> DataDeleteResponseSchema:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.delete_dynamic_execution_environments(execution_environment_id)
            return self.get_serialized_data(DataDeleteResponseSchema, data)

    def default_pylist(self) -> List[DefaultExecutionEnvSchema]:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.default_pylist()
            return data

    def update_dynamic_execution_env(
        self, execution_environment_id: int, request_data: UpdateDynamicExecEnvDetailRequestSchema
    ) -> StatusResponseSchema:
        with ExecutionEnvService() as execution_env_service:
            data = execution_env_service.update_dynamic_execution_env(execution_environment_id, request_data)
            return data
