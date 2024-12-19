#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import math
import os
from datetime import datetime

import pandas as pd
from api.codex_models.code_utils import get_default_code
from api.codex_models.projects import BlueprintNotebook
from api.codex_models.tinyurl import get_blob_tinyurl
from api.connectors.datasource import DatasourceFileStorage
from api.connectors.execution_env import ExecutionEnvAzureDatabricks
from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.helpers import get_clean_postdata
from api.main import socketio
from api.middlewares import app_publish_required, app_required, login_required
from api.models import (
    Project,
    ProjectNotebook,
    ProjectNotebookConfig,
    ProjectNotebookConfigTag,
    ProjectNotebookTriggered,
    db,
)
from azure.storage.blob import BlockBlobService
from azure.storage.blob.models import ContentSettings
from flask import Blueprint
from flask import current_app as app
from flask import g, json, request
from sqlalchemy import asc, desc
from sqlalchemy.sql import func

bp = Blueprint("ProjectNotebooks", __name__)


@bp.route("/codex-api/project-notebooks/<int:project_id>", methods=["GET"])
@login_required
@app_required
def instance_list(project_id):
    """Returns the notebook info for given project_id

    Args:
        project_id ([type]): [description]

    Returns:
        json: {id}
    """
    notebooks = ProjectNotebook.query.filter_by(project_id=project_id).order_by(desc(ProjectNotebook.created_at))
    notebook_items = []
    for notebook in notebooks:
        try:
            latest_notebook_params = (
                ProjectNotebookConfig.query.filter_by(project_nb_id=notebook.id)
                .order_by(desc(ProjectNotebookConfig.created_at))
                .first()
            )
            # latest_notebook_config_id = latest_notebook_params.id
            # latest_notebook_config_params = json.loads(latest_notebook_params.config_params)
            latest_config_submitted_at = latest_notebook_params.created_at.strftime("%d %B, %Y %H:%M")
        except Exception as error_msg:
            ExceptionLogger(error_msg)
            latest_config_submitted_at = "--"
        # latest_notebook_config_id = False
        # latest_notebook_config_params = False

        notebook_items.append(
            {
                "id": notebook.id,
                "created_by": f"{notebook.created_by_user.first_name} {notebook.created_by_user.last_name}"
                if notebook.created_by
                else "--",
                "created_at": notebook.created_at.strftime("%d %B, %Y %H:%M"),
                "updated_at": notebook.updated_at.strftime("%d %B, %Y %H:%M") if notebook.updated_at else "--",
                "latest_config_submitted_at": latest_config_submitted_at,
                "name": notebook.name,
                "exec_env_id": notebook.exec_env_id
                # "latest_notebook_config_id": latest_notebook_config_id,
                # "params": latest_notebook_config_params
            }
        )

    return json_response_count(notebook_items, 200, notebooks.count())


@bp.route("/codex-api/project-notebooks/<int:project_id>", methods=["POST"])
@login_required
@app_required
def create_notebook(project_id):
    try:
        request_data = get_clean_postdata(request)

        execution = ProjectNotebook(
            project_id=request_data["project_id"],
            blueprint=None,
            created_by=g.user.id,
            name=request_data["name"],
            exec_env_id=request_data["exec_env_id"],
        )
        db.session.add(execution)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error creating project notebook"}, 422)

    return json_response({"id": execution.id, "name": execution.name})


