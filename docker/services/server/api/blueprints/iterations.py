#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import os
from datetime import datetime

import pandas as pd
from api.connectors.datasource import DatasourceFileStorage
from api.connectors.execution_env import ExecutionEnvAzureDatabricks
from api.constants.functions import ExceptionLogger, json_response, sanitize_content
from api.helpers import get_clean_postdata
from api.main import socketio
from api.middlewares import app_required, login_required
from api.models import ProjectNotebook, ProjectNotebookConfig, db
from flask import Blueprint
from flask import current_app as app
from flask import json, request
from flask_cors import CORS

bp = Blueprint("Iterations", __name__)

CORS(bp)


@bp.route("/codex-api/projects-notebooks/<int:notebook_id>/blueprint", methods=["GET"])
@login_required
@app_required
def get_blueprint(notebook_id):
    try:
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if execution is None:
            return json_response({"error": "item not found"}, 404)

        if execution.blueprint is None:
            data = False
        else:
            data = json.loads(execution.blueprint)

        if execution.exec_logs is None:
            logs = False
        else:
            logs = json.loads(execution.exec_logs)

        return json_response({"status": "success", "data": data, "logs": logs})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/blueprint",
    methods=["GET"],
)
@login_required
@app_required
def get_iteration_blueprint(notebook_id, iteration_id):
    try:
        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
        if iteration is None:
            return json_response({"error": "item not found"}, 404)

        if iteration.blueprint is None:
            data = False
        else:
            data = json.loads(iteration.blueprint)

        if iteration.exec_logs is None:
            logs = False
        else:
            logs = json.loads(iteration.exec_logs)

        return json_response({"status": "success", "data": data, "logs": logs})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


def find_sourcenodename_fromlink(link_id, blueprint):
    source_id = False
    for link_item in blueprint["links"]:
        if link_item["id"] == link_id:
            source_id = link_item["source"]

    node_name = False
    node_output_vars = False
    if source_id:
        for node_item in blueprint["nodes"]:
            if node_item["id"] == source_id:
                node_name = node_item["name"]
                if "extras" in node_item and "widget_output_vars" in node_item["extras"]:
                    node_output_vars = node_item["extras"]["widget_output_vars"]
        return {"id": source_id, "name": node_name, "output_vars": node_output_vars}
    else:
        return False


def get_inputvar_blobpath(notebook_id, widget_id, var_name, iteration_id=False):
    try:
        # datasource_fs = DatasourceFileStorage('azure_blob_storage')

        # search_prefix = f"executions/execution-{notebook_id}/output-{widget_id}-{var_name}."
        # if iteration_id:
        #     search_prefix = f"executions/notebook-{notebook_id}/iteration-{iteration_id}/output-{widget_id}-{var_name}."

        # file_list = datasource_fs.get_azureblobstorage_list(
        #     app.config['AZURE_STORAGE_CONNECTION_STRING'],
        #     app.config['EXECUTION_FOLDER_PATH'],
        #     search_prefix
        # )

        response_code = "from codex_widget_factory.publish.utils_publish import get_widget_input\n\n"
        # response_filelist = []
        # for file_list_item in file_list:
        response_code += f"{var_name} = get_widget_input(connection_uri='{app.config['AZURE_STORAGE_CONNECTION_STRING']}', container_name='{app.config['EXECUTION_FOLDER_PATH']}', notebook_id='{notebook_id}', widget_id='{widget_id}', var_name='{var_name}', iteration_id='{iteration_id}')\n"
        return response_code
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return False


@bp.route("/codex-api/projects-notebooks/<int:notebook_id>/blueprint", methods=["PUT", "POST"])
@login_required
@app_required
def save_blueprint(notebook_id):
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        notebook.blueprint = json.dumps(request_data["blueprint"])
        db.session.commit()

        save_node_scripts(notebook)
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/blueprint",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def save_iteration_blueprint(notebook_id, iteration_id):
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()

        if iteration is None:
            return json_response({"error": "item not found"}, 404)

        iteration.blueprint = json.dumps(request_data["blueprint"])
        db.session.commit()

        save_node_scripts(notebook, iteration)
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/execute",
    methods=["GET"],
)
@login_required
@app_required
def execute_notebook_widget(notebook_id, widget_id):
    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        execute_widget_code(notebook, widget_id)

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/widget/<string:widget_id>/execute",
    methods=["GET"],
)
@login_required
@app_required
def execute_iteration_widget(notebook_id, iteration_id, widget_id):
    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
        if iteration is None:
            return json_response({"error": "item not found"}, 404)

        execute_widget_code(notebook, widget_id, iteration)

        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


