import logging
from typing import List

from api.constants.variables import ApprovalStatus
from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.llm_workbench.handlers.deployment_orchestrator import (
    DeploymentHandler,
)
from api.serializers.llm_workbench import deployment_serializer
from api.services.llm_workbench.deployment_service import LLMDeploymentService
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)
from fastapi import status
from fastapi.responses import StreamingResponse


class LLMDeploymentController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.llm_deployment_service = LLMDeploymentService()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()
        self.llm_workbench_event_utility_service = LLMWorkbenchEventUtilityService()

    def get_llm_deployed_models(
        self, user, page, page_size, search, approval_status, problem_type, base_model_name
    ) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.llm_deployment_service.get_paginated_llm_deployed_models(
                    user, page, page_size, search, approval_status, problem_type, base_model_name
                )
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    deployment_serializer.LLMDeployedModelSerializer,
                )
                return deployment_serializer.PaginatedLLMDeployedModelSerializer(**paginated_data)

            ml_models = self.llm_deployment_service.get_llm_deployed_models(
                user, search, approval_status, problem_type, base_model_name
            )
            return self.get_serialized_list(deployment_serializer.LLMDeployedModelSerializer, ml_models)

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching LLMDeployedModels.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_llm_deployed_model_detail(self, user, id) -> dict:
        llm_deployed_model = self.llm_deployment_service.get_llm_deployed_model_detail(user, id)
        return self.get_serialized_data(deployment_serializer.LLMDeployedModelDetailSerializer, llm_deployed_model)

    async def get_llm_deployed_model_live_status(self, user, id):
        llm_deployed_model = self.llm_deployment_service.get_llm_deployed_model_by_id(user, id)
        return StreamingResponse(
            self.llm_workbench_event_utility_service.get_stream_llm_deployed_model_status(
                user, f"{llm_deployed_model.id}-{llm_deployed_model.name}"
            ),
            media_type="text/event-stream",
        )

    def create_llm_deployed_model(self, user, request_data) -> dict:
        llm_deployed_model = self.llm_deployment_service.create_llm_deployed_model(user, request_data)
        return self.get_serialized_data(deployment_serializer.LLMDeployedModelSerializer, llm_deployed_model)

    def update_llm_deployed_model(self, user, request_data):
        llm_deployed_model = self.llm_deployment_service.update_llm_deployed_model(user, request_data)
        return self.get_serialized_data(deployment_serializer.LLMDeployedModelSerializer, llm_deployed_model)

    async def execute_deployed_model(self, user, request_data):
        if request_data["execution_type"].lower() == ApprovalStatus.APPROVED.value:
            llm_deployed_model = self.llm_deployment_service.approve_llm_deployed_model(user, request_data)

            serialized_llm_deployed_model = self.get_serialized_data(
                deployment_serializer.LLMDeployedModelDetailSerializer,
                llm_deployed_model,
            )

            # Orchstration Process
            await DeploymentHandler(user, self.to_dict(serialized_llm_deployed_model)).deploy_model_runtime()

            # Create Event
            self.llm_workbench_event.create_event(
                user,
                f"{llm_deployed_model.id}-{llm_deployed_model.name}",
                detail={"type": "deployment", "status": "Created", "message": "Deployment is created."},
                is_set=True,
            )

            return {
                "message": "Deployment approved succesfully.",
                "status_code": status.HTTP_200_OK,
            }
        elif request_data["execution_type"].lower() == ApprovalStatus.REJECTED.value:
            return self.llm_deployment_service.reject_llm_deployed_model(user, request_data)
        else:
            raise GeneralException(
                message="Please provide proper detail to perform action.",
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
            )

    def get_llm_deployed_model_status(self, user, id) -> dict:
        llm_deployed_model = self.llm_deployment_service.get_llm_deployed_model_by_id(user, id)
        return self.get_serialized_data(deployment_serializer.LLMDeployedModelStatusSerializer, llm_deployed_model)