@bp.route(
    "/codex-api/project-notebooks/<int:project_id>/<int:notebook_id>",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def update(project_id, notebook_id):
    try:
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if execution is None:
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
        execution.project_id = project_id
        execution.name = request_data["name"]
        execution.exec_env_id = request_data["exec_env_id"]
        execution.updated_by = g.user.id
        db.session.commit()

        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating project notebook"}, 500)


@bp.route("/codex-api/project-notebooks/<int:notebook_id>", methods=["DELETE"])
@login_required
@app_required
def delete(notebook_id):
    try:
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        execution.deleted_at = func.now()
        execution.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting project notebook"}, 500)


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
        return json_response({"error": "Error in operation"}, 404)


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


def get_inputvar_blobpath(notebook_id, widget_id, var_name):
    try:
        datasource_fs = DatasourceFileStorage("azure_blob_storage")

        file_list = datasource_fs.get_azureblobstorage_list(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            f"executions/execution-{notebook_id}/output-{widget_id}-{var_name}.",
        )

        response_code = "from codex_widget_factory.publish.utils_publish import get_from_blob\n\n"
        # response_filelist = []
        for file_list_item in file_list:
            response_code += f"{var_name} = get_from_blob(connection_uri='{app.config['AZURE_STORAGE_CONNECTION_STRING']}', container_name='{app.config['EXECUTION_FOLDER_PATH']}', filepath='{file_list_item.name}')\n"

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
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if execution is None:
            return json_response({"error": "item not found"}, 404)

        execution.blueprint = json.dumps(request_data["blueprint"])
        db.session.commit()

        if request_data["blueprint"] and request_data["blueprint"]["nodes"]:
            for node_item in request_data["blueprint"]["nodes"]:
                if (
                    node_item["extras"]
                    and node_item["extras"]["widget_code"]
                    and node_item["extras"]["widget_code"] != ""
                ):
                    exec_filecontent = ""

                    in_port = None
                    input_widgets = []
                    for node_port in node_item["ports"]:
                        if node_port["in"]:
                            in_port = node_port

                    if in_port and "links" in in_port:
                        for in_port_link in in_port["links"]:
                            input_widget = find_sourcenodename_fromlink(in_port_link, request_data["blueprint"])
                            if input_widget:
                                input_widgets.append(input_widget)

                    if len(input_widgets) > 0:
                        exec_filecontent += "# BEGIN WIDGET INPUT VARS CODE (system generated, dont edit)\n"

                        for input_widget_item in input_widgets:
                            exec_filecontent += f"#   BEGIN INPUT WIDGET: {input_widget_item['name']}\n"

                            if input_widget_item["output_vars"] and isinstance(input_widget_item["output_vars"], list):
                                for output_var_item in input_widget_item["output_vars"]:
                                    exec_filecontent += f"#   getting input widget var: {output_var_item}\n"
                                    exec_filecontent += f"{get_inputvar_blobpath(notebook_id, input_widget_item['id'], output_var_item)}\n"
                            elif input_widget_item["output_vars"]:
                                exec_filecontent += (
                                    f"#   getting input widget var: {input_widget_item['output_vars']}\n"
                                )
                                exec_filecontent += f"{get_inputvar_blobpath(notebook_id, input_widget_item['id'], input_widget_item['output_vars'])}\n"

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
                            output_filepath = f"executions/execution-{notebook_id}/{output_filename}"

                            exec_filecontent += f"# VAR: {output_var}\n"
                            exec_filecontent += f"output_filepath_suffix = infer_file_type_from_var({output_var})\n"
                            exec_filecontent += f"blob_publish(data={output_var}, path='{app.config['EXECUTION_FOLDER_PATH'] + '/' + output_filepath + '.'}' + output_filepath_suffix, method='using_connection_uri', connection_uri='{app.config['AZURE_STORAGE_CONNECTION_STRING']}', index=True)\n"
                        exec_filecontent += "# END WIDGET OUTPUT VARS CODE\n\n"
                        exec_filecontent += "# ---------------------------\n\n"
                else:
                    exec_filecontent = "# No executable code found"

                status_url = f"{app.config['BACKEND_APP_URI']}/projects-notebooks/{execution.access_token}/widget/{node_item['id']}/update-execution-status"

                indent_exec_filecontent = "  " + exec_filecontent.replace("\n", "\n  ")

                final_exec_filecontent = "import sys\n"
                final_exec_filecontent += "from datetime import datetime\n"
                final_exec_filecontent += "from datetime import timedelta\n"
                final_exec_filecontent += "from time import time\n"
                final_exec_filecontent += "execute_notebook = sys.argv[1]\n"
                final_exec_filecontent += "print(execute_notebook)\n"
                final_exec_filecontent += "start_time = time()\n\n"

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
                exec_filepath = f"executions/execution-{notebook_id}/{exec_filename}"

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
        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/execute",
    methods=["GET"],
)
@login_required
@app_required
def execute_widget(notebook_id, widget_id):
    try:
        execution = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if execution is None:
            return json_response({"error": "item not found"}, 404)

        exec_env = ExecutionEnvAzureDatabricks()
        exec_env.submit_job(
            {
                "name": f"exec-task-execution-{execution.id}-widget-{widget_id}",
                "cluster_id": execution.execution_environment.cluster_id,
                "exec_filepath": f"dbfs:/mnt/{app.config['EXECUTION_FOLDER_DATABRICKS_MOUNT']}/executions/execution-{execution.id}/py-exec-{widget_id}.py",
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
        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error executing widget"}, 404)


@bp.route("/codex-api/project-notebooks/<int:notebook_id>/execute", methods=["POST"])
@login_required
@app_required
def execute_notebook(notebook_id):
    try:
        notebook = ProjectNotebook.query.filter_by(id=notebook_id).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        exec_blueprint = json.loads(notebook.blueprint)
        execution_logs = {}

        exec_env = ExecutionEnvAzureDatabricks()

        for node_item in exec_blueprint["nodes"]:
            widget_id = node_item["id"]
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
                        "name": f"exec-task-execution-{notebook.id}-widget-{widget_id}",
                        "cluster_id": notebook.execution_environment.cluster_id,
                        "exec_filepath": f"dbfs:/mnt/{app.config['EXECUTION_FOLDER_DATABRICKS_MOUNT']}/executions/execution-{notebook.id}/py-exec-{widget_id}.py",
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

        notebook.exec_logs = json.dumps(execution_logs)
        db.session.commit()

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error executing the notebook"}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<string:execution_token>/widget/<string:widget_id>/update-execution-status",
    methods=["PUT", "POST"],
)
def update_execution_status(execution_token, widget_id):
    try:
        request_data = json.loads(get_clean_postdata(request))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        notebook = ProjectNotebook.query.filter_by(access_token=execution_token).first()
        if notebook is None:
            return json_response({"error": "item not found"}, 404)

        if notebook.exec_logs and notebook.exec_logs is not None:
            execution_logs = json.loads(notebook.exec_logs)
        else:
            execution_logs = {}

        execution_logs[widget_id] = {
            "logs": request_data["logs"],
            "status": request_data["status"],
            "timetaken": request_data["timetaken"],
            "updated_at": request_data["updated_at"],
        }

        notebook.exec_logs = json.dumps(execution_logs)
        db.session.commit()

        socketio.emit(
            "widget_status",
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
            execution_logs = get_nested_children(notebook, widget_id)
            notebook.exec_logs = json.dumps(execution_logs)
            db.session.commit()

        return json_response({"success": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 404)


def get_nested_children(notebook, input_widget_id):
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
def get_execution_status(notebook_id, widget_id):
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
        return json_response({"error": "Error in fetching execution status"}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/outputs",
    methods=["GET"],
)
@login_required
@app_required
def get_widget_outputs(notebook_id, widget_id):
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

        return json_response({"status": "success", "list": response_filelist})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching outputs"}, 404)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/<string:widget_id>/outputs",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_widget_output(notebook_id, widget_id):
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
        return json_response({"error": "Error in operation"}, 404)


@bp.route("/codex-api/project-notebooks/get-tags/<int:project_nb_id>", methods=["GET"])
@login_required
@app_required
def get_tags(project_nb_id):
    """Returns list of all project notebook tag names for given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {[list of tag names], 200}
    """
    config_tags = (
        ProjectNotebookConfigTag.query.with_entities(ProjectNotebookConfigTag.tag_name)
        .join(ProjectNotebookConfig)
        .filter(ProjectNotebookConfig.project_nb_id == project_nb_id)
        .distinct()
    )

    return_response = []

    for config_tag in config_tags:
        return_response.append(config_tag.tag_name)

    return json_response(return_response, 200)


@bp.route(
    "/codex-api/project-notebooks/get-filter-categories/<int:project_nb_id>",
    methods=["GET"],
)
@login_required
@app_required
def get_filter_categories(project_nb_id):
    """Returns a list of tag names and tag values as categories and category values for given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {categories,category_values}
    """
    config_tags = ProjectNotebookConfigTag.query.join(ProjectNotebookConfig).filter(
        ProjectNotebookConfig.project_nb_id == project_nb_id
    )
    # return_response = []

    categories = []
    category_values = {}

    for config_tag in config_tags:
        if config_tag.tag_name not in categories:
            categories.append(config_tag.tag_name)

        if config_tag.tag_name not in category_values:
            category_values[config_tag.tag_name] = []

        if config_tag.tag_value not in category_values[config_tag.tag_name]:
            category_values[config_tag.tag_name].append(config_tag.tag_value)

    return json_response({"categories": categories, "category_values": category_values}, 200)


@bp.route(
    "/codex-api/project-notebooks/get-results/<int:project_nb_config_id>",
    methods=["GET"],
)
@login_required
@app_required
def get_results(project_nb_config_id):
    """Returns the notebook configuration for the given project_nb_config_id

    Args:
        project_nb_config_id ([type]): [description]

    Returns:
        json: {results,status}
    """
    try:
        notebook_config = ProjectNotebookConfig.query.filter_by(id=project_nb_config_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "iteration not found"}, 500)

    try:
        return json_response(
            json.loads(notebook_config.results) if notebook_config and notebook_config.results else False,
            200,
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "iteration results error"}, 500)


@bp.route(
    "/codex-api/project-notebooks/get-result-options/<int:project_nb_id>",
    methods=["GET"],
)
@login_required
@app_required
def get_result_options(project_nb_id):
    """Sets and returns the result options of graphs, metrics, traces, filters and options for given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: ({graphs,metrics,traces,filters,actions},200)
    """

    response_graph_options = {}
    response_metric_options = {}
    # response_table_options = {}
    # response_simulator_options = {}
    # response_insight_options = {}
    response_trace_options = {}
    response_filter_options = {}
    response_action_options = {}
    response_responsibility_options = []
    notebook_configs = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id).order_by(
        desc(ProjectNotebookConfig.created_at)
    )
    for notebook_config in notebook_configs:
        results = json.loads(notebook_config.results) if notebook_config.results else False

        if results:
            for result in results:
                try:
                    if (
                        result["type"].strip() == "config"
                        and result["name"].strip() == "user_mgmt"
                        and result["component"].strip() == "responsibilities"
                        and "options" in result
                    ):
                        response_responsibility_options = result["options"]
                    else:
                        if not result["type"].strip() in response_graph_options.keys():
                            response_graph_options[result["type"].strip()] = {
                                result["name"].strip(): {result["component"].strip(): get_options("graph", result)}
                            }
                            response_trace_options[result["type"].strip()] = {
                                result["name"].strip(): {result["component"].strip(): get_graph_traces(result)}
                            }
                        elif not result["name"].strip() in response_graph_options[result["type"].strip()].keys():
                            response_graph_options[result["type"].strip()][result["name"].strip()] = {
                                result["component"].strip(): get_options("graph", result)
                            }
                            response_trace_options[result["type"].strip()][result["name"].strip()] = {
                                result["component"].strip(): get_graph_traces(result)
                            }
                        elif (
                            not result["component"].strip()
                            in response_graph_options[result["type"].strip()][result["name"].strip()].keys()
                        ):
                            response_graph_options[result["type"].strip()][result["name"].strip()][
                                result["component"].strip()
                            ] = get_options("graph", result)
                            response_trace_options[result["type"].strip()][result["name"].strip()][
                                result["component"].strip()
                            ] = get_graph_traces(result)

                        if not result["type"].strip() in response_metric_options.keys():
                            response_metric_options[result["type"].strip()] = {
                                result["name"].strip(): {result["component"].strip(): get_options("metric", result)}
                            }
                        elif not result["name"].strip() in response_metric_options[result["type"].strip()].keys():
                            response_metric_options[result["type"].strip()][result["name"].strip()] = {
                                result["component"].strip(): get_options("metric", result)
                            }
                        elif (
                            not result["component"].strip()
                            in response_metric_options[result["type"].strip()][result["name"].strip()].keys()
                        ):
                            response_metric_options[result["type"].strip()][result["name"].strip()][
                                result["component"].strip()
                            ] = get_options("metric", result)

                        if not result["type"].strip() in response_filter_options.keys():
                            response_filter_options[result["type"].strip()] = {
                                result["name"].strip(): {result["component"].strip(): get_options("filter", result)}
                            }
                        elif not result["name"].strip() in response_filter_options[result["type"].strip()].keys():
                            response_filter_options[result["type"].strip()][result["name"].strip()] = {
                                result["component"].strip(): get_options("filter", result)
                            }
                        elif (
                            not result["component"].strip()
                            in response_filter_options[result["type"].strip()][result["name"].strip()].keys()
                        ):
                            response_filter_options[result["type"].strip()][result["name"].strip()][
                                result["component"].strip()
                            ] = get_options("filter", result)

                        if not result["type"].strip() in response_action_options.keys():
                            response_action_options[result["type"].strip()] = {
                                result["name"].strip(): {result["component"].strip(): get_options("action", result)}
                            }
                        elif not result["name"].strip() in response_action_options[result["type"].strip()].keys():
                            response_action_options[result["type"].strip()][result["name"].strip()] = {
                                result["component"].strip(): get_options("action", result)
                            }
                        elif (
                            not result["component"].strip()
                            in response_action_options[result["type"].strip()][result["name"].strip()].keys()
                        ):
                            response_action_options[result["type"].strip()][result["name"].strip()][
                                result["component"].strip()
                            ] = get_options("action", result)
                except Exception as error_msg:
                    ExceptionLogger(error_msg)
                    print(
                        "Results for this particular submission has an error: "
                        + result["name"]
                        + " -- "
                        + result["type"]
                        + str(error_msg)
                    )
    return json_response(
        {
            "graphs": response_graph_options,
            "metrics": response_metric_options,
            "traces": response_trace_options,
            "filters": response_filter_options,
            "actions": response_action_options,
            "responsibilities": response_responsibility_options,
        },
        200,
    )


