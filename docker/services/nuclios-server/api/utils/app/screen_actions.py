import json
import logging
from typing import Dict, Tuple

from api.constants.apps.screen_actions_error_messages import ScreenActionsErrors
from api.utils.app.app import execute_code_string, sanitize_content
from fastapi import Request


def get_screen_action_settings(
    app_id: int,
    screen_id: int,
    access_token: str,
    screen_action_settings: str,
    current_action_params: Dict = {},
    request: Request = None,
) -> Tuple[Dict, str, bool, None] | bool:  # verify returned types and update if required
    """Gets and executes screen actions settings and code

    Args:
        app_id: app id
        screen_id: screen id
        access_token: auth access token of the user
        screen_action_settings: screen actions details
        current_action_params: action parameters
        request: incoming request object

    Returns:
        Output response after execution of screen action code string, logs and error line number if any
    """
    try:
        action_settings = json.loads(screen_action_settings)
        if not action_settings:
            return False, ScreenActionsErrors.APP_SCREEN_ACTION_CODE_MISSING_ATTR_ERROR.value, None
        elif action_settings.get("default"):
            return action_settings.get("default")
        elif action_settings.get("action_generator") is not None:
            config_generator_code = action_settings.get("action_generator", "")
            code = (
                config_generator_code
                + """
code_outputs = dynamic_outputs
        """
            )
            filter_state = current_action_params.get("filter_state", None)
            file_prefix = f"screen_action_generator_{app_id}_{screen_id}_{request.state.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": filter_state,
                    "user_info": request.state.user_info,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )
            return (
                json.loads(sanitize_content(code_string_response["code_string_output"]["code_outputs"])),
                code_string_response["logs"],
                code_string_response.get("lineno", None),
            )
        else:
            return False, ScreenActionsErrors.APP_SCREEN_ACTION_CODE_MISSING_ATTR_ERROR.value, None
    except Exception as e:
        logging.exception(e)
        return False, ScreenActionsErrors.APP_SCREEN_ACTION_CODE_EXECUTION_ERROR.value + ": " + str(e), None


def execute_screen_action_handler(
    app_id: int,
    screen_id: int,
    access_token: str,
    screen_action_settings: Dict,
    current_action_params: Dict = {},
    base_url: str = "",
    request: Request = None,
) -> Tuple[Dict, str, bool, None]:  # verify returned types and update if required:
    """Gets and executes screen action handler settings and code

    Args:
        app_id: app id
        screen_id: screen id
        access_token: auth access token of the user
        screen_action_settings: screen actions details
        current_action_params: action parameters
        base_url: the base url
        request: incoming request object

    Returns:
        Output response after execution of screen action handler code string, logs and error line number if any
    """
    try:
        if screen_action_settings.get("action_handler") is not None:
            action_handler = screen_action_settings.get("action_handler", "")
            code = (
                action_handler
                + """
if 'dynamic_outputs' in locals():
    code_outputs = dynamic_outputs
        """
            )
            # handle case where no action type is passed, set dynamic outputs to empty object -
            # this prevents syntax issues where dynamic_outputs is not defined
            action_type = current_action_params.get("action_type", None)
            # if action_type is None:
            #     code = 'dynamic_outputs = "{}"\n' + code
            file_prefix = f"screen_action_handler_{app_id}_{screen_id}_{request.state.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": current_action_params.get("filter_state", None),
                    "action_param": current_action_params.get("action_param", None),
                    "action_type": action_type,
                    "user_info": request.state.user_info,
                    "__baseurl__": base_url,
                    "source_app_id": app_id,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )
            return (
                json.loads(sanitize_content(code_string_response["code_string_output"].get("code_outputs", "{}"))),
                code_string_response["logs"],
                code_string_response.get("lineno", None),
            )
        else:
            return False, ScreenActionsErrors.APP_SCREEN_ACTION_CODE_MISSING_ATTR_ERROR.value, None
    except Exception as e:
        logging.exception(e)
        return False, ScreenActionsErrors.APP_SCREEN_ACTION_CODE_EXECUTION_ERROR.value + ": " + str(e), None
