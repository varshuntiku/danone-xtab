import logging
from typing import List

from api.constants.execution_environment.variables import (
    ApprovalStatus,
    ExecutionEnvironmentComputeType,
)
from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import DoesNotExistException, GeneralException
from api.orchestrators.execution_environment.handlers.execution_environment_orchestrator import (
    ExecutionEnvironment,
)
from api.serializers.execution_environment import execution_environment_serializer
from api.services.execution_environment.execution_environment_service import (
    ExecutionEnvironmentService,
)
from api.services.utils.execution_environment.execution_environment_event_utility_service import (
    ExecutionEnvironmentEventUtilityService,
)
from fastapi import status
from fastapi.responses import StreamingResponse


class ExecutionEnvironmentController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.execution_environment_service = ExecutionEnvironmentService()
        self.execution_environment_event = ExecutionEnvironmentEventUtilityService()

    def get_execution_environments(
        self, user, page, page_size, search, env_type, env_category, project_id, approval_status
    ) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.execution_environment_service.get_paginated_execution_environments(
                    user, page, page_size, search, env_type, env_category, project_id, approval_status
                )
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    execution_environment_serializer.ExecutionEnvironmentSerializer,
                )
                return execution_environment_serializer.PaginatedExecutionEnvironmentSerializer(**paginated_data)

            ml_models = self.execution_environment_service.get_execution_environments(
                user, search, env_type, env_category, project_id, approval_status
            )
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Execution Environments.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    async def get_execution_environment_id_by_app_id(
        self, user, app_id, default_env, fetch_execution_environment_details
    ) -> dict:
        try:
            exec_env = self.execution_environment_service.get_execution_environment_id_by_app_id(
                user, app_id, default_env, fetch_execution_environment_details
            )
            if fetch_execution_environment_details:
                return self.get_serialized_data(
                    execution_environment_serializer.ExecutionEnvironmentSerializer,
                    exec_env,
                )
            return self.get_serialized_data(
                execution_environment_serializer.AppEnvMapSerializer,
                exec_env,
            )
        except DoesNotExistException:
            return {
                "app_id": app_id,
                "env_id": 0,
            }
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Execution Environments.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    async def get_execution_environment_live_status(self, user, id):
        return StreamingResponse(
            self.execution_environment_service.get_stream_execution_environment_status_via_db(user, id),
            media_type="text/event-stream",
        )

    async def create_execution_environment(self, user, request_data) -> dict:
        execution_environment = self.execution_environment_service.create_execution_environment(user, request_data)

        serialized_execution_environment = self.get_serialized_data(
            execution_environment_serializer.ExecutionEnvironmentSerializer, execution_environment
        )

        # Create Event
        self.execution_environment_event.create_event(
            user,
            execution_environment.id,
            detail={
                "type": "execution_env_create",
                "status": "Created",
                "message": "Execution Environment is created.",
                "endpoint": None,
            },
            is_set=True,
        )
        logging.info("User object in controller")
        # Orchstration Process
        if request_data.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
            self.execution_environment_service.action_execution_environment(user, execution_environment.id)
            return serialized_execution_environment

        await ExecutionEnvironment(user, self.to_dict(execution_environment)).deploy_execution_environment_runtime()
        return serialized_execution_environment

    def validate_pip_packages(self, user, request_data) -> dict:
        execution_environment_packages = self.execution_environment_service.validate_packages(user, request_data)
        return {
            "message": "Packages are validated successfully.",
            "packages": execution_environment_packages,
        }

    def get_execution_environment_detail(self, user, id) -> dict:
        execution_environment = self.execution_environment_service.get_execution_environment_detail(user, id)
        return self.get_serialized_data(
            execution_environment_serializer.ExecutionEnvironmentSerializer,
            execution_environment,
        )

    async def link_app_env(self, user, request_data) -> dict:
        app_env_map = self.execution_environment_service.link_app_env(user, request_data)
        # print("app_env_map", app_env_map.app_id)
        serialized_app_env_map = self.get_serialized_data(
            execution_environment_serializer.AppEnvMapSerializer, app_env_map
        )
        return serialized_app_env_map

    async def update_execution_environment(self, user, id, request_data):
        execution_environment = self.execution_environment_service.update_execution_environment(user, id, request_data)
        serialized_execution_environment = self.get_serialized_data(
            execution_environment_serializer.ExecutionEnvironmentSerializer, execution_environment
        )
        self.execution_environment_event.create_event(
            user,
            execution_environment.id,
            detail={
                "type": "execution_env_update",
                "status": "Created",
                "message": "Execution Environment is created.",
                "endpoint": None,
            },
            is_set=True,
        )
        # Orchstration Process
        await ExecutionEnvironment(
            user, self.to_dict(execution_environment)
        ).deploy_updated_execution_environment_runtime()
        return serialized_execution_environment

    async def delete_execution_environment(self, user, id) -> dict:
        execution_environment = self.execution_environment_service.delete_execution_environment(user, id)
        # Orchstration Process
        await ExecutionEnvironment(
            user, self.to_dict(execution_environment)
        ).deploy_delete_execution_environment_runtime()
        return {
            "message": "Execution Environment is deleted successfully.",
            "status_code": status.HTTP_204_NO_CONTENT,
        }

    async def action_execution_environment(self, user, id, request_data) -> dict:
        execution_environment = self.execution_environment_service.action_execution_environment(user, id, request_data)
        serialized_approve_execution_environment = self.get_serialized_data(
            execution_environment_serializer.ExecutionEnvironmentSerializer, execution_environment
        )
        if execution_environment.approval_status == ApprovalStatus.APPROVED.value:
            await ExecutionEnvironment(user, self.to_dict(execution_environment)).deploy_execution_environment_runtime()
        return serialized_approve_execution_environment

    async def get_project_execution_environment_live_status(self, project_id):
        return StreamingResponse(
            self.execution_environment_service.get_stream_project_execution_environment_status_via_db(project_id),
            media_type="text/event-stream",
        )

    async def action_on_execution_environment(self, user, id, action) -> dict:
        execution_environment = self.execution_environment_service.get_execution_environment_by_id(user, id)
        await ExecutionEnvironment(user, self.to_dict(execution_environment)).action_on_execution_environment(action)
        return {
            "message": f"{action} action on Execution Environment is applied successfully.",
            "status_code": status.HTTP_204_NO_CONTENT,
        }

    async def fetch_logs(self, user, deployment, namespace) -> dict:
        logs = self.execution_environment_service.fetch_logs(deployment, namespace)
        return {
            "message": logs,
            "status_code": status.HTTP_200_OK,
        }
