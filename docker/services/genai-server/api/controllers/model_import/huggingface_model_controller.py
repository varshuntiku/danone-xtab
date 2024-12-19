import logging

from api.controllers.base_controller import BaseController
from api.middlewares.error_middleware import GeneralException
from api.services.model_import.huggingface_model_service import HuggingFaceModelService
from fastapi import status


class HuggingFaceModelController(BaseController):
    def __init__(self) -> None:
        self.huggingface_model_service = HuggingFaceModelService()

    def get_huggingface_models(self, task, search, sort, page):
        try:
            models = self.huggingface_model_service.get_huggingface_models(
                pipeline_tag=task, search=search, page=page, sort=sort
            )
            return models
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message="Error occurred in fetching Models.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_tasks(self, search):
        tasks = self.huggingface_model_service.get_tasks(search)
        return tasks
