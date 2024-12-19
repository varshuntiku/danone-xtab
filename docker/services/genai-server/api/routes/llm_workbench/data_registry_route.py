from typing import List, Union

from api.controllers.llm_workbench.data_registry_controller import (
    DataRegistryController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.serializers.llm_workbench import data_registry_serializer
from fastapi import APIRouter, Request, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
data_registry_controller = DataRegistryController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        data_registry_serializer.PaginatedDatasetSerializer,
        List[data_registry_serializer.DatasetSerializer],
    ],
)
@authenticate_user
async def get_data_registries(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the data registries available on Nuclios.
    Will take input as search parameters and pagination parameters
    Returns:
        _type_: _description_
    """
    return data_registry_controller.get_data_registries(request.state.user, page, size, search)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
@authenticate_user
async def upload_to_data_registries(
    request: Request,
    file: UploadFile,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the data registries available on Nuclios.
    Will take input as search parameters and pagination parameters
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__
    return await data_registry_controller.upload_file_to_data_registries(user, file)