def execute_widget_code(notebook, widget_id, iteration=False):
    cluster_id = notebook.execution_environment.cluster_id

    execution = notebook
    exec_name = f"exec-task-execution-notebook-{notebook.id}-widget-{widget_id}"
    exec_folder = f"executions/execution-{notebook.id}"
    if iteration:
        execution = iteration
        exec_name = f"exec-task-execution-notebook-{notebook.id}-iteration-{iteration.id}-widget-{widget_id}"
        exec_folder = f"executions/notebook-{notebook.id}/iteration-{iteration.id}"

    exec_env = ExecutionEnvAzureDatabricks()
    exec_env.submit_job(
        {
            "name": exec_name,
            "cluster_id": cluster_id,
            "exec_filepath": f"dbfs:/mnt/{app.config['EXECUTION_FOLDER_DATABRICKS_MOUNT']}/{exec_folder}/py-exec-{widget_id}.py",
            "job_id": False,
            "notebook_execute": False,
        }
    )

    if execution.exec_logs and execution.exec_logs is not None:
        execution_logs = json.loads(execution.exec_logs)
    else:
        execution_logs = {}

    execution_logs[widget_id] = {
        "logs": None,
        "status": "QUEUED",
        "timetaken": None,
        "updated_at": datetime.now().strftime("%d %b, %Y %H:%M:%S"),
    }

    execution.exec_logs = json.dumps(execution_logs)


@bp.route("/codex-api/project-notebooks/<int:notebook_id>/execute", methods=["POST"])
@login_required
@app_required
def execute_notebook(notebook_id):
    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        execute_notebook_code(notebook)
        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/project-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/execute",
    methods=["POST"],
)
@login_required
@app_required
def execute_iteration(notebook_id, iteration_id):
    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
        if iteration is None:
            return json_response({"error": "item not found"}, 404)

        execute_notebook_code(notebook, iteration)
        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


def execute_notebook_code(notebook, iteration=False):
    cluster_id = notebook.execution_environment.cluster_id

    execution = notebook
    exec_folder = f"executions/execution-{notebook.id}"
    if iteration:
        execution = iteration
        exec_folder = f"executions/notebook-{notebook.id}/iteration-{iteration.id}"

    exec_blueprint = json.loads(execution.blueprint)
    execution_logs = {}

    exec_env = ExecutionEnvAzureDatabricks()

    for node_item in exec_blueprint["nodes"]:
        widget_id = node_item["id"]

        exec_name = f"exec-task-execution-notebook-{notebook.id}-widget-{widget_id}"
        if iteration:
            exec_name = f"exec-task-execution-notebook-{notebook.id}-iteration-{iteration.id}-widget-{widget_id}"

        in_port = False
        # out_port = False

        for port_item in node_item["ports"]:
            if port_item["in"]:
                in_port = port_item
            else:
                # out_port = port_item
                pass

        if not in_port or (in_port and len(in_port["links"]) == 0):
            exec_env.submit_job(
                {
                    "name": exec_name,
                    "cluster_id": cluster_id,
                    "exec_filepath": f"dbfs:/mnt/{app.config['EXECUTION_FOLDER_DATABRICKS_MOUNT']}/{exec_folder}/py-exec-{widget_id}.py",
                    "job_id": False,
                    "notebook_execute": True,
                }
            )

            exec_timestamp = datetime.now().strftime("%d %b, %Y %H:%M:%S")

            execution_logs[widget_id] = {
                "logs": None,
                "status": "QUEUED",
                "timetaken": None,
                "updated_at": exec_timestamp,
            }

    execution.exec_logs = json.dumps(execution_logs)