@bp.route(
    "/codex-api/project-notebooks/get-pipeline-options/<int:project_nb_id>",
    methods=["GET"],
)
@login_required
@app_required
def get_pipeline_options(project_nb_id):
    """Gives the count of pipelines for the given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {pipelines,200}
    """

    response_pipeline_options = {}
    current_order = 0

    notebook_configs = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id).order_by(
        desc(ProjectNotebookConfig.created_at)
    )
    for notebook_config in notebook_configs:
        results = json.loads(notebook_config.results) if notebook_config.results else False

        if results:
            for result in results:
                if "pipeline" in result and result["pipeline"]:
                    if result["pipeline"] in response_pipeline_options:
                        response_pipeline_options[result["pipeline"]]["count"] = (
                            response_pipeline_options[result["pipeline"]]["count"] + 1
                        )
                    else:
                        response_pipeline_options[result["pipeline"]] = {
                            "count": 1,
                            "order": current_order,
                        }
                        current_order = current_order + 1

    return json_response({"pipelines": response_pipeline_options}, 200)


@bp.route(
    "/codex-api/project-notebooks/download-jupyter-config/<int:project_nb_id>",
    methods=["GET"],
)
@login_required
@app_required
def download_config_jupyter(project_nb_id):
    """Fetches the blueprint for given project_nb_id and stores the jupyter notebook file in blob storage finally returning
    the tinyurl for jupyter file stored in blob

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {status,url}
    """
    try:
        project_nb_config = (
            ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id)
            .order_by(desc(ProjectNotebookConfig.created_at))
            .first()
        )
        if not project_nb_config:
            project_nb_config = False

        project_nb = ProjectNotebook.query.filter_by(id=project_nb_id).first()
        project = Project.query.filter_by(id=project_nb.project_id).first()

        blueprint_nb = BlueprintNotebook(project, project_nb, project_nb_config)

        jupyter_filename = blueprint_nb.get_nb_config_code()

        if jupyter_filename:
            block_blob_service = BlockBlobService(connection_string=app.config["DATA_AZURE_CONNECTION_STRING"])
            block_blob_service.create_blob_from_path(
                container_name=f"{app.config['DATA_FOLDER_PATH']}",
                blob_name=jupyter_filename,
                file_path=jupyter_filename,
                content_settings=ContentSettings(
                    content_type="application/x-ipynb+json",
                    content_disposition=f'attachment;filename="{jupyter_filename}"',
                ),
            )

            os.remove(jupyter_filename)

            tiny_url = get_blob_tinyurl(jupyter_filename)
        else:
            tiny_url = False
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "success", "error_message": "Error in operation"})

    return json_response({"status": "success", "url": tiny_url})


