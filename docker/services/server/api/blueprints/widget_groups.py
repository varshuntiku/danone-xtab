#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.helpers import get_clean_postdata
from api.middlewares import login_required, widget_factory_required
from api.models import Widget, WidgetGroup, db
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy.sql import func

bp = Blueprint("WidgetGroups", __name__)


@bp.route("/codex-api/widget-groups", methods=["GET"])
@swag_from("./documentation/widget_groups/list.yml")
@login_required
@widget_factory_required
def list():
    return json_response_count(
        [
            {
                "id": row.id,
                "name": row.name,
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M") if row.created_at else "--",
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
                "widget_count": Widget.query.filter_by(group_id=row.id).count(),
            }
            for row in WidgetGroup.query.order_by(WidgetGroup.id)
        ],
        200,
        WidgetGroup.query.count(),
    )


@bp.route("/codex-api/widget-groups", methods=["POST"])
@swag_from("./documentation/widget_groups/create.yml")
@login_required
@widget_factory_required
def create():
    try:
        request_data = get_clean_postdata(request)

        widget_group = WidgetGroup(
            name=request_data["name"],
            code=request_data["code"],
            light_color=request_data["light_color"],
            dark_color=request_data["dark_color"],
            in_port=request_data["in_port"] if "in_port" in request_data and request_data["in_port"] != "" else False,
            out_port=request_data["out_port"]
            if "out_port" in request_data and request_data["out_port"] != ""
            else False,
            created_by=g.user.id,
        )
        db.session.add(widget_group)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error creating widget group"}, 422)

    return json_response({"id": widget_group.id, "name": widget_group.name})


@bp.route("/codex-api/widget-groups/<int:widget_group_id>", methods=["GET"])
@swag_from("./documentation/widget_groups/show.yml")
@login_required
@widget_factory_required
def show(widget_group_id):
    try:
        item = WidgetGroup.query.filter_by(id=widget_group_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "code": item.code,
                "light_color": item.light_color,
                "dark_color": item.dark_color,
                "in_port": item.in_port,
                "out_port": item.out_port,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/widget-groups/<int:widget_group_id>", methods=["PUT", "POST"])
@swag_from("./documentation/widget_groups/update.yml", methods=["PUT"])
@login_required
@widget_factory_required
def update(widget_group_id):
    try:
        widget_group = WidgetGroup.query.filter_by(id=widget_group_id).first()
        if widget_group is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        widget_group.name = request_data["name"]
        widget_group.code = request_data["code"]
        widget_group.light_color = request_data["light_color"]
        widget_group.dark_color = request_data["dark_color"]
        widget_group.in_port = (
            request_data["in_port"] if "in_port" in request_data and request_data["in_port"] != "" else False
        )
        widget_group.out_port = (
            request_data["out_port"] if "out_port" in request_data and request_data["out_port"] != "" else False
        )
        widget_group.updated_by = g.user.id
        db.session.commit()
        widget_group = WidgetGroup.query.filter_by(id=widget_group_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)

        return json_response({"error": "Error updating widget group"}, 500)


@bp.route("/codex-api/widget-groups/<int:widget_group_id>", methods=["DELETE"])
@swag_from("./documentation/widget_groups/delete.yml")
@login_required
@widget_factory_required
def delete(widget_group_id):
    try:
        widget_group = WidgetGroup.query.filter_by(id=widget_group_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)

        return json_response({"error": "item not found"}, 404)

    try:
        widget_group.deleted_at = func.now()
        widget_group.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)

        return json_response({"error": "Error deleting widget group"}, 500)
