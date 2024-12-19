from typing import Annotated, Dict, List

from api.controllers.apps.execution_env_controller import ExecutionEnvController
from api.middlewares.auth_middleware import authenticate_user, nac_role_info_required
from api.schemas.apps.execution_env_schema import (
    CreateDynamicExecutionEnvRequestSchema,
    CreateDynamicExecutionEnvResponseSchema,
    DefaultExecutionEnvSchema,
    GetDynamicExecutionEnvByAppSchema,
    GetDynamicExecutionEnvListSchema,
    UpdateDynamicExecEnvDetailRequestSchema,
    UpdateDynamicExecutionEnvRequestSchema,
    UpdateDynamicExecutionEnvResponseSchema,
)
from api.schemas.generic_schema import DataDeleteResponseSchema, StatusResponseSchema
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

execution_env_controller = ExecutionEnvController()


@router.get(
    "/dynamic-execution-environments",
    status_code=status.HTTP_200_OK,
    response_model=List[GetDynamicExecutionEnvListSchema],
)
@authenticate_user
async def get_dynamic_execution_environments(
    request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get dynamic execution environments
    """
    return execution_env_controller.get_dynamic_execution_env_list()


@router.get(
    "/dynamic-execution-environments/app/{app_id}",
    status_code=status.HTTP_200_OK,
    response_model=GetDynamicExecutionEnvByAppSchema,
)
@authenticate_user
async def get_dynamic_execution_env_by_app_id(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get dynamic execution environment by app_id
    """
    return execution_env_controller.get_dynamic_execution_env_by_app_id(app_id)


@router.put(
    "/dynamic-execution-environments/app",
    status_code=status.HTTP_200_OK,
    response_model=UpdateDynamicExecutionEnvResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def update_app_env_id(
    request: Request,
    request_data: UpdateDynamicExecutionEnvRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update dynamic execution environment id by app_id \n
    Example Request Parameters: \n
        {
          "exec_env_id": 3,
          "app_id": 5
        }
    """
    return execution_env_controller.update_app_env_id(request_data)


@router.post(
    "/dynamic-execution-environments",
    status_code=status.HTTP_201_CREATED,
    response_model=CreateDynamicExecutionEnvResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def create_dynamic_execution_environments(
    request: Request,
    request_data: CreateDynamicExecutionEnvRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to create dynamic execution environment id by app_id \n
    Example Request Parameters: \n
        {
          "name": "string",
          "requirements": "string",
          "py_version": "string",
          "created_by": 0
        }
    """
    return execution_env_controller.create_dynamic_execution_environments(request_data)


@router.get(
    "/dynamic-execution-environments/{execution_environment_id}/start",
    status_code=status.HTTP_200_OK,
    response_model=Dict,
)
@authenticate_user
@nac_role_info_required
async def start_dynamic_execution_environments(
    request: Request,
    execution_environment_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to start dynamic execution environment by id \n
    """
    access_token = token.credentials
    return execution_env_controller.start_dynamic_execution_environments(access_token, execution_environment_id)


@router.delete(
    "/dynamic-execution-environments/{execution_environment_id}",
    status_code=status.HTTP_200_OK,
    response_model=DataDeleteResponseSchema,
)
@authenticate_user
async def delete_dynamic_execution_environments(
    request: Request,
    execution_environment_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to delete dynamic execution environment by id \n
    """

    return execution_env_controller.delete_dynamic_execution_environments(execution_environment_id)


@router.get(
    "/dynamic-execution-environments/default",
    status_code=status.HTTP_200_OK,
    response_model=List[DefaultExecutionEnvSchema],
)
@authenticate_user
async def default_pylist(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get default requirements for dynamic execution.\n
    """

    return execution_env_controller.default_pylist()


@router.post(
    "/dynamic-execution-environments/{execution_environment_id}",
    status_code=status.HTTP_200_OK,
    response_model=StatusResponseSchema,
)
@authenticate_user
async def update_dynamic_execution_env_post(
    request: Request,
    execution_environment_id: int,
    request_data: UpdateDynamicExecEnvDetailRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update dynamic execution POST.\n
    Example Request Parameters: \n
        {
            "id": 3,
            "name": "env18",
            "py_version": "3.10.2",
            "requirements": "httpx"
        }
    """
    return execution_env_controller.update_dynamic_execution_env(execution_environment_id, request_data)


@router.put(
    "/dynamic-execution-environments/{execution_environment_id}",
    status_code=status.HTTP_200_OK,
    response_model=StatusResponseSchema,
)
@authenticate_user
async def update_dynamic_execution_env_put(
    request: Request,
    execution_environment_id: int,
    request_data: UpdateDynamicExecEnvDetailRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update dynamic execution PUT.\n
    Example Request Parameters: \n
        {
            "id": 3,
            "name": "env18",
            "py_version": "3.10.2",
            "requirements": "httpx"
        }
    """
    return execution_env_controller.update_dynamic_execution_env(execution_environment_id, request_data)
