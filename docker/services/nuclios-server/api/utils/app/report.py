import json
import logging
import os
import runpy
import time
from typing import Dict

from api.constants.apps.report_error_messages import ReportErrors
from api.constants.auth.auth_error_messages import AuthErrors
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from api.utils.auth.token import decode_token
from fastapi import status


def get_layout_info(page, layout_data, info):
    """Returns the filtered layout details of the given page

    Args:
        page ([type]): [description]
        layout_data ([type]): [description]
        info ([type]): [description]

    Returns:
        string: [layout data]
    """
    try:
        filtered_layout_data = list(filter(lambda layout: (layout.id == page.layout_id), layout_data))
        if len(filtered_layout_data) > 0:
            if info == "layout_props":
                return filtered_layout_data[0].layout_props
            elif info == "layout_style":
                return filtered_layout_data[0].layout_style
        else:
            return None
    except Exception:
        return None


def eval_widget_filters(content_info):
    """Returns filter info for the content passed. Takes into account all types of content.
        Graphs from Minerva will have no filters.
        Graphs coming from Iteration submissions will have their filters calculated
        Graphs from code strings will already have their filters(if they exist) as without filters code strings normally fail.

    Args:
        content_info (tuple): ((AppScreenWidgetValue, AppScreenWidget), StoryContent)

    Returns:
        dictionary: Either a blank dictionary or a dicctionary containing filters
    """
    filters = {}
    try:
        if not (
            content_info[1].app_screen_id
            and content_info[1].app_screen_widget_id
            and content_info[1].app_screen_widget_value_id
        ):
            # its from minerva
            filters = {}
        elif len(json.loads(content_info[1].filter_data)) >= 0:
            # for Code string expecting '{}' or real filters
            filters = json.loads(content_info[1].filter_data)
        elif content_info[0] and content_info[0].AppScreenWidgetValue and content_info[0].AppScreenWidgetValue.filters:
            filters = {
                filter_item.widget_tag_key: filter_item.widget_tag_value
                for filter_item in content_info[0].AppScreenWidgetValue.filters
            }

    except Exception:
        filters = {}
    return filters


def eval_widget_value(content_info, story_type: str, user_info: Dict):
    """Returns the widget value for the given content info
    The execution process depends on the type of the story:
    Algo:
        Check for the story type
        if one-shot or recurring:
            fetch the data from the save snapshots/content_info.content_json
        if dynamic:
            fetch the latest viz by running the code string
            if graph from minerva/ids are null:
                fallback to snapshots/content_info.content_json

        correctly put:
        widget_value always = content_json if content_json else appwidgetvalue.widget_value
        if story type == dynamic:
            dynamic_run(appwidgetvalue.widget_value)
        TODO YET
    Args:
        content_info (StoryContent): Story Content Object
        story_type (String): Can be either oneshot, recurring, dynamic

    Returns:
        string: widget_value
    """
    try:
        filters = json.loads(content_info[1].filter_data) if json.loads(content_info[1].filter_data) else {}
        # widget_value = ""
        # if not (content_info[1].app_screen_id and content_info[1].app_screen_widget_id and content_info[1].app_screen_widget_value_id):
        #     # If graph is from minerva, then ids will be Null
        #     widget_value = content_info[1].content_json
        # else:
        #     widget_value = content_info[0].AppScreenWidgetValue.widget_value

        widget_value = content_info[1].content_json
        if not widget_value:  # Only to maintain compatibility
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
        if story_type == "dynamic":
            widget_value = content_info[0].AppScreenWidgetValue.widget_value
        data = json.loads(widget_value)

        if data.get("is_dynamic", False):
            return run_code(data, filters, user_info)
        else:
            return widget_value
    except Exception:
        return ""


def run_code(data, filters, user_info):
    """this function will accept the filter as dictionary and the data as dictionary and then run the code inside data
    or fetch the actual json saved in the widget and put it as the content json

    Args:
        data (dict): the data from which can either contian the code or the json itself(when old iterations are used)
        filters (dict): the filters used to obtain the data after running code string

    Returns:
        string: the dictionary/json strified object
    """
    try:
        execution_filename = "execution_code_" + str(time.time()) + ".py"
        code = data.get("code", False)
        with open(execution_filename, "w") as code_file:
            code_file.write(code)
        global_outputs = runpy.run_path(
            execution_filename,
            init_globals={
                "simulator_inputs": {},
                "selected_filters": filters,
                "user_info": user_info if user_info else None,
            },
        )
        return global_outputs["dynamic_outputs"]
    except Exception as error_msg:
        logging.exception(error_msg)
        return ""
    finally:
        os.remove(execution_filename)


def get_story_id_from_token(token: str):
    """decoding from jwt token

    Args:
        token (string): id_token

    Returns:
        int: story id
    """
    data = decode_token(token)
    story_id = data.get("story_id", False)
    sub = data.get("sub")

    # validating story id
    if sub == "data_story_id_token":
        if story_id is not False:
            if isinstance(story_id, int):
                return story_id
            else:
                raise GeneralException(
                    status.HTTP_400_BAD_REQUEST,
                    message={"error": ReportErrors.INCORRECT_STORY_TYPE_ERROR.value},
                )
        else:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": ReportErrors.MISSING_STORY_ID_ERROR.value},
            )
    else:
        raise AuthenticationException(
            message={"error": AuthErrors.TOKEN_SUBJECT_MISMATCH.value},
            status_code=status.HTTP_403_FORBIDDEN,
        )
