import json
from typing import List, Union

from api.controllers.llm_workbench.model_registry_controller import (
    ModelRegistryController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.llm_workbench import model_registry_schema

# from api.schemas.llm_workbench import experiment_schema
from api.serializers.llm_workbench import model_registry_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
model_registry_controller = ModelRegistryController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        model_registry_serializer.PaginatedModelRegistrySerializer,
        List[model_registry_serializer.ModelRegistrySerializer],
    ],
)
@authenticate_user
async def get_model_registries(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the finetuned models available on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    return model_registry_controller.get_model_registries(request.state.user, page, size, search)


@router.post("", status_code=status.HTTP_200_OK, response_model=model_registry_serializer.ModelRegistrySerializer)
@authenticate_user
async def create_model_registry(
    request: Request,
    request_data: model_registry_schema.ModelRegistryCreateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will create new model registry
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return model_registry_controller.create_model_registry(user, request_data)
