from typing import List, Union

from api.controllers.ml_model.base_model_controller import BaseModelController
from api.middlewares.auth_middleware import authenticate_user
from api.serializers.ml_model import base_model_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
base_model_controller = BaseModelController()


@router.get(
    "/models",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        base_model_serializer.PaginatedBaseModelSerializer,
        List[base_model_serializer.BaseModelSerializer],
    ],
)
@authenticate_user
async def get_base_models(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the base models supported by Co.dx.\n
    Will take optional query parameters as search parameter and pagination parameters\n
    If pagination parameters will created paginated response.
    Returns:
        _type_: {list of base_models and pagination detail}
    """
    return base_model_controller.get_base_models(request.state.user, page, size, search)


@router.get(
    "/{base_model_id}",
    status_code=status.HTTP_200_OK,
    response_model=base_model_serializer.BaseModelSerializer,
)
@authenticate_user
async def get_base_model_detail(
    request: Request,
    base_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the base model detail.
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return base_model_controller.get_base_model_detail(user, base_model_id)
