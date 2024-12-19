# import json
import logging

from api.utils.executor_app.app import fetch_endpoint, insert_app_functions_variables


def get_updated_code_string(app_info, code_string, request_data, request, exclude_app_functions=False):
    injected_vars = {
        "user_info": request.state.user_info,
    }
    return insert_app_functions_variables(app_info, injected_vars, code_string, exclude_app_functions)


def get_app_function_settings(app_info, request_data, request, code_string=None):
    try:
        no_error, endpoint, executor_id = fetch_endpoint(app_info)
        if not no_error:
            return (False, False), "Failed to fetch Exec Env", endpoint, None
        if code_string:
            return get_updated_code_string(app_info, code_string, request_data, request), {}, endpoint, executor_id
        return (False, False), "Code Execution error: Code is not provided to execute", None, None
    except Exception as e:
        logging.exception(e)
        return (False, False), "Code Execution error: " + str(e), None, None
