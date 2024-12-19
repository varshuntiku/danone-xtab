import json

from api.dtos.model_import.huggingface_model_dto import (
    HuggingFaceModelDTO,
    PaginatedHuggingfaceModelDTO,
)
from api.utils.huggingface_utils import get_models


class HuggingFaceModelService:
    def get_huggingface_models(self, sort, pipeline_tag, search, page):
        """
        Retrives list of huggingface models and its details in a paginated way
        """
        try:
            models = get_models(search=search, sort=sort, page=page, pipeline_tag=pipeline_tag)
            models = json.loads(models)
            transform_models_list = [vars(HuggingFaceModelDTO(model)) for model in models["models"]]
            transform_model = {**vars(PaginatedHuggingfaceModelDTO(models, transform_models_list))}
            return transform_model
        except Exception as e:
            return e

    def get_tasks(self, search):
        tasks_list = [
            "Text Classification",
            "Question Answering",
            "Text2Text Generation",
            "Table Question answering",
            "Token Classification",
            "Text Generation",
            "Summarization",
            "Fill-Mask",
            "Sentence similarity",
            "Conversational",
            "Translation",
        ]
        filtered_tasks = [task for task in tasks_list if search.lower() in task.lower()]
        response = {"tasks": filtered_tasks}
        return response
