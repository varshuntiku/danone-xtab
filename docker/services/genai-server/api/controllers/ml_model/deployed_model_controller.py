import logging
from typing import List

from api.constants.variables import ApprovalStatus
from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.handlers import deployment_orchestrator
from api.serializers.ml_model import deployed_model_serializer
from api.services.ml_model.deployed_model_service import DeployedModelService
from api.services.utils.ml_model.deployed_model_utility_service import (
    DeployedModelUtilityService,
)
from fastapi import status


class DeployedModelController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.deployed_model_service = DeployedModelService()
        self.deployed_model_utility_service = DeployedModelUtilityService()

    def get_deployed_models_form_configurations(self, user) -> dict:
        form_configuration = self.deployed_model_service.get_deployed_models_form_configurations(user)
        return form_configuration

    def get_deployed_models(self, user, page, page_size, search, is_pending) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.deployed_model_service.get_paginated_deployed_models(user, page, page_size, search, is_pending)
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    deployed_model_serializer.DeployedModelSerializer,
                )
                return deployed_model_serializer.PaginatedDeployedModelSerializer(**paginated_data)

            ml_models = self.deployed_model_service.get_deployed_models(user, search, is_pending)
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Finetuned Models.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_deployed_model(self, user, request_data) -> dict:
        # # Orchestrator's Deploy Method
        # response_from_orchestrator = await deployment_orchestrator.deploy_model(user, request_data)
        # return response_from_orchestrator
        deployed_model = self.deployed_model_utility_service.create_deployed_model(user, request_data)
        return self.get_serialized_data(deployed_model_serializer.DeployedModelSerializer, deployed_model)

    def validate_deployed_model_form(self, user, request_data) -> dict:
        validate_form = self.deployed_model_service.validate_deployed_model_form(user, request_data)
        if validate_form:
            return {
                "message": "Validation successful!",
                "status_code": status.HTTP_200_OK,
            }
        raise GeneralException(
            message="Failed to validate form. Please verify fields!",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    def update_deployed_model(self, user, request_data) -> dict:
        deployed_model = self.deployed_model_utility_service.update_deployed_model(user, request_data)
        return self.get_serialized_data(deployed_model_serializer.DeployedModelSerializer, deployed_model)

    def get_deployed_model_detail(self, user, id) -> dict:
        deployed_model = self.deployed_model_utility_service.get_deployed_model_detail(user, id)
        return self.get_serialized_data(deployed_model_serializer.DeployedModelSerializer, deployed_model)

    def delete_deployed_model(self, user, id) -> dict:
        self.deployed_model_utility_service.delete_deployed_model(user, id, delete_from_orchestrator=True)
        return {
            "message": "Deployed model is deleted successfully.",
            "status_code": status.HTTP_204_NO_CONTENT,
        }

    async def execute_deployed_model(self, user, request_data) -> dict:
        if request_data["execution_type"].lower() == ApprovalStatus.APPROVED.value:
            response_from_orchestrator = await deployment_orchestrator.deploy_model(
                user, request_data["job_id"], request_data["id"]
            )
            return response_from_orchestrator
        elif request_data["execution_type"].lower() == ApprovalStatus.REJECTED.value:
            return self.deployed_model_utility_service.reject_deployed_model(user, request_data)
        else:
            raise GeneralException(
                message="Please provide proper detail to perform action.",
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
            )
