#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import gzip
import io
import logging
import os
import runpy
import shutil
import sys
import time
import traceback

from api.blueprints.alerts.notifications import emit_notification, notification_data
from api.blueprints.utils import add_container_mapping
from api.connectors.dynamic_viz_exec_env import ExecutionEnvDynamicViz
from api.constants.functions import (
    ExceptionLogger,
    file_response,
    json_response,
    json_response_count,
    sanitize_content,
)
from api.constants.variables import CustomException
from api.helpers import get_blob, get_blob_list, get_clean_postdata
from api.middlewares import (
    app_user_info_required,
    login_required,
    nac_role_info_required,
    platform_user_info_required,
    restricted_user_info_required,
)
from api.models import (
    App,
    AppContainer,
    AppDynamicVizExecutionEnvironment,
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetFilterValue,
    AppScreenWidgetValue,
    AppUser,
    CustomLayout,
    DynamicVizExecutionEnvironment,
    StoryAppMapping,
    db,
)
from cryptography.fernet import Fernet
from flasgger.utils import swag_from
from flask import Blueprint
from flask import current_app as app
from flask import g, json, request
from sqlalchemy import and_, asc
from sqlalchemy.sql import func

bp = Blueprint("App", __name__)
generic_err_message = "item not found"


@bp.route("/codex-product-api/app/user-app", methods=["GET"])
@swag_from("./documentation/app/get_user_app_id.yml")
@login_required
def get_user_app_id():
    """Generates a list of all the accessible apps for the logged in user with a url to access the apps

    Returns:
        json: {status,app_id,landing_url}
    """
    accessible_apps = []
    landing_url = ""
    try:
        # & (AppUser.environment == 'prod')).all()
        # NOTE: May need to modify this with a join to retrieve only prod version apps from app_user table.
        app_user = AppUser.query.filter(
            (func.lower(AppUser.user_email) == func.lower(g.logged_in_email)) & (AppUser.deleted_at.is_(None))
        ).all()
        accessible_apps = [app.app_id for app in app_user]
        # Getting the Function and Industry Name
        # NOTE: Mandatory that all apps are in the same function  so we can query only the first app
        if len(accessible_apps) > 1:
            landing_url = "/my-dashboard"

        return json_response(
            {
                "status": "success",
                "app_id": accessible_apps[0]
                if len(accessible_apps) == 1
                else accessible_apps
                if len(accessible_apps) >= 1
                else False,
                "landing_url": landing_url,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)

        return json_response({"status": "error", "error": generic_err_message}, 500)


@bp.route("/codex-product-api/app/user-access", methods=["GET"])
@swag_from("./documentation/app/get_user_special_access.yml")
@login_required
def get_user_special_access():
    """Generates urls to access the apps if the logged in user has special access

    Returns:
        json: {status,special_access_urls}
    """
    try:
        # app_user = AppUser.query.filter(func.lower(
        #     AppUser.user_email) == func.lower(g.logged_in_email)).first()
        # # Getting the special access
        # if app_user and app_user.permissions:
        #     special_links = json.loads(app_user.permissions)

        return json_response(
            {
                "status": "success",
                "special_access_urls": {
                    "special_links": [{"link": "/marketing-dashboard", "component": "MarketingDemo"}]
                },
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": generic_err_message}, 500)


# TODO correct api naming


@bp.route("/codex-product-api/app/get-apps", methods=["GET"])
@swag_from("./documentation/app/get_app_list.yml")
@login_required
def get_app_list():
    """Returns the list of all the apps with id and name

    Returns:
        dictionary: {app_id,app_name}
    """
    app_list = []
    try:
        app_list_ = App.query.filter(App.environment == "prod").all()
        app_list = [{"app_id": app_item.id, "app_name": app_item.name} for app_item in app_list_]

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error executing code"}, 500)
    return json_response(app_list)


# TODO correct api naming


@bp.route("/codex-product-api/app/get-app-by-name/<string:app_name>", methods=["GET"])
@swag_from("./documentation/app/get_app_by_name.yml")
@login_required
def get_app_by_name(app_name):
    """Returns a list of all the apps with the given name

    Args:
        app_name ([type]): [description]

    Returns:
        json: {app_id,app_name}
    """
    try:
        app_list_ = App.query.filter(App.name.contains(app_name) & (App.environment == "prod")).all()
        app_list = [{"app_id": app_item.id, "app_name": app_item.name} for app_item in app_list_]

    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error fetching application by name"}, 500)
    return json_response(app_list)


@bp.route("/codex-product-api/app/<int:app_id>", methods=["GET", "POST"])
@swag_from("./documentation/app/get_app_config.yml")
@login_required
@app_user_info_required
@platform_user_info_required
@restricted_user_info_required
def get_app_config(app_id):
    """Returns all the configurations for the app and all it's app_screens info for the given app_id

    Args:
        app_id ([type]): [description]

    Returns:
        json: {list of all the app configurations}
    """
    try:
        item = App.query.filter_by(id=app_id).first()
        if item is None:
            return json_response({"error": "The app has been deleted or does not exist"}, 404)
        container_mapping_details = item.container_mapping_details()

        apps_under_same_container = App.query.filter_by(parent_container=item.parent_container).all()
        response_env_apps = [{"id": el.id, "environment": el.environment} for el in apps_under_same_container]

        app_screens = AppScreen.query.filter_by(app_id=app_id).order_by(asc(AppScreen.screen_index)).all()
        app_user = g.app_user_info
        app_modules = json.loads(item.modules) if item.modules else {}
        user_mgmt = app_modules.get("user_mgmt")
        story_enabled = app_modules.get("data_story", False)
        story_count = 0
        if story_enabled:
            story_count = len(StoryAppMapping.query.filter_by(app_id=app_id, deleted_by=None).all())

        screens = []
        if user_mgmt and not g.get("platform_user", {}).get("feature_access", {}).get("app_publish", False):
            if app_user:
                for user_role in app_user.user_roles:
                    screens.extend(json.loads(user_role.permissions))
                screens = [screen.replace("app_screen_", "") for screen in screens]
                last_matched_level = None
                filtered_app_screens = []
                current_branch = [None, None, None]
                for screen in app_screens:
                    screen_level = screen.level or 0
                    current_branch[screen_level] = screen
                    if str(screen.id) in screens:
                        current_branch = current_branch[0 : (screen_level + 1)]
                        filtered_app_screens.extend(list(filter(None, current_branch)))
                        current_branch = [None, None, None]
                        last_matched_level = screen_level
                    elif last_matched_level is None:
                        continue
                    elif screen_level > (last_matched_level or 0):
                        filtered_app_screens.append(screen)
                    else:
                        last_matched_level = None
                app_screens = filtered_app_screens
            else:
                app_screens = []

        return json_response(
            {
                "id": item.id,
                "user_id": item.app_creator_id,
                "env_apps": response_env_apps,
                "environment": item.environment,
                "name": item.name,
                "theme_id": item.theme_id,
                "screens": [
                    {
                        "id": row.id,
                        "screen_index": row.screen_index,
                        "screen_name": row.screen_name,
                        "screen_description": row.screen_description,
                        "screen_filters_open": row.screen_filters_open,
                        "screen_auto_refresh": row.screen_auto_refresh,
                        "screen_image": row.screen_image,
                        "level": row.level,
                        "graph_type": row.graph_type,
                        "horizontal": row.horizontal,
                        "graph_width": row.graph_width,
                        "graph_height": row.graph_height,
                        # "no_labels": row.no_labels,
                        # "no_graphs": row.no_graphs,
                        "rating_url": row.rating_url,
                        "widget_count": AppScreenWidget.query.filter_by(screen_id=row.id).count(),
                        "screen_filters_values_present": True
                        if row.screen_filters_value and row.screen_filters_value != "false"
                        else False,
                        "screen_actions_present": True
                        if row.action_settings and row.action_settings != "false"
                        else False,
                        "hidden": row.hidden if row.hidden else False
                        # "screen_filters_values": False,
                        # "screen_filters_values": get_dynamic_filters_helper(row.screen_filters_value,app_filters) if row.screen_filters_value else False,
                        # "action_settings": get_screen_action_settings(row.action_settings) if row.action_settings else False
                        # "action_settings": False
                    }
                    for row in app_screens
                ],
                "modules": app_modules,
                "industry": item.industry_names(),
                "function": item.function_names(),
                "description": item.description,
                "blueprint_link": item.blueprint_link,
                "config_link": item.config_link,
                "approach_url": get_blob(item.approach_blob_name) if item.approach_blob_name else False,
                "logo_url": get_blob(item.logo_blob_name) if item.logo_blob_name else False,
                "small_logo_url": get_blob(item.small_logo_blob_name) if item.small_logo_blob_name else False,
                "logo_blob_name": item.logo_blob_name,
                "small_logo_blob_name": item.small_logo_blob_name,
                "story_count": story_count,
                "restricted_app": (False if app_user else True) if item.restricted_app else False,
                "is_user_admin": (app_user.is_admin if app_user else False) if item.restricted_app else True,
                "permissions": (json.loads(app_user.permissions) if app_user and app_user.permissions else False),
                "is_app_user": True if app_user else False,
                "user_mgmt_access": "user_mgmt" in screens,
                "contact_email": item.contact_email if item.contact_email else False,
                "problem_area": item.problem_area,
                # Note: Sharing single industry/function ids assuming user can have single mapping per app as part of this version
                "industry_id": container_mapping_details[0].industry_id if len(container_mapping_details) else None,
                "function_id": container_mapping_details[0].function_id if len(container_mapping_details) else None,
                "is_connected_systems_app": item.is_connected_systems_app if item.is_connected_systems_app else False,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route("/codex-product-api/app/<int:app_id>/screens", methods=["GET"])
@swag_from("./documentation/app/get_screens.yml")
@login_required
def get_screens(app_id):
    """Generates a list of all the screens and it's info associated with the given app_id

    Args:
        app_id ([type]): [description]

    Returns:
        json: {list of screens and info}
    """
    try:
        app_screens = AppScreen.query.filter_by(app_id=app_id).order_by(asc(AppScreen.screen_index))
        return json_response_count(
            [
                {
                    "id": row.id,
                    "screen_index": row.screen_index,
                    "screen_name": row.screen_name,
                    "screen_description": row.screen_description,
                    "screen_image": row.screen_image,
                    "level": row.level,
                    "graph_type": row.graph_type,
                    "horizontal": row.horizontal,
                    "rating_url": row.rating_url,
                    "graph_width": row.graph_width,
                    "graph_height": row.graph_height,
                    # "screen_filters_values": get_dynamic_filters_helper(row.screen_filters_value) if row.screen_filters_value else False
                }
                for row in app_screens.all()
            ],
            count=app_screens.count(),
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/filters",
    methods=["GET"],
)
@swag_from("./documentation/app/get_filters.yml")
@login_required
def get_filters(app_id, screen_id):
    """Generates a list of all the filters with their values and topics for the given app and screen id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {values,topics}
    """
    try:
        app_filter_values = (
            AppScreenWidgetFilterValue.query.filter_by(app_id=app_id, screen_id=screen_id)
            .order_by(asc(AppScreenWidgetFilterValue.widget_value_id))
            .all()
        )
        response_filter_values = []
        response_filter_topics = {}

        current_value_id = False
        current_values = {}
        for row in app_filter_values:
            if (current_value_id is False) or (row.widget_value_id != current_value_id):
                current_value_id = row.widget_value_id
                if current_values != {} and current_values not in response_filter_values:
                    response_filter_values.append(current_values)
                current_values = {}
            current_values[row.widget_tag_key] = row.widget_tag_value

            if row.widget_tag_key not in response_filter_topics:
                response_filter_topics[row.widget_tag_key] = [row.widget_tag_value]
            elif row.widget_tag_value not in response_filter_topics[row.widget_tag_key]:
                response_filter_topics[row.widget_tag_key].append(row.widget_tag_value)

        if current_values != {}:
            response_filter_values.append(current_values)

        return json_response({"values": response_filter_values, "topics": response_filter_topics})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/dynamic-filters",
    methods=["POST"],
)
@swag_from("./documentation/app/get_dynamic_filters.yml")
@login_required
@app_user_info_required
def get_dynamic_filters(app_id, screen_id):
    """Adds dynamic filters to the given screen using a helper function

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        # GET the code for the screen
        screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()
        screen_filters = screen.screen_filters_value

        new_filters, new_filter_logs, error_lineno = get_dynamic_filters_helper(
            app_id, screen_id, access_token, screen_filters, request_data
        )
        return json_response(new_filters)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/dynamic-actions",
    methods=["POST"],
)
@swag_from("./documentation/app/get_dynamic_actions.yml")
@login_required
@app_user_info_required
def get_dynamic_actions(app_id, screen_id):
    """Adds dynamic actions to the given screen using a helper function

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        # GET the code for the screen
        access_token = request.headers.get("authorization", None)
        screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()
        action_settings = screen.action_settings

        new_actions, new_action_logs, error_lineno = (
            get_screen_action_settings(app_id, screen_id, access_token, action_settings, request_data)
            if action_settings
            else False
        )
        return json_response(sanitize_content(new_actions))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found " + str(error_msg)}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/action_handler",
    methods=["POST"],
)
@swag_from("./documentation/app/screen_action_handler.yml")
@login_required
@app_user_info_required
def screen_action_handler(app_id, screen_id):
    """

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]
    """
    try:
        access_token = request.headers.get("authorization", None)
        request_data = get_clean_postdata(request)
        filter_state = request_data.get("filter_state", None)
        action_param = request_data.get("action_param", None)
        action_type = request_data.get("action_type", None)

        screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()

        (
            action_handler_response,
            action_handler_logs,
            error_lineno,
        ) = execute_screen_action_handler(
            app_id,
            screen_id,
            access_token,
            json.loads(screen.action_settings),
            {
                "current_filter_params": filter_state,
                "action_param": action_param,
                "action_type": action_type,
            },
            base_url=app.config["BACKEND_APP_URI"],
        )
        return json_response(sanitize_content(action_handler_response))

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in executing action handler code"}, 500)


def execute_screen_action_handler(
    app_id,
    screen_id,
    access_token,
    screen_action_settings,
    current_action_params={},
    base_url="",
):
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
            file_prefix = f"screen_action_handler_{app_id}_{screen_id}_{g.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": current_action_params.get("filter_state", None),
                    "action_param": current_action_params.get("action_param", None),
                    "action_type": action_type,
                    "user_info": g.user_info,
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
            return False, "Error executing code: No required attributes", None
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return False, "Error executing code: " + str(error_msg), None


def get_screen_action_settings(app_id, screen_id, access_token, screen_action_settings, current_action_params={}):
    try:
        action_settings = json.loads(screen_action_settings)
        if action_settings is None:
            return False
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
            file_prefix = f"screen_action_generator_{app_id}_{screen_id}_{g.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": filter_state,
                    "user_info": g.user_info,
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
            return False, "Error executing code: No required attributes", None
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return False, "Error executing code: " + str(error_msg), None


def get_dynamic_filters_helper(app_id, screen_id, access_token, screen_filter_value, current_filter_params={}):
    """Helper function to add dynamic filters for the given screen

    Args:
        screen_filter_value ([type]): [description]
        current_filter_params (dict, optional): [description]. Defaults to {}.

    Raises:
        error_msg: [description]

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
            file_prefix = f"filter_{app_id}_{screen_id}_{g.logged_in_email}_"
            code_string_response = execute_code_string(
                app_id=app_id,
                code_string=code,
                injected_vars={
                    "current_filter_params": current_filter_params,
                    "user_info": g.user_info,
                },
                access_token=access_token,
                file_prefix=file_prefix,
            )
            return (
                json.loads(code_string_response["code_string_output"]["code_outputs"]),
                code_string_response["logs"],
                code_string_response.get("lineno", None),
            )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return False, "Error executing code: " + str(error_msg), None


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/widgets",
    methods=["GET"],
)
@swag_from("./documentation/app/get_widgets.yml")
@login_required
def get_widgets(app_id, screen_id):
    """Generates a list of all the widgets and it's info associated to given app and screen id

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: {id,widget_index,widget_key,is_label,config}
    """
    try:
        app_screen_widgets = AppScreenWidget.query.filter_by(app_id=app_id, screen_id=screen_id).order_by(
            asc(AppScreenWidget.widget_index)
        )

        response = [
            {
                "id": row.id,
                "widget_index": row.widget_index,
                "widget_key": row.widget_key,
                "is_label": row.is_label,
                "config": (json.loads(row.config) if row.config else False),
            }
            for row in app_screen_widgets.all()
        ]

        # for widget_index in range(len(response)):
        #     widget_val = AppScreenWidgetValue.query\
        #         .filter_by(app_id=app_id, screen_id=screen_id, widget_id=response[widget_index].get("id"))\
        #         .order_by(desc(AppScreenWidgetValue.id))\
        #         .first()
        #     if widget_val and widget_val.widget_value:
        #         widget_val = json.loads(widget_val.widget_value)
        #         if widget_val.get("is_dynamic"):
        #             response[widget_index]["config"]["code"] = widget_val.get(
        #                 "code")

        return json_response_count(response, count=app_screen_widgets.count())
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/multi-widget",
    methods=["PUT"],
)
@swag_from("./documentation/app/get_multi_widget.yml")
@login_required
@app_user_info_required
def get_multi_widget(app_id, screen_id):
    """Fetches the app screen widget details for given app and screen ID

    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Raises:
        CustomException: [description]

    Returns:
        json: {widget_value_id, value, simulated_value}
    """
    try:
        request_data = get_clean_postdata(request)
        logging.info(
            f"Multi-Widget API: appId: {app_id}, widget_id: {request_data['widget']['id']}, user: {g.logged_in_email}"
        )
        access_token = request.headers.get("authorization", None)
        _app = App.query.filter_by(id=app_id).first()
        app_modules = json.loads(_app.modules)

        widget_value = AppScreenWidgetValue.query.filter_by(
            app_id=app_id,
            screen_id=screen_id,
            widget_id=request_data["widget"]["id"],
            deleted_at=None,
        ).join(AppScreenWidget)
        widget_value = widget_value.filter(AppScreenWidget.widget_key == request_data["widget"]["widget_key"])
        widget_value = widget_value.first()

        widget_value_id = None
        if widget_value:
            widget_value_id = widget_value.id
            widget_simulated_value = widget_value.widget_simulated_value
            widget_value = widget_value.widget_value
            # If code fragrment get dynamic data
            try:
                widget_json = json.loads(widget_value)
                if widget_json.get("is_dynamic", False) and widget_json["code"] and widget_json["code"] != "":
                    widget_value, logs, error_lineno = get_dynamic_widgets(
                        app_id,
                        request_data["widget"]["id"],
                        access_token,
                        request_data["filters"],
                        widget_json["code"],
                        request_data.get("data_state_key", None),
                        widget_event=request_data.get("widget_event", None),
                    )
            except Exception as error_msg:
                ExceptionLogger(error_msg)
                return json_response({"error": "Error in Parsing UIaC, Review and Correct UIaC"}, 400)
        else:
            widget_value = False
            widget_simulated_value = False

        try:
            widget_value = json.loads(widget_value) if widget_value else widget_value
            widget_simulated_value = (
                json.loads(widget_simulated_value) if widget_simulated_value else widget_simulated_value
            )
        except Exception as error_msg:
            ExceptionLogger(error_msg)

        if app_modules.get("alerts", False) and widget_value and widget_value.get("alert_config", False):
            notification_data(app_id, request_data["widget"]["id"], widget_value)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        logging.info(
            f"Error occuerd, Multi-Widget API: appId: {app_id}, widget_id: {request_data['widget']['id']}, user: {g.logged_in_email}, Error: {error_msg}"
        )
        return json_response({"error": "Failed to Process Widget Data, check UIAC or widget value"}, 400)
    return json_response(
        {
            "data": {
                "widget_value_id": widget_value_id,
                "value": widget_value,
                "simulated_value": widget_simulated_value,
            }
        }
    )


@bp.route("/codex-product-api/update-data/<string:access_token>", methods=["PUT"])
def update_widget_data(access_token):
    try:
        widget_value = AppScreenWidgetValue.query.filter_by(access_token=access_token).first()
        if not widget_value:
            # ExceptionLogger(error_msg)
            return json_response({"error": "access token not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "access token not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
        if widget_value and widget_value.id == request_data["widget_value_id"]:
            emit_notification(
                request_data["data"],
                request_data["user_email"],
                "digital_twin_widget_id_" + str(request_data["widget_value_id"]),
            )
        else:
            # ExceptionLogger(error_msg)
            return json_response({"error": generic_err_message}, 500)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)

    return json_response({"success": True})


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/widget",
    methods=["PUT"],
)
@swag_from("./documentation/app/update_widget.yml")
@login_required
@app_user_info_required
def get_widget(app_id, screen_id):
    """Fetches the app screen widget details for given app and screen ID

    Args:
        app_id (int): Application ID
        screen_id (int): Screen ID

    Raises:
        CustomException: Rudimentary Data, i.e. direct values string/int
        CustomException: No UIaC. Fallback to Iteration fetch Mode.

    Returns:
        json: {widget_value_id, value, simulated_value}
    """
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        _app = App.query.filter_by(id=app_id).first()
        app_modules = json.loads(_app.modules)

        widget_value = AppScreenWidgetValue.query.filter_by(app_id=app_id, screen_id=screen_id).join(AppScreenWidget)

        filter_aliases = []

        for filter_key in request_data["filters"]:
            filter_value_alias = db.aliased(AppScreenWidgetFilterValue)
            widget_value.join(filter_value_alias)
            filter_aliases.append(filter_value_alias)

        widget_value = widget_value.filter(AppScreenWidget.widget_key == request_data["widget"]["widget_key"])

        index = 0
        for filter_key in request_data["filters"]:
            try:
                if (
                    not isinstance(request_data["filters"][filter_key], int)
                    and "checked" in request_data["filters"][filter_key]
                    and request_data["filters"][filter_key]["checked"] != ""
                ):
                    widget_value = widget_value.filter(filter_aliases[index].widget_value_id == AppScreenWidgetValue.id)
                    widget_value = widget_value.filter(filter_aliases[index].widget_tag_key == filter_key)
                    widget_value = widget_value.filter(
                        filter_aliases[index].widget_tag_value == request_data["filters"][filter_key]["checked"]
                    )
            except Exception:
                pass
            index = index + 1

        widget_value = widget_value.first()

        widget_value_id = None
        if widget_value:
            widget_value_id = widget_value.id
            widget_simulated_value = widget_value.widget_simulated_value
            widget_value = widget_value.widget_value
            # If code fragrment get dynamic data
            try:
                widget_json = ""
                try:  # for handling number or just string KPIs like 'xx M' or 'xx.y /xx.y'
                    widget_json = json.loads(widget_value)
                except Exception:
                    widget_json = widget_value
                if type(widget_json) is not dict:
                    raise CustomException("Just KPI number, or rudimentay data", 422)
                if widget_json.get("is_dynamic", False):
                    widget_value, logs, error_lineno = get_dynamic_widgets(
                        app_id,
                        request_data["widget"]["id"],
                        access_token,
                        request_data["filters"],
                        widget_json["code"],
                        request_data.get("data_state_key", None),
                        widget_event=request_data.get("widget_event", None),
                    )
                else:
                    raise CustomException("No Dynamic Data. Falling back to normal mode!")
            except CustomException:
                pass
        else:
            widget_value = False

        widget_id = AppScreenWidgetValue.query.filter(AppScreenWidgetValue.id == widget_value_id).first().widget_id
        try:
            try:
                widget_value = json.loads(widget_value)
            except CustomException:
                widget_value = widget_value
            widget_simulated_value = json.loads(widget_simulated_value) if widget_simulated_value else False
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            widget_simulated_value = False
        if app_modules.get("alerts", False) and widget_value.get("alert_config", False):
            notification_data(app_id, widget_id, widget_value)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error getting widget"}, 500)

    return json_response(
        {
            "data": {
                "widget_value_id": widget_value_id,
                "value": widget_value,
                "simulated_value": widget_simulated_value,
            }
        }
    )


def get_dynamic_widgets(
    app_id,
    widget_id,
    access_token,
    filters,
    widget_code,
    data_state_key,
    widget_event=None,
):
    """Helper function to fetch the dynamic widgets using filers, code and state key

    Args:
        filters (dictionary): [dictionary which gives the information of the selected filters]
        widget_code (string): [code string saved for the widget]
        data_state_key (string): [the data state information which will determine outputs of the code string]
         widget_event (dictionary) :[dictionary which gives information about an event that was triggerd in source widget]
    Returns:
        code_output: [the json in co.dx format which will be used in the UI to render the corresponding component]
        logs : code logs if any
    """
    inputs = {}
    selected_filters = filters
    code = (
        widget_code
        + """
code_outputs = dynamic_outputs
"""
    )
    file_prefix = f"widget_code_{app_id}_{widget_id}_{g.logged_in_email}_"
    code_string_response = execute_code_string(
        app_id=app_id,
        code_string=code,
        injected_vars={
            "simulator_inputs": inputs,
            "selected_filters": selected_filters,
            "user_info": g.user_info,
            "data_state_key": data_state_key,
            "crossfilter_event": widget_event,
        },
        access_token=access_token,
        file_prefix=file_prefix,
    )
    return (
        code_string_response["code_string_output"]["code_outputs"],
        code_string_response["logs"],
        code_string_response.get("lineno", None),
    )


@bp.route("/codex-product-api/app/<int:app_id>/execute-code", methods=["PUT"])
@swag_from("./documentation/app/get_simulator_output.yml")
@login_required
@app_user_info_required
def get_simulator_output(app_id):
    """Returns the simulator ouputs for the given inputs, selected filters and code

    Args:
        app_id ([type]): [description]

    Returns:
        json: {data}
    """
    try:
        post_data = get_clean_postdata(request)
        # execution_filename = "execution_code_" + str(time.time()) + ".py"
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing code"}, 500)

    try:
        access_token = request.headers.get("authorization", None)
        inputs = post_data["inputs"]
        selected_filters = post_data["selected_filters"]
        code = (
            post_data["code"]
            + """
code_outputs = json.loads(json.dumps(simulator_outputs,cls=plotly.utils.PlotlyJSONEncoder))
"""
        )
        file_prefix = f"execute_code_{app_id}_{g.logged_in_email}_"
        code_string_response = execute_code_string(
            app_id=app_id,
            code_string=code,
            injected_vars={
                "simulator_inputs": inputs,
                "selected_filters": selected_filters,
                "user_info": g.user_info,
            },
            access_token=access_token,
            file_prefix=file_prefix,
        )

        return json_response({"data": sanitize_content(code_string_response["code_string_output"]["code_outputs"])})
    except Exception as error_msg:
        ExceptionLogger(error_msg, log_exception=False)
        # os.remove(execution_filename)
        return json_response({"error": "Error executing code"}, 500)


@bp.route("/codex-product-api/app/<int:app_id>", methods=["PUT"])
@swag_from("./documentation/app/update_app_details.yml")
@login_required
def update_app_details(app_id):
    """Updates the app details for the given app id

    Args:
        app_id ([type]): [description]

    Returns:
        json: ({"message": "App details updated successfully"}, 200)
    """
    try:
        inputs = request.get_json()
        industry_id = inputs.get("industry_id")
        function_id = inputs.get("function_id")

        # fetching data from db
        app_details = App.query.filter_by(id=app_id).first()

        app_details.name = inputs.get("name", None) if inputs.get("name") else None
        app_details.description = inputs.get("description", None) if inputs.get("description") else None
        app_details.blueprint_link = inputs.get("blueprint_link", None) if inputs.get("blueprint_link") else None
        app_details.orderby = inputs.get("orderby", None) if inputs.get("orderby") else 0
        app_details.config_link = inputs.get("config_link", None) if inputs.get("config_link") else None
        app_details.small_logo_blob_name = inputs.get("small_logo_url", None) if inputs.get("small_logo_url") else None
        app_details.logo_blob_name = inputs.get("logo_url", None) if inputs.get("logo_url") else None
        app_details.updated_at = func.now()
        modules = json.loads(app_details.modules or "{}")
        modules["nac_collaboration"] = (
            inputs.get("nac_collaboration", False) if inputs.get("nac_collaboration") else False
        )
        app_details.modules = json.dumps(modules)
        app_details.is_connected_systems_app = inputs.get("is_connected_systems_app", False)
        db.session.commit()

        # method called to update app mapping
        add_container_mapping(industry_id, function_id, app_details.container_id)

        return json_response({"message": "App details updated successfully"}, 200)

    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"error": "Error while editing app data"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/execute-dynamic-action",
    methods=["POST"],
)
@swag_from("./documentation/app/get_dynamic_action_response.yml")
@login_required
@app_user_info_required
def get_dynamic_action_response(app_id, screen_id):
    code = ""
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        widget_data = AppScreenWidgetValue.query.filter_by(
            app_id=app_id, screen_id=screen_id, id=request_data["widget_value_id"]
        ).first()

        code = json.loads(widget_data.widget_value)
        code = code.get("code", None)
        if not code:
            raise CustomException("Code does not exist", 422)

        code = (
            code
            + """
code_outputs = dynamic_outputs
"""
        )
        file_prefix = f"widget_action_{app_id}_{widget_data.widget_id}_{g.logged_in_email}_"
        code_string_response = execute_code_string(
            app_id=app_id,
            code_string=code,
            injected_vars={
                "action_type": request_data.get("action_type", None),
                "screen_data": request_data.get("data", None),
                "filter_data": request_data.get("filters", None),
                "selected_filters": request_data.get("filters", None),
                "form_data": request_data.get("formData", None),
                "user_info": g.user_info,
                "__baseurl__": app.config["BACKEND_APP_URI"],
                "source_app_id": request.view_args.get("app_id", None),
            },
            access_token=access_token,
            file_prefix=file_prefix,
        )

        return json_response(sanitize_content(json.loads(code_string_response["code_string_output"]["code_outputs"])))
    except Exception as ex:
        ExceptionLogger(ex, log_exception=False)
        return json_response({"error": "Error executing code"}, 500)


def get_kpis(app_id, access_token, limit=5):
    value_list = []
    try:
        widget_value = (
            db.session.query(
                AppScreenWidgetValue.widget_value,
                AppScreenWidget.widget_key,
                AppScreenWidget.config,
                AppScreen.screen_filters_value,
                AppScreen.id,
                AppScreenWidget.id,
            )
            .filter(
                and_(
                    AppScreenWidgetValue.app_id == app_id,
                    AppScreenWidgetValue.deleted_at.is_(None),
                    AppScreenWidget.deleted_at.is_(None),
                    AppScreen.deleted_at.is_(None),
                )
            )
            .join(AppScreen, AppScreenWidgetValue.screen_id == AppScreen.id)
            .join(AppScreenWidget, AppScreenWidget.id == AppScreenWidgetValue.widget_id)
            .filter(AppScreenWidget.is_label.is_(True))
            .distinct()
            .limit(limit)
            .all()
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return value_list

    for el in widget_value:
        try:
            data = json.loads(el[0])
            widget_config = json.loads(el[2]) if el[2] else None
            if data.get("is_dynamic", False):
                try:
                    (
                        selected_filters,
                        selected_filter_logs,
                        error_lineno,
                    ) = get_dynamic_filters_helper(app_id, el[4], access_token, el[3])
                    code = data.get("code", False)
                    code = (
                        code
                        + """
code_outputs = dynamic_outputs
            """
                    )
                    file_prefix = f"widget_code_{app_id}_{el[5]}_{g.logged_in_email}_"
                    code_string_response = execute_code_string(
                        app_id=app_id,
                        code_string=code,
                        injected_vars={
                            "simulator_inputs": {},
                            "selected_filters": selected_filters
                            if isinstance(selected_filters, bool)
                            else selected_filters.get("defaultValues", None),
                            "user_info": g.user_info,
                        },
                        access_token=access_token,
                        file_prefix=file_prefix,
                    )
                    data = json.loads(code_string_response["code_string_output"]["code_outputs"])
                except Exception as error_msg:
                    ExceptionLogger(error_msg, log_exception=False)
                    data = None
            value_list.append({"name": el[1], "data": data, "config": widget_config})
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=False)
            value_list.append({"name": el[1], "data": el[0], "config": widget_config})
    return value_list


@bp.route("/codex-product-api/app/<int:app_id>/kpis", methods=["GET"])
@swag_from("./documentation/app/get_app_kpi_list.yml")
@login_required
@app_user_info_required
def get_app_kpi_list(app_id):
    try:
        access_token = request.headers.get("authorization", None)
        limit = request.args.get("limit", 5)
        response = get_kpis(app_id, access_token, limit)
        return json_response(sanitize_content(response))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "error while fetching " + str(error_msg)}, 500)


def execute_code_string(
    app_id,
    code_string,
    injected_vars,
    access_token,
    exclude_app_functions=False,
    app_functions=[],
    file_prefix="code_string_exec_",
):
    """
    This method decides how to execute the UiaC -
     - If exec env configured
        * if app id mapped to app exec env, call execution service
        * if mapping not present - execute on same service (dont call exec service)
    - If exec env not configured - execute on same service (dont call exec service)
    TODO: Add default exec env if exec env URL is configured
    """
    try:
        # get app vars to be injected into the UIaC
        app_info = db.session.query(App).filter_by(id=app_id).first()
        fernet = Fernet(app.config["CRYPTO_ENCRYPTION_KEY"])
        app_variables = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )

        if exclude_app_functions:
            app_functions = []
        elif not app_functions:
            if app_info.function_defns:
                app_functions = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            else:
                app_functions = []

        #     for func in app_functions:
        #             code_string = func['value'] + "\n\n" + code_string

        injected_vars["_codx_app_vars_"] = app_variables
        # execute based on dynamic env config
        if app.config.get("DYNAMIC_EXEC_ENV_URL") is not None:
            app_exec_env = db.session.query(AppDynamicVizExecutionEnvironment).filter_by(app_id=app_id).first()
            if app_exec_env is not None and app_exec_env.dynamic_env_id is not None:
                exec_env = (
                    db.session.query(DynamicVizExecutionEnvironment).filter_by(id=app_exec_env.dynamic_env_id).first()
                )
                return execute_code_string_exec_env(
                    exec_env.id,
                    exec_env.py_version,
                    injected_vars,
                    code_string,
                    access_token,
                    app_functions,
                )
            else:
                return execute_code_string_server(
                    code_string,
                    injected_vars,
                    app_functions=app_functions,
                    file_prefix=file_prefix,
                )
        else:
            return execute_code_string_server(
                code_string,
                injected_vars,
                app_functions=app_functions,
                file_prefix=file_prefix,
            )
    except Exception as error_msg:
        ExceptionLogger(error_msg, log_exception=False)
        return {"code_string_output": None, "status": "error"}


def execute_code_string_server(code_string, injected_vars, app_functions=[], file_prefix="code_string_exec_"):
    """
    Function that executes a code string locally(same server) using the runpy module
    """
    try:
        # write code string as file to disk
        file_name = (file_prefix + str(time.time())).replace(".", "_").replace("@", "_")
        execution_filename = file_name + ".py"

        code_string = (
            f"""
def import_app_func(key):
    import imp
    return imp.load_source("module_name", "app_func_{file_name}/"  + key.replace("/", "_") + ".py")

"""
            + code_string
        )

        with open(execution_filename, "w") as code_file:
            code_file.write(code_string)
        # execute code string using runpy
        # capture output
        for app_func in app_functions:
            app_func_file_name = "app_func_" + file_name + "/" + app_func["key"].replace("/", "_") + ".py"
            os.makedirs(os.path.dirname(app_func_file_name), exist_ok=True)
            with open(app_func_file_name, "w") as code_file:
                app_fuc_code = (
                    f"""
def import_app_func(key):
    import imp
    return imp.load_source("module_name", "app_func_{file_name}/"  + key.replace("/", "_") + ".py")

_codx_app_vars_={injected_vars['_codx_app_vars_']}

"""
                    + app_func["value"]
                )
                code_file.write(app_fuc_code)

        injected_vars["func_apps_path"] = "app_func_" + file_name + "/"
        old_std_out = sys.stdout
        capture_io = io.StringIO()
        sys.stdout = capture_io
        # TODO: BEFORE MAKING RUNPY NEED TO MAKE SURE THERE ARE NO MALICIOUS CODE
        logging.info(f"Before running UIAC:  API: fileprefix: {file_prefix}")
        code_outputs = runpy.run_path(execution_filename, init_globals=injected_vars)
        # close output
        stdout = capture_io.getvalue()
        sys.stdout = old_std_out
        capture_io.close()
        response = {
            "code_string_output": code_outputs,
            "logs": stdout,
            "status": "success",
        }
        return response
    except Exception as error_msg:
        ExceptionLogger(error_msg, log_exception=False)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        trace = next(
            (trace for trace in traceback.extract_tb(exc_tb) if trace.filename == execution_filename),
            None,
        )
        lineno = (trace.lineno - 5) if trace else (error_msg.lineno - 5) if hasattr(error_msg, "lineno") else None
        response = {
            "code_string_output": {"code_outputs": "{}"},
            "logs": f"line no: {lineno}\n" + str(error_msg) if lineno else str(error_msg),
            "lineno": lineno,
            "status": "error",
        }
        return response
    finally:
        if "capture_io" in vars() or "capture_io" in globals():
            capture_io.close()
        os.remove(execution_filename)
        # os.rmdir("app_func_" + file_postfix+"/")
        shutil.rmtree("app_func_" + file_name + "/", ignore_errors=True)


def execute_code_string_exec_env(
    exec_env_id,
    exec_env_version,
    injected_vars,
    code_string,
    access_token,
    app_functions,
):
    """
    Function that executes a code string on remote execution environment
    """
    try:
        exec_env_obj = ExecutionEnvDynamicViz()
        exec_env_response = exec_env_obj.run_interface_api(
            params={
                "env_id": exec_env_id,
                "py_version": exec_env_version,
                "params": injected_vars,
                "code_string": code_string,
                "app_functions": app_functions,
            },
            endpoint="execute",
            access_token=access_token,
        )
        exec_env_response_data = json.loads(gzip.decompress(exec_env_response.content).decode("utf-8"))
        exec_env_response_data["code_string_output"] = {"code_outputs": exec_env_response_data["code_string_output"]}
        return exec_env_response_data
    except Exception as error_msg:
        ExceptionLogger(error_msg, log_exception=False)
        response = {
            "code_string_output": {"code_outputs": "{}"},
            "logs": str(error_msg),
            "status": "error",
        }
        return response


@bp.route(
    "/codex-product-api/app/<int:app_id>/screen/<int:screen_id>/filter/uiac",
    methods=["GET"],
)
@swag_from("./documentation/app/get_screen_filters.yml")
@login_required
@app_user_info_required
def get_screen_filters(app_id, screen_id):
    """Fetch the filter code string associated with the screen for the app
    securely.

    Args:
        app_id (int): application id
        screen_id (int): screen id

    Returns:
        json: {list of screens and info}
    """
    try:
        app_screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()

        response = {"code": False}
        if app_screen and app_screen.screen_filters_value:
            screen_filters = json.loads(app_screen.screen_filters_value)
            # TODO: THIS CASUSES ERROR WHEN screen_filters is boolean.
            # SHOULD BE CORRECTED
            if screen_filters and screen_filters.get("is_dynamic", False):
                response["code"] = screen_filters.get("code")

        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screen/<int:screen_id>/action/uiac",
    methods=["GET"],
)
@swag_from("./documentation/app/get_screen_actions.yml")
@login_required
@app_user_info_required
def get_screen_actions(app_id, screen_id):
    """Fetch the filter code string associated with the screen for the app
    securely.

    Args:
        app_id (int): application id
        screen_id (int): screen id

    Returns:
        json: {list of screens and info}
    """
    try:
        app_screen = AppScreen.query.filter_by(app_id=app_id, id=screen_id).first()

        response = {}
        if app_screen and app_screen.action_settings:
            response = json.loads(app_screen.action_settings)

        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/app/<int:app_id>/screen/<int:screen_id>/widget/<int:widget_id>/uiac",
    methods=["GET"],
)
@swag_from("./documentation/app/get_screen_widget_code.yml")
@login_required
@app_user_info_required
def get_screen_widget_code(app_id, screen_id, widget_id):
    """Fetch the filter code string associated with the screen for the app
    securely.
    https://itnext.io/sharing-aes-256-encrypted-data-between-node-js-and-python-3-d0c87eae212b
    Args:
        app_id (int): application id
        screen_id (int): screen id

    Returns:
        json: {list of screens and info}
    """
    try:
        widget_val = AppScreenWidgetValue.query.filter_by(
            app_id=app_id, screen_id=screen_id, widget_id=widget_id
        ).first()

        response = {}
        if widget_val and widget_val.widget_value:
            widget_val = json.loads(widget_val.widget_value)
            if widget_val.get("is_dynamic"):
                response["code"] = widget_val.get("code")

        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


def encrypt_uiac():
    """This function will be used to share the UIaC securely to the frontend.
        If the UI does not have the secret to decrypt the code then no one can read the code.

    Args:
        code (string): contains the code which will encrypted

    Returns:
        string: encrypted code
    """
    raise NotImplementedError


@bp.route("/codex-product-api/app/replicate", methods=["POST"])
@swag_from("./documentation/app/replicate_app.yml")
@login_required
@nac_role_info_required
def replicate_app():
    try:
        # TODO: Add the target env.

        request_data = get_clean_postdata(request)
        """
        Expected request_data structure:
        source_app_id: integer
        destination_app_id :  integer/None, should be the same as app_id parameter
        destination_app_env : string, optional
        """

        source_app_id = request_data.get("source_app_id")
        source_app = App.query.filter_by(id=source_app_id).first()  # app to be replicated

        app_screens_to_be_replicated = AppScreen.query.filter_by(app_id=source_app_id).all()
        app_screen_widgets_to_be_replicated = AppScreenWidget.query.filter_by(app_id=source_app_id).all()
        app_screen_widget_value_to_be_replicated = AppScreenWidgetValue.query.filter_by(app_id=source_app_id).all()
        try:
            for app_widget_values in app_screen_widget_value_to_be_replicated:
                __widget_value__ = (
                    json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
                )
                if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                    raise CustomException(
                        "Application has been created using Iterations, Hence it cant be replicated; Please Create a Fresh Version",
                        422,
                    )
        except CustomException as cex:
            return json_response({"error": str(cex)}, cex.code)

        # For App to be replicated from scracth.
        # The app does not yet exists. so it has to be created.
        # The condition is that, destination_app_id ia None, but destination_app_env will have the value
        destination_app = None
        destination_app_id = request_data.get("destination_app_id")

        if destination_app_id:
            delete_at_time = func.now()
            destination_app = App.query.filter_by(id=destination_app_id).first()

            db.session.query(AppScreen).filter(
                and_(
                    AppScreen.app_id == destination_app_id,
                    AppScreen.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})

            db.session.query(AppScreenWidget).filter(
                and_(
                    AppScreenWidget.app_id == destination_app_id,
                    AppScreenWidget.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})

            db.session.query(AppScreenWidgetValue).filter(
                and_(
                    AppScreenWidgetValue.app_id == destination_app_id,
                    AppScreenWidgetValue.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})
            db.session.commit()
        else:
            destination_app = App(
                name=source_app.name,
                theme_id=source_app.theme_id,
                contact_email=source_app.contact_email,
                modules=source_app.modules,
                app_creator_id=request_data["user_id"],
            )
            db.session.add(destination_app)

        # overview being copied over from source to destination
        destination_app.app_creator_id = request_data["user_id"]
        destination_app.approach_blob_name = source_app.approach_blob_name
        destination_app.blueprint_link = source_app.blueprint_link
        destination_app.config_link = source_app.config_link
        destination_app.description = source_app.description
        destination_app.logo_blob_name = source_app.logo_blob_name
        destination_app.orderby = source_app.orderby
        destination_app.small_logo_blob_name = source_app.small_logo_blob_name
        destination_app.theme_id = source_app.theme_id
        destination_app.function_defns = source_app.function_defns
        db.session.flush()

        # check if app variables need to be copied
        if request_data.get("copy_app_vars_flag"):
            copy_app_vars_flag = request_data.get("copy_app_vars_flag")
            if copy_app_vars_flag is True:
                destination_app.variables = source_app.variables

        if request_data.get("destination_app_env"):
            destination_app.environment = request_data.get("destination_app_env")

        destination_app.source_app_id = source_app.id
        destination_app.container_id = source_app.container_id
        db.session.commit()
        # For Its Screens
        screen_id_mapping = {}
        for screen_entity in app_screens_to_be_replicated:
            new_screen_entity = AppScreen(
                app_id=destination_app.id,
                screen_index=screen_entity.screen_index,
                screen_name=screen_entity.screen_name,
                screen_description=screen_entity.screen_description,
                screen_filters_open=screen_entity.screen_filters_open,
                screen_auto_refresh=screen_entity.screen_auto_refresh,
                screen_image=screen_entity.screen_image,
                level=screen_entity.level,
                horizontal=screen_entity.horizontal,
                graph_type=screen_entity.graph_type,
                screen_filters_value=screen_entity.screen_filters_value,
                action_settings=screen_entity.action_settings,
                hidden=screen_entity.hidden,
                user_guide=screen_entity.user_guide,
                graph_width=screen_entity.graph_width,
                graph_height=screen_entity.graph_height,
            )

            db.session.add(new_screen_entity)
            db.session.flush()
            screen_id_mapping[screen_entity.id] = new_screen_entity.id

        widget_id_mapping = {}
        for widget_entity in app_screen_widgets_to_be_replicated:
            if screen_id_mapping.get(widget_entity.screen_id):
                new_widget_entity = AppScreenWidget(
                    app_id=destination_app.id,
                    screen_id=screen_id_mapping[widget_entity.screen_id],
                    widget_index=widget_entity.widget_index,
                    widget_key=widget_entity.widget_key,
                    is_label=widget_entity.is_label,
                    config=widget_entity.config,
                )

                db.session.add(new_widget_entity)
                db.session.flush()
                widget_id_mapping[widget_entity.id] = new_widget_entity.id

        widget_value_id_mapping = {}
        for widget_value_entity in app_screen_widget_value_to_be_replicated:
            if screen_id_mapping.get(widget_value_entity.screen_id) and widget_id_mapping.get(
                widget_value_entity.widget_id
            ):
                new_widget_value_entity = AppScreenWidgetValue(
                    app_id=destination_app.id,
                    screen_id=screen_id_mapping[widget_value_entity.screen_id],
                    widget_id=widget_id_mapping[widget_value_entity.widget_id],
                    widget_value=widget_value_entity.widget_value,
                    widget_simulated_value=None,
                )

                db.session.add(new_widget_value_entity)
                db.session.flush()
                widget_value_id_mapping[widget_value_entity.id] = widget_value_entity.id

        db.session.flush()
        db.session.commit()
        response = {"new_app_id": destination_app.id}
        return json_response(response)
    except Exception as ex:
        db.session.rollback()
        ExceptionLogger(ex)
        return json_response({"error": "Could Not Create the Replica. Please Try Again."}, 500)


@bp.route("/codex-product-api/app/<int:app_id>/reset", methods=["POST"])
@swag_from("./documentation/app/reset_app.yml")
@login_required
@platform_user_info_required
@nac_role_info_required
def reset_app(app_id):
    try:
        app_to_be_reset = App.query.filter_by(id=app_id).first()
        app_screens_to_be_reset = AppScreen.query.filter_by(app_id=app_id).all()
        app_screen_widgets_to_be_reset = AppScreenWidget.query.filter_by(app_id=app_id).all()
        app_screen_widget_value_to_be_reset = AppScreenWidgetValue.query.filter_by(app_id=app_id).all()
        app_screen_widget_filter_values_to_be_reset = AppScreenWidgetFilterValue.query.filter_by(app_id=app_id).all()

        # TODO: App User Roles reset.

        deleted_at_time = func.now()
        app_to_be_reset.modules = "{}"
        app_to_be_reset.variables = None
        app_to_be_reset.updated_at = deleted_at_time
        app_to_be_reset.blueprint_link = None
        app_to_be_reset.function_defns = None

        for screen in app_screens_to_be_reset:
            screen.deleted_at = deleted_at_time

        for widget in app_screen_widgets_to_be_reset:
            widget.deleted_at = deleted_at_time

        for widget_value in app_screen_widget_value_to_be_reset:
            widget_value.deleted_at = deleted_at_time

        for widget_filter_value in app_screen_widget_filter_values_to_be_reset:
            widget_filter_value.deleted_at = deleted_at_time

        db.session.commit()
        return json_response({"status": "success"})
    except Exception as ex:
        db.session.rollback()
        ExceptionLogger(ex)
        return json_response({"error": "Could Not Reset the App. Please Try Again."}, 500)


@bp.route("/codex-product-api/app/create_containers", methods=["GET"])
@swag_from("./documentation/app/migrate_containers.yml")
@login_required
def migrate_containers():
    """Creates all containers

    Returns:
        json: {list of containers and their apps}
    """
    try:
        _preview_apps_ = App.query.filter(App.environment == "preview").all()
        mapping_created = {}

        for __app__ in _preview_apps_:
            if __app__.container_id is None:
                # This app does not have a prod version neither has a container, so we create its container
                __app__container__ = AppContainer(
                    order=__app__.orderby,
                    prob_area=__app__.problem_area,
                    problem=__app__.problem,
                    blueprint_link=__app__.blueprint_link,
                )
                db.session.add(__app__container__)
                db.session.flush()
                __app__.container_id = __app__container__.id
                update_app_mapping(__app__.container_mapping_details(), __app__container__.id)
                db.session.commit()
                mapping_created[__app__.id] = __app__container__.id

        _prod_apps_ = App.query.filter(App.environment == "prod", App.container_id is None).all()
        for __app__ in _prod_apps_:
            # This app does not have a preview version neither has a container, so we create its container
            # why? because previous For loop takes care of adding containers for preview-prod grouped apps.
            __app__container__ = AppContainer(
                order=__app__.orderby,
                prob_area=__app__.problem_area,
                problem=__app__.problem,
                blueprint_link=__app__.blueprint_link,
            )
            db.session.add(__app__container__)
            db.session.flush()
            __app__.container_id = __app__container__.id
            update_app_mapping(__app__.container_mapping_details(), __app__container__.id)
            db.session.commit()
            mapping_created[__app__.id] = __app__container__.id

        # FOR THE INDUSTRY FUNCTION MAPPING:
        # app_mappings = ContainerMapping.query.all()
        # for mapping in app_mappings:
        #     if not mapping.container_id and mapping.app_id in mapping_created:
        #         mapping.container_id = mapping_created.get(mapping.app_id)
        # db.session.commit()

        return json_response({"success": "done", "mapping": mapping_created})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


def update_app_mapping(mappings, container_id):
    try:
        for mapping in mappings:
            # if delete:
            #     print("Deleted", mapping.id)
            #     deleted_mappings.append(mapping.id)
            #     db.session.delete(mapping)
            # else:
            mapping.container_id = container_id
        db.session.commit()
    except Exception as ex:
        ExceptionLogger(ex)


@bp.route("/codex-product-api/app/clone", methods=["POST"])
@swag_from("./documentation/app/clone.yml")
@login_required
@nac_role_info_required
def clone_app():
    request_data = get_clean_postdata(request)
    return handle_clone_app(request_data)


@bp.route("/codex-product-api/app/import", methods=["POST"])
# @swag_from("./documentation/app/import.yml")
@login_required
def import_app():
    app_data = json.loads((request.form["app_data"]))
    fernet = Fernet(app.config["CRYPTO_ENCRYPTION_KEY"])
    source_file_data = request.files["source_file"].read()
    try:
        srouce_app_data = json.loads(fernet.decrypt(source_file_data).decode())
    except Exception:
        return json_response({"error": "Failed to process file!"}, 422)
    app_data["source_app_data"] = srouce_app_data
    return handle_clone_app(app_data)


def handle_clone_app(request_data):
    try:
        """
        Expected request_data structure:
        source_app_id: integer
        export: boolean, tells if a user wants to download the App.
        """
        # CODX_APP_VERSION = app.config["API_VERSION"]
        if "source_app_data" in request_data:
            source_app_data = request_data.get("source_app_data")
            # commenting out for temporary purpose
            # if source_app_data["version"] != CODX_APP_VERSION:
            #     raise CustomException(
            #         "The imported application's version is not same as the current codx applicaiton version",
            #         409,
            #     )
            app_info = source_app_data.get("app_info")
            source_app = App(
                name=app_info["name"],
                contact_email=app_info["contact_email"],
                modules=None,
                app_creator_id=request_data["user_id"],
                is_connected_systems_app=request_data.get("is_connected_systems_app", False),
            )
            source_app.id = app_info["id"]
            source_app.function_defns = app_info["function_defns"]
            screens = source_app_data.get("screens")
            app_screens_to_be_replicated = []
            for screen in screens:
                app_screen = AppScreen(
                    app_id=source_app.id,
                    screen_index=screen["screen_index"],
                    screen_name=screen["screen_name"],
                    screen_description=screen["screen_description"],
                    screen_filters_open=screen["screen_filters_open"],
                    screen_auto_refresh=screen["screen_auto_refresh"],
                    screen_image=screen["screen_image"],
                    level=screen["level"],
                    horizontal=screen["horizontal"],
                    graph_type=screen["graph_type"],
                    screen_filters_value=screen["screen_filters_value"],
                    action_settings=screen["action_settings"],
                    hidden=screen["hidden"],
                    graph_width=screen["graph_width"],
                    graph_height=screen["graph_height"],
                )
                app_screen.id = screen["id"]
                app_screens_to_be_replicated.append(app_screen)

            widgets = source_app_data.get("widgets")
            app_screen_widgets_to_be_replicated = []
            for widget in widgets:
                app_screen_widget = AppScreenWidget(
                    app_id=source_app.id,
                    screen_id=widget["screen_id"],
                    widget_index=widget["widget_index"],
                    widget_key=widget["widget_key"],
                    is_label=widget["is_label"],
                    config=widget["config"],
                )
                app_screen_widget.id = widget["id"]
                app_screen_widgets_to_be_replicated.append(app_screen_widget)
            screen_widget_values = source_app_data.get("widget_values")
            app_screen_widget_value_to_be_replicated = []
            for screen_widget_value in screen_widget_values:
                app_screen_widget_value = AppScreenWidgetValue(
                    app_id=source_app.id,
                    screen_id=screen_widget_value["screen_id"],
                    widget_id=screen_widget_value["widget_id"],
                    widget_value=screen_widget_value["widget_value"],
                    widget_simulated_value=screen_widget_value["widget_simulated_value"],
                )
                app_screen_widget_value.id = screen_widget_value["id"]
                app_screen_widget_value_to_be_replicated.append(app_screen_widget_value)
        else:
            source_app_id = request_data.get("source_app_id")
            source_app = App.query.filter_by(id=source_app_id).first()  # app to be replicated

            app_screens_to_be_replicated = AppScreen.query.filter_by(app_id=source_app_id).all()
            app_screen_widgets_to_be_replicated = AppScreenWidget.query.filter_by(app_id=source_app_id).all()
            app_screen_widget_value_to_be_replicated = AppScreenWidgetValue.query.filter_by(app_id=source_app_id).all()
        try:
            for app_widget_values in app_screen_widget_value_to_be_replicated:
                __widget_value__ = (
                    json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
                )
                if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                    raise CustomException(
                        "Application has been created using Iterations, Hence it cant be replicated; Please Create a Fresh Version",
                        422,
                    )
        except CustomException as cex:
            return json_response({"error": str(cex)}, cex.code)

        # SOURCE JSON CREATION

        # complete_app_info = {
        #     "app_info": source_app,
        #     "screens": app_screens_to_be_replicated,
        #     "widgets": app_screen_widgets_to_be_replicated,
        #     "widget_values": app_screen_widget_value_to_be_replicated
        #     }

        # For App to be replicated from scracth.
        # The app does not yet exists. so it has to be created.
        # The condition is that, destination_app_id ia None, but destination_app_env will have the value
        destination_app = None
        destination_app_id = request_data.get("destination_app_id")

        if destination_app_id:
            delete_at_time = func.now()
            destination_app = App.query.filter_by(id=destination_app_id).first()

            db.session.query(AppScreen).filter(
                and_(
                    AppScreen.app_id == destination_app_id,
                    AppScreen.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})

            db.session.query(AppScreenWidget).filter(
                and_(
                    AppScreenWidget.app_id == destination_app_id,
                    AppScreenWidget.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})

            db.session.query(AppScreenWidgetValue).filter(
                and_(
                    AppScreenWidgetValue.app_id == destination_app_id,
                    AppScreenWidgetValue.deleted_at.is_(None),
                )
            ).update({"deleted_at": delete_at_time})
            db.session.commit()
        else:
            destination_app = App(
                name=request_data.get("app_name", ""),
                contact_email=request_data.get("contact_email", ""),
                modules=json.dumps({"nac_collaboration": request_data.get("nac_collaboration", False)}),
                app_creator_id=request_data["user_id"],
                is_connected_systems_app=request_data.get("is_connected_systems_app", False),
            )
            db.session.add(destination_app)
            app_container = AppContainer(order=0, problem=request_data.get("app_name", ""))
            db.session.add(app_container)
            db.session.flush()
            destination_app.container_id = app_container.id
            destination_app.environment = "preview"
            db.session.flush()

        # overview being copied over from source to destination
        if request_data.get("clone_overview"):
            destination_app.approach_blob_name = source_app.approach_blob_name
            destination_app.blueprint_link = source_app.blueprint_link
            destination_app.config_link = source_app.config_link
            destination_app.description = source_app.description
            destination_app.logo_blob_name = source_app.logo_blob_name
            destination_app.orderby = source_app.orderby
            destination_app.small_logo_blob_name = source_app.small_logo_blob_name
            destination_app.theme_id = source_app.theme_id
            db.session.flush()

        # check if app variables need to be copied
        if request_data.get("copy_app_vars_flag"):
            copy_app_vars_flag = request_data.get("copy_app_vars_flag")
            if copy_app_vars_flag is True:
                destination_app.variables = source_app.variables

        if request_data.get("destination_app_env"):
            destination_app.environment = request_data.get("destination_app_env")

        destination_app.source_app_id = source_app.id if "source_app_data" not in request_data else None

        destination_app.function_defns = source_app.function_defns

        db.session.commit()

        add_container_mapping(
            request_data.get("industry_id"),
            request_data.get("function_id"),
            destination_app.container_id,
        )

        # For Its Screens
        screen_id_mapping = {}
        for screen_entity in app_screens_to_be_replicated:
            new_screen_entity = AppScreen(
                app_id=destination_app.id,
                screen_index=screen_entity.screen_index,
                screen_name=screen_entity.screen_name,
                screen_description=screen_entity.screen_description,
                screen_filters_open=screen_entity.screen_filters_open,
                screen_auto_refresh=screen_entity.screen_auto_refresh,
                screen_image=screen_entity.screen_image,
                level=screen_entity.level,
                horizontal=screen_entity.horizontal,
                graph_type=screen_entity.graph_type,
                screen_filters_value=screen_entity.screen_filters_value,
                action_settings=screen_entity.action_settings,
                hidden=screen_entity.hidden,
                graph_width=screen_entity.graph_width,
                graph_height=screen_entity.graph_height,
            )

            db.session.add(new_screen_entity)
            db.session.flush()
            screen_id_mapping[screen_entity.id] = new_screen_entity.id

        widget_id_mapping = {}
        for widget_entity in app_screen_widgets_to_be_replicated:
            if screen_id_mapping.get(widget_entity.screen_id):
                new_widget_entity = AppScreenWidget(
                    app_id=destination_app.id,
                    screen_id=screen_id_mapping[widget_entity.screen_id],
                    widget_index=widget_entity.widget_index,
                    widget_key=widget_entity.widget_key,
                    is_label=widget_entity.is_label,
                    config=widget_entity.config,
                )

                db.session.add(new_widget_entity)
                db.session.flush()
                widget_id_mapping[widget_entity.id] = new_widget_entity.id

        widget_value_id_mapping = {}
        for widget_value_entity in app_screen_widget_value_to_be_replicated:
            if screen_id_mapping.get(widget_value_entity.screen_id) and widget_id_mapping.get(
                widget_value_entity.widget_id
            ):
                new_widget_value_entity = AppScreenWidgetValue(
                    app_id=destination_app.id,
                    screen_id=screen_id_mapping[widget_value_entity.screen_id],
                    widget_id=widget_id_mapping[widget_value_entity.widget_id],
                    widget_value=widget_value_entity.widget_value,
                    widget_simulated_value=None,
                )

                db.session.add(new_widget_value_entity)
                db.session.flush()
                widget_value_id_mapping[widget_value_entity.id] = widget_value_entity.id

        db.session.flush()
        db.session.commit()
        response = {"app_id": destination_app.id}
        return json_response(sanitize_content(response))
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Could Not Create the Replica. Please Try Again."}, 500)


@bp.route("/codex-product-api/app/<int:app_id>/export", methods=["GET"])
@login_required
@nac_role_info_required
def download_app(app_id):
    try:
        # request_data = get_clean_postdata(request)
        CODX_APP_VERSION = app.config["API_VERSION"]
        source_app_id = app_id
        source_app = App.query.filter_by(id=source_app_id).first()  # app to be replicated

        app_screens_to_be_replicated = AppScreen.query.filter_by(app_id=source_app_id).all()
        app_screen_widgets_to_be_replicated = AppScreenWidget.query.filter_by(app_id=source_app_id).all()
        app_screen_widget_value_to_be_replicated = AppScreenWidgetValue.query.filter_by(app_id=source_app_id).all()
        try:
            for app_widget_values in app_screen_widget_value_to_be_replicated:
                __widget_value__ = (
                    json.loads(app_widget_values.widget_value) if app_widget_values.widget_value else None
                )
                if type(__widget_value__) is dict and __widget_value__.get("is_dynamic", False) is False:
                    raise CustomException(
                        "Application has been created using Iterations, Hence it cant be replicated; Please Create a Fresh Version",
                        422,
                    )
        except CustomException as cex:
            return json_response({"error": str(cex)}, cex.code)

        # SOURCE JSON CREATION

        complete_app_info = {
            "version": CODX_APP_VERSION,
            "source_app_url": app.config["CLIENT_HTTP_ORIGIN"] + "/app/" + str(source_app.id),
            "app_info": {
                "id": source_app.id,
                "name": source_app.name,
                "contact_email": source_app.contact_email,
                "function_defns": source_app.function_defns,
            },
            "screens": [
                {
                    "id": screen_entity.id,
                    "screen_index": screen_entity.screen_index,
                    "screen_name": screen_entity.screen_name,
                    "screen_description": screen_entity.screen_description,
                    "screen_filters_open": screen_entity.screen_filters_open,
                    "screen_auto_refresh": screen_entity.screen_auto_refresh,
                    "screen_image": screen_entity.screen_image,
                    "level": screen_entity.level,
                    "horizontal": screen_entity.horizontal,
                    "graph_type": screen_entity.graph_type,
                    "screen_filters_value": screen_entity.screen_filters_value,
                    "action_settings": screen_entity.action_settings,
                    "hidden": screen_entity.hidden,
                    "graph_width": screen_entity.graph_width,
                    "graph_height": screen_entity.graph_height,
                }
                for screen_entity in app_screens_to_be_replicated
            ],
            "widgets": [
                {
                    "id": widget_entity.id,
                    "screen_id": widget_entity.screen_id,
                    "widget_index": widget_entity.widget_index,
                    "widget_key": widget_entity.widget_key,
                    "is_label": widget_entity.is_label,
                    "config": widget_entity.config,
                }
                for widget_entity in app_screen_widgets_to_be_replicated
            ],
            "widget_values": [
                {
                    "id": widget_value_entity.id,
                    "screen_id": widget_value_entity.screen_id,
                    "widget_id": widget_value_entity.widget_id,
                    "widget_value": widget_value_entity.widget_value,
                    "widget_simulated_value": None,
                }
                for widget_value_entity in app_screen_widget_value_to_be_replicated
            ],
        }

        # generator = (cell for row in complete_app_info
        #              for cell in row)
        fernet = Fernet(app.config["CRYPTO_ENCRYPTION_KEY"])

        encoded_app_info = fernet.encrypt(json.dumps(complete_app_info).encode())

        # json.loads(fernet.decrypt(data.encode()).decode())
        return file_response(encoded_app_info, source_app.name + ".txt")

        # return json_response(response)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Failed to download file."}, 500)


@bp.route("/codex-product-api/app/<int:app_id>/get-logo", methods=["GET"])
def get_app_logo(app_id):
    try:
        item = App.query.filter_by(id=app_id).first()
        return json_response(
            {
                "logo_url": get_blob(item.logo_blob_name) if item.logo_blob_name else False,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/<int:app_id>/layoutOptions",
    methods=["GET"],
)
@login_required
def get_layout_options(app_id):
    try:
        layout_options = CustomLayout.query.filter_by(app_id=app_id)
        response = [
            {"app_id": app_item.app_id, "layout_options": app_item.layout_options} for app_item in layout_options
        ]
        return json_response(sanitize_content(response))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/update_layoutOptions",
    methods=["PUT"],
)
@login_required
def insert_layout_options():
    try:
        request_data = get_clean_postdata(request)
        get_max_id = db.session.query(func.max(CustomLayout.id)).first()
        max_id = 0
        for row in get_max_id:
            max_id = 0 if row is None else row
        db.session.execute(f"INSERT INTO custom_layout (id,app_id) VALUES ('{max_id + 1}','{request_data['app_id']}')")
        db.session.flush()
        db.session.commit()
        response = {"message": "success", "code": 200}
        return json_response(sanitize_content(response))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/update_layoutOptions",
    methods=["POST"],
)
@login_required
def update_layout_options():
    try:
        request_data = get_clean_postdata(request)
        layout_table = db.session.query(CustomLayout).filter_by(app_id=request_data["app_id"]).first()
        updated_layout = [*layout_table.layout_options, {**request_data["layout_options"]}]
        layout_table.layout_options = updated_layout
        db.session.flush()
        db.session.commit()
        response = {"message": "success", "code": 200}
        return json_response(sanitize_content(response))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": generic_err_message}, 500)


@bp.route(
    "/codex-product-api/screen_overview_images",
    methods=["GET"],
)
@login_required
def screen_overview_images():
    try:
        urls = get_blob_list(prefix="screenOverview/")
        return json_response(urls)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": error_msg}, 500)
