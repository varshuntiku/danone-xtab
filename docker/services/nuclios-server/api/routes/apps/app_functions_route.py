from typing import Annotated, List

from api.controllers.apps.app_functions_controller import AppFunctionsController
from api.middlewares.auth_middleware import (
    authenticate_user,
    nac_role_info_required,
    platform_user_info_required,
)
from api.schemas.apps.app_functions_schema import (
    AddAppFunctionRequestSchema,
    AddAppFunctionResponseSchema,
    GetAppFunctionResponseSchema,
    GetAppFunctionsListResponseSchema,
    TestAppFunctionRequestSchema,
    TestAppFunctionResponseSchema,
    UpdateAppFunctionResponseSchema,
)
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

app_functions_controller = AppFunctionsController()


@router.get(
    "/app-admin/app/{app_id}/app-function/list",
    status_code=status.HTTP_200_OK,
    response_model=List[GetAppFunctionsListResponseSchema],
)
@authenticate_user
@platform_user_info_required
async def get_app_functions_list(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    Returns a list of all the existing app function keys
    """
    return app_functions_controller.get_app_functions_list(app_id)


@router.post(
    "/app-admin/app/{app_id}/app-function/value/{key}",
    status_code=status.HTTP_201_CREATED,
    response_model=AddAppFunctionResponseSchema,
)
@authenticate_user
@platform_user_info_required
@nac_role_info_required
async def add_app_functions_value(
    request: Request,
    app_id: int,
    key: str,
    request_data: AddAppFunctionRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    Creates and adds a new app function to app functions
    Example Request Parameters: \n
        {
            "value": "# def func1():#  pass",
            "test": "# # import the module using the following code: # app_func = import_app_func(<Function Name>)# app_func.func1()",
            "desc": "add two numbers"
        }
    """
    return app_functions_controller.add_app_functions_value(app_id, key, request_data)


@router.put(
    "/app-admin/app/{app_id}/app-function/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=UpdateAppFunctionResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def update_app_function_value(
    request: Request,
    app_id: int,
    key: str,
    request_data: AddAppFunctionRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates value for one of the app functions
    Example Request Parameters: \n
        {
            "value": "# def func1():#  pass",
            "test": "# # import the module using the following code: # app_func = import_app_func(<Function Name>)# app_func.func1()",
            "desc": "add two numbers"
        }
    """
    return app_functions_controller.update_app_function_value(app_id, key, request_data)


@router.delete(
    "/app-admin/app/{app_id}/app-function/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=UpdateAppFunctionResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def delete_app_function_value(
    request: Request,
    app_id: int,
    key: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes key from existing app functions
    """
    return app_functions_controller.delete_app_function_value(app_id, key)


@router.get(
    "/app-admin/app/{app_id}/app-function/value/{key}",
    status_code=status.HTTP_200_OK,
    response_model=GetAppFunctionResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def get_app_function_value(
    request: Request,
    app_id: int,
    key: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns value for existing app function
    """
    return app_functions_controller.get_app_function_value(app_id, key)


@router.post(
    "/app-admin/app/{app_id}/app-function/test/{key}",
    status_code=status.HTTP_200_OK,
    response_model=TestAppFunctionResponseSchema,
)
@authenticate_user
@platform_user_info_required
async def test_app_function_value(
    request: Request,
    app_id: int,
    key: str,
    request_data: TestAppFunctionRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Tests one of the app functions
    """
    return app_functions_controller.test_app_function_value(token.credentials, app_id, key, request_data, request)
