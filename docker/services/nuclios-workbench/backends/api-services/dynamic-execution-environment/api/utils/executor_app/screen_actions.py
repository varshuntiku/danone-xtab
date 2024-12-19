import json
import logging

from api.utils.executor_app.app import fetch_endpoint, insert_app_functions_variables


def get_updated_code_string(app_info, code_string, request, request_data, exclude_app_functions=False):
    injected_vars = {
        "current_filter_params": getattr(request_data, "filter_state", None),
        "user_info": request.state.user_info,
        "action_param": getattr(request_data, "action_param", None),
        "action_type": getattr(request_data, "action_type", None),
    }
    return insert_app_functions_variables(app_info, injected_vars, code_string, exclude_app_functions)


def get_screen_action_settings(app_info, app_screen, request_data, request, code_string=None):
    no_error, endpoint, executor_id = fetch_endpoint(app_info)
    if not no_error:
        return (False, False), endpoint, None, None
    if code_string:
        return get_updated_code_string(app_info, code_string, request, request_data), {}, endpoint, executor_id

    action_settings = app_screen.action_settings

    try:
        action_code_param = "action_generator"
        if (getattr(request_data, "action_param", None) and request_data.get("action_param")) or (
            getattr(request_data, "action_type", None) and request_data.get("action_type")
        ):
            action_code_param = "action_handler"
        action_settings = json.loads(action_settings)
        if not action_settings or type(action_settings) is not dict:
            return (False, False), "Action doesn't have code to execute", None, None
        elif action_settings.get("default"):
            return (False, False), action_settings.get("default"), None, None
        elif action_settings.get(action_code_param) is not None:
            config_generator_code = action_settings.get(action_code_param, "")
            return (
                get_updated_code_string(app_info, config_generator_code, request, request_data),
                {},
                endpoint,
                executor_id,
            )
        else:
            return (False, False), "No Code found", None, None
    except Exception as e:
        logging.exception(e)
        return (False, False), "Code Execution error: " + str(e), None, None
