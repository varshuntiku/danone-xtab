import logging
from typing import List

from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.serializers.llm_workbench import model_registry_serializer
from api.services.llm_workbench.model_registry_service import ModelRegistryService
from fastapi import status


class ModelRegistryController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.model_registry_service = ModelRegistryService()

    def get_model_registries(self, user, page, page_size, search) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    ml_models,
                    total,
                ) = self.model_registry_service.get_paginated_model_registries(user, page, page_size, search)
                paginated_data = self.handle_pagination_response(
                    ml_models,
                    page,
                    page_size,
                    total,
                    model_registry_serializer.ModelRegistrySerializer,
                )
                return model_registry_serializer.PaginatedModelRegistrySerializer(**paginated_data)

            ml_models = self.model_registry_service.get_model_registries(user, search)
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Model Registries.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_model_registry(self, user, request_data) -> dict:
        model_registry = self.model_registry_service.create_model_registry(user, request_data)
        return self.get_serialized_data(model_registry_serializer.ModelRegistrySerializer, model_registry)

    # def create_llm_experiment(self, user, request_data) -> dict:
    #     llm_experiment = self.model_registry_service.create_llm_experiment(user, request_data)
    #     return self.get_serialized_data(model_registry_serializer.ModelRegistrySerializer, llm_experiment)

    # def get_llm_experiment_detail(self, user, id) -> dict:
    #     llm_experiment = self.model_registry_service.get_llm_experiment_detail(user, id)
    #     return self.get_serialized_data(model_registry_serializer.ModelRegistrySerializer, llm_experiment)
