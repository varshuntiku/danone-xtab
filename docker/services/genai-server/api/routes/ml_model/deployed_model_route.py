from typing import List, Union

from api.controllers.ml_model.deployed_model_controller import DeployedModelController
from api.middlewares.auth_middleware import (
    authenticate_user,
    specific_user_required,
    super_user_required,
)
from api.schemas.ml_model import deployed_model_schema
from api.serializers.base_serializers import BaseResponseSerializer
from api.serializers.ml_model import deployed_model_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
deployed_model_controller = DeployedModelController()


@router.get(
    "/form-configurations",
    status_code=status.HTTP_200_OK,
    response_model=deployed_model_serializer.DeployedModelFormConfigurationSerializer,
)
@authenticate_user
@super_user_required
async def get_deployed_models_form_configurations(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the form configuration for Deployed Models.\n
    Will take path parameter as table.\n
    Returns:
        json: [table configurations]
    """
    return deployed_model_controller.get_deployed_models_form_configurations(request.state.user)


@router.get(
    "/models",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        deployed_model_serializer.PaginatedDeployedModelSerializer,
        List[deployed_model_serializer.DeployedModelSerializer],
    ],
)
@authenticate_user
@super_user_required
async def get_deployed_models(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    is_pending: bool = False,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the deployed models available on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    return deployed_model_controller.get_deployed_models(request.state.user, page, size, search, is_pending)


@router.post(
    "/models",
    status_code=status.HTTP_201_CREATED,
    response_model=Union[
        deployed_model_serializer.DeployedModelCreateSerializer,
        deployed_model_serializer.DeployedModelSerializer,
    ],
)
@authenticate_user
@super_user_required
async def create_deployed_model(
    request: Request,
    request_data: deployed_model_schema.DeployedModelSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Deployed Model.\n

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return deployed_model_controller.create_deployed_model(user, request_data)


@router.post(
    "/validate-form",
    status_code=status.HTTP_201_CREATED,
    response_model=deployed_model_serializer.DeployedModelValidateFormSerializer,
)
@authenticate_user
@super_user_required
async def validate_deployed_model_form(
    request: Request,
    request_data: deployed_model_schema.DeployedModelValidationSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to validate Deployed Model Form.\n

    Returns: \n
        json: {response}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return deployed_model_controller.validate_deployed_model_form(user, request_data)


@router.put(
    "/models",
    status_code=status.HTTP_201_CREATED,
    response_model=Union[BaseResponseSerializer, deployed_model_serializer.DeployedModelSerializer],
)
@authenticate_user
@super_user_required
async def update_deployed_model(
    request: Request,
    request_data: deployed_model_schema.DeployedModelUpdateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Deployed Model.\n

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return deployed_model_controller.update_deployed_model(user, request_data)


@router.get(
    "/{deployed_model_id}",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        deployed_model_serializer.PaginatedDeployedModelSerializer,
        deployed_model_serializer.DeployedModelSerializer,
    ],
)
@authenticate_user
@super_user_required
async def get_deployed_model_detail(
    request: Request,
    deployed_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the deployed model detail.
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return deployed_model_controller.get_deployed_model_detail(user, deployed_model_id)


@router.patch(
    "/job",
    status_code=status.HTTP_201_CREATED,
    response_model=deployed_model_serializer.DeployedModelExecuteSerializer,
)
@authenticate_user
@super_user_required
@specific_user_required
async def execute_deployed_model(
    request: Request,
    request_data: deployed_model_schema.DeployedModelExecuteSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute Deployed Model.\n
    Execution options - approved/rejected

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await deployed_model_controller.execute_deployed_model(user, request_data)


@router.delete(
    "/{deployed_model_id}",
    status_code=status.HTTP_200_OK,
    response_model=deployed_model_serializer.DeployedModelDeleteSerializer,
)
@authenticate_user
@super_user_required
async def delete_deployed_model(
    request: Request,
    deployed_model_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will delete the deployed model.
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return deployed_model_controller.delete_deployed_model(user, deployed_model_id)
