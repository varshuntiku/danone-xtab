import json

from api.utils.app.app import execute_code_string
from fastapi import Request


def get_dynamic_filters_helper(
    request: Request,
    app_id: int,
    screen_id: int,
    access_token: str,
    screen_filter_value,
    current_filter_params={},
):
    """Helper function to add dynamic filters for the given screen

    Args:
        screen_filter_value ([type]): [description]
        current_filter_params (dict, optional): [description]. Defaults to {}.

    Returns:
        [type]: [description]
    """
    try:
        # loading the filter data from the query:
        # 1. Direct JSON has the structure so is_dynamic will not exist but
        # dataValues and defaultValues will exist
        screen_filter_value = {} if not screen_filter_value else json.loads(screen_filter_value)
        if screen_filter_value is None:
            return False
        elif (
            screen_filter_value.get("is_dynamic", True)
            and screen_filter_value.get("dataValues", None)
            and screen_filter_value.get("defaultValues", None)
        ):
            return screen_filter_value if screen_filter_value else False
        else:  # 2. the JSON has been sent as a code
            # 2.1 This is the first touch, so we just need the basic set of filters with default values
            # So the code will run normally and give us the JSON
            # 2.2 This is where the trick is, this is called from get_dynamic_filters api,
            # the current_filter_params will not be empty, and thus we pass this to the code and get the specific set of filter data

            # FROM HERE THE CODE STRING WILL RUN

            filter_code = screen_filter_value.get("code", "")
            code = (
                filter_code
                + """
code_outputs = dynamic_outputs
        """
            )
            file_prefix = f"filter_{app_id}_{screen_id}_{request.state.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": current_filter_params,
                    "user_info": request.state.user_info,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )
            return (
                json.loads(code_string_response["code_string_output"]["code_outputs"]),
                code_string_response["logs"],
                code_string_response.get("lineno", None),
            )
    except Exception as e:
        return False, "Error executing code: " + str(e), None