@bp.route(
    "/codex-api/projects-notebooks/<string:execution_token>/widget/<string:widget_id>/update-execution-status",
    methods=["PUT", "POST"],
)
def update_notebook_execution_status(execution_token, widget_id):
    try:
        request_data = json.loads(get_clean_postdata(request))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        notebook = ProjectNotebook.query.filter_by(access_token=execution_token).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        update_widget_execution_status(request_data, notebook, widget_id)

        save_node_scripts(notebook)

        return json_response({"success": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<string:execution_token>/iterations/<int:iteration_id>/widget/<string:widget_id>/update-execution-status",
    methods=["PUT", "POST"],
)
def update_iteration_execution_status(execution_token, iteration_id, widget_id):
    try:
        request_data = json.loads(get_clean_postdata(request))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        notebook = ProjectNotebook.query.filter_by(access_token=execution_token).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
        if iteration is None:
            return json_response({"error": "item not found"}, 404)

        update_widget_execution_status(request_data, notebook, widget_id, iteration)

        return json_response({"success": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


def update_widget_execution_status(request_data, notebook, widget_id, iteration=False):
    execution = notebook
    notification_type = "notebook_widget_status"
    if iteration:
        execution = iteration
        notification_type = "iteration_widget_status"

    if execution.exec_logs and execution.exec_logs is not None:
        execution_logs = json.loads(execution.exec_logs)
    else:
        execution_logs = {}

    execution_logs[widget_id] = {
        "logs": request_data["logs"],
        "status": request_data["status"],
        "timetaken": request_data["timetaken"],
        "updated_at": request_data["updated_at"],
    }

    execution.exec_logs = json.dumps(execution_logs)
    db.session.commit()

    socketio.emit(
        notification_type,
        {
            "widget_id": widget_id,
            "logs": request_data["logs"],
            "status": request_data["status"],
            "timetaken": request_data["timetaken"],
            "updated_at": request_data["updated_at"],
        },
        namespace="/codx_platform_notification",
    )

    if request_data["execute_notebook"] == "yes" and request_data["status"] == "FINISHED":
        execution_logs = get_nested_children(execution, widget_id, notification_type)
        execution.exec_logs = json.dumps(execution_logs)
        db.session.commit()


def get_nested_children(notebook, input_widget_id, notification_type):
    exec_env = ExecutionEnvAzureDatabricks()

    nb_blueprint = json.loads(notebook.blueprint)
    nodes = nb_blueprint["nodes"]
    links = nb_blueprint["links"]
    exec_logs = json.loads(notebook.exec_logs)

    target_node_ids = []

    for link_item in links:
        if link_item["source"] == input_widget_id:
            target_node_ids.append(link_item["target"])

    for node_item in nodes:
        widget_id = node_item["id"]
        inputs_complete = True

        # Check for node_id in target_node_ids
        if widget_id in target_node_ids:
            for link_item in links:
                # Check if all input nodes are FINISHED
                if link_item["target"] == widget_id and (
                    link_item["source"] not in exec_logs or exec_logs[link_item["source"]]["status"] != "FINISHED"
                ):
                    inputs_complete = False
                    break

            if inputs_complete:
                # Queue the node
                exec_env.submit_job(
                    {
                        "name": f"exec-task-execution-{notebook.id}-widget-{widget_id}",
                        "cluster_id": notebook.execution_environment.cluster_id,
                        "exec_filepath": f"dbfs:/mnt/{app.config['EXECUTION_FOLDER_DATABRICKS_MOUNT']}/executions/execution-{notebook.id}/py-exec-{widget_id}.py",
                        "job_id": False,
                        "notebook_execute": True,
                    }
                )

                exec_timestamp = datetime.now().strftime("%d %b, %Y %H:%M:%S")

                exec_logs[widget_id] = {
                    "logs": None,
                    "status": "QUEUED",
                    "timetaken": None,
                    "updated_at": exec_timestamp,
                }

                socketio.emit(
                    "widget_status",
                    {
                        "widget_id": widget_id,
                        "logs": None,
                        "status": "QUEUED",
                        "timetaken": None,
                        "updated_at": exec_timestamp,
                    },
                    namespace="/codx_platform_notification",
                )

    return exec_logs


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/execution-status",
    methods=["GET"],
)
@login_required
@app_required
def get_notebook_execution_status(notebook_id, widget_id):
    try:
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if execution is None:
            return json_response({"error": "item not found"}, 404)

        if execution.exec_logs:
            exec_logs = json.loads(execution.logs)
            if widget_id in exec_logs:
                return json_response({"status": "success", "data": exec_logs[widget_id]})

        return json_response({"status": "success", "data": False})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/widget/<string:widget_id>/execution-status",
    methods=["GET"],
)
@login_required
@app_required
def get_iteration_execution_status(notebook_id, iteration_id, widget_id):
    try:
        execution = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
        if execution is None:
            return json_response({"error": "item not found"}, 404)

        if execution.exec_logs:
            exec_logs = json.loads(execution.logs)
            if widget_id in exec_logs:
                return json_response({"status": "success", "data": exec_logs[widget_id]})

        return json_response({"status": "success", "data": False})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/outputs",
    methods=["GET"],
)
@login_required
@app_required
def get_notebook_widget_outputs(notebook_id, widget_id):
    try:
        datasource_fs = DatasourceFileStorage("azure_blob_storage")

        file_list = datasource_fs.get_azureblobstorage_list(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            f"executions/execution-{notebook_id}/output-{widget_id}-",
        )

        response_filelist = []

        for file_list_item in file_list:
            response_filelist.append(file_list_item.name)

        return json_response({"status": "success", "list": sanitize_content(response_filelist)})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/widget/<string:widget_id>/outputs",
    methods=["GET"],
)
@login_required
@app_required
def get_iteration_widget_outputs(notebook_id, iteration_id, widget_id):
    try:
        datasource_fs = DatasourceFileStorage("azure_blob_storage")

        file_list = datasource_fs.get_azureblobstorage_list(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            f"executions/notebook-{notebook_id}/iteration-{iteration_id}/output-{widget_id}-",
        )

        response_filelist = []

        for file_list_item in file_list:
            response_filelist.append(file_list_item.name)

        return json_response({"status": "success", "list": sanitize_content(response_filelist)})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/outputs",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_notebook_widget_output(notebook_id, widget_id):
    try:
        request_data = get_clean_postdata(request)
        output_blobpath = request_data["output_blobpath"]
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        output_blobpath_items = output_blobpath.split("/")
        blob_filename = output_blobpath_items[len(output_blobpath_items) - 1]

        output_blobfile_items = blob_filename.split(".")
        blob_filesuffix = output_blobfile_items[len(output_blobfile_items) - 1]

        local_filepath = f"/tmp/{blob_filename}"

        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.copy_blob(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            output_blobpath,
            local_filepath,
        )

        if blob_filesuffix == "csv":
            df = pd.read_csv(local_filepath, low_memory=False)
            os.remove(local_filepath)
            return json_response(
                sanitize_content(
                    {
                        "status": "success",
                        "output": {
                            "multiple_tables": False,
                            "table_headers": df.columns.values.tolist(),
                            "table_data": df.values.tolist(),
                            "show_searchbar": False,
                        },
                    }
                )
            )
        elif blob_filesuffix == "json":
            with open(local_filepath) as local_file:
                output_dict = json.loads(local_file.read())
                if not isinstance(output_dict, dict):
                    output_dict = json.loads(output_dict)
            local_file.close()
            os.remove(local_filepath)
            return json_response({"status": "success", "output": sanitize_content(output_dict)})
        else:
            return json_response({"status": "success", "output": False})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/widget/<string:widget_id>/outputs",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_iteration_widget_output(notebook_id, iteration_id, widget_id):
    try:
        request_data = get_clean_postdata(request)
        output_blobpath = request_data["output_blobpath"]
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        output_blobpath_items = output_blobpath.split("/")
        blob_filename = output_blobpath_items[len(output_blobpath_items) - 1]

        output_blobfile_items = blob_filename.split(".")
        blob_filesuffix = output_blobfile_items[len(output_blobfile_items) - 1]

        local_filepath = f"/tmp/{blob_filename}"

        datasource_fs = DatasourceFileStorage("azure_blob_storage")
        datasource_fs.copy_blob(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            output_blobpath,
            local_filepath,
        )

        if blob_filesuffix == "csv":
            df = pd.read_csv(local_filepath, low_memory=False)
            os.remove(local_filepath)
            return json_response(
                {
                    "status": "success",
                    "output": {
                        "multiple_tables": False,
                        "table_headers": df.columns.values.tolist(),
                        "table_data": df.values.tolist(),
                        "show_searchbar": False,
                    },
                }
            )
        elif blob_filesuffix == "json":
            with open(local_filepath) as local_file:
                output_dict = json.loads(local_file.read())
                if not isinstance(output_dict, dict):
                    output_dict = json.loads(output_dict)
            local_file.close()
            os.remove(local_filepath)
            return json_response({"status": "success", "output": output_dict})
        else:
            return json_response({"status": "success", "output": False})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 404)


