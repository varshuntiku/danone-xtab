#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.connectors.dynamic_viz_exec_env import ExecutionEnvDynamicViz
from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.helpers import get_clean_postdata
from api.middlewares import login_required, nac_role_info_required
from api.models import (
    AppDynamicVizExecutionEnvironment,
    DynamicVizExecutionEnvironment,
    DynamicVizExecutionEnvironmentDefaults,
    db,
)
from flasgger.utils import swag_from
from flask import Blueprint, request
from flask_cors import CORS
from sqlalchemy.sql import func

bp = Blueprint("DynamicVizExecutionEnvironments", __name__)

CORS(bp)


@bp.route("/codex-product-api/dynamic-execution-environments/default", methods=["GET"])
@swag_from("./documentation/dynamic_exec_env/default_pylist.yml")
@login_required
def default_pylist():
    env_list = []
    try:
        env_list = [
            {
                "requirements": row.requirements,
                "py_version": row.py_version if row.py_version else False,
            }
            for row in DynamicVizExecutionEnvironmentDefaults.query.order_by(
                DynamicVizExecutionEnvironmentDefaults.updated_at
            ).values(
                DynamicVizExecutionEnvironmentDefaults.py_version,
                DynamicVizExecutionEnvironmentDefaults.requirements,
            )
        ]
        return json_response(env_list, 200)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Unable to retrieve default requirements for dynamic execution environments",
            },
            500,
        )


@bp.route("/codex-product-api/dynamic-execution-environments", methods=["GET"])
@swag_from("./documentation/dynamic_exec_env/list.yml")
@login_required
def list():
    env_list = []
    try:
        env_list = [
            {
                "id": row.id,
                "name": row.name,
                "requirements": row.requirements,
                "py_version": row.py_version if row.py_version else False,
                "status": False,
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M") if row.created_at else "--",
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
            }
            for row in DynamicVizExecutionEnvironment.query.order_by(DynamicVizExecutionEnvironment.updated_at)
        ]
        return json_response(env_list, 200)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Unable to retrieve dynamic execution environments",
            },
            500,
        )


@bp.route("/codex-product-api/dynamic-execution-environments", methods=["POST"])
@swag_from("./documentation/dynamic_exec_env/create.yml")
@login_required
@nac_role_info_required
def create():
    try:
        request_data = get_clean_postdata(request)

        execution_environment = DynamicVizExecutionEnvironment(
            name=request_data["name"],
            requirements=request_data["requirements"],
            py_version=request_data["py_version"],
            created_by=0,
        )
        db.session.add(execution_environment)
        db.session.commit()
        return json_response({"id": execution_environment.id, "name": execution_environment.name})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "Error creating execution environment"}, 500)


@bp.route(
    "/codex-product-api/dynamic-execution-environments/<int:execution_environment_id>",
    methods=["GET"],
)
@swag_from("./documentation/dynamic_exec_env/show.yml")
@login_required
def show(execution_environment_id):
    try:
        item = DynamicVizExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "py_version": item.py_version,
                "requirements": item.requirements,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "Item not found"}, 404)


@bp.route(
    "/codex-product-api/dynamic-execution-environments/<int:execution_environment_id>/start",
    methods=["GET"],
)
@swag_from("./documentation/dynamic_exec_env/start.yml")
@login_required
@nac_role_info_required
def start(execution_environment_id):
    try:
        access_token = request.headers.get("authorization", None)
        item = DynamicVizExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        exec_env = ExecutionEnvDynamicViz()
        response = exec_env.create_env(
            item.name,
            execution_environment_id,
            access_token,
            item.py_version if item.py_version else False,
            item.requirements if item.requirements else False,
        )
        return json_response(sanitize_content(response), 500 if response["status"] == "error" else 200)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Error initializing dynamic visualization environment",
            },
            500,
        )


@bp.route(
    "/codex-product-api/dynamic-execution-environments/<int:execution_environment_id>",
    methods=["PUT", "POST"],
)
@swag_from("./documentation/dynamic_exec_env/update.yml")
@login_required
def update(execution_environment_id):
    try:
        execution_environment = DynamicVizExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        if execution_environment is None:
            return json_response({"status": "error", "error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "post data error"}, 422)

    try:
        execution_environment.name = request_data["name"]
        execution_environment.requirements = request_data["requirements"]
        execution_environment.py_version = request_data["py_version"]
        execution_environment.updated_by = 0
        db.session.commit()

        execution_environment = DynamicVizExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Error updating dynamic execution environment",
            },
            500,
        )


@bp.route(
    "/codex-product-api/dynamic-execution-environments/<int:execution_environment_id>",
    methods=["DELETE"],
)
@swag_from("./documentation/dynamic_exec_env/delete.yml")
@login_required
def delete(execution_environment_id):
    try:
        execution_environment = DynamicVizExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "item not found"}, 404)

    try:
        execution_environment.deleted_at = func.now()
        execution_environment.deleted_by = 0
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Error deleting dynamic execution environment",
            },
            500,
        )


@bp.route("/codex-product-api/dynamic-execution-environments/app", methods=["PUT"])
@swag_from("./documentation/dynamic_exec_env/update_app_env_id.yml")
@login_required
@nac_role_info_required
def update_app_env_id():
    try:
        request_data = get_clean_postdata(request)
        app_id = request_data["app_id"]
        execution_environment_id = request_data["exec_env_id"]
        app_execution_environment = AppDynamicVizExecutionEnvironment.query.filter_by(app_id=app_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "item not found"}, 404)
    try:
        if app_execution_environment is not None:
            # update record if it exists in the database
            app_execution_environment.dynamic_env_id = (
                int(execution_environment_id) if execution_environment_id is not None else execution_environment_id
            )
        else:
            # if record not present, insert  into table
            # TODO: Set Correct user once we have it integrated
            app_execution_environment = AppDynamicVizExecutionEnvironment(execution_environment_id, app_id, 0)
            db.session.add(app_execution_environment)
        db.session.commit()
        return json_response(
            {
                "app_id": app_execution_environment.app_id,
                "dynamic_env_id": app_execution_environment.dynamic_env_id,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "error",
                "error": "Error updating app dynamic execution environment",
            },
            500,
        )


@bp.route(
    "/codex-product-api/dynamic-execution-environments/app/<int:app_id>",
    methods=["GET"],
)
@swag_from("./documentation/dynamic_exec_env/get_app_env_id.yml")
@login_required
def get_app_env_id(app_id):
    try:
        app_execution_environment = AppDynamicVizExecutionEnvironment.query.filter_by(app_id=app_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "error", "error": "item not found"}, 404)
    try:
        if app_execution_environment is not None:
            # if record is present, send values back
            return json_response(
                {
                    "app_id": app_execution_environment.app_id,
                    "dynamic_env_id": app_execution_environment.dynamic_env_id,
                }
            )
        else:
            # if record not present, send exec_env id as None
            return json_response({"app_id": app_id, "dynamic_env_id": None})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {"status": "error", "error": "Error retrieving app execution id mapping"},
            500,
        )
