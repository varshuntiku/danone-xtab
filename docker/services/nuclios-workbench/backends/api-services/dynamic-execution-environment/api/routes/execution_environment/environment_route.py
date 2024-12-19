import json
from typing import List, Union

from api.controllers.execution_environment import execution_environment_controller
from api.middlewares.auth_middleware import (
    authenticate_user,
    environment_required,
    super_user_required,
)
from api.schemas.execution_environment import execution_environment_schema
from api.serializers.execution_environment import execution_environment_serializer
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

# Controller Intialization
execution_environment_controller = execution_environment_controller.ExecutionEnvironmentController()


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=Union[
        execution_environment_serializer.PaginatedExecutionEnvironmentSerializer,
        List[execution_environment_serializer.ExecutionEnvironmentSerializer],
    ],
)
@authenticate_user
async def get_execution_environments(
    request: Request,
    page: int = None,
    size: int = None,
    search: str = None,
    env_type: str = None,
    env_category: str = None,
    project_id: int = None,
    approval_status: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """API will return the Execution Environments available on Co.dx.
    Will take input as search, env_type and pagination parameters
    Returns:
        _type_: _description_
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return execution_environment_controller.get_execution_environments(
        user, page, size, search, env_type, env_category, project_id, approval_status
    )


@router.get(
    "/{id}/stream-status",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def get_execution_environment_live_status(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a execution environment from the server.\n
    Will take url parameters as execution environment id parameter.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.get_execution_environment_live_status(user, id)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=execution_environment_serializer.ExecutionEnvironmentSerializer,
)
@authenticate_user
@super_user_required
async def create_execution_environment(
    request: Request,
    request_data: execution_environment_schema.ExecutionEnvironmentCreateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create Finetuned Model(Experiments).\n
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.create_execution_environment(user, request_data)


@router.post(
    "/validate/packages",
    status_code=status.HTTP_200_OK,
    response_model=execution_environment_serializer.ExecutionEnvironmentPackagesListSerializer,
)
@authenticate_user
async def validate_pip_packages(
    request: Request,
    request_data: execution_environment_schema.ExecutionEnvironmentPackagesListValidatorSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to Validate Packages.\n
    """
    request_data = json.loads(json.dumps(request_data, default=lambda o: o.__dict__))
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return execution_environment_controller.validate_pip_packages(user, request_data)


@router.get(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=execution_environment_serializer.ExecutionEnvironmentSerializer,
)
@authenticate_user
async def get_execution_environment_detail(
    request: Request,
    id: int = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will return the Execution Environment Detail.
    id is query parameter(Execution Environment ID) which is of type of int.
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return execution_environment_controller.get_execution_environment_detail(user, id)


@router.post(
    "/custom/link",
    status_code=status.HTTP_201_CREATED,
    response_model=execution_environment_serializer.AppEnvMapSerializer,
)
@authenticate_user
# @super_user_required
async def link_app_env(
    request: Request,
    request_data: execution_environment_schema.AppEnvMappingSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to link Env to App.\n
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.link_app_env(user, request_data)


@router.get(
    "/custom/link/app/{app_id}",
    status_code=status.HTTP_201_CREATED,
    # response_model=dict,
    # execution_environment_serializer.ExecutionEnvironmentSerializer,
)
@authenticate_user
async def get_exec_env_id_by_app_id(
    request: Request,
    app_id: int,
    default_env: bool = False,
    fetch_execution_environment_details: bool = False,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to link Env to App.\n
    """
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.get_execution_environment_id_by_app_id(
        user, app_id, default_env, fetch_execution_environment_details
    )


@router.patch(
    "/{id}",
    status_code=status.HTTP_200_OK,
    response_model=execution_environment_serializer.ExecutionEnvironmentSerializer,
)
@authenticate_user
@super_user_required
async def update_execution_environment(
    request: Request,
    id: int,
    request_data: execution_environment_schema.ExecutionEnvironmentUpdateSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update Execution Environment.\n

    Returns: \n
        json: {Execution Environment}
    """
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.update_execution_environment(user, id, request_data)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
@authenticate_user
async def delete_execution_environment(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stop the finetuning process
    """
    user = request.state.user.__dict__
    return await execution_environment_controller.delete_execution_environment(user, id)


@router.post(
    "/{id}/action",
    status_code=status.HTTP_202_ACCEPTED,
    response_model=execution_environment_serializer.ExecutionEnvironmentSerializer,
)
@authenticate_user
@environment_required
async def action_execution_environment(
    request: Request,
    id: int,
    request_data: execution_environment_schema.ExecutionEnvironmentApprovalSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    request_data = json.loads(
        json.dumps(request_data, default=lambda o: o.__dict__)
    )  # Converting to dict to decouple controller from pydantic model
    user = request.state.user.__dict__
    return await execution_environment_controller.action_execution_environment(user, id, request_data)


@router.post(
    "/logs/{deployment}",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def fetch_logs(
    request: Request,
    deployment: str,
    namespace: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will start/stop the execution environment
    """
    user = request.state.user.__dict__
    return await execution_environment_controller.fetch_logs(user, deployment, namespace)


@router.post(
    "/{id}/{action}",
    status_code=status.HTTP_204_NO_CONTENT,
)
@authenticate_user
async def action_on_execution_environment(
    request: Request,
    id: int,
    action: execution_environment_schema.ExecutionEnvironmentActions,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will start/stop the execution environment
    """
    user = request.state.user.__dict__
    return await execution_environment_controller.action_on_execution_environment(user, id, action)


@router.get(
    "/{project_id}/project-status-stream",
    status_code=status.HTTP_200_OK,
)
@authenticate_user
async def project_status_stream(
    request: Request,
    project_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API will stream the live status of a execution environment for a Project from the server.\n
    Will take url parameters as Project id parameter.
    """
    # user = request.state.user.__dict__  # Converting to dict to decouple controller from user sqlalchemy object
    return await execution_environment_controller.get_project_execution_environment_live_status(project_id)
