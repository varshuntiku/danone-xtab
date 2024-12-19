#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import sys
from time import time

from api.blueprints.app import execute_code_string
from api.blueprints.utils import add_container_mapping
from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.constants.variables import CustomException
from api.helpers import get_clean_postdata
from api.middlewares import (
    app_publish_required,
    login_required,
    nac_role_info_required,
    platform_user_info_required,
)
from api.models import App, AppContainer, AppScreen, db
from cryptography.fernet import Fernet
from flasgger.utils import swag_from
from flask import Blueprint, current_app, g, json, request
from sqlalchemy.sql import func

bp = Blueprint("AppAdmin", __name__)


@bp.route("/codex-product-api/app-admin/app", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin/create_app.yml")
@login_required
@platform_user_info_required
@app_publish_required
@nac_role_info_required
def create_app():
    """Creates a new app with the submitted iterations.

    Returns:
        JSON: {status, app_id}
    """
    try:
        request_data = json.loads(request.data)

        if "env_key" in request_data and "source_app_id" in request_data:
            parent_app = App.query.filter_by(id=request_data["source_app_id"]).first()

            application = App(
                name=parent_app.name,
                contact_email=parent_app.contact_email,
                modules=json.dumps(
                    {
                        "nac_collaboration": request_data.get("nac_collaboration", False),
                        "top_navbar": request_data.get("top_navbar", False),
                    }
                ),
                app_creator_id=parent_app.app_creator_id,
                is_connected_systems_app=request_data.get("is_connected_systems_app", False),
            )

            if parent_app.container_id is None:
                # Create the container.
                # Add the new app and parent app under the container
                # TODO: Need to correct this as parent_app will have a bunch of things removed
                app_container = AppContainer(order=parent_app.order, problem=request_data["app_name"])
                db.session.add(app_container)
                db.session.flush()
                parent_app.container_id = app_container.id
                application.container_id = app_container.id
            else:
                application.container_id = parent_app.container_id

            application.problem = parent_app.problem
            application.environment = request_data["env_key"]
            db.session.add(application)
            db.session.flush()
            application.source_app_id = parent_app.id
            db.session.commit()

            db.session.flush()
            db.session.commit()

        else:
            application = App(
                name=request_data["app_name"],
                contact_email=request_data["contact_email"],
                modules=json.dumps(
                    {
                        "nac_collaboration": request_data.get("nac_collaboration", False),
                        "top_navbar": request_data.get("top_navbar", False),
                    }
                ),
                app_creator_id=request_data["user_id"],
                is_connected_systems_app=request_data.get("is_connected_systems_app", False),
            )

            application.problem = request_data["app_name"]
            application.environment = "preview"

            app_container = AppContainer(order=0, problem=request_data["app_name"])
            db.session.add(application)
            db.session.add(app_container)
            db.session.flush()
            application.container_id = app_container.id
            db.session.commit()

            add_container_mapping(
                request_data["industry_id"],
                request_data["function_id"],
                application.container_id,
            )

        return json_response({"status": "success", "app_id": application.id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in creating the application"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/overview", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin/update_app_overview.yml")
@login_required
@platform_user_info_required
@app_publish_required
@nac_role_info_required
def update_app_overview(app_id):
    """Updates app overview.

    Returns:
        JSON: {status}
    """
    try:
        request_data = json.loads(request.data)

        application = App.query.filter_by(id=app_id).first()
        modules = json.loads(application.modules)

        application.name = request_data["app_name"]
        application.contact_email = request_data["contact_email"]
        application.logo_blob_name = request_data["logo_blob_name"]
        application.small_logo_blob_name = request_data["small_logo_blob_name"]
        application.description = request_data["description"]
        application.problem_area = request_data["problem_area"]
        modules["nac_collaboration"] = request_data.get("nac_collaboration", modules.get("nac_collaboration", False))
        modules["top_navbar"] = request_data.get("top_navbar", modules.get("top_navbar", False))
        application.modules = json.dumps(modules)
        db.session.commit()

        add_container_mapping(
            request_data["industry_id"],
            request_data["function_id"],
            application.container_id,
        )

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating application overview"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/apply-theme", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin/apply_theme.yml")
@login_required
@platform_user_info_required
@app_publish_required
@nac_role_info_required
def apply_app_theme(app_id):
    """Updates app overview.

    Returns:
        JSON: {status}
    """
    try:
        request_data = json.loads(request.data)
        application = App.query.filter_by(id=app_id).first()
        application.theme_id = request_data["theme_id"]
        db.session.commit()
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in applying theme"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app-admin/<int:app_id>/setup-app", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin/setup_app_project.yml")
@login_required
@platform_user_info_required
@app_publish_required
def setup_app_project(app_id):
    """Adds the blueprint link to the given app id

    Args:
        app_id ([type]): [description]

    Returns:
        JSON: {status, blueprint_link}
    """
    try:
        request_data = json.loads(request.data)

        app = App.query.filter_by(id=app_id).first()

        app.blueprint_link = "/projects/" + str(request_data["project_id"]) + "/design"

        db.session.commit()
        return json_response({"status": "success", "blueprint_link": app.blueprint_link})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in updating Blueprint Link"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/screens", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin/get_screen_config.yml")
@login_required
@platform_user_info_required
@app_publish_required
def get_screen_config(app_id):
    """Get screens for a given app

    Args:
        app_id ([type]): [description]

    Returns:
        JSON: {status}
    """
    try:
        response_screens = []
        app_screens = AppScreen.query.filter_by(app_id=app_id).order_by(AppScreen.screen_index).all()
        for screen_item in app_screens:
            response_screens.append(
                {
                    "id": screen_item.id,
                    "name": screen_item.screen_name,
                    "screen_index": screen_item.screen_index,
                    "level": screen_item.level if screen_item.level else 0,
                    "hidden": screen_item.hidden,
                }
            )

        return json_response({"status": "success", "data": response_screens})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in getting application screens"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/screens", methods=["POST"])
@swag_from("./documentation/app_admin/app_admin/save_screen_config.yml")
@login_required
@platform_user_info_required
@app_publish_required
@nac_role_info_required
def save_screen_config(app_id):
    """Save screen info for a given app

    Args:
        app_id ([type]): [description]

    Returns:
        JSON: {status}
    """
    try:
        request_data = json.loads(request.data)

        app_screen_ids = []
        for screen_item in request_data["screens"]:
            if "id" in screen_item:
                app_screen_ids.append(screen_item["id"])

        response_app_screens = AppScreen.query.filter_by(app_id=app_id).all()
        for app_screen_item in response_app_screens:
            if app_screen_item.id in app_screen_ids:
                pass
            else:
                app_screen_item.deleted_at = func.now()

        screen_index = 0
        for screen_item in request_data["screens"]:
            if "id" in screen_item:
                response_app_screen = AppScreen.query.filter_by(id=screen_item["id"]).first()
                response_app_screen.app_id = app_id
                response_app_screen.screen_index = screen_index
                response_app_screen.screen_name = screen_item["name"]
                response_app_screen.level = (
                    screen_item["level"] if ("level" in screen_item and screen_item["level"]) else None
                )
                response_app_screen.hidden = screen_item.get("hidden", False)

            else:
                db.session.add(
                    AppScreen(
                        app_id=app_id,
                        screen_index=screen_index,
                        screen_name=screen_item["name"],
                        screen_description=None,
                        screen_filters_open=None,
                        screen_auto_refresh=None,
                        screen_image=None,
                        level=screen_item["level"] if ("level" in screen_item and screen_item["level"]) else None,
                        graph_type=None,
                        horizontal=None,
                        screen_filters_value=None,
                        action_settings=None,
                        hidden=screen_item.get("hidden", False),
                        graph_width=None,
                        graph_height=None,
                    )
                )
            screen_index = screen_index + 1

        db.session.commit()
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in saving application screens"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/modules", methods=["PATCH"])
@swag_from("./documentation/app_admin/app_admin/save_app_modules.yml")
@login_required
@platform_user_info_required
@app_publish_required
@nac_role_info_required
def save_app_modules(app_id):
    """Save module info for a given app

    Args:
        app_id (int): [the application id]

    Returns:
        JSON: {status}
    """
    try:
        request_data = get_clean_postdata(request)
        app_details = App.query.filter(App.id == app_id).first()
        if app_details:
            app_modules = json.loads(app_details.modules) if app_details.modules else {}
            existing_responsibilities = app_modules.get("responsibilities", [])
            if "responsibilities" in request_data:
                app_modules["responsibilities"] = request_data.get("responsibilities", [])
                app_details.modules = json.dumps(app_modules)
            else:
                requested_modules = request_data.get("modules", {})
                requested_modules["responsibilities"] = existing_responsibilities
                app_details.modules = json.dumps(requested_modules)
        else:
            raise CustomException("Application " + str(app_id) + "Not Found", 404)
        db.session.commit()
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in saving application modules"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-variable/value/<key>",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin/add_app_variable_key_value.yml")
@login_required
@platform_user_info_required
@nac_role_info_required
def add_app_variable_key_value(app_id, key):
    """Creates and adds a new app variable to app variables json

    Returns:
        JSON: ({"message": "Created Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        decoded_app_vars = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )
        decoded_app_vars[key] = request_data["value"]
        app_info.variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
        db.session.commit()
        return json_response({"status": "success"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while adding application variable"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-variable/value/<key>",
    methods=["PUT"],
)
@swag_from("./documentation/app_admin/app_admin/update_app_variable_value.yml")
@login_required
@platform_user_info_required
def update_app_variable_value(app_id, key):
    """Updates value for one of the app variables

    Returns:
        json: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                decoded_app_vars[key] = request_data["value"]
                app_info.variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
                db.session.commit()
                return json_response({"message": "Variable updated successfully"}, 200)
            else:
                return json_response(
                    {"error": "Error in update operation, variable does not exist in application variables"},
                    404,
                )
        else:
            return json_response(
                {"error": "Error in update operation, variable does not exist in application variables"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating application variable"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-variable/value/<key>",
    methods=["DELETE"],
)
@swag_from("./documentation/app_admin/app_admin/delete_app_variable_value.yml")
@login_required
@platform_user_info_required
def delete_app_variable_value(app_id, key):
    """Deletes key from existing app variables

    Returns:
        json: ({"message": "Variable deleted successfully"}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                del decoded_app_vars[key]
                app_info.variables = fernet.encrypt(json.dumps(decoded_app_vars).encode()).decode()
                db.session.commit()
                return json_response({"message": "Variable deleted successfully"}, 200)
            else:
                return json_response(
                    {"error": "Error in delete operation, variable does not exist in application variables"},
                    404,
                )
        else:
            return json_response(
                {"error": "Error in delete operation, variable does not exist in application variables"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error in deleting application variable"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-variable/value/<key>",
    methods=["GET"],
)
@swag_from("./documentation/app_admin/app_admin/get_app_variable_value.yml")
@login_required
@platform_user_info_required
def get_app_variable_value(app_id, key):
    """Returns value for existing app variable

    Returns:
        json: ({"key": "<key>", "value": "<value>"}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            if key in decoded_app_vars:
                return json_response({"key": key, "value": sanitize_content(decoded_app_vars[key])}, 200)
            else:
                return json_response(
                    {"error": "Error in fetch operation, variable does not exist in application variables"},
                    404,
                )
        else:
            return json_response(
                {"error": "Error in fetch operation, variable does not exist in application variables"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error fetching application variable information"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/app-variable/keys", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin/get_app_variable_keys.yml")
@login_required
@platform_user_info_required
def get_app_variable_keys(app_id):
    """Returns a list of all the existing app variable keys

    Returns:
        json: ({"keys": [<List of keys>]}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.variables is not None:
            decoded_app_vars = json.loads(fernet.decrypt(app_info.variables.encode()).decode())
            app_var_keys = list(decoded_app_vars.keys())
            return json_response({"keys": app_var_keys}, 200)
        else:
            return json_response({"keys": []}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching application variables"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-function/value/<key>",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin/add_app_function_key_value.yml")
@login_required
@platform_user_info_required
@nac_role_info_required
def add_app_function_key_value(app_id, key):
    """Creates and adds a new app function to app functions json

    Returns:
        JSON: ({"message": "Created Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
        else:
            decoded_app_funcs = []

        for item in decoded_app_funcs:
            if item["key"] == key:
                raise Exception("Key Alreay exists")
        decoded_app_funcs.append(
            {
                "key": key,
                "value": request_data.get("value", ""),
                "desc": request_data.get("desc", ""),
                "test": request_data.get("test", ""),
            }
        )
        # decoded_app_funcs[key] = request_data["value"]
        # decoded_app_funcs[key + '_test'] = request_data["test"]
        app_info.function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
        db.session.commit()
        return json_response({"status": "success"}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while adding application function"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-function/value/<key>",
    methods=["PUT"],
)
@swag_from("./documentation/app_admin/app_admin/update_app_function_value.yml")
@login_required
@platform_user_info_required
def update_app_function_value(app_id, key):
    """Updates value for one of the app functions

    Returns:
        json: ({"message": "Updated Successfully"}, 200)
    """
    try:
        request_data = get_clean_postdata(request)
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            func = next((func for func in decoded_app_funcs if func["key"] == key), None)
            func["value"] = request_data.get("value", "")
            func["desc"] = request_data.get("desc", "")
            func["test"] = request_data.get("test", "")
            app_info.function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
            db.session.commit()
            return json_response({"message": "Function updated successfully"}, 200)
        else:
            return json_response(
                {"error": "Error in update operation, function does not exist in application functions"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while updating application function"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-function/value/<key>",
    methods=["DELETE"],
)
@swag_from("./documentation/app_admin/app_admin/delete_app_function_value.yml")
@login_required
@platform_user_info_required
def delete_app_function_value(app_id, key):
    """Deletes key from existing app functions

    Returns:
        json: ({"message": "Variable deleted successfully"}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            decoded_app_funcs = [func for func in decoded_app_funcs if not (func["key"] == key)]
            app_info.function_defns = fernet.encrypt(json.dumps(decoded_app_funcs).encode()).decode()
            db.session.commit()
            return json_response({"message": "Function deleted successfully"}, 200)
        else:
            return json_response(
                {"error": "Error in delete operation, function does not exist in application functions"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error in deleting application function"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-function/value/<key>",
    methods=["GET"],
)
@swag_from("./documentation/app_admin/app_admin/get_app_function_value.yml")
@login_required
@platform_user_info_required
def get_app_function_value(app_id, key):
    """Returns value for existing app function

    Returns:
        json: ({"key": "<key>", "value": "<value>"}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.function_defns is not None:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            func = next((func for func in decoded_app_funcs if func["key"] == key), None)
            if func:
                return json_response(
                    {
                        "key": key,
                        "value": func["value"],
                        "test": func["test"],
                        "desc": func["desc"],
                    },
                    200,
                )
            else:
                return json_response(
                    {"error": "Error in fetch operation, function does not exist in application functions"},
                    404,
                )
        else:
            return json_response(
                {"error": "Error in fetch operation, function does not exist in application functions"},
                404,
            )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error fetching application function information"}, 500)


@bp.route("/codex-product-api/app-admin/app/<int:app_id>/app-function/list", methods=["GET"])
@swag_from("./documentation/app_admin/app_admin/get_app_function_list.yml")
@login_required
@platform_user_info_required
def get_app_function_keys(app_id):
    """Returns a list of all the existing app function keys

    Returns:
        json: ({"keys": [<List of keys>]}, 200)
    """
    try:
        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            response_app_funcs = []
            for app_func in decoded_app_funcs:
                response_app_funcs.append({"key": app_func["key"], "desc": app_func["desc"]})
            return json_response(sanitize_content(response_app_funcs), 200)
        else:
            return json_response([], 200)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error while fetching application functions"}, 500)


@bp.route(
    "/codex-product-api/app-admin/app/<int:app_id>/app-function/test/<key>",
    methods=["POST"],
)
@swag_from("./documentation/app_admin/app_admin/test_app_function.yml")
@login_required
@login_required
@platform_user_info_required
def test_app_function_value(app_id, key):
    """Tests one of the app functions

    Returns:
        json: ({"message": "Tested Successfully"}, 200)
    """
    try:
        request_data = json.loads(request.data)
        test_code = (
            request_data.get("test", "")
            + """
if 'dynamic_outputs' in locals():
    code_outputs = dynamic_outputs
                """
        )
        start_time = time()
        access_token = request.headers.get("authorization", None)

        app_info = App.query.filter_by(id=app_id).first()
        fernet = Fernet(current_app.config["CRYPTO_ENCRYPTION_KEY"])
        new_func = {"key": key, "value": request_data.get("value", "")}
        if app_info.function_defns:
            decoded_app_funcs = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode()) or []
            index = next(
                (index for (index, func) in enumerate(decoded_app_funcs) if func["key"] == key),
                None,
            )
            if index:
                decoded_app_funcs[index] = new_func
            else:
                decoded_app_funcs.append(new_func)
        else:
            decoded_app_funcs = [new_func]
        file_prefix = f"test_app_function_{app_id}_{g.logged_in_email}_"
        code_string_response = execute_code_string(
            app_id=app_id,
            code_string=test_code,
            injected_vars={},
            access_token=access_token,
            app_functions=decoded_app_funcs,
            file_prefix=file_prefix,
        )

        end_time = time()
        code_outputs = sanitize_content(code_string_response["code_string_output"].get("code_outputs", ""))
        return json_response(
            {
                "status": "success",
                "timetaken": str(round((end_time - start_time), 2)),
                "size": str(sys.getsizeof(json.dumps(code_outputs))),
                "output": code_outputs,
                "logs": code_string_response["logs"],
                "lineno": code_string_response.get("lineno", None),
            }
        )
    except Exception as ex:
        ExceptionLogger(ex)
        # db.session.rollback()
        return json_response({"error": "Error while testing application function"}, 500)
    finally:
        db.session.close()
