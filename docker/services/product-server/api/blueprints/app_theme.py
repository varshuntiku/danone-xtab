#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from operator import and_

from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import login_required
from api.models import App, AppTheme, AppThemeMode, db
from flask import Blueprint, json, request
from sqlalchemy import desc
from sqlalchemy.sql import func

bp = Blueprint("AppTheme", __name__)


def modes_com_key(e):
    return e.mode


def sort_modes(modes):
    modes.sort(key=modes_com_key, reverse=True)
    return modes


@bp.route("/codex-product-api/theme", methods=["GET"])
@login_required
def get_app_themes():
    """Rrturns the app themes.
    Returns:
        JSON: []
    """
    try:
        app_themes = AppTheme.query.filter(AppTheme.deleted_at.is_(None)).order_by(desc(AppTheme.readonly)).all()
        # sorting so the entries with readonly = True take priority
        sorted_themes = sorted(app_themes, key=lambda x: (x.readonly is not True), reverse=False)
        res = [
            {
                "id": el.id,
                "name": el.name,
                "readOnly": el.readonly,
                "modes": [
                    {
                        "mode": el2.mode,
                        "bg_variant": el2.bg_variant,
                        "contrast_color": el2.contrast_color,
                        "chart_colors": json.loads(el2.chart_colors),
                        "params": json.loads(el2.params or "{}"),
                    }
                    for el2 in sort_modes(el.modes)
                ],
            }
            for el in sorted_themes
        ]
        return json_response(res)
    except Exception as error_msg:
        ExceptionLogger(error_msg, log_exception=True)
        return json_response({"error": "Error while getting app themes"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/theme/<int:theme_id>", methods=["GET"])
@login_required
def get_app_theme(theme_id):
    """Rrturns the app themes.
    Returns:
        JSON: {}
    """
    try:
        app_theme = AppTheme.query.filter_by(id=theme_id).first()
        res = {
            "id": app_theme.id,
            "name": app_theme.name,
            "readOnly": app_theme.readonly,
            "modes": [
                {
                    "mode": el2.mode,
                    "bg_variant": el2.bg_variant,
                    "contrast_color": el2.contrast_color,
                    "chart_colors": json.loads(el2.chart_colors),
                    "params": json.loads(el2.params or "{}"),
                }
                for el2 in sort_modes(app_theme.modes)
            ],
        }
        return json_response(res)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while getting app theme"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/theme", methods=["POST"])
@login_required
def add_app_theme():
    """Rrturns the app themes.
    Returns:
        JSON: {}
    """
    try:
        request_data = get_clean_postdata(request)
        app_theme = AppTheme.query.filter_by(name=request_data["name"]).first()
        if app_theme:
            return json_response({"error": "Theme already exists with the same name"}, 409)
        app_theme = AppTheme(request_data["name"])
        db.session.add(app_theme)
        db.session.flush()
        for el in request_data["modes"]:
            app_theme_mode = AppThemeMode(
                el["mode"],
                el["bg_variant"],
                el["contrast_color"],
                json.dumps(el["chart_colors"]),
                json.dumps(el["params"] or {}),
                app_theme.id,
            )
            db.session.add(app_theme_mode)
        db.session.commit()
        return json_response({"id": app_theme.id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while adding app theme"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/theme/<int:theme_id>", methods=["DELETE"])
@login_required
def delete_app_theme(theme_id):
    """Deletes a theme
    Returns:
        JSON: {}
    """
    try:
        app_theme = AppTheme.query.filter_by(id=theme_id).first()
        if not app_theme:
            return json_response({"error": "Theme doesn't exist"}, 404)
        if app_theme.readonly:
            return json_response({"error": "Immutable themes can't be deleted"}, 403)
        if not app_theme.deleted_at:
            app_theme.deleted_at = func.now()
            db.session.commit()
        return json_response({"success": "Theme deleted successfully"}, 200)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        db.session.rollback()
        return json_response({"error": "Error while updating app theme"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/apps-by-theme/<int:theme_id>", methods=["GET"])
@login_required
def get_apps_by_theme_id(theme_id):
    """
    Fetches all apps that are associated with a given theme_id.
    Returns a list of app IDs.
    """
    try:
        apps = App.query.filter(App.theme_id == theme_id, App.deleted_at.is_(None)).all()
        app_ids = [app.id for app in apps]
        return json_response(app_ids), 200
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "An error occurred while retrieving the apps."}), 500
    finally:
        db.session.close()


@bp.route("/codex-product-api/theme/<int:theme_id>", methods=["PUT"])
@login_required
def update_app_theme(theme_id):
    """Rrturns the app themes.
    Returns:
        JSON: {}
    """
    try:
        request_data = get_clean_postdata(request)
        app_theme = AppTheme.query.filter_by(id=theme_id).first()
        if not app_theme:
            return json_response({"error": "Theme doesn't exists"}, 404)
        app_theme2 = AppTheme.query.filter(and_(AppTheme.id != theme_id, AppTheme.name == request_data["name"])).first()
        if app_theme2:
            return json_response({"error": "Theme already exists with the same name"}, 409)

        app_theme.name = request_data["name"]
        for new_mode in request_data["modes"]:
            mode = next((item for item in app_theme.modes if item.mode == new_mode["mode"]), None)
            if mode:
                mode.bg_variant = new_mode["bg_variant"]
                mode.contrast_color = new_mode["contrast_color"]
                mode.chart_colors = json.dumps(new_mode["chart_colors"])
                mode.params = json.dumps(new_mode["params"] or {})

        db.session.commit()
        return json_response({"message": "Theme updated successfully."})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while updating app theme"}, 500)
    finally:
        db.session.close()
