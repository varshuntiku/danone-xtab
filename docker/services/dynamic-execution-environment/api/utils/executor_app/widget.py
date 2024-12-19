import json

from api.utils.executor_app.app import fetch_endpoint, insert_app_functions_variables


def get_updated_code_string(app_info, code_string, request_data, request, exclude_app_functions=False):
    injected_vars = {
        "simulator_inputs": {},
        "selected_filters": request_data.filters if hasattr(request_data, "filters") else {},
        "user_info": request.state.user_info
        if hasattr(request, "state") and hasattr(request.state, "user_info")
        else {},
        "data_state_key": request_data.data_state_key if hasattr(request_data, "data_state_key") else None,
        "crossfilter_event": request_data.widget_event if hasattr(request_data, "widget_event") else None,
    }
    if hasattr(request_data, "action_type") and request_data.action_type:
        injected_vars["action_type"] = request_data.action_type
    if hasattr(request_data, "data") and request_data.data:
        injected_vars["screen_data"] = request_data.data
    if hasattr(request_data, "filters") and request_data.filters:
        injected_vars["filter_data"] = request_data.filters
    if hasattr(request_data, "formData") and request_data.formData:
        injected_vars["form_data"] = request_data.formData
    if hasattr(request_data, "selected") and request_data.selected:
        injected_vars["selected"] = request_data.selected
    if hasattr(request_data, "prev_screen_data") and request_data.prev_screen_data:
        injected_vars["prev_screen_data"] = request_data.prev_screen_data
    return insert_app_functions_variables(app_info, injected_vars, code_string, exclude_app_functions)


def get_code_string_value(
    widget_value, app_info, app_id, widget_id, request_data, request, code_string=None, widget_filter=False
):
    # code_string = None
    widget_simulated_value = None
    no_error, endpoint, executor_id = fetch_endpoint(app_info)
    if not no_error:
        return True, (endpoint, 0), None, None, None
    if code_string:
        code_string, injected_lines_count = get_updated_code_string(app_info, code_string, request_data, request)
    elif widget_value:
        if widget_filter == False:
            # widget_value_id = widget_value.id
            widget_simulated_value = widget_value.widget_simulated_value
            widget_value = widget_value.widget_value
            # If code fragment get dynamic data
            widget_json = json.loads(widget_value)
            try:
                if widget_json.get("is_dynamic", False) and widget_json["code"] and widget_json["code"] != "":
                    code_string, injected_lines_count = get_updated_code_string(
                        app_info, widget_json["code"], request_data, request
                    )
                else:
                    code_string = None
                    return True, (widget_json, 0), widget_simulated_value, endpoint, executor_id
            except Exception as error_msg:
                print(error_msg)
                pass
        elif widget_filter == True:
            widget_value = widget_value.widget_filter_value
            # If code fragment get dynamic data
            widget_json = json.loads(widget_value)
            try:
                if widget_json["code"] and widget_json["code"] != "":
                    code_string, injected_lines_count = get_updated_code_string(
                        app_info, widget_json["code"], request_data, request
                    )
                else:
                    code_string = None
                    return True, (widget_json, 0), widget_simulated_value, endpoint, executor_id
            except Exception as error_msg:
                print(error_msg)
                pass

    no_widget_value = False if code_string else True
    return (
        no_widget_value,
        (code_string, injected_lines_count),
        widget_simulated_value,
        endpoint,
        executor_id,
    )


def get_dynamic_widget_code(
    app_info, widget_value, app_id, widget_id, request_data, request, widget_filter=False, code_string=None
):
    (
        no_widget_value,
        (code_string, injected_lines_count),
        widget_simulated_value,
        endpoint,
        executor_id,
    ) = get_code_string_value(
        widget_value, app_info, app_id, widget_id, request_data, request, code_string, widget_filter
    )
    return (
        no_widget_value,
        (code_string, injected_lines_count),
        widget_simulated_value,
        endpoint,
        executor_id,
    )
