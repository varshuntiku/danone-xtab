#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import base64
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from operator import or_
from time import time

from api.blueprints.app import (
    execute_screen_action_handler,
    get_dynamic_filters_helper,
    get_dynamic_widgets,
    get_screen_action_settings,
)
from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.helpers import get_clean_postdata
from api.middlewares import login_required, nac_role_info_required, validate_uiac
from api.models import App, AppScreen, AppScreenWidget, AppScreenWidgetValue, db
from codex_widget_factory_lite.config import utils as system_widgets
from cryptography.fernet import Fernet
from flasgger.utils import swag_from
from flask import Blueprint
from flask import current_app as app
from flask import json, request
from flask_cors import CORS
from sqlalchemy import asc, desc, text
from sqlalchemy.sql import func

bp = Blueprint("AppAdminScreens", __name__)

CORS(bp)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/preview-filters", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/preview_filters.yml")
@login_required
def preview_filters(app_id):
    """Preview dynamic filters given code_str, default_selected_values & output_var

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        screen_filters = {"code": request_data["code_string"]}
        access_token = request.headers.get("authorization", None)
        (
            response_filters,
            response_filter_logs,
            error_lineno,
        ) = get_dynamic_filters_helper(
            app_id,
            None,
            access_token,
            json.dumps(screen_filters),
            {"selected": request_data["selected_filters"]} if "selected_filters" in request_data else {},
        )

        return json_response(sanitize_content(response_filters))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Issue with getting filters"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/test-filters", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/test_filters.yml")
@login_required
@nac_role_info_required
def test_filters(app_id):
    """Test dynamic filters given code_str, default_selected_values & output_var

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        screen_filters = {"code": request_data["code_string"]}
        access_token = request.headers.get("authorization", None)
        start_time = time()

        (
            response_filters,
            response_filter_logs,
            error_lineno,
        ) = get_dynamic_filters_helper(
            app_id,
            None,
            access_token,
            json.dumps(screen_filters),
            {"selected": request_data["selected_filters"]} if "selected_filters" in request_data else {},
        )

        end_time = time()

        sanitized_response_filters = sanitize_content(response_filters)

        return json_response(
            {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(json.dumps(sanitized_response_filters))),
                "output": sanitized_response_filters,
                "logs": response_filter_logs,
                "lineno": error_lineno,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Issue with getting filters"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/test-actions-code", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/test_action_generator.yml")
@login_required
@nac_role_info_required
def test_action_generator(app_id):
    """Test dynamic action given action_generator, action_handler codes

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        screen_actions = {
            "action_generator": request_data["code_string"],
            "action_handler": "",
            "default": None,
        }

        start_time = time()

        response_actions, response_logs, error_lineno = get_screen_action_settings(
            app_id,
            None,
            request.headers.get("authorization", None),
            json.dumps(screen_actions),
        )

        end_time = time()
        sanitized_response_actions = sanitize_content(response_actions)

        return json_response(
            {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(json.dumps(sanitized_response_actions))),
                "output": sanitized_response_actions,
                "logs": response_logs,
                "lineno": error_lineno,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Issue with getting actions"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/preview-actions-handler",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/preview_actions_handler.yml")
@login_required
@nac_role_info_required
def preview_actions_handler(app_id):
    """Preview dynamic action given action_generator, action_handler codes

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        screen_actions = {
            "action_generator": "",
            "action_handler": request_data["code_string"],
            "default": None,
        }

        start_time = time()
        response_actions, response_logs, error_lineno = execute_screen_action_handler(
            app_id, None, access_token, screen_actions
        )
        end_time = time()

        sanitized_response_actions = sanitize_content(response_actions)

        return json_response(
            {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(json.dumps(sanitized_response_actions))),
                "output": sanitized_response_actions,
                "logs": response_logs,
                "lineno": error_lineno,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Issue with getting actions"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/preview-actions", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/preview_actions.yml")
@login_required
def preview_actions(app_id):
    """Preview dynamic action given action_generator, action_handler codes

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        screen_actions = {
            "action_generator": request_data["action_settings"]["action_generator"],
            "action_handler": request_data["action_settings"]["action_handler"],
            "default": None,
        }

        response_actions, response_logs, error_lineno = get_screen_action_settings(
            app_id, access_token, json.dumps(screen_actions)
        )

        return json_response(sanitize_content(response_actions))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Issue with getting actions"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/save-overview",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_overview.yml")
@login_required
@nac_role_info_required
def save_overview(app_id, screen_id):
    # Setup ability here to save the filter settings and potentially use them as we go forward.
    try:
        request_data = get_clean_postdata(request)
        app_screen = AppScreen.query.filter_by(id=screen_id).first()
        if "screen_name" in request_data:
            app_screen.screen_name = request_data["screen_name"]
        app_screen.screen_description = request_data["screen_description"]
        app_screen.screen_image = request_data["screen_image"]
        app_screen.screen_auto_refresh = request_data["screen_auto_refresh"]
        app_screen.rating_url = request_data["rating_url"]
        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving screen overview"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/user-guide",
    methods=["GET"],
)
@login_required
def get_guide(app_id, screen_id):
    # Get the list of user guides configured for the screen
    try:
        app_screen = AppScreen.query.filter_by(id=screen_id).first()
        if app_screen.user_guide is None:
            return json_response({"status": "success", "data": ""})
        response = eval(app_screen.user_guide)
        return json_response({"status": "success", "data": response})

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching guide"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/user-guide",
    methods=["POST"],
)
@login_required
@nac_role_info_required
def save_guide(app_id, screen_id):
    # Saves a user guide for a screen
    try:
        request_data = get_clean_postdata(request)
        app_screen = AppScreen.query.filter_by(id=screen_id).first()

        if app_screen.user_guide is None:
            new_user_guide = []
            new_user_guide.append(request_data)
            app_screen.user_guide = str(new_user_guide)
        else:
            existing_guide = eval(app_screen.user_guide)
            existing_guide.append(request_data)
            app_screen.user_guide = str(existing_guide)
        db.session.commit()

        return json_response({"status": "success"})

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving screen user guide"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/user-guide",
    methods=["PUT"],
)
@login_required
@nac_role_info_required
def update_guide(app_id, screen_id):
    # Updates the list of available user guides for the screen
    try:
        request_data = get_clean_postdata(request)
        new_guides = request_data["data"]
        app_screen = AppScreen.query.filter_by(id=screen_id).first()
        if len(new_guides) == 0:
            app_screen.user_guide = None
        else:
            app_screen.user_guide = str(new_guides)
        db.session.commit()

        return json_response({"status": "success"})

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while updating screen user guide"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/save-filters",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_filters_code.yml")
@login_required
@validate_uiac
@nac_role_info_required
def save_filters_code(app_id, screen_id):
    # Setup ability here to save the filter settings and potentially use them as we go forward.
    try:
        request_data = get_clean_postdata(request)
        app_screen = AppScreen.query.filter_by(id=screen_id).first()

        # Does not matter if i have filter code already or not
        # # if app_screen.screen_filters_value:
        # #     current_screen_filters_value = json.loads(app_screen.screen_filters_value)
        # #     if current_screen_filters_value and type(current_screen_filters_value) != str and type(current_screen_filters_value) != bool:
        # #         app_screen.screen_filters_value = json.dumps(screen_filters_value)
        # # else:
        # #     app_screen.screen_filters_value = json.dumps(incoming_screen_filters_value) if incoming_screen_filters_value else None

        # i will anyway need to update it with the latest code/input from UI.
        # The update logic:
        # if i get code from UI, i update app_screen.screen_filters_value with the code and set is_dynamic to true.
        # if code is '' or none, then update the value as None or NULL in the db
        incoming_screen_filters_value = {
            "code": request_data.get("code_string", None),
            "is_dynamic": True,
        }
        if not request_data.get("code_string", None):
            incoming_screen_filters_value = None

        app_screen.screen_filters_value = (
            json.dumps(incoming_screen_filters_value) if incoming_screen_filters_value else None
        )

        # also updating capability to update the filter state open as it comes from the UI, but safely
        app_screen.screen_filter_open = request_data.get("screen_filter_open", False)

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving screen filters"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/save-actions",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_actions_code.yml")
@login_required
@nac_role_info_required
def save_actions_code(app_id, screen_id):
    # Setup ability here to save the filter settings and potentially use them as we go forward.
    try:
        request_data = get_clean_postdata(request)
        app_screen = AppScreen.query.filter_by(id=screen_id).first()

        action_settings = request_data["action_settings"]

        if action_settings["action_handler"] == "" and action_settings["action_generator"] == "":
            app_screen.action_settings = None
        else:
            app_screen.action_settings = json.dumps(request_data["action_settings"])

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving screen actions"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/save-screen-widgets",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_screen_widgets.yml")
@login_required
@nac_role_info_required
def save_screen_widgets(app_id, screen_id):
    # Setup ability here to save the filter settings and potentially use them as we go forward.
    try:
        request_data = get_clean_postdata(request)
        app_screen = db.session.query(AppScreen).filter_by(id=screen_id).first()

        app_screen.graph_type = (
            request_data["selected_layout"]["graph_type"] if "graph_type" in request_data["selected_layout"] else None
        )
        app_screen.horizontal = (
            request_data["selected_layout"]["horizontal"] if "horizontal" in request_data["selected_layout"] else None
        )

        app_screen.graph_width = (
            request_data["selected_layout"]["graph_width"] if "graph_width" in request_data["selected_layout"] else None
        )
        app_screen.graph_height = (
            request_data["selected_layout"]["graph_height"]
            if "graph_height" in request_data["selected_layout"]
            else None
        )

        request_widget_ids = []
        for widget_item in request_data["widgets"]:
            if str(widget_item["id"]).startswith("new_"):
                pass
            else:
                request_widget_ids.append(widget_item["id"])

        app_screen_widgets = AppScreenWidget.query.filter_by(screen_id=screen_id).all()
        for app_screen_widget in app_screen_widgets:
            if app_screen_widget.id in request_widget_ids:
                pass
            else:
                app_screen_widget.deleted_at = func.now()

        for widget_item in request_data["widgets"]:
            if str(widget_item["id"]).startswith("new_"):
                app_screen_widget = AppScreenWidget(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_index=widget_item["widget_index"],
                    widget_key=widget_item.get("config", {}).get("title", ""),
                    is_label=widget_item["is_label"],
                    config=json.dumps(widget_item["config"]),
                )
                db.session.add(app_screen_widget)
            else:
                app_screen_widget = AppScreenWidget.query.filter_by(id=widget_item["id"]).first()
                app_screen_widget.config = json.dumps(widget_item["config"])
                app_screen_widget.widget_key = widget_item.get("config", {}).get("title", "")

        db.session.commit()

        app_screen_widgets = AppScreenWidget.query.filter_by(app_id=app_id, screen_id=screen_id).order_by(
            asc(AppScreenWidget.widget_index)
        )

        return json_response(
            {
                "status": "success",
                "widgets": [
                    {
                        "id": row.id,
                        "widget_index": row.widget_index,
                        "widget_key": row.widget_key,
                        "is_label": row.is_label,
                        "config": (json.loads(row.config) if row.config else False),
                    }
                    for row in app_screen_widgets.all()
                ],
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving screen layout " + str(error_msg)}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/widget/<int:widget_id>",
    methods=["GET"],
)
@swag_from("./documentation/app_admin/app_admin_screens/get_screen_widget.yml")
@login_required
def get_screen_widget(app_id, screen_id, widget_id):
    # THIS IS WHERE WIDGET IS FETCHED
    try:
        app_screen_widget = AppScreenWidget.query.filter_by(id=widget_id).first()

        widget_val = AppScreenWidgetValue.query.filter_by(
            app_id=app_id, screen_id=screen_id, widget_id=widget_id
        ).first()

        response = json.loads(app_screen_widget.config) if app_screen_widget.config else {}

        if widget_val and widget_val.widget_value:
            widget_val = json.loads(widget_val.widget_value)
            if widget_val.get("is_dynamic"):
                response["code"] = widget_val.get("code")

        return json_response({"status": "success", "data": response})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving filters"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/widget/<int:widget_id>/config",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_screen_widget_config.yml")
@login_required
@nac_role_info_required
def save_screen_widget_config(app_id, screen_id, widget_id):
    # THIS IS WHERE WIDGET IS SAVED
    try:
        request_data = get_clean_postdata(request)
        app_screen_widget = db.session.query(AppScreenWidget).filter_by(id=widget_id).first()

        app_screen_widget.config = json.dumps(request_data["config"])
        app_screen_widget.widget_key = request_data.get("config", {}).get("title")

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving widget config"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/screen/<int:screen_id>/widget/<int:widget_id>/uiac",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/save_screen_widget_uiac.yml")
@login_required
@validate_uiac
@nac_role_info_required
def save_screen_widget_uiac(app_id, screen_id, widget_id):
    # THIS IS WHERE WIDGET IS SAVED
    try:
        request_data = get_clean_postdata(request)

        _widget_value = (
            AppScreenWidgetValue.query.filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id)
            .order_by(desc(AppScreenWidgetValue.id))
            .first()
        )

        incoming_widget_value = {
            "is_dynamic": True,
            "code": request_data.get("code", None),
        }
        if incoming_widget_value["code"] is None:
            incoming_widget_value = None

        if _widget_value:
            _widget_value.widget_value = json.dumps(incoming_widget_value) if incoming_widget_value else None

            other_widget_values = (
                AppScreenWidgetValue.query.filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id)
                .filter(AppScreenWidgetValue.id != _widget_value.id)
                .order_by(desc(AppScreenWidgetValue.id))
                .all()
            )
            time_stamp = func.now()
            for owv in other_widget_values:
                owv.deleted_at = time_stamp
        else:
            new_widget_value = AppScreenWidgetValue(
                app_id=app_id,
                screen_id=screen_id,
                widget_id=widget_id,
                widget_value=json.dumps(incoming_widget_value) if incoming_widget_value else None,
                widget_simulated_value=None,
            )
            db.session.add(new_widget_value)

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while saving widget uiac"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/preview-visualization",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin_screens/preview_visualization.yml")
@login_required
def preview_visualization(app_id):
    """Preview dynamic visualization given code_str

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)
        access_token = request.headers.get("authorization", None)
        widget_value_json, run_logs, error_lineno = get_dynamic_widgets(
            app_id, access_token, request_data["filters"], request_data["code"], None
        )

        response_data = {
            "data": {
                "widget_value_id": False,
                "value": json.loads(widget_value_json),
                "simulated_value": False,
            }
        }

        return json_response(sanitize_content(response_data))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/test-visualization", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/test_visualization.yml")