@bp.route(
    "/codex-api/project-notebooks/<int:project_nb_id>/get-iterations",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_notebook_iterations(project_nb_id):
    """Generates the iteration details of a notebook for given project_nb_id for every iteration, filtered if requested

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {iteration_data, page, pages}
    """
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    notebook_submission_total = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id)
    notebook_submissions = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id)

    if "filtered" in request_data:
        for filter_item in request_data["filtered"]:
            if (
                filter_item["id"] == "technique"
                or filter_item["id"] == "dep_var"
                or filter_item["id"] == "params"
                or filter_item["id"] == "exog"
            ):
                notebook_submission_total = notebook_submission_total.filter(
                    getattr(ProjectNotebookConfig, filter_item["id"]).like("%" + filter_item["value"] + "%")
                )
                notebook_submissions = notebook_submissions.filter(
                    getattr(ProjectNotebookConfig, filter_item["id"]).like("%" + filter_item["value"] + "%")
                )
            else:
                notebook_submission_total = notebook_submission_total.filter(
                    ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_name == filter_item["id"]),
                    ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_value == filter_item["value"]),
                )
                notebook_submissions = notebook_submissions.filter(
                    ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_name == filter_item["id"]),
                    ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_value == filter_item["value"]),
                )

    notebook_submission_total = notebook_submission_total.count()

    if "sorted" in request_data:
        added_id_sort = False
        for sort_item in request_data["sorted"]:
            if "desc" in sort_item and sort_item["desc"]:
                if sort_item["id"] == "id":
                    added_id_sort = True
                notebook_submissions = notebook_submissions.order_by(
                    desc(getattr(ProjectNotebookConfig, sort_item["id"]))
                )
            else:
                if sort_item["id"] == "id":
                    added_id_sort = True
                notebook_submissions = notebook_submissions.order_by(
                    asc(getattr(ProjectNotebookConfig, sort_item["id"]))
                )

        if not added_id_sort:
            notebook_submissions = notebook_submissions.order_by(desc(ProjectNotebookConfig.id))
    else:
        notebook_submissions = notebook_submissions.order_by(desc(ProjectNotebookConfig.id))

    if "pageSize" not in request_data:
        request_data["pageSize"] = 10

    if "page" not in request_data:
        request_data["page"] = 0

    notebook_submissions = notebook_submissions.limit(request_data["pageSize"]).offset(
        request_data["page"] * request_data["pageSize"]
    )
    # .\
    # from_self().join(ProjectNotebookConfigTag)

    iterations = []

    for notebook_submission in notebook_submissions:
        iteration = {
            "id": notebook_submission.id,
            "name": notebook_submission.name,
            "config_params": notebook_submission.config_params,
            "config_code": notebook_submission.config_code,
            "config_df": json.loads(notebook_submission.config_df) if notebook_submission.config_df else None,
            "technique": notebook_submission.technique,
            "dep_var": notebook_submission.dep_var,
            "exog": notebook_submission.exogs.split("|") if notebook_submission.exogs else [],
            "params": notebook_submission.params.split("|") if notebook_submission.params else [],
            "accuracy": notebook_submission.accuracy,
            "created_at": notebook_submission.created_at.strftime("%d %B, %Y %H:%M"),
        }

        for submission_tag in notebook_submission.tags:
            iteration[submission_tag.tag_name.lower()] = submission_tag.tag_value

        iterations.append(iteration)

    return json_response(
        {
            "data": iterations,
            "page": request_data["page"],
            "pages": math.ceil(notebook_submission_total / request_data["pageSize"]),
        }
    )


