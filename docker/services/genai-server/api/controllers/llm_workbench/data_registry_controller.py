import logging
from typing import List

from api.controllers.base_controller import BaseController
from api.helpers.common_helper import nested_object_to_dict_converter
from api.middlewares.error_middleware import GeneralException
from api.serializers.llm_workbench import data_registry_serializer
from api.services.llm_workbench.data_registry_service import DataRegistryService
from fastapi import status


class DataRegistryController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.data_registry_service = DataRegistryService()

    def get_data_registries(self, user, page, page_size, search) -> List[dict]:
        try:
            if page is not None and page_size is not None:
                (
                    data_registries,
                    total,
                ) = self.data_registry_service.get_paginated_data_registries(user, page, page_size, search)
                paginated_data = self.handle_pagination_response(
                    data_registries,
                    page,
                    page_size,
                    total,
                    data_registry_serializer.DatasetSerializer,
                )
                return data_registry_serializer.PaginatedDatasetSerializer(**paginated_data)

            data_registries = self.data_registry_service.get_data_registries(user, search)
            return data_registries

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Data Registries.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    async def upload_file_to_data_registries(self, user, file):
        try:
            response = await self.data_registry_service.upload_to_data_registries(user, file)
            return data_registry_serializer.DatasetSerializer(**(nested_object_to_dict_converter(response)))
        except GeneralException as e:
            logging.exception(e)
            raise e
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in adding file to Data Registries.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
