import json
from typing import List, Union

from api.controllers.execution_environment.compute_config_controller import (
    ComputeConfigController,
)
from api.middlewares.auth_middleware import authenticate_user, super_user_required
from api.schemas.execution_environment import compute_config_schema
from api.serializers.execution_environment import compute_config_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
compute_config_controller = ComputeConfigController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[List[compute_config_serializer.ComputeConfigSerializer],],
)
@authenticate_user
async def get_compute_configs(
    request: Request,
    search: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the infra configs available on Nuclios.
    Will take input as search parameters and pagination parameters
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__
    return compute_config_controller.get_compute_configs(user, search)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=Union[
        compute_config_serializer.ComputeConfigSerializer,
        List[compute_config_serializer.ComputeConfigSerializer],
    ],
)
@authenticate_user
@super_user_required
async def create_compute_config(
    request: Request,
    request_data: Union[
        compute_config_schema.ComputeConfigCreateSchema, List[compute_config_schema.ComputeConfigCreateSchema]
    ],
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Compute Config.\n
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return compute_config_controller.create_compute_config(user, request_data)


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=compute_config_serializer.ComputeConfigSerializer,
)
@authenticate_user
async def get_compute_config_by_id(
    request: Request,
    id: int = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the infra config by id available on Nuclios.
    Will take input as infra id
    """
    user = request.state.user.__dict__
    return compute_config_controller.get_compute_config_by_id(user, id)
