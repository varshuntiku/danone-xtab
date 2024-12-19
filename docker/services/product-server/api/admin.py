#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import deployed_access_required
from api.models import (
    App,
    AppScreen,
    AppScreenWidget,
    AppScreenWidgetFilterValue,
    AppScreenWidgetValue,
    db,
)
from flasgger.utils import swag_from
from flask import Blueprint, json, request
from sqlalchemy.sql import func

bp = Blueprint("Admin", __name__)


@bp.route("/codex-product-api/admin/app/<string:access_key>", methods=["PUT"])
@swag_from("./documentation/admin/add_app.yml")
@deployed_access_required
def add_app(access_key):
    """Creates and adds an application

    Args:
        access_key ([type]): [description]

    Returns:
        JSON: {add_id}
    """
    try:
        request_data = get_clean_postdata(request)

        application = App(
            name=request_data["name"],
            theme=request_data["theme"],
            contact_email=request_data["contact_email"],
            modules=json.dumps(request_data["modules"]),
        )

        db.session.add(application)
        db.session.commit()
        return json_response({"app_id": application.id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error adding application"}, 500)
    finally:
        db.session.close()


@bp.route(
    "/codex-product-api/admin/app/<int:app_id>/add-screens/<string:access_key>",
    methods=["PUT"],
)
@swag_from("./documentation/admin/add_screens.yml")
@deployed_access_required
def add_screens(app_id, access_key):
    """Creates a new screen and adds the relevant info in app_screen,
         app_screen_widget, app_screen_widget_value & app_screen_widget_filter_value table.

    Args:
        app_id ([type]): [description]
        access_key ([type]): [description]

    Returns:
        JSON: {screen_ids}
    """
    try:
        request_data = get_clean_postdata(request)

        screen_ids = []
        # print(json.dumps(request_data['screens']))

        for screen in request_data["screens"]:
            app_screen = AppScreen(
                app_id=app_id,
                screen_index=screen["screen_index"],
                screen_name=screen["screen_name"],
                screen_description=screen["screen_description"],
                screen_filters_open=screen["screen_filters_open"],
                screen_auto_refresh=screen["screen_auto_refresh"],
                screen_image=screen["screen_image"],
                level=screen["level"] if screen["level"] else None,
                graph_type=screen["graph_type"] if "graph_type" in screen and screen["graph_type"] else None,
                horizontal=screen["horizontal"] if "horizontal" in screen and screen["horizontal"] else None,
                graph_width=screen["graph_width"] if "graph_width" in screen and screen["graph_width"] else None,
                graph_height=screen["graph_height"] if "graph_height" in screen and screen["graph_height"] else None,
                hidden=screen["hidden"],
            )
            db.session.add(app_screen)
            db.session.flush()

            for setting in screen["settings"]:
                app_screen_widget = AppScreenWidget(
                    app_id=app_id,
                    screen_id=app_screen.id,
                    widget_index=setting["item_index"],
                    widget_key=setting["item"],
                    is_label=setting["item_is_label"],
                    config=json.dumps(setting["config"]),
                )
                db.session.add(app_screen_widget)
                db.session.flush()

                for widget_value in setting["values"]:
                    app_screen_widget_value = AppScreenWidgetValue(
                        app_id=app_id,
                        screen_id=app_screen.id,
                        widget_id=app_screen_widget.id,
                        widget_value=json.dumps(widget_value["value"])
                        if isinstance(widget_value["value"], dict) or isinstance(widget_value["value"], list)
                        else widget_value["value"],
                        widget_simulated_value=json.dumps(widget_value["simulated_value"])
                        if isinstance(widget_value["simulated_value"], dict)
                        or isinstance(widget_value["simulated_value"], list)
                        else widget_value["simulated_value"],
                    )
                    db.session.add(app_screen_widget_value)
                    db.session.flush()

                    for filter_value in widget_value["filters"]:
                        app_screen_widget_filter_value = AppScreenWidgetFilterValue(
                            app_id=app_id,
                            screen_id=app_screen.id,
                            widget_id=app_screen_widget.id,
                            widget_value_id=app_screen_widget_value.id,
                            widget_tag_key=filter_value["key"],
                            widget_tag_value=filter_value["value"],
                        )
                        db.session.add(app_screen_widget_filter_value)

            screen_ids.append(app_screen.id)

        db.session.commit()
        return json_response({"screen_ids": screen_ids})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error adding screen"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/admin/app/<int:app_id>/<string:access_key>", methods=["PUT"])
@swag_from("./documentation/admin/replace_app.yml")
@deployed_access_required
def replace_app(app_id, access_key):
    """Updates the application info for the given app id.

    Args:
        app_id ([type]): [description]
        access_key ([type]): [description]

    Returns:
        JSON: {app_id}
    """
    try:
        request_data = get_clean_postdata(request)

        application = App.query.filter_by(id=app_id).first()
        application.name = request_data["name"]
        application.theme = request_data["theme"]
        application.contact_email = request_data["contact_email"]
        application.modules = json.dumps(request_data["modules"])

        AppScreenWidgetFilterValue.query.filter_by(app_id=app_id).update(
            dict(deleted_at=func.now()), synchronize_session=False
        )

        AppScreenWidgetValue.query.filter_by(app_id=app_id).update(
            dict(deleted_at=func.now()), synchronize_session=False
        )

        AppScreenWidget.query.filter_by(app_id=app_id).update(dict(deleted_at=func.now()), synchronize_session=False)

        AppScreen.query.filter_by(app_id=app_id).update(dict(deleted_at=func.now()), synchronize_session=False)

        db.session.commit()
        return json_response({"app_id": app_id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error adding application"}, 500)
    finally:
        db.session.close()
