#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


from api.connectors.execution_env import (
    ExecutionEnvAzureDatabricks,
    ExecutionEnvDynamicViz,
)
from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import environments_required, login_required
from api.models import ExecutionEnvironment, db
from flasgger.utils import swag_from
from flask import Blueprint, g, json, request
from sqlalchemy.sql import func

bp = Blueprint("ExecutionEnvironments", __name__)


@bp.route("/codex-api/execution-environments", methods=["GET"])
@swag_from("./documentation/execution_environments/list.yml")
@login_required
@environments_required
def list():
    env_list = []
    try:
        exec_env = ExecutionEnvAzureDatabricks()
        env_list = [
            {
                "id": row.id,
                "name": row.name,
                "requirements": row.requirements,
                "env_type": row.env_type,
                "py_version": row.py_version if row.py_version else False,
                "config": json.loads(row.config) if row.config else False,
                "cluster_id": row.cluster_id,
                "status": (exec_env.check_env_status(row.cluster_id) if row.cluster_id != "READY" else row.cluster_id)
                if row.cluster_id
                else False,
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M") if row.created_at else "--",
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
            }
            for row in ExecutionEnvironment.query.filter_by(created_by=g.user.id).order_by(
                ExecutionEnvironment.updated_at
            )
        ]
        return json_response(env_list, 200)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching execution environments"}, 500)


@bp.route("/codex-api/execution-environments", methods=["POST"])
@swag_from("./documentation/execution_environments/create.yml")
@login_required
@environments_required
def create():
    try:
        request_data = get_clean_postdata(request)

        execution_environment = ExecutionEnvironment(
            name=request_data["name"],
            requirements=request_data["requirements"],
            env_type=request_data["env_type"],
            py_version=request_data["py_version"],
            config=json.dumps(request_data["config"]),
            created_by=g.user.id,
        )
        db.session.add(execution_environment)
        db.session.commit()

        # file_path = 'codx_execution_requirements_' + \
        #     str(execution_environment.id) + '.sh'

        # req_file_handle = open(file_path, 'w')

        # if request_data['requirements']:
        #     req_file_handle.write('pip install ' + request_data['requirements'].replace("\n", " "))
        # else:
        #     req_file_handle.write('echo "No extra requirements..."')
        # req_file_handle.close()

        # blob_datasource = DatasourceFileStorage('azure_blob_storage')
        # blob_datasource.upload_blob(
        #     app.config['AZURE_STORAGE_CONNECTION_STRING'],
        #     app.config['EXECUTION_FOLDER_PATH'],
        #     'execution_envs/' + file_path,
        #     file_path
        # )

        # os.remove(file_path)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error creating execution environment"}, 422)

    return json_response({"id": execution_environment.id, "name": execution_environment.name})


@bp.route("/codex-api/execution-environments/<int:execution_environment_id>", methods=["GET"])
@swag_from("./documentation/execution_environments/show.yml")
@login_required
@environments_required
def show(execution_environment_id):
    try:
        item = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "env_type": item.env_type,
                "py_version": item.py_version,
                "requirements": item.requirements,
                "config": json.loads(item.config) if item.config else False,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route(
    "/codex-api/execution-environments/<int:execution_environment_id>/start",
    methods=["GET"],
)
@swag_from("./documentation/execution_environments/start.yml")
@login_required
@environments_required
def start(execution_environment_id):
    try:
        item = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        if item.env_type == "Azure Databricks":
            exec_env = ExecutionEnvAzureDatabricks()
            cluster_id = exec_env.create_env(
                item.name,
                execution_environment_id,
                json.loads(item.config) if item.config else False,
            )

            item.cluster_id = cluster_id
            db.session.commit()

            return json_response({"status": True})
        else:
            exec_env = ExecutionEnvDynamicViz()
            response = exec_env.create_env(
                item.name,
                execution_environment_id,
                item.py_version if item.py_version else False,
                item.requirements if item.requirements else False,
            )
            # item.cluster_id = 'READY'

            db.session.commit()
            return json_response({"status": "success", "logs": response})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"Error": "Error starting execution environment"}, 404)


@bp.route(
    "/codex-api/execution-environments/<int:execution_environment_id>/stop",
    methods=["GET"],
)
@swag_from("./documentation/execution_environments/stop.yml")
@login_required
@environments_required
def stop(execution_environment_id):
    try:
        item = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        exec_env = ExecutionEnvAzureDatabricks()

        if item.cluster_id:
            exec_env.stop_env(item.cluster_id)

            item.cluster_id = None
            db.session.commit()
        else:
            return json_response({"Error": "Cluster id not found"}, 404)

        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error stopping execution environment"}, 404)


@bp.route(
    "/codex-api/execution-environments/<int:execution_environment_id>",
    methods=["PUT", "POST"],
)
@swag_from("./documentation/execution_environments/update.yml", methods=["PUT"])
@login_required
@environments_required
def update(execution_environment_id):
    try:
        execution_environment = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        if execution_environment is None:
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
        execution_environment.name = request_data["name"]
        execution_environment.config = json.dumps(request_data["config"])
        execution_environment.requirements = request_data["requirements"]
        execution_environment.env_type = request_data["env_type"]
        execution_environment.py_version = request_data["py_version"]
        execution_environment.updated_by = g.user.id
        db.session.commit()

        # file_path = 'codx_execution_requirements_' + \
        #     str(execution_environment.id) + '.sh'

        # req_file_handle = open(file_path, 'w')

        # if request_data['requirements']:
        #     req_file_handle.write('pip install ' + request_data['requirements'].replace("\n", " "))
        # else:
        #     req_file_handle.write('echo "No extra requirements..."')
        # req_file_handle.close()

        # blob_datasource = DatasourceFileStorage('azure_blob_storage')
        # blob_datasource.upload_blob(
        #     app.config['AZURE_STORAGE_CONNECTION_STRING'],
        #     app.config['EXECUTION_FOLDER_PATH'],
        #     'execution_envs/' + file_path,
        #     file_path
        # )

        # os.remove(file_path)

        execution_environment = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating execution environment"}, 500)


@bp.route(
    "/codex-api/execution-environments/<int:execution_environment_id>",
    methods=["DELETE"],
)
@swag_from("./documentation/execution_environments/delete.yml")
@login_required
@environments_required
def delete(execution_environment_id):
    try:
        execution_environment = ExecutionEnvironment.query.filter_by(id=execution_environment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        execution_environment.deleted_at = func.now()
        execution_environment.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting execution environment"}, 500)