@login_required
def test_visualization(app_id):
    """Test dynamic visualization given code_str

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        request_data = get_clean_postdata(request)

        start_time = time()
        access_token = request.headers.get("authorization", None)
        widget_value_json, run_logs, error_lineno = get_dynamic_widgets(
            app_id,
            None,
            access_token,
            request_data.get("filters", {}),
            request_data.get("code", ""),
            None,
        )

        end_time = time()

        sanitized_widget_value_json = sanitize_content(widget_value_json)

        response_data = {
            "status": "success",
            "timetaken": str(round((end_time - start_time), 2)),
            "size": str(sys.getsizeof(sanitized_widget_value_json)),
            "output": json.loads(sanitized_widget_value_json),
            "logs": str(run_logs),
            "lineno": error_lineno,
        }

        return json_response(response_data)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/get-system-widgets", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin_screens/get_system_widgets.yml")
@login_required
def get_system_widgets(app_id):
    """Get system supports widget given a widget type

    Args:
      app_id ([type]): [description]

    Returns:
      json: [description]
    """
    try:
        # request_data = get_clean_postdata(request)

        for system_widget in system_widgets:
            if system_widget["object"] != "":
                system_widget["doc_string"] = system_widget["object"].__doc__
                if hasattr(system_widget["object"], "DEFAULT_CODE"):
                    system_widget["default_code"] = system_widget["object"].DEFAULT_CODE
                system_widget["object"] = ""

        fernet = Fernet(app.config["CRYPTO_ENCRYPTION_KEY"])
        app_info = App.query.filter_by(id=app_id).first()
        decoded_app_vars = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
        else:
            decoded_app_funcs = []
        response_func_keys = []
        for app_func in decoded_app_funcs:
            response_func_keys.append({"test": app_func["test"], "key": app_func["key"], "desc": app_func["desc"]})

        response_data = {
            "data": {
                "system_widgets": system_widgets,
                "app_variables": list(decoded_app_vars.keys()),
                "app_functions": response_func_keys,
            }
            # 'widgets': system_widgets
        }

        return json_response(sanitize_content(response_data))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route(
    "/codex-product-api/app-admin/get-system-widget-documentation/<md_file_name>",
    methods=["GET"],
)
@swag_from("./documentation/app_admin/app_admin_screens/get_system_widget_documentation.yml")
@login_required
def get_system_widget_documentation(md_file_name):
    """Get markdown file for a given widget

    Args:
      md_file_name ([str]): Markdown file name
    Returns:
      json: json object with markdown content
    """
    try:
        with open(
            os.path.abspath(os.path.join(app.root_path, "../codex_widget_factory_lite/docs/", md_file_name)),
            "r",
        ) as reader:
            file_content = reader.read()
            # replace images with base encoded value
            image_src_list = []
            image_list = []
            regex = r"!\[[^\]]*\]\((.*?)\s*(\"(?:.*[^\"])\")?\s*\)"
            matches = re.finditer(regex, file_content)
            for matchNum, match in enumerate(matches, start=1):
                image_src_list.append(match.group(1))
                image_list.append(match.group())

            for src, img_tag in zip(image_src_list, image_list):
                with open(
                    os.path.abspath(os.path.join(app.root_path, "../codex_widget_factory_lite/docs", src)),
                    "rb",
                ) as image_file:
                    encoded_string = base64.b64encode(image_file.read())
                replacement = "<img src='data:image/png;base64, " + encoded_string.decode("utf-8") + "'/>"
                file_content = file_content.replace(img_tag, replacement)
        response_data = {"data": file_content}
        return json_response(response_data)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/archived-uiac/list", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin_screens/get_archived_uiacs.yml")
@login_required
def get_archived_uiacs(app_id):
    """Get lost UIaC's for a Project

    Args:
      app_id ([str]): application id
    Returns:
      list: list of all the lost widgets
    """
    try:
        q1 = (
            db.session.query(AppScreenWidgetValue, AppScreenWidget, AppScreen)
            .filter(
                AppScreenWidget.app_id == app_id,
                or_(AppScreenWidget.deleted_at.is_not(None), AppScreen.deleted_at.is_not(None)),
                text("CAST(app_screen_widget_value.widget_value AS JSONB) ->> 'code' != ''"),
            )
            .join(AppScreenWidget, AppScreenWidget.id == AppScreenWidgetValue.widget_id)
            .join(AppScreen, AppScreen.id == AppScreenWidget.screen_id)
            .order_by(desc(AppScreenWidgetValue.created_at))
            .all()
        )
        widget_values_json = [
            {
                "id": record.AppScreenWidgetValue.id,
                "widget_value": json.loads(record.AppScreenWidgetValue.widget_value),
                "widget_id": record.AppScreenWidgetValue.widget_id,
                "widget_title": json.loads(record.AppScreenWidget.config).get("title", ""),
                "screen_id": record.AppScreen.id,
                "screen_title": record.AppScreen.screen_name,
                "is_deleted_screen": True if record.AppScreen.deleted_at else False,
                "type": "widget",
            }
            for record in q1
        ]
        return json_response(widget_values_json, 200)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "internal error"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/archived-filter-uiac/list",
    methods=["GET"],
)
@swag_from("./documentation/app_admin/app_admin_screens/get_archived_filter_uiacs.yml")
@login_required
def get_archived_filter_uiac(app_id):
    """Returns list of archived filter uiac for specific app which are not older than 60 days

    Args:
        app_id (int): id of application

    Returns:
        json: {list of archived filter uiac}
    """
    try:
        time_elapsed = datetime.now(timezone.utc) - timedelta(days=60)
        archived_code = (
            db.session.query(AppScreen)
            .filter(
                AppScreen.deleted_at.is_not(None),
                AppScreen.app_id == app_id,
                AppScreen.screen_filters_value != "false",
                AppScreen.screen_filters_value.is_not(None),
                AppScreen.deleted_at > time_elapsed,
            )
            .order_by(desc(AppScreen.created_at))
            .all()
        )
        archived_filters_json = [
            {
                "id": record.id,
                "filter_value": json.loads(record.screen_filters_value),
                "screen_title": record.screen_name,
                "is_deleted_screen": True if record.deleted_at else False,
                "type": "filter",
            }
            for record in archived_code
        ]
        return json_response(archived_filters_json, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "internal error"}, 500)
    finally:
        db.session.close()