@bp.route(
    "/codex-api/project-notebooks/<int:project_nb_id>/iterations/<int:iteration_id>",
    methods=["DELETE"],
)
@login_required
@app_publish_required
def delete_iteration(project_nb_id, iteration_id):
    """Deletes all the iterations for the given iteration_id

    Args:
        iteration_id ([type]): [description]

    Returns:
        json: {'deleted_rows': 1}
    """
    try:
        project_nb_config_tags = ProjectNotebookConfigTag.query.filter_by(project_nb_config_id=iteration_id).all()
        project_nb_config = ProjectNotebookConfig.query.filter_by(id=iteration_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        for project_nb_config_tag in project_nb_config_tags:
            project_nb_config_tag.deleted_at = func.now()
            project_nb_config_tag.deleted_by = g.user.id

        project_nb_config.deleted_at = func.now()
        project_nb_config.deleted_by = g.user.id

        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in deleting iteration"}, 500)


@bp.route(
    "/codex-api/project-notebooks/<int:project_nb_id>/iterations/delete-selected",
    methods=["PUT"],
)
@login_required
@app_publish_required
def delete_selected(project_nb_id):
    """Deletes all the selected iterations

    Args:
        project_nb_id ([type]): [description]

    Returns:
        json: {deleted_rows}
    """
    deleted_rows = 0
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)

    for row_id in request_data["selected_rowids"]:
        try:
            project_nb_config_tags = ProjectNotebookConfigTag.query.filter_by(project_nb_config_id=row_id).all()
            project_nb_config = ProjectNotebookConfig.query.filter_by(id=row_id).first()
        except Exception as error_msg:
            ExceptionLogger(error_msg)

        try:
            for project_nb_config_tag in project_nb_config_tags:
                project_nb_config_tag.deleted_at = func.now()
                project_nb_config_tag.deleted_by = g.user.id

            project_nb_config.deleted_at = func.now()
            project_nb_config.deleted_by = g.user.id

            db.session.commit()
            deleted_rows = deleted_rows + 1
        except Exception as error_msg:
            ExceptionLogger(error_msg)

    return json_response({"deleted_rows": deleted_rows})


