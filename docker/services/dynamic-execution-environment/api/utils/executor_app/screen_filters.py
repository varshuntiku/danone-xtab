import json
import logging

from api.utils.executor_app.app import fetch_endpoint, insert_app_functions_variables


def get_updated_code_string(app_info, code_string, request_data, request, exclude_app_functions=False):
    current_filter_params = {}
    # dict(request_data)
    selected_filters = getattr(request_data, "selected_filters", None)
    selected = getattr(request_data, "selected", None)
    if selected_filters:
        current_filter_params = request_data.__dict__ if request_data else {}
    elif selected:
        current_filter_params = request_data.__dict__ if request_data else {}
    injected_vars = {
        "current_filter_params": current_filter_params,
        "user_info": request.state.user_info,
    }
    return insert_app_functions_variables(app_info, injected_vars, code_string, exclude_app_functions)


def get_screen_filter_settings(app_info, app_screen, request_data, request, code_string=None):
    no_error, endpoint, executor_id = fetch_endpoint(app_info)
    if not no_error:
        return (False, False), "Unable to fetch Exec Env", endpoint, None
    if code_string:
        return get_updated_code_string(app_info, code_string, request_data, request), {}, endpoint, executor_id
    screen_filters = app_screen.screen_filters_value

    try:
        screen_filter_value = {} if not screen_filters else json.loads(screen_filters)
        if screen_filter_value is None:
            return (False, False), "Filters doesn't have any code to execute", None, None
        elif (
            screen_filter_value.get("is_dynamic", True)
            and screen_filter_value.get("dataValues", None)
            and screen_filter_value.get("defaultValues", None)
        ):
            return (screen_filter_value if screen_filter_value else False, 0), "", None, None
        else:
            filter_code = screen_filter_value.get("code", "")
            return get_updated_code_string(app_info, filter_code, request_data, request), "", endpoint, executor_id

    except Exception as e:
        logging.exception(e)
        return (False, False), "Code Execution error: " + str(e), None, None