# @bp.route("/codex-api/project-notebooks/<int:notebook_id>/iterations", methods=["GET"])
# @login_required
# @app_required
# def get_iteration(notebook_id):
#   try:
#     iterations = ProjectNotebookConfig.query.filter_by(
#         project_nb_id=notebook_id).order_by(desc(ProjectNotebook.created_at))
#     notebook_items = []
#     for notebook in notebooks:
#         try:
#             latest_notebook_params = ProjectNotebookConfig.query.filter_by(
#                 project_nb_id=notebook.id).order_by(desc(ProjectNotebookConfig.created_at)).first()
#             # latest_notebook_config_id = latest_notebook_params.id
#             # latest_notebook_config_params = json.loads(latest_notebook_params.config_params)
#             latest_config_submitted_at = latest_notebook_params.created_at.strftime(
#                 "%d %B, %Y %H:%M")
#         except Exception as error_msg:
#             ExceptionLogger(error_msg)
#             latest_config_submitted_at = '--'
#         # latest_notebook_config_id = False
#         # latest_notebook_config_params = False

#         notebook_items.append({
#             "id": notebook.id,
#             "created_by": f'{notebook.created_by_user.first_name} {notebook.created_by_user.last_name}' if notebook.created_by else '--',
#             "created_at": notebook.created_at.strftime("%d %B, %Y %H:%M"),
#             "latest_config_submitted_at": latest_config_submitted_at,
#             "name": notebook.name,
#             "exec_env_id": notebook.exec_env_id
#             # "latest_notebook_config_id": latest_notebook_config_id,
#             # "params": latest_notebook_config_params
#         })