def get_options(item_type, item):
    """Helper function to set the result type in project notebooks

    Args:
        item_type ([type]): [description]
        item ([type]): [description]

    Returns:
        list: [list of selected items]
    """
    # NOTE can be refactored, items initially cna be set to [] inner ifelse can be killed
    if item_type == "graph":
        items = False
        if (
            "visual_results" in item
            and item["visual_results"]
            and "data" in item["visual_results"]
            and "layout" in item["visual_results"]
        ):
            items = ["default"]
        elif "visual_results" in item and item["visual_results"]:
            items = list(item["visual_results"].keys())

        if item.get("dynamic_visual_results", False):
            if items:
                items += list(item["dynamic_visual_results"].keys())
            else:
                items = list(item["dynamic_visual_results"].keys())
        if "tables" in item and item["tables"]:
            if items:
                items = items + list(item["tables"].keys())
            else:
                items = list(item["tables"].keys())

        if "table_simulators" in item and item["table_simulators"]:
            if items:
                items = items + list(item["table_simulators"].keys())
            else:
                items = list(item["table_simulators"].keys())

        if "gantt_table" in item and item["gantt_table"]:
            if items:
                items = items + list(item["gantt_table"].keys())
            else:
                items = list(item["gantt_table"].keys())

        if "insights" in item and item["insights"]:
            if items:
                items = items + list(item["insights"].keys())
            else:
                items = list(item["insights"].keys())

        if "simulator" in item and "name" in item["simulator"]:
            if items:
                items = items + list([item["simulator"]["name"]])
            else:
                items = list([item["simulator"]["name"]])

        if "test_learn_data" in item and "name" in item["test_learn_data"]:
            if items:
                items = items + list([item["test_learn_data"]["name"]])
            else:
                items = list([item["test_learn_data"]["name"]])

        # Can be coded as  `return items if len(items) else False` when items = [] (init.)
        return items
    elif item_type == "metric":
        items = []
        if "metrics" in item and item["metrics"]:
            items += list(item["metrics"].keys())
        if item.get("dynamic_metrics_results", False):
            items += list(item["dynamic_metrics_results"].keys())
        return items if len(items) else False

    elif item_type == "filter":
        items = []
        if "dynamic_filters" in item and item["dynamic_filters"]:
            items += list(item["dynamic_filters"].keys())
        if "dynamic_code_filters" in item and item["dynamic_code_filters"]:
            items += list(item["dynamic_code_filters"].keys())
        return items if len(items) else False

    elif item_type == "action":
        items = []
        if "actions" in item and item["actions"]:
            items += list(item["actions"].keys())
        return items if len(items) else False


def get_graph_traces(item):
    """elper function to set the trace options in the project notebook

    Args:
        item ([type]): [description]

    Returns:
        dictionary: {trace options}
    """

    # NOTE HERE handle things for Dynamic code
    if (
        "visual_results" in item
        and item["visual_results"]
        and "data" in item["visual_results"]
        and "layout" in item["visual_results"]
    ):
        return get_data_traces(item["visual_results"]["data"])
    else:
        if "visual_results" in item and item["visual_results"]:
            response = {}
            for data_item_key in item["visual_results"]:
                if "data" in item["visual_results"][data_item_key]:
                    response[data_item_key] = get_data_traces(item["visual_results"][data_item_key]["data"])
                else:
                    response[data_item_key] = False
            return response
        else:
            return False


def get_data_traces(data):
    """Helper function to set the graph trace options

    Args:
        data ([type]): [description]

    Returns:
        list: {key, type}
    """
    response = []
    response_index = 0
    for data_item in data:
        if "name" in data_item:
            response.append({"key": data_item["name"], "type": "name"})
        else:
            response.append({"key": response_index})

        response_index = response_index + 1

    return response


@bp.route(
    "/codex-api/project-notebooks/get-trigger-data/<int:project_nb_config_id>",
    methods=["PUT"],
)
@login_required
@app_publish_required
def get_trigger_data(project_nb_config_id):
    """Returns config parameters and the results for given project_nb_config_id

    Args:
        project_nb_config_id ([type]): [description]

    Returns:
        json: {status,params,results}
    """
    project_nb_config = ProjectNotebookConfig.query.filter_by(id=project_nb_config_id).first()
    config_params = json.loads(project_nb_config.config_params) if project_nb_config.config_params else False
    results = json.loads(project_nb_config.results) if project_nb_config.results else False

    return json_response({"status": "success", "params": config_params, "results": results})


