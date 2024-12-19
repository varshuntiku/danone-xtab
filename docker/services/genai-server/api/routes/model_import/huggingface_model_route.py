from api.controllers.model_import.huggingface_model_controller import (
    HuggingFaceModelController,
)
from api.serializers.model_import.huggingface_model_serializer import (
    HuggingfaceModelSerializer,
    HuggingfaceTaskSerializer,
)
from fastapi import APIRouter, status

router = APIRouter()

# Controller initialization
huggingface_model_controller = HuggingFaceModelController()


@router.get("/models", status_code=status.HTTP_200_OK, response_model=HuggingfaceModelSerializer)
async def get_huggingface_models(sort: str, task: str = None, search: str = None, page: int = None):
    models_list = huggingface_model_controller.get_huggingface_models(sort=sort, task=task, search=search, page=page)
    return models_list


@router.get("/tasks", status_code=status.HTTP_200_OK, response_model=HuggingfaceTaskSerializer)
def get_tasks(search: str = ""):
    tasks = huggingface_model_controller.get_tasks(search)
    return tasks
