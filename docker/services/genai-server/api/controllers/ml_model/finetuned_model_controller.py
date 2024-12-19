import logging
from typing import List

from api.constants.variables import ApprovalStatus
from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.handlers.finetuning_orchestrator import deploy_finetuning_runtime
from api.serializers.ml_model import finetuned_model_serializer
from api.services.ml_model.finetuned_model_service import FinetunedModelService
from api.services.utils.ml_model.finetuned_model_utility_service import (
    FinetunedModelUtilityService,
)
from fastapi import status


class FinetunedModelController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.finetuned_model_service = FinetunedModelService()
        self.finetuned_model_utility_service = FinetunedModelUtilityService()

    def get_finetuned_models(self, user, page, page_size, search, is_pending) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.finetuned_model_service.get_paginated_finetuned_models(
                    user, page, page_size, search, is_pending
                )
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    finetuned_model_serializer.FinetunedModelSerializer,
                )
                return finetuned_model_serializer.PaginatedFinetunedModelSerializer(**paginated_data)

            ml_models = self.finetuned_model_service.get_finetuned_models(user, search, is_pending)
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Finetuned Models.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_finetuned_model(self, user, request_data) -> dict:
        finetuned_model = self.finetuned_model_utility_service.create_finetuned_model(user, request_data)
        return self.get_serialized_data(finetuned_model_serializer.FinetunedModelSerializer, finetuned_model)

    def upload_finetuned_data_set(self, user, file, request_data):
        self.finetuned_model_utility_service.upload_finetuned_data_set(user, file, request_data)
        return {
            "message": "Finetuned Dataset is uploaded successfully.",
            "status_code": status.HTTP_200_OK,
        }

    def upload_finetuned_config(self, user, request_data):
        is_uploaded = self.finetuned_model_utility_service.upload_finetuned_config(user, request_data)
        if not is_uploaded:
            raise GeneralException(
                message="Error while updating config information.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return {
            "message": "Finetuned Config is uploaded successfully.",
            "status_code": status.HTTP_200_OK,
        }

    def submit_finetuned_model(self, user, id):
        self.finetuned_model_utility_service.submit_finetuned_model(user, id)
        return {
            "message": "Finetuned Model is submitted successfully.",
            "status_code": status.HTTP_200_OK,
        }

    async def execute_finetuned_model(self, user, request_data) -> dict:
        if request_data["execution_type"].lower() == ApprovalStatus.APPROVED.value:
            response_from_orchestrator = await deploy_finetuning_runtime(
                user, request_data["job_id"], request_data["id"]
            )
            return response_from_orchestrator

        elif request_data["execution_type"].lower() == ApprovalStatus.REJECTED.value:
            return self.finetuned_model_utility_service.reject_finetuned_model(user, request_data)
        else:
            raise GeneralException(
                message="Please provide proper detail to perform action.",
                status_code=status.HTTP,
            )

    def delete_finetuned_model(self, user, id) -> dict:
        self.finetuned_model_utility_service.delete_finetuned_model(user, id, delete_from_orchestrator=True)
        return {
            "message": "Finetuned model is deleted successfully.",
            "status_code": status.HTTP_204_NO_CONTENT,
        }

    def get_finetuned_model_detail(self, user, id) -> dict:
        finetuned_model = self.finetuned_model_utility_service.get_finetuned_model_detail(user, id)
        return self.get_serialized_data(finetuned_model_serializer.FinetunedModelSerializer, finetuned_model)