@bp.route("/codex-api/project-notebooks/trigger/<int:project_nb_config_id>", methods=["PUT"])
@login_required
@app_publish_required
def trigger(project_nb_config_id):
    try:
        request_data = get_clean_postdata(request)
        config_params = request_data["params"]
        project_nb_config = ProjectNotebookConfig.query.filter_by(id=project_nb_config_id).first()

        project_nb_triggered_run = ProjectNotebookTriggered(
            project_nb_config_id=project_nb_config.id,
        )
        db.session.add(project_nb_triggered_run)
        db.session.commit()

        file_path = "codx_execution_" + str(project_nb_triggered_run.id) + ".py"

        exec_file_handle = open(file_path, "w")

        exec_file_str = ""
        exec_code_str = ""

        # Top level imports
        exec_code_str += """
from codex_widget_factory import utils

"""

        # Mark run as in-progress
        exec_code_str += f"""
utils.update_run_status(
  '{app.config['BACKEND_APP_URI']}/projects/update-run-status/{project_nb_config.project_notebook.access_token}',
  '{project_nb_triggered_run.id}',
  'In Progress',
  EXECUTION_RUNURL
)

"""

        # Tags
        exec_code_str += "codx_tags = {\n"
        if config_params and config_params["tags"] and len(config_params["tags"]) > 0:
            for tag_key, tag_value in config_params["tags"].items():
                exec_code_str += f"  '{tag_key}': '{tag_value}',\n"
        exec_code_str += "}\n\n"

        # Init results_json
        exec_code_str += "results_json = []\n"
        exec_code_str += "displayables = ''\n"

        # Results
        for widget_item in config_params["widgets"]:
            if "code" in widget_item and widget_item["code"] and widget_item["code"] != "":
                exec_code_str += "\n\n#---------------\n\n"
                exec_code_str += widget_item["code"]
                exec_code_str += "\n"

        # Submit
        exec_code_str += f"""
utils.submit_config_params(
  '{app.config['BACKEND_APP_URI']}/projects/upload-config-params/{project_nb_config.project_notebook.access_token}',
  EXECUTION_FILEPATH,
  results_json,
  codx_tags,
  {'{}'}
)

"""

        # Mark run as complete
        exec_code_str += f"""
utils.update_run_status(
  '{app.config['BACKEND_APP_URI']}/projects/update-run-status/{project_nb_config.project_notebook.access_token}',
  '{project_nb_triggered_run.id}',
  'Complete',
  EXECUTION_RUNURL
)

"""

        exec_file_str += "try:"

        exec_file_str += reindent(exec_code_str, 2)

        exec_file_str += f"""
except Exception as error_msg:
  print('Error running job: ' + str(error_msg))
  utils.update_run_status(
    '{app.config['BACKEND_APP_URI']}/projects/update-run-status/{project_nb_config.project_notebook.access_token}',
    '{project_nb_triggered_run.id}',
    'Error',
    EXECUTION_RUNURL
  )
"""

        # exec_file_handle.write(exec_file_str.replace('utils.render_response', 'displayables += utils.render_databricks_response'))
        exec_file_handle.write(exec_file_str.replace("utils.render_response", "utils.render_databricks_response"))
        exec_file_handle.close()

        blob_datasource = DatasourceFileStorage("azure_blob_storage")
        blob_datasource.upload_blob(
            app.config["AZURE_STORAGE_CONNECTION_STRING"],
            app.config["EXECUTION_FOLDER_PATH"],
            file_path,
            file_path,
        )

        os.remove(file_path)

        return json_response({"status": "success"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 500)


@bp.route("/codex-api/project-notebooks/<int:project_nb_id>/triggered-runs", methods=["GET"])
@login_required
@app_publish_required
def triggered_runs(project_nb_id):
    """Returns a list of all the trigger runs with status and url for the given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        JSON: {id, trigger_status, trigger_run_url}
    """
    project_nb_triggered = (
        ProjectNotebookTriggered.query.join(ProjectNotebookConfig)
        .filter(ProjectNotebookConfig.project_nb_id == project_nb_id)
        .order_by(desc(ProjectNotebookTriggered.created_at))
    )
    # notebook_submission_total = ProjectNotebookConfig.query.filter_by(project_nb_id=project_nb_id)
    # notebook_submissions = ProjectNotebookConfig.query.\
    #   filter_by(project_nb_id=project_nb_id)

    # if 'filtered' in request_data:
    #   for filter_item in request_data['filtered']:
    #     if filter_item['id'] == 'technique' or filter_item['id'] == 'dep_var' or\
    #        filter_item['id'] == 'params' or filter_item['id'] == 'exog':
    #       notebook_submission_total = notebook_submission_total.filter(getattr(ProjectNotebookConfig, filter_item['id']).like('%' + filter_item['value'] + '%'))
    #       notebook_submissions = notebook_submissions.filter(getattr(ProjectNotebookConfig, filter_item['id']).like('%' + filter_item['value'] + '%'))
    #     else:
    #       notebook_submission_total = notebook_submission_total.filter(
    #         ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_name == filter_item['id']),
    #         ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_value == filter_item['value'])
    #       )
    #       notebook_submissions = notebook_submissions.filter(
    #         ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_name == filter_item['id']),
    #         ProjectNotebookConfig.tags.any(ProjectNotebookConfigTag.tag_value == filter_item['value'])
    #       )

    # notebook_submission_total = notebook_submission_total.count()

    # if 'sorted' in request_data:
    #   added_id_sort = False
    #   for sort_item in request_data['sorted']:
    #     if 'desc' in sort_item and sort_item['desc']:
    #       if sort_item['id'] == 'id':
    #         added_id_sort = True
    #       notebook_submissions = notebook_submissions.\
    #         order_by(desc(getattr(ProjectNotebookConfig, sort_item['id'])))
    #     else:
    #       if sort_item['id'] == 'id':
    #         added_id_sort = True
    #       notebook_submissions = notebook_submissions.\
    #         order_by(asc(getattr(ProjectNotebookConfig, sort_item['id'])))

    #   if not added_id_sort:
    #     notebook_submissions = notebook_submissions.\
    #         order_by(desc(ProjectNotebookConfig.id))
    # else:
    #   notebook_submissions = notebook_submissions.\
    #     order_by(desc(ProjectNotebookConfig.id))

    # notebook_submissions = notebook_submissions.\
    #   limit(request_data['pageSize']).offset(request_data['page']*request_data['pageSize'])
    #   # .\
    #   # from_self().join(ProjectNotebookConfigTag)

    triggered_runs = []

    for project_nb_triggered_item in project_nb_triggered:
        triggered_run_item = {
            "id": project_nb_triggered_item.id,
            "trigger_status": project_nb_triggered_item.trigger_status,
            "trigger_run_url": project_nb_triggered_item.trigger_run_url,
            "created_at": project_nb_triggered_item.created_at.strftime("%d %B, %Y %H:%M"),
        }

        # for submission_tag in notebook_submission.tags:
        #   iteration[submission_tag.tag_name.lower()] = submission_tag.tag_value

        triggered_runs.append(triggered_run_item)

    return json_response_count(triggered_runs, count=project_nb_triggered.count())


@bp.route("/codex-api/project-notebooks/<int:widget_id>/get-default-code", methods=["GET"])
@login_required
@app_required
def get_widget_default_code(widget_id):
    """Fetches the default widget code for given widget_id

    Args:
        widget_id ([type]): [description]

    Returns:
        json: {status,url}
    """
    try:
        widgetcode_details = get_default_code(widget_id)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "success", "error_message": "Error fetching widget code"})

    return json_response({"status": "success", "details": widgetcode_details})


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/widget/get-inputs",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_widget_inputs(notebook_id):
    """Fetches the outputs for input widgets for given widget_id

    Returns:
        json: {status,url}
    """
    try:
        request_data = get_clean_postdata(request)
        input_widget_ids = request_data["input_widget_ids"]
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)

    try:
        # print(input_widget_ids)
        datasource_fs = DatasourceFileStorage("azure_blob_storage")

        response_filelist = []
        for input_widget_id in input_widget_ids:
            file_list = datasource_fs.get_azureblobstorage_list(
                app.config["AZURE_STORAGE_CONNECTION_STRING"],
                app.config["EXECUTION_FOLDER_PATH"],
                f"executions/execution-{notebook_id}/output-{input_widget_id}-",
            )

            for file_list_item in file_list:
                response_filelist.append({"widget_id": input_widget_id, "output": file_list_item.name})

        return json_response({"status": "success", "list": response_filelist})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 500)