#     return json_response_count(notebook_items, 200, notebooks.count())


#     return json_response({'status': 'success', 'iteration_id': iteration.id})
#   except Exception as error_msg:
#     ExceptionLogger(error_msg)
#     return json_response({'error': str(error_msg)}, 422)


@bp.route("/codex-api/project-notebooks/<int:notebook_id>/iterations", methods=["PUT", "POST"])
@login_required
@app_required
def create_iteration(notebook_id):
    try:
        request_data = get_clean_postdata(request)

        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()

        iteration = ProjectNotebookConfig(
            project_nb_id=notebook_id,
            config_params=request_data["config_params"]
            if request_data["config_params"] and request_data["config_params"] != ""
            else None,
            config_code=request_data["config_code"]
            if request_data["config_code"] and request_data["config_code"] != ""
            else None,
            config_df=json.dumps(request_data["config_df"])
            if request_data["config_df"] and request_data["config_df"] != ""
            else None,
            blueprint=notebook.blueprint,
            name=request_data["name"],
        )
        db.session.add(iteration)
        db.session.commit()

        save_node_scripts(notebook, iteration)

        return json_response({"status": "success", "iteration_id": iteration.id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 422)


@bp.route(
    "/codex-api/project-notebooks/<int:notebook_id>/iterations/<int:iteration_id>",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def update_iteration(notebook_id, iteration_id):
    try:
        request_data = get_clean_postdata(request)

        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        iteration = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()

        iteration.project_nb_id = notebook_id
        iteration.config_params = (
            request_data["config_params"]
            if request_data["config_params"] and request_data["config_params"] != ""
            else None
        )
        iteration.config_code = (
            request_data["config_code"] if request_data["config_code"] and request_data["config_code"] != "" else None
        )
        iteration.config_df = (
            json.dumps(request_data["config_df"])
            if request_data["config_df"] and request_data["config_df"] != ""
            else None
        )
        iteration.name = request_data["name"]

        db.session.commit()

        save_node_scripts(notebook, iteration)

        return json_response({"status": "success", "iteration_id": iteration.id})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 422)


def save_node_scripts(notebook, iteration=False):
    execution_folder = f"notebook-{notebook.id}"
    blueprint = json.loads(notebook.blueprint)
    # exeuction_config = False

    if iteration:
        execution_folder = f"notebook-{notebook.id}/iteration-{iteration.id}"
        blueprint = json.loads(iteration.blueprint)
        execution_config = {
            "params": json.loads(iteration.config_params) if iteration.config_params else False,
            "code": iteration.config_code,
            "df": json.loads(iteration.config_df) if iteration.config_df else False,
        }

    if blueprint and blueprint["nodes"]:
        for node_item in blueprint["nodes"]:
            if node_item["extras"] and node_item["extras"]["widget_code"] and node_item["extras"]["widget_code"] != "":
                exec_filecontent = ""

                in_port = None
                input_widgets = []
                for node_port in node_item["ports"]:
                    if node_port["in"]:
                        in_port = node_port

                if in_port and "links" in in_port:
                    for in_port_link in in_port["links"]:
                        input_widget = find_sourcenodename_fromlink(in_port_link, blueprint)
                        if input_widget:
                            input_widgets.append(input_widget)

                if len(input_widgets) > 0:
                    exec_filecontent += "# BEGIN WIDGET INPUT VARS CODE (system generated, dont edit)\n"

                    for input_widget_item in input_widgets:
                        exec_filecontent += f"#   BEGIN INPUT WIDGET: {input_widget_item['name']}\n"

                        if input_widget_item["output_vars"] and isinstance(input_widget_item["output_vars"], list):
                            for output_var_item in input_widget_item["output_vars"]:
                                exec_filecontent += f"#   getting input widget var: {output_var_item}\n"
                                exec_filecontent += f"{get_inputvar_blobpath(notebook.id, input_widget_item['id'], output_var_item, iteration.id if iteration else False)}\n"
                        elif input_widget_item["output_vars"]:
                            exec_filecontent += f"#   getting input widget var: {input_widget_item['output_vars']}\n"
                            exec_filecontent += f"{get_inputvar_blobpath(notebook.id, input_widget_item['id'], input_widget_item['output_vars'], iteration.id if iteration else False)}\n"

                        exec_filecontent += f"#   END INPUT WIDGET: {input_widget_item['name']}\n\n"

                    exec_filecontent += "# END WIDGET INPUT VARS CODE\n"
                    exec_filecontent += "# ---------------------------\n\n"

                exec_filecontent += node_item["extras"]["widget_code"]
                exec_filecontent += "# --------------------\n\n"

                if node_item["extras"]["widget_output_vars"] and node_item["extras"]["widget_output_vars"] != "":
                    # Adding extra code at the end of the file to save output vars from the execution into Blob Storage
                    output_vars = node_item["extras"]["widget_output_vars"].split(",")
                    exec_filecontent += "# BEGIN WIDGET OUTPUT VARS CODE (system generated, dont edit)\n"
                    exec_filecontent += (
                        "from codex_widget_factory.publish.save_to_storage import publish as blob_publish\n"
                    )
                    exec_filecontent += (
                        "from codex_widget_factory.publish.utils_publish import infer_file_type_from_var\n\n"
                    )
                    for output_var in output_vars:
                        output_var = output_var.replace(" ", "")
                        output_filename = f"output-{node_item['id']}-{output_var}"
                        output_filepath = f"executions/{execution_folder}/{output_filename}"

                        exec_filecontent += f"# VAR: {output_var}\n"
                        exec_filecontent += f"output_filepath_suffix = infer_file_type_from_var({output_var})\n"
                        exec_filecontent += f"blob_publish(data={output_var}, path='{app.config['EXECUTION_FOLDER_PATH'] + '/' + output_filepath + '.'}' + output_filepath_suffix, method='using_connection_uri', connection_uri='{app.config['AZURE_STORAGE_CONNECTION_STRING']}', index=True)\n"
                    exec_filecontent += "# END WIDGET OUTPUT VARS CODE\n\n"
                    exec_filecontent += "# ---------------------------\n\n"
            else:
                exec_filecontent = "# No executable code found"

            status_url = f"{app.config['BACKEND_APP_URI']}/projects-notebooks/{notebook.access_token}/widget/{node_item['id']}/update-execution-status"
            if iteration:
                status_url = f"{app.config['BACKEND_APP_URI']}/projects-notebooks/{notebook.access_token}/iterations/{iteration.id}/widget/{node_item['id']}/update-execution-status"

            indent_exec_filecontent = "  " + exec_filecontent.replace("\n", "\n  ")

            final_exec_filecontent = "import sys\n"
            final_exec_filecontent += "from datetime import datetime\n"
            final_exec_filecontent += "from datetime import timedelta\n"
            final_exec_filecontent += "from time import time\n"
            final_exec_filecontent += "execute_notebook = sys.argv[1]\n"
            final_exec_filecontent += "start_time = time()\n\n"

            if execution_config:
                if execution_config["params"]:
                    final_exec_filecontent += f'config_params = {execution_config["params"]}\n\n'
                if execution_config["code"]:
                    final_exec_filecontent += f'{execution_config["code"]}\n\n'
                if execution_config["df"]:
                    final_exec_filecontent += "from codex_widget_factory.utils import get_config_df\n\n"
                    final_exec_filecontent += f'{execution_config["code"]}\n\n'

            final_exec_filecontent += f"execution_config = {execution_config}\n\n"

            final_exec_filecontent += "from codex_widget_factory.utils import update_widget_execution_status\n"
            final_exec_filecontent += f'update_widget_execution_status("{status_url}", "IN-PROGRESS", None, datetime.now().strftime("%d %b, %Y %H:%M:%S"))\n\n'

            final_exec_filecontent += "from io import StringIO\n\n"
            final_exec_filecontent += "old_stdout = sys.stdout\n"
            final_exec_filecontent += "io_result = StringIO()\n"
            final_exec_filecontent += "sys.stdout = io_result\n\n\n"
            final_exec_filecontent += "exec_success = True\n"
            final_exec_filecontent += "try:\n"
            final_exec_filecontent += indent_exec_filecontent[: len(indent_exec_filecontent) - 2]
            final_exec_filecontent += "except Exception as error_msg:\n"
            final_exec_filecontent += "  exec_success = False\n"
            final_exec_filecontent += '  print("FAILURE: " + str(error_msg))\n\n'
            final_exec_filecontent += "\n\nsys.stdout = old_stdout\n"
            final_exec_filecontent += "response_logs = io_result.getvalue()\n"
            final_exec_filecontent += "print(response_logs)\n\n"

            final_exec_filecontent += "end_time = time()\n"
            final_exec_filecontent += "exec_timetaken = str(timedelta(seconds=round(end_time-start_time)))\n"
            final_exec_filecontent += 'response_status = "FINISHED"\n'
            final_exec_filecontent += "if not exec_success:\n"
            final_exec_filecontent += '  response_status = "FAILED"\n'
            final_exec_filecontent += 'print("Status: " + exec_timetaken + " seconds")\n'
            final_exec_filecontent += 'print("Timetaken: " + exec_timetaken + " seconds")\n'

            final_exec_filecontent += f'update_widget_execution_status("{status_url}", response_status, response_logs, datetime.now().strftime("%d %b, %Y %H:%M:%S"), exec_timetaken, execute_notebook)\n\n'

            exec_filename = f"py-exec-{node_item['id']}.py"
            exec_filepath = f"executions/{execution_folder}/{exec_filename}"

            exec_file_handle = open(exec_filename, "w")
            exec_file_handle.write(final_exec_filecontent)
            exec_file_handle.close()

            blob_datasource = DatasourceFileStorage("azure_blob_storage")
            blob_datasource.upload_blob(
                app.config["AZURE_STORAGE_CONNECTION_STRING"],
                app.config["EXECUTION_FOLDER_PATH"],
                exec_filepath,
                exec_filename,
            )

            os.remove(exec_filename)

    pass
