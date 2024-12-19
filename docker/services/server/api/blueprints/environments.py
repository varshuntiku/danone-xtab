#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.helpers import get_clean_postdata
from api.middlewares import environments_required, login_required
from api.models import Environment, db
from flasgger.utils import swag_from
from flask import Blueprint, g, request
from sqlalchemy.sql import func

bp = Blueprint("Environments", __name__)


@bp.route("/codex-api/environments", methods=["GET"])
@swag_from("./documentation/_environments/list.yml")
@login_required
@environments_required
def list():
    env_list = []
    try:
        env_list = [
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
            }
            for row in Environment.query.order_by(Environment.id)
        ]
        return json_response_count(env_list, 200, Environment.query.count())

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error :": "Error in fetching environments"}, 500)


@bp.route("/codex-api/environments", methods=["POST"])
@swag_from("./documentation/_environments/create.yml")
@login_required
@environments_required
def create():
    try:
        request_data = get_clean_postdata(request)

        environment = Environment(name=request_data["name"], created_by=g.user.id)
        db.session.add(environment)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error creating environment"}, 422)

    return json_response({"id": environment.id, "name": environment.name})


@bp.route("/codex-api/environments/<int:environment_id>", methods=["GET"])
@swag_from("./documentation/_environments/show.yml")
@login_required
@environments_required
def show(environment_id):
    try:
        item = Environment.query.filter_by(id=environment_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)


@bp.route("/codex-api/environments/<int:environment_id>", methods=["PUT", "POST"])
@swag_from("./documentation/_environments/update.yml", methods=["PUT"])
@login_required
@environments_required
def update(environment_id):
    try:
        environment = Environment.query.filter_by(id=environment_id).first()
        if environment is None:
            return json_response({"Error": "Item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Could not update"}, 422)

    try:
        environment.name = request_data["name"]
        environment.updated_by = g.user.id
        db.session.commit()
        environment = Environment.query.filter_by(id=environment_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error updating environment"}, 500)


@bp.route("/codex-api/environments/<int:environment_id>", methods=["DELETE"])
@swag_from("./documentation/_environments/delete.yml")
@login_required
@environments_required
def delete(environment_id):
    try:
        environment = Environment.query.filter_by(id=environment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Item not found"}, 404)

    try:
        environment.deleted_at = func.now()
        environment.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting environment"}, 500)