@bp.route(
    "/codex-api/projects-notebooks/<int:notebook_id>/iterations/<int:iteration_id>/widget/get-inputs",
    methods=["PUT", "POST"],
)
@login_required
@app_required
def get_iteration_widget_inputs(notebook_id, iteration_id):
    """Fetches the outputs for input widgets for given widget_id

    Returns:
        json: {status,url}
    """
    try:
        request_data = get_clean_postdata(request)
        input_widget_ids = request_data["input_widget_ids"]
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 422)

    try:
        datasource_fs = DatasourceFileStorage("azure_blob_storage")

        response_filelist = []
        for input_widget_id in input_widget_ids:
            file_list = datasource_fs.get_azureblobstorage_list(
                app.config["AZURE_STORAGE_CONNECTION_STRING"],
                app.config["EXECUTION_FOLDER_PATH"],
                f"executions/notebook-{notebook_id}/iteration-{iteration_id}/output-{input_widget_id}-",
            )

            for file_list_item in file_list:
                response_filelist.append({"widget_id": input_widget_id, "output": file_list_item.name})

        return json_response({"status": "success", "list": response_filelist})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": str(error_msg)}, 500)


def reindent(s, numSpaces):
    """Returns the variable 's' with the given number of spaces at starting

    Args:
        s ([type]): [description]
        numSpaces ([type]): [description]

    Returns:
        string: s
    """
    s = s.split("\n")
    s = [(numSpaces * " ") + line.lstrip() for line in s]
    s = ("\n").join(s)
    return s
