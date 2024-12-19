import logging
from typing import List

from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.serializers.ml_model import base_model_serializer
from api.services.ml_model.base_model_service import BaseModelService
from api.services.utils.ml_model.base_model_utility_service import (
    BaseModelUtilityService,
)
from fastapi import status


class BaseModelController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.base_model_service = BaseModelService()
        self.base_model_utility_service = BaseModelUtilityService()

    def get_base_models(self, user, page, page_size, search) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                ml_models, total = self.base_model_service.get_paginated_base_models(user, page, page_size, search)
                paginated_data = self.handle_pagination_response(
                    ml_models, page, page_size, total, base_model_serializer.BaseModelSerializer
                )
                return base_model_serializer.PaginatedBaseModelSerializer(**paginated_data)

            ml_models = self.base_model_service.get_base_models(user, search)
            return ml_models

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Base Models.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_base_model_detail(self, user, id) -> dict:
        base_model = self.base_model_utility_service.get_base_model_detail(user, id)
        return self.get_serialized_data(base_model_serializer.BaseModelSerializer, base_model)
