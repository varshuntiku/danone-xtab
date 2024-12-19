from typing import Annotated

from api.controllers.apps.app_variables_controller import AdminController
from api.middlewares.auth_middleware import (
    authenticate_user,
    nac_role_info_required,
    platform_user_info_required,
)
from api.schemas.apps.app_variables_schema import (
    AddAppVariableRequestSchema,
    AddAppVariableResponseSchema,
    GetAppVariableKeyResponseSchema,
    GetAppVariableValueResponseSchema,
    UpdateAppVariableResponseSchema,
)
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization

auth_scheme = HTTPBearer(auto_error=False)
app_variables_controller = AdminController()


@router.get(
    "/app-admin/app/{app_id}/app-variable/keys",
    status_code=status.HTTP_200_OK,
    response_model=GetAppVariableKeyResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def get_app_variable_keys(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get a list of all the existing app variable keys
    """
    return app_variables_controller.get_app_variable_keys(app_id)


@router.post(
    "/app-admin/app/{app_id}/app-variable/value/{key}",
    status_code=status.HTTP_201_CREATED,
    response_model=AddAppVariableResponseSchema,
)
@authenticate_user
@platform_user_info_required
@nac_role_info_required
async def add_app_variables(
    request: Request,
    app_id: int,
    key: str,
    request_data: AddAppVariableRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to create app variable.\n

    Example Request Parameters: \n
        {
            "value": "test_var_val"
        }
    """
    return app_variables_controller.add_app_variables(app_id, key, request_data)


@router.put(
    "/app-admin/app/{app_id}/app-variable/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=UpdateAppVariableResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def update_app_variable_value(
    request: Request,
    app_id: int,
    key: str,
    request_data: AddAppVariableRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update app variable.\n

    Example Request Parameters: \n
        {
            "value": "test_var_val"
        }
    """
    return app_variables_controller.update_app_variables(app_id, key, request_data)


@router.delete(
    "/app-admin/app/{app_id}/app-variable/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=UpdateAppVariableResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def delete_app_variable_value(
    request: Request,
    app_id: int,
    key: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes key from existing app variables\n
    """
    return app_variables_controller.delete_app_variable_value(app_id, key)


@router.get(
    "/app-admin/app/{app_id}/app-variable/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=GetAppVariableValueResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def get_app_variable_value(
    request: Request,
    app_id: int,
    key: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Get  value for existing app variable.\n
    """
    return app_variables_controller.get_app_variable_value(app_id, key)
