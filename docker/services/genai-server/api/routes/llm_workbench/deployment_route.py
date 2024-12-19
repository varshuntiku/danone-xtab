from typing import List, Union

from api.controllers.llm_workbench.deployment_controller import LLMDeploymentController
from api.middlewares.auth_middleware import authenticate_user, super_user_required
from api.schemas.llm_workbench import deployment_schema
from api.serializers.llm_workbench import deployment_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
llm_deployment_controller = LLMDeploymentController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        deployment_serializer.PaginatedLLMDeployedModelSerializer,
        List[deployment_serializer.LLMDeployedModelSerializer],
    ],
)
@authenticate_user
async def get_llm_deployed_models(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    approval_status: str = None,
    problem_type: str = None,
    base_model_name: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the deployed models available on Co.dx.
    Will take input as search parameters and pagination parameters
    create the models for payload and response in models folder under ml_models folder
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_deployment_controller.get_llm_deployed_models(
        user, page, size, search, approval_status, problem_type, base_model_name
    )


@router.get(
    "/{id}/stream-status",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_llm_deployed_model_live_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a experiment from the server.\n
    Will take url parameters as experiment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_deployment_controller.get_llm_deployed_model_live_status(user, id)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=deployment_serializer.LLMDeployedModelSerializer,
)
@authenticate_user
@super_user_required
async def create_llm_deployed_model(
    request: Request,
    request_data: deployment_schema.LLMDeployedModelCreateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Deployed Model.\n

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_deployment_controller.create_llm_deployed_model(user, request_data)


@router.patch(
    "",
    status_code=status.HTTP_200_OK,
    response_model=deployment_serializer.LLMDeployedModelSerializer,
)
@authenticate_user
@super_user_required
async def update_llm_deployed_model(
    request: Request,
    request_data: deployment_schema.LLMDeployedModelUpdateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Deployed Model.\n

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return llm_deployment_controller.update_llm_deployed_model(user, request_data)


@router.patch(
    "/execute",
    status_code=status.HTTP_201_CREATED,
    response_model=deployment_serializer.LLMDeployedModelExecuteSerializer,
)
@authenticate_user
@super_user_required
async def execute_deployed_model(
    request: Request,
    request_data: deployment_schema.LLMDeployedModelExecuteSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute LLM Deployed Model.\n
    Execution options - approved/rejected

    Returns: \n
        json: {Deployed Model}
    """
    request_data = dict(request_data)  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await llm_deployment_controller.execute_deployed_model(user, request_data)


@router.get(
    "/{id}/details",
    status_code=status.HTTP_200_OK,
    response_model=deployment_serializer.LLMDeployedModelDetailSerializer,
)
@authenticate_user
async def get_deployed_model_details(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__
    return llm_deployment_controller.get_llm_deployed_model_detail(user, id)


@router.get(
    "/{id}/status",
    status_code=status.HTTP_200_OK,
    response_model=deployment_serializer.LLMDeployedModelStatusSerializer,
)
@authenticate_user
async def get_deployed_model_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    user = request.state.user.__dict__
    return llm_deployment_controller.get_llm_deployed_model_status(user, id)
