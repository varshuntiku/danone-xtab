import logging
from typing import List, Union

from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.services.execution_environment.compute_config_service import (
    ComputeConfigService,
)
from fastapi import status


class ComputeConfigController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.compute_config_service = ComputeConfigService()

    def get_compute_configs(self, user, search) -> List[dict]:
        try:
            compute_configs = self.compute_config_service.get_compute_configs(user, search)
            return compute_configs

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Compute configs.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_compute_config(self, user, request_data) -> Union[List[dict], dict]:
        try:
            compute_config = self.compute_config_service.create_compute_config(user, request_data)
            return compute_config

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in creating Compute config.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_compute_config_by_id(self, user, id) -> List[dict]:
        try:
            compute_config = self.compute_config_service.get_compute_config_by_id(user, id)
            return compute_config

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Compute config.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
