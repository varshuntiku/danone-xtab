from typing import Annotated, Dict

from api.controllers.apps.screen_actions_controller import ScreenActionsController
from api.middlewares.auth_middleware import (
    app_user_info_required,
    authenticate_user,
    nac_role_info_required,
)
from api.schemas.apps.screen_actions_schema import (
    AppScreenActionHandlerRequestSchema,
    AppScreenActionsCodeStringRequestSchema,
    AppScreenActionsOutputResponseSchema,
    AppScreenActionsRequestSchema,
    AppScreenActionsResponseSchema,
    AppScreenDynamicActionsRequestSchema,
    AppScreenGetActionsResponseSchema,
    AppScreenResponseSchema,
    ExecuteDynamicActionsRequestSchema,
)
from fastapi import APIRouter, Header, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

screen_actions_controller = ScreenActionsController()

auth_scheme = HTTPBearer(auto_error=False)


##############################
# App actions related routes #
##############################


@router.post(
    "/app-admin/app/{app_id}/screen/{screen_id}/save-actions",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def save_actions(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: AppScreenActionsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to save screen app actions \n
    Example Request Parameters: \n
        {
            "action_settings": {
                "action_generator": "import json",
                "action_handler": ""
            }
        }
    """
    user_id = request.state.user.id
    response = screen_actions_controller.save_actions(user_id, screen_id, request_data)
    return response


@router.post(
    "/app-admin/app/{app_id}/test-actions-code",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenActionsResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def test_actions(
    request: Request,
    app_id: int,
    request_data: AppScreenActionsCodeStringRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to execute and return output of passed actions code strings \n
    Example Request Parameters: \n
        {
            "code_string": "import json"
        }
    """
    response = screen_actions_controller.test_actions(app_id, request, request_data)
    return response


@router.get(
    "/app/{app_id}/screen/{screen_id}/action/uiac",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenGetActionsResponseSchema | Dict | bool | None,
)
@authenticate_user
@app_user_info_required
async def get_actions(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch the screen app actions generator and handler code strings
    """
    response = screen_actions_controller.get_actions(app_id, screen_id)
    return response


@router.post(
    "/app-admin/app/{app_id}/preview-actions",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenActionsOutputResponseSchema | Dict | bool,
)
@authenticate_user
async def preview_actions(
    request: Request,
    app_id: int,
    request_data: AppScreenActionsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute and return output of passed action settings code strings \n
    Example Request Parameters: \n
        {
            "action_settings": {
                "action_generator": "import path",
                "action_handler": "import json"
            }
        }
    """
    response = screen_actions_controller.preview_actions(app_id, request, request_data)
    return response


@router.post(
    "/app/{app_id}/screens/{screen_id}/dynamic-actions",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenActionsOutputResponseSchema | Dict | bool,
)
@authenticate_user
@app_user_info_required
async def get_dynamic_actions(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: AppScreenDynamicActionsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get app screen actions' code string output after execution \n
    Example Request Parameters: \n
        {
            "filter_state": {}
        }
    """
    response = screen_actions_controller.get_dynamic_actions(app_id, screen_id, request, request_data)
    return response


@router.post(
    "/app-admin/app/{app_id}/preview-actions-handler",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenActionsResponseSchema,
)
@authenticate_user
@nac_role_info_required
async def preview_actions_handler(
    request: Request,
    app_id: int,
    request_data: AppScreenActionsCodeStringRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to execute and return output of passed action handler code string \n
    Example Request Parameters: \n
        {
            "code_string": "import json"
        }
    """
    response = screen_actions_controller.preview_actions_handler(app_id, request, request_data)
    return response


@router.post(
    "/app/{app_id}/screens/{screen_id}/action_handler",
    status_code=status.HTTP_200_OK,
    response_model=AppScreenActionsOutputResponseSchema | Dict,
)
@authenticate_user
@app_user_info_required
async def action_handler(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: AppScreenActionHandlerRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute and return output of given screen's action handler \n
    Example Request Parameters: \n
        {
            "filter_state": {},
            "action_param": {},
            "action_type": "test_button_action",
        }
    """
    response = screen_actions_controller.action_handler(app_id, screen_id, request_data, request)
    return response


@router.post(
    "/app/{app_id}/screens/{screen_id}/execute-dynamic-action", status_code=status.HTTP_200_OK, response_model=Dict
)
@authenticate_user
@app_user_info_required
async def get_dynamic_action_response(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: ExecuteDynamicActionsRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to execute dynamic actions .\n
    """
    access_token = token.credentials
    user_info = request.state.user_info
    logged_in_email = request.state.logged_in_email
    return screen_actions_controller.get_dynamic_action_response(
        user_info, logged_in_email, app_id, screen_id, request_data, access_token
    )
