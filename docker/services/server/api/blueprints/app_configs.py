#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import time
from datetime import datetime as dt

import pandas as pd
from api.bg_jobs.trigger_queue import queue_job
from api.blueprints.project_notebooks import get_graph_traces, get_options
from api.connectors.product_db_helpers import (
    apps_dbconn,
    apps_execute_query,
    apps_insert_query,
    apps_selectone_query,
    select_data_into_dataframe,
)
from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.constants.variables import CustomException
from api.helpers import get_clean_postdata
from api.middlewares import app_publish_required, app_required, login_required
from api.models import (
    AppConfig,
    Environment,
    JobStatus,
    ProjectNotebook,
    ProjectNotebookConfig,
    User,
    db,
)
from flask import Blueprint
from flask import current_app as app
from flask import g, json, request
from sqlalchemy import and_, desc, or_
from sqlalchemy.sql import func

bp = Blueprint("AppConfigs", __name__)


@bp.route("/codex-api/app-configs/<int:notebook_id>", methods=["GET"])
@login_required
@app_required
def instance_list(notebook_id):
    """Returns the appconfig info for the given notebook_id from the database.]

    Args:
        notebook_id ([type]): [description]

    Returns:
        JSON: {notebook info}
    """
    return json_response_count(
        [
            {
                "id": row.id,
                "name": row.name,
                "notebook_id": row.notebook_id,
                "environment": row.environment.name,
                "last_deployed_at": row.last_deployed_at.strftime("%d %B, %Y %H:%M") if row.last_deployed_at else "--",
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "last_deployed_by": f"{row.last_deployed_by_user.first_name} {row.last_deployed_by_user.last_name}"
                if row.last_deployed_by
                else "--",
                "app_id": row.deployed_app_id,
                "config": json.loads(row.config) if row.config else False,
            }
            for row in AppConfig.query.filter_by(notebook_id=notebook_id).all()
        ],
        200,
        AppConfig.query.count(),
    )


@bp.route("/codex-api/app-configs/environments", methods=["GET"])
@login_required
@app_publish_required
def env_list():
    """Returns a list of Environments and their ids

    Returns:
        JSON: {value, label}
    """
    return json_response_count(
        [{"value": row.id, "label": row.name} for row in Environment.query.all()],
        200,
        Environment.query.count(),
    )


@bp.route("/codex-api/app-configs/<int:notebook_id>", methods=["POST"])
@login_required
@app_publish_required
def create_instance(notebook_id):
    """Adds a new instance in database for given notebook ID with name,environment_id,email,
    config and created_by

    Args:
        notebook_id ([type]): [description]

    Returns:
        JSON: {id,name}
    """
    try:
        request_data = get_clean_postdata(request)

        app_config = AppConfig(
            notebook_id=notebook_id,
            name=request_data["name"],
            environment_id=request_data["environment_id"],
            contact_email=request_data["contact_email"],
            config=json.dumps(request_data["config"]),
            created_by=g.user.id,
        )
        db.session.add(app_config)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 422)

    return json_response({"id": app_config.id, "name": app_config.name})


@bp.route("/codex-api/app-configs/<int:notebook_id>/<int:app_config_id>", methods=["GET"])
@login_required
@app_required
def show_instance(notebook_id, app_config_id):
    """Returns app details from database using app config ID

    Args:
        app_config_id ([type]): [description]

    Returns:
        json: {id,name,environment_id,contact_email,config}
    """
    try:
        item = AppConfig.query.filter_by(id=app_config_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "environment_id": item.environment_id,
                "contact_email": item.contact_email,
                "config": json.loads(item.config),
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/app-configs/get-app-details/<int:deployed_app_id>", methods=["GET"])
@login_required
@app_required
def get_app_details(deployed_app_id):
    """Returns app details from database using deployed_app_id

    Args:
        deployed_app_id ([type]): [description]

    Returns:
        json: {id,name,environment_id,contact_email,config}
    """
    try:
        item = AppConfig.query.filter_by(deployed_app_id=deployed_app_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "environment_id": item.environment_id,
                "contact_email": item.contact_email,
                "config": json.loads(item.config),
            }
        )
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/app-configs/get-app-details-fromid/<int:app_id>", methods=["GET"])
@login_required
@app_required
def get_app_details_fromid(app_id):
    """[Returns app details from database using app ID]

    Args:
        app_id ([type]): [description]

    Returns:
        json: {id,name,environment_id,contact_email,config}
    """
    try:
        item = AppConfig.query.filter_by(id=app_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "environment_id": item.environment_id,
                "contact_email": item.contact_email,
                "config": json.loads(item.config),
            }
        )
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "item not found"}, 404)


@bp.route(
    "/codex-api/app-configs/<int:notebook_id>/<int:app_config_id>",
    methods=["PUT", "POST"],
)
@login_required
@app_publish_required
def update_instance(notebook_id, app_config_id):
    """updates the app_config details in database using notebook ID and app_config_id

    Args:
        notebook_id ([type]): [description]
        app_config_id ([type]): [description]

    Returns:
        JSON: {'status': True}
    """
    try:
        app_config = AppConfig.query.filter_by(id=app_config_id).first()
        if app_config is None:
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
        app_config.notebook_id = notebook_id
        app_config.name = request_data["name"]
        app_config.environment_id = request_data["environment_id"]
        app_config.contact_email = request_data["contact_email"]
        app_config.config = json.dumps(request_data["config"])
        app_config.updated_by = g.user.id
        db.session.commit()
        app_config = AppConfig.query.filter_by(id=app_config_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in operation"}, 500)


@bp.route("/codex-api/app-configs/<int:notebook_id>/<int:app_config_id>", methods=["DELETE"])
@login_required
@app_publish_required
def delete_instance(notebook_id, app_config_id):
    """Deletes an app_config instance in database using ID by setting date&time in deleted_at column

    Args:
        app_config_id ([type]): [description]

    Returns:
        JSON: {'deleted_rows': 1}
    """
    try:
        app_config = AppConfig.query.filter_by(id=app_config_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        app_config.deleted_at = func.now()
        app_config.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error in delete operation"}, 500)


@bp.route(
    "/codex-api/app-configs/<int:notebook_id>/<int:app_config_id>/deploy",
    methods=["PUT", "POST"],
)
@login_required
@app_publish_required
def deploy(notebook_id, app_config_id):
    """Deploys the app configured by the user with submitted iterations for given app_config_id

    Args:
        notebook_id ([type]): [description]
        app_config_id ([type]): [description]

    Returns:
        JSON: {status, params, timetaken, screen_id}
    """
    try:
        request_data = get_clean_postdata(request)
        overwrite = request_data["overwrite"]
        app_id = request_data["app_id"]
        params = {
            "type": request_data["type"],
            "index": request_data["index"],
            "name": request_data["name"],
        }
        app_conn_uri = app.config["APPS_DB_URI"]
        conn = apps_dbconn(app_conn_uri)

        return json_response(deploy_task(params, app_config_id, app_id, overwrite, conn))
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "failure", "params": params, "error": "FAILURE | bad params"})


@bp.route(
    "/codex-api/app-configs/<string:access_token>/<int:app_config_id>/get-deploy-from-notebook-params",
    methods=["GET"],
)
def get_deploy_from_notebook_params(access_token, app_config_id):
    try:
        # app_conn_uri = app.config["APPS_DB_URI"]
        # conn = apps_dbconn(app_conn_uri)

        project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

        if project_nb:
            app_config = AppConfig.query.filter_by(id=app_config_id).first()
            app_config_params = json.loads(app_config.config)

            return json_response({"status": "success", "params": app_config_params})
        else:
            return json_response({"status": "failure", "error": "FAILURE | item not found"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "failure", "error": "FAILURE | bad params"})


@bp.route(
    "/codex-api/app-configs/<string:access_token>/<int:app_config_id>/deploy-from-notebook-task",
    methods=["PUT", "POST"],
)
def deploy_from_notebook_task(access_token, app_config_id):
    try:
        app_conn_uri = app.config["APPS_DB_URI"]
        conn = apps_dbconn(app_conn_uri)

        post_params = get_clean_postdata(request)

        project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

        if project_nb:
            app_config = AppConfig.query.filter_by(id=app_config_id).first()
            # app_config_params = json.loads(app_config.config)

            overwrite = True if app_config.deployed_app_id else False

            time_taken = 0

            # Deploy Task
            response = deploy_task(post_params, app_config_id, app_config.deployed_app_id, overwrite, conn)

            if response["status"] == "success":
                time_taken += response["timetaken"]
            else:
                return json_response(response)

            return json_response({"status": "success", "timetaken": time_taken})
        else:
            return json_response({"status": "failure", "error": "FAILURE | item not found"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "failure", "error": "FAILURE | bad params"})


@bp.route(
    "/codex-api/app-configs/<string:access_token>/<int:app_config_id>/deploy-from-notebook",
    methods=["PUT", "POST"],
)
def deploy_from_notebook(access_token, app_config_id):
    """Deploys the app and screens from project notebook with submitted iterations for given app_config_id

    Args:
        access_token ([type]): [description]
        app_config_id ([type]): [description]

    Returns:
        JSON: {status,timetaken}
    """
    try:
        app_conn_uri = app.config["APPS_DB_URI"]
        conn = apps_dbconn(app_conn_uri)

        project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

        if project_nb:
            app_config = AppConfig.query.filter_by(id=app_config_id).first()
            app_config_params = json.loads(app_config.config)

            overwrite = True if app_config.deployed_app_id else False

            time_taken = 0
            # Deploy App
            response = deploy_task(
                {"type": "app"},
                app_config_id,
                app_config.deployed_app_id,
                overwrite,
                conn,
            )

            if response["status"] == "success":
                time_taken += response["timetaken"]
            else:
                return json_response(response)

            # Deploy Screens
            for screen_index, screen_item in enumerate(app_config_params["screens"]):
                response = deploy_task(
                    {
                        "type": "screen",
                        "index": screen_index,
                        "name": screen_item["name"],
                    },
                    app_config_id,
                    app_config.deployed_app_id,
                    overwrite,
                    conn,
                )

                if response["status"] == "success":
                    time_taken += response["timetaken"]
                else:
                    return json_response(response)

            return json_response({"status": "success", "timetaken": time_taken})
        else:
            return json_response({"status": "failure", "error": "FAILURE | item not found"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "failure", "error": "FAILURE | bad params"})


def deploy_task(params, app_config_id, app_id, overwrite, conn):
    """Helper function to deploy a new app or overwrite an existing app with the submitted iterations and customised screen and filter settings

    Args:
        params ([type]): [description]
        app_config_id ([type]): [description]
        app_id ([type]): [description]
        overwrite ([type]): [description]
        conn ([type]): [description]

    Returns:
        JSON: {status, params, timetaken, screen_id}
    """
    try:
        app_config = AppConfig.query.filter_by(id=app_config_id).first()
        app_config_params = json.loads(app_config.config)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return {
            "status": "failure",
            "params": params,
            "error": "FAILURE | item not found",
        }

    try:
        # product_server_url = app.config['BACKEND_PRODUCT_APP_URI'] + "/admin/"

        if params["type"] == "app":
            # Add App
            api_start_time = time.time()
            # add_app_url = product_server_url + "app/" + app.config['BACKEND_PRODUCT_APP_SECRET']

            app_config_params["modules"]["responsibilities"] = app_config_params.get("responsibilities", None)

            if overwrite and app_config.deployed_app_id:
                # Update old app
                apps_execute_query(
                    conn,
                    "UPDATE app SET name = %s, contact_email = %s, theme = %s, modules = %s WHERE id = %s",
                    (
                        app_config.name,
                        app_config.contact_email,
                        app_config_params["theme"],
                        json.dumps(app_config_params["modules"]),
                        app_config.deployed_app_id,
                    ),
                )
                # Delete old app screens and widgets here
                apps_execute_query(
                    conn,
                    "UPDATE app_screen SET deleted_at = %s WHERE app_id = %s",
                    (dt.now(), app_config.deployed_app_id),
                )
                apps_execute_query(
                    conn,
                    "UPDATE app_screen_widget SET deleted_at = %s WHERE app_id = %s",
                    (dt.now(), app_config.deployed_app_id),
                )
                apps_execute_query(
                    conn,
                    "UPDATE app_screen_widget_value SET deleted_at = %s WHERE app_id = %s",
                    (dt.now(), app_config.deployed_app_id),
                )
                apps_execute_query(
                    conn,
                    "UPDATE app_screen_widget_filter_value SET deleted_at = %s WHERE app_id = %s",
                    (dt.now(), app_config.deployed_app_id),
                )
                app_id = app_config.deployed_app_id
            else:
                contianer_id = apps_insert_query(
                    conn,
                    "INSERT INTO app_container (orderby, problem) VALUES(%s, %s)",
                    (0, app_config.name),
                )

                apps_insert_query(
                    conn,
                    "INSERT INTO container_mapping (container_id) SELECT %s",
                    (contianer_id,),
                )

                apps_execute_query(
                    conn,
                    """
update container_mapping
set
industry_id = (select i.id from "functions" f inner join industry i on f.industry_id = i.id where i.industry_name = 'Miscellaneous Industry' and function_name='Miscellaneous Function'),
function_id = (select f.id from "functions" f inner join industry i on f.industry_id = i.id where i.industry_name = 'Miscellaneous Industry' and function_name='Miscellaneous Function')
where container_id = %s
                    """,
                    (contianer_id,),
                )

                app_id = apps_insert_query(
                    conn,
                    "INSERT INTO app (name, contact_email, theme, modules, environment, container_id) VALUES (%s, %s, %s, %s, %s, %s)",
                    (
                        app_config.name,
                        app_config.contact_email,
                        app_config_params["theme"],
                        json.dumps(app_config_params["modules"]),
                        "preview",
                        contianer_id,
                    ),
                )
                # add_app_url = product_server_url + "app/" + str(app_config.deployed_app_id) + "/" + app.config['BACKEND_PRODUCT_APP_SECRET']

            # response = requests.put(url=add_app_url, json={
            #     'name': app_config.name,
            #     'contact_email': app_config.contact_email,
            #     'theme': app_config_params['theme'],
            #     'modules': app_config_params['modules']
            # })

            # if response.status_code == 200:
            #     try:
            #         response_json = response.json()
            #         if response_json['app_id']:
            #             app_id = response_json['app_id']
            #         else:
            #             return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not find application id'})
            #     except Exception as error_msg:
            #         ExceptionLogger(error_msg)
            #         return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not process add application response: ' + str(error_msg)})
            # else:
            #     return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not add application, status: ' + str(response.status_code) + ', msg: ' + str(response.json())})

            app_config.deployed_app_id = app_id
            app_config.last_deployed_at = func.now()
            if "user" in g:
                app_config.last_deployed_by = g.user.id
            db.session.commit()

            return {
                "status": "success",
                "params": params,
                "timetaken": (time.time() - api_start_time),
                "data": {"app_id": app_id},
            }
        elif params["type"] == "screen":
            app_screen_widget_value_query = "INSERT INTO app_screen_widget_value (app_id, screen_id, widget_id, widget_value, widget_simulated_value) VALUES "
            app_screen_widget_value_index = 0
            app_screen_widget_value_params = False

            # Add Screen
            api_start_time = time.time()
            # add_screens_url = product_server_url + "app/" + str(app_id) + "/add-screens/" + app.config['BACKEND_PRODUCT_APP_SECRET']

            # screens_data = []
            # for screen_index,screen in enumerate(app_config_params['screens']):
            screen_index = params["index"]
            screen = app_config_params["screens"][screen_index]

            project_nb_configs = ProjectNotebookConfig.query.filter_by(project_nb_id=app_config.notebook_id).all()

            # Setup settings
            screen_settings = []
            filter_settings = {}
            action_settings = {}
            if "action_settings" in screen and screen["action_settings"]:
                screen_action_mapping = screen["action_settings"]
                if screen_action_mapping.get("item", None):
                    for project_nb_config in project_nb_configs:
                        nb_config_results = json.loads(project_nb_config.results)
                        for nb_config_result in nb_config_results:
                            if (
                                nb_config_result["component"].strip() == screen_action_mapping.get("component", None)
                                and nb_config_result["name"].strip() == screen_action_mapping.get("name", None)
                                and nb_config_result["type"].strip() == screen_action_mapping.get("type", None)
                            ):
                                if (
                                    "actions" in nb_config_result
                                    and screen_action_mapping["item"] in nb_config_result["actions"]
                                ):
                                    action_settings.update(nb_config_result["actions"][screen_action_mapping["item"]])
            if "filter_settings" in screen and screen["filter_settings"]:
                filter_settings = screen["filter_settings"]
            if "settings" in screen and screen["settings"]:
                for setting in screen["settings"]:
                    screen_setting = {
                        "item_index": setting["item_index"],
                        "item": setting["item"],
                        "item_is_label": setting["item_is_label"],
                        "config": {
                            "title": setting["title"] if "title" in setting else False,
                            "subtitle": setting["subtitle"] if "subtitle" in setting else False,
                            "value_factor": setting["value_factor"] if "value_factor" in setting else False,
                            "prefix": setting["prefix"] if "prefix" in setting else False,
                            "traces": setting["traces"] if "traces" in setting else False,
                            "legend": setting["legend"] if "legend" in setting else False,
                            "assumptions_header": setting["assumptions_header"]
                            if "assumptions_header" in setting
                            else False,
                            "action_link": setting["action_link"] if "action_link" in setting else False,
                            "filters_open": setting["filters_open"] if "filters_open" in setting else False,
                            "auto_refresh": setting["auto_refresh"] if "auto_refresh" in setting else False,
                            "size_nooverride": setting["size_nooverride"] if "size_nooverride" in setting else False,
                            "color_nooverride": setting["color_nooverride"] if "color_nooverride" in setting else False,
                        },
                    }

                    values = []

                    for project_nb_config in project_nb_configs:
                        nb_config_results = json.loads(project_nb_config.results)
                        response_value = False
                        response_simulator_value = False
                        response_assumptions_value = False
                        response_filters = []
                        for nb_config_result in nb_config_results:
                            if (
                                nb_config_result["component"].strip() == setting["component"]
                                and nb_config_result["name"].strip() == setting["name"]
                                and nb_config_result["type"].strip() == setting["type"]
                            ):
                                if setting["item_is_label"]:
                                    if (
                                        "metrics" in nb_config_result
                                        and nb_config_result["metrics"]
                                        and nb_config_result["metrics"].get(setting["item"], False)
                                    ):
                                        response_value = nb_config_result["metrics"][setting["item"]]
                                    elif (
                                        "dynamic_metrics_results" in nb_config_result
                                        and nb_config_result["dynamic_metrics_results"]
                                        and nb_config_result["dynamic_metrics_results"].get(setting["item"], False)
                                    ):
                                        response_value = {
                                            "code": nb_config_result["dynamic_metrics_results"][setting["item"]],
                                            "is_dynamic": True,
                                        }
                                elif not setting["item_is_label"]:
                                    if (
                                        "visual_results" in nb_config_result
                                        and setting["item"] in nb_config_result["visual_results"]
                                    ):
                                        response_value = nb_config_result["visual_results"][setting["item"]]
                                        if (
                                            "simulator" in nb_config_result
                                            and "is_internal" in nb_config_result["simulator"]
                                            and nb_config_result["simulator"]["is_internal"]
                                        ):
                                            if (
                                                "internal_plot_index" in nb_config_result["simulator"]
                                                and nb_config_result["simulator"]["internal_plot_index"]
                                                == setting["item"]
                                            ):
                                                response_value["simulator"] = nb_config_result["simulator"]
                                    elif (
                                        "dynamic_visual_results" in nb_config_result
                                        and setting["item"] in nb_config_result["dynamic_visual_results"]
                                    ):
                                        response_value = {
                                            "code": nb_config_result["dynamic_visual_results"][setting["item"]],
                                            "is_dynamic": True,
                                        }
                                    elif "tables" in nb_config_result and setting["item"] in nb_config_result["tables"]:
                                        response_value = nb_config_result["tables"][setting["item"]]
                                    elif (
                                        "table_simulators" in nb_config_result
                                        and setting["item"] in nb_config_result["table_simulators"]
                                    ):
                                        response_value = nb_config_result["table_simulators"][setting["item"]]
                                    elif (
                                        "gantt_table" in nb_config_result
                                        and setting["item"] in nb_config_result["gantt_table"]
                                    ):
                                        response_value = nb_config_result["gantt_table"][setting["item"]]
                                    elif (
                                        "insights" in nb_config_result
                                        and setting["item"] in nb_config_result["insights"]
                                    ):
                                        response_value = nb_config_result["insights"][setting["item"]]
                                    elif (
                                        "simulator" in nb_config_result
                                        and "name" in nb_config_result["simulator"]
                                        and setting["item"] == nb_config_result["simulator"]["name"]
                                    ):
                                        response_value = {"simulator": nb_config_result["simulator"]}
                                    elif (
                                        "test_learn_data" in nb_config_result
                                        and "name" in nb_config_result["test_learn_data"]
                                        and setting["item"] == nb_config_result["test_learn_data"]["name"]
                                    ):
                                        response_value = {"test_learn_data": nb_config_result["test_learn_data"]}

                            if filter_settings.get("item", None):
                                if (
                                    nb_config_result["component"].strip() == filter_settings.get("component", None)
                                    and nb_config_result["name"].strip() == filter_settings.get("name", None)
                                    and nb_config_result["type"].strip() == filter_settings.get("type", None)
                                ):
                                    if (
                                        "dynamic_code_filters" in nb_config_result
                                        and filter_settings["item"] in nb_config_result["dynamic_code_filters"]
                                    ):
                                        filter_settings["screen_filter"] = {
                                            "code": nb_config_result["dynamic_code_filters"][filter_settings["item"]],
                                            "is_dynamic": True,
                                        }
                                    elif (
                                        "dynamic_filters" in nb_config_result
                                        and filter_settings["item"] in nb_config_result["dynamic_filters"]
                                    ):
                                        filter_settings["screen_filter"] = nb_config_result["dynamic_filters"][
                                            filter_settings["item"]
                                        ]

                            if (
                                "simulator_component" in setting
                                and "simulator_name" in setting
                                and "simulator_type" in setting
                                and nb_config_result["component"].strip() == setting["simulator_component"]
                                and nb_config_result["name"].strip() == setting["simulator_name"]
                                and nb_config_result["type"].strip() == setting["simulator_type"]
                            ):
                                if (
                                    setting["item_is_label"]
                                    and "metrics" in nb_config_result
                                    and setting["simulator_item"] in nb_config_result["metrics"]
                                ):
                                    response_simulator_value = nb_config_result["metrics"][setting["simulator_item"]]
                                elif not setting["item_is_label"]:
                                    if (
                                        "visual_results" in nb_config_result
                                        and setting["simulator_item"] in nb_config_result["visual_results"]
                                    ):
                                        response_simulator_value = nb_config_result["visual_results"][
                                            setting["simulator_item"]
                                        ]
                                    elif (
                                        "tables" in nb_config_result
                                        and setting["simulator_item"] in nb_config_result["tables"]
                                    ):
                                        response_simulator_value = nb_config_result["tables"][setting["simulator_item"]]
                                    elif (
                                        "table_simulators" in nb_config_result
                                        and setting["simulator_item"] in nb_config_result["table_simulators"]
                                    ):
                                        response_simulator_value = nb_config_result["table_simulators"][
                                            setting["simulator_item"]
                                        ]
                                    elif (
                                        "gantt_table" in nb_config_result
                                        and setting["simulator_item"] in nb_config_result["gantt_table"]
                                    ):
                                        response_simulator_value = nb_config_result["gantt_table"][
                                            setting["simulator_item"]
                                        ]
                                    elif (
                                        "insights" in nb_config_result
                                        and setting["simulator_item"] in nb_config_result["insights"]
                                    ):
                                        response_simulator_value = nb_config_result["insights"][
                                            setting["simulator_item"]
                                        ]
                                    elif (
                                        "simulator" in nb_config_result
                                        and "name" in nb_config_result["simulator"]
                                        and setting["simulator_item"] == nb_config_result["simulator"]["name"]
                                    ):
                                        response_simulator_value = {"simulator": nb_config_result["simulator"]}
                                    elif (
                                        "test_learn_data" in nb_config_result
                                        and "name" in nb_config_result["test_learn_data"]
                                        and setting["simulator_item"] == nb_config_result["test_learn_data"]["name"]
                                    ):
                                        response_simulator_value = {
                                            "test_learn_data": nb_config_result["test_learn_data"]
                                        }

                            if (
                                "assumptions_component" in setting
                                and "assumptions_name" in setting
                                and "assumptions_type" in setting
                                and nb_config_result["component"].strip() == setting["assumptions_component"]
                                and nb_config_result["name"].strip() == setting["assumptions_name"]
                                and nb_config_result["type"].strip() == setting["assumptions_type"]
                            ):
                                if (
                                    setting["item_is_label"]
                                    and "metrics" in nb_config_result
                                    and setting["assumptions_item"] in nb_config_result["metrics"]
                                ):
                                    response_assumptions_value = nb_config_result["metrics"][
                                        setting["assumptions_item"]
                                    ]
                                elif not setting["item_is_label"]:
                                    if (
                                        "visual_results" in nb_config_result
                                        and setting["assumptions_item"] in nb_config_result["visual_results"]
                                    ):
                                        response_assumptions_value = nb_config_result["visual_results"][
                                            setting["assumptions_item"]
                                        ]
                                    elif (
                                        "tables" in nb_config_result
                                        and setting["assumptions_item"] in nb_config_result["tables"]
                                    ):
                                        response_assumptions_value = nb_config_result["tables"][
                                            setting["assumptions_item"]
                                        ]
                                    elif (
                                        "table_simulators" in nb_config_result
                                        and setting["assumptions_item"] in nb_config_result["table_simulators"]
                                    ):
                                        response_assumptions_value = nb_config_result["table_simulators"][
                                            setting["assumptions_item"]
                                        ]
                                    elif (
                                        "gantt_table" in nb_config_result
                                        and setting["assumptions_item"] in nb_config_result["gantt_table"]
                                    ):
                                        response_assumptions_value = nb_config_result["gantt_table"][
                                            setting["assumptions_item"]
                                        ]
                                    elif (
                                        "insights" in nb_config_result
                                        and setting["assumptions_item"] in nb_config_result["insights"]
                                    ):
                                        response_assumptions_value = nb_config_result["insights"][
                                            setting["assumptions_item"]
                                        ]
                                    elif (
                                        "simulator" in nb_config_result
                                        and "name" in nb_config_result["simulator"]
                                        and setting["assumptions_item"] == nb_config_result["simulator"]["name"]
                                    ):
                                        response_assumptions_value = {"simulator": nb_config_result["simulator"]}
                                    elif (
                                        "test_learn_data" in nb_config_result
                                        and "name" in nb_config_result["test_learn_data"]
                                        and setting["assumptions_item"] == nb_config_result["test_learn_data"]["name"]
                                    ):
                                        response_assumptions_value = {
                                            "test_learn_data": nb_config_result["test_learn_data"]
                                        }

                        # ProjectNotebookConfigTag.query.filter_by(project_nb_config_id=project_nb_config.id).all()
                        project_nb_config_tags = project_nb_config.tags
                        for project_nb_config_tag in project_nb_config_tags:
                            response_filters.append(
                                {
                                    "key": project_nb_config_tag.tag_name,
                                    "value": project_nb_config_tag.tag_value,
                                }
                            )

                        if response_value:
                            if isinstance(response_value, dict):
                                response_value["assumptions"] = response_assumptions_value

                            values.append(
                                {
                                    "value": response_value,
                                    "simulated_value": response_simulator_value,
                                    "filters": response_filters,
                                }
                            )

                    screen_setting["values"] = values
                    screen_settings.append(screen_setting)

            screen_response = {
                "screen_index": screen_index,
                "screen_name": screen["name"],
                "screen_description": screen["description"] if "description" in screen else "",
                "screen_filters_open": screen["filters_open"] if "filters_open" in screen else False,
                "screen_auto_refresh": screen["auto_refresh"] if "auto_refresh" in screen else False,
                "screen_image": screen["image"] if "image" in screen else False,
                "level": screen["level"] if "level" in screen else False,
                "horizontal": screen["horizontal"] if "horizontal" in screen else False,
                "graph_type": screen["graph_type"] if "graph_type" in screen else False,
                "settings": screen_settings,
                # 'screen_filters_value': json.dumps(screen['filter_settings']) if 'filter_settings' in screen else False,
                "screen_filters_value": json.dumps(filter_settings["screen_filter"])
                if filter_settings.get("screen_filter", None)
                else False,
                "action_settings": json.dumps(action_settings) if action_settings else False,
                "rating_url": screen["screen_rating_url"] if "screen_rating_url" in screen else False,
                "hidden": screen["hidden"] if "hidden" in screen else False,
                "graph_width": screen["graph_width"] if "graph_width" in screen else False,
                "graph_height": screen["graph_height"] if "graph_height" in screen else False,
            }

            app_screen_id = apps_insert_query(
                conn,
                "INSERT INTO app_screen (app_id, screen_index, screen_name, screen_description, screen_filters_open, screen_auto_refresh, screen_image, level, graph_type, horizontal,screen_filters_value, action_settings, rating_url, hidden) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (
                    app_id,
                    screen_response["screen_index"],
                    screen_response["screen_name"],
                    screen_response["screen_description"],
                    screen_response["screen_filters_open"],
                    screen_response["screen_auto_refresh"],
                    screen_response["screen_image"],
                    (screen_response["level"] if screen_response["level"] else None),
                    (
                        screen_response["graph_type"]
                        if "graph_type" in screen_response and screen_response["graph_type"]
                        else None
                    ),
                    (
                        screen_response["horizontal"]
                        if "horizontal" in screen_response and screen_response["horizontal"]
                        else None
                    ),
                    (
                        screen_response["screen_filters_value"]
                        if "screen_filters_value" in screen_response and screen_response["screen_filters_value"]
                        else None
                    ),
                    (
                        screen_response["action_settings"]
                        if "action_settings" in screen_response and screen_response["action_settings"]
                        else None
                    ),
                    (
                        screen_response["rating_url"]
                        if "rating_url" in screen_response and screen_response["rating_url"]
                        else None
                    ),
                    (screen_response["hidden"] if "hidden" in screen_response and screen_response["hidden"] else False),
                    (
                        screen_response["graph_width"]
                        if "graph_width" in screen_response and screen_response["graph_width"]
                        else None
                    ),
                    (
                        screen_response["graph_height"]
                        if "graph_height" in screen_response and screen_response["graph_height"]
                        else None
                    ),
                ),
            )

            # logs += "inserted app_screen\n"
            # logging.info("inserted app_screen")

            if "settings" in screen_response and screen_response["settings"]:
                for setting in screen_response["settings"]:
                    app_screen_widget_id = apps_insert_query(
                        conn,
                        "INSERT INTO app_screen_widget (app_id, screen_id, widget_index, widget_key, is_label, config) VALUES (%s, %s, %s, %s, %s, %s)",
                        (
                            app_id,
                            app_screen_id,
                            setting["item_index"],
                            setting["item"],
                            setting["item_is_label"],
                            json.dumps(setting["config"]),
                        ),
                    )

                    # logs += "inserted app_screen_widget\n"
                    # logging.info("inserted app_screen_widget")

                    for widget_value in setting["values"]:
                        if app_screen_widget_value_index == 0:
                            app_screen_widget_value_query += "(%s, %s, %s, %s, %s)"
                            app_screen_widget_value_params = (
                                app_id,
                                app_screen_id,
                                app_screen_widget_id,
                                (
                                    json.dumps(widget_value["value"])
                                    if isinstance(widget_value["value"], dict)
                                    or isinstance(widget_value["value"], list)
                                    else widget_value["value"]
                                ),
                                (
                                    json.dumps(widget_value["simulated_value"])
                                    if isinstance(widget_value["simulated_value"], dict)
                                    or isinstance(widget_value["simulated_value"], list)
                                    else widget_value["simulated_value"]
                                ),
                            )
                        else:
                            app_screen_widget_value_query += ", (%s, %s, %s, %s, %s)"
                            app_screen_widget_value_params = app_screen_widget_value_params + (
                                app_id,
                                app_screen_id,
                                app_screen_widget_id,
                                (
                                    json.dumps(widget_value["value"])
                                    if isinstance(widget_value["value"], dict)
                                    or isinstance(widget_value["value"], list)
                                    else widget_value["value"]
                                ),
                                (
                                    json.dumps(widget_value["simulated_value"])
                                    if isinstance(widget_value["simulated_value"], dict)
                                    or isinstance(widget_value["simulated_value"], list)
                                    else widget_value["simulated_value"]
                                ),
                            )
                        app_screen_widget_value_index = app_screen_widget_value_index + 1

                    app_screen_widget_value_id = apps_insert_query(
                        conn,
                        app_screen_widget_value_query,
                        app_screen_widget_value_params,
                    )
                    app_screen_widget_value_id = app_screen_widget_value_id - len(setting["values"]) + 1

                    app_screen_widget_filter_value_query = "INSERT INTO app_screen_widget_filter_value (app_id, screen_id, widget_id, widget_value_id, widget_tag_key, widget_tag_value) VALUES "
                    app_screen_widget_filter_value_index = 0
                    app_screen_widget_filter_value_params = False

                    # logs += "inserted app_screen_widget_value\n"
                    # logging.info("inserted app_screen_widget_value")
                    for widget_value in setting["values"]:
                        for filter_value in widget_value["filters"]:
                            if app_screen_widget_filter_value_index == 0:
                                app_screen_widget_filter_value_query += "(%s, %s, %s, %s, %s, %s)"
                                app_screen_widget_filter_value_params = (
                                    app_id,
                                    app_screen_id,
                                    app_screen_widget_id,
                                    app_screen_widget_value_id,
                                    filter_value["key"],
                                    filter_value["value"],
                                )
                            else:
                                app_screen_widget_filter_value_query += ", (%s, %s, %s, %s, %s, %s)"
                                app_screen_widget_filter_value_params = app_screen_widget_filter_value_params + (
                                    app_id,
                                    app_screen_id,
                                    app_screen_widget_id,
                                    app_screen_widget_value_id,
                                    filter_value["key"],
                                    filter_value["value"],
                                )
                            app_screen_widget_filter_value_index = app_screen_widget_filter_value_index + 1

                            # logs += "inserted app_screen_widget_filter_value\n"
                            # logging.info("inserted app_screen_widget_filter_value")

                        app_screen_widget_value_id = app_screen_widget_value_id + 1

                    if app_screen_widget_filter_value_params:
                        apps_insert_query(
                            conn,
                            app_screen_widget_filter_value_query,
                            app_screen_widget_filter_value_params,
                        )

            # Get latest old app_screen_id with the screen index
            q1 = "SELECT max(id) FROM app_screen WHERE app_id = %s AND screen_index = %s AND screen_name = %s AND level = %s AND deleted_at IS NOT NULL"
            p1 = (
                app_id,
                screen_response["screen_index"],
                screen_response["screen_name"],
                screen_response["level"],
            )
            if screen_response["level"] in [None, False]:
                q1 = "SELECT max(id) FROM app_screen WHERE app_id = %s AND screen_index = %s AND screen_name = %s AND level IS NULL AND deleted_at IS NOT NULL"
                p1 = (
                    app_id,
                    screen_response["screen_index"],
                    screen_response["screen_name"],
                )
            old_app_screen_id = apps_selectone_query(conn, q1, p1)

            # Update app_user_roles screen_ids
            if old_app_screen_id:
                apps_execute_query(
                    conn,
                    "UPDATE app_user_role SET permissions = REPLACE(permissions, '%s', '%s'), updated_at = %s WHERE app_id = %s AND deleted_at IS NULL",
                    (
                        old_app_screen_id,
                        app_screen_id,
                        dt.now(),
                        app_config.deployed_app_id,
                    ),
                )

            # response = requests.put(url=add_screens_url, json={
            #     'screens': [{
            #         'screen_index': screen_index,
            #         'screen_name': screen['name'],
            #         'screen_description': screen['description'] if 'description' in screen else False,
            #         'screen_filters_open': screen['filters_open'] if 'filters_open' in screen else False,
            #         'screen_image': screen['image'] if 'image' in screen else False,
            #         'level': screen['level'] if 'level' in screen else False,
            #         'horizontal': screen['horizontal'] if 'horizontal' in screen else False,
            #         'graph_type': screen['graph_type'] if 'graph_type' in screen else False,
            #         'settings': screen_settings
            #     }]
            # })

            # if response.status_code == 200:
            #     try:
            #         response_json = response.json()
            #         if response_json['screen_ids']:
            #             screen_id = response_json['screen_ids'][0]
            #         else:
            #             return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not find screen ids'})
            #     except Exception as error_msg:
            #         return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not process add screens response: ' + str(error_msg)})
            # else:
            #     return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Could not add screens, status: ' + str(response.status_code) + str(response.json())})

            app_config.last_deployed_at = func.now()
            if "user" in g:
                app_config.last_deployed_by = g.user.id
            db.session.commit()

            return {
                "status": "success",
                "params": params,
                "timetaken": (time.time() - api_start_time),
                "data": {"screen_id": app_screen_id},
            }
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return {
            "status": "failure",
            "params": params,
            "timetaken": (time.time() - api_start_time),
            "error": "FAILURE | Deploy error",
        }


# @bp.route("/codex-api/app-configs/<int:notebook_id>/<int:app_config_id>/deploy", methods=["PUT", "POST"])
# @login_required
# @app_publish_required
# def deploy(notebook_id, app_config_id):
#     app_conn_uri = ""
#     api_start_time = time.time()

#     try:
#         request_data = get_clean_postdata(request)
#         params = {
#             'app_config_id': app_config_id,
#             'overwrite': request_data['overwrite'],
#             'app_id': request_data['app_id'],
#             'type': request_data['type'],
#             'index': request_data['index'],
#             'name': request_data['name']
#         }

#         app_config = AppConfig.query.filter_by(id=app_config_id).first()
#         app_config_params = json.loads(app_config.config)
#         app_conn_uri = app.config['APPS_DB_URI']
#     except Exception as error_msg:
#         ExceptionLogger(error_msg)
#         return json_response({'status': 'failure', 'params': params, 'error': 'FAILURE | item not found, response: ' + str(error_msg)})

#     # Queueing the background-job for deploy
#     try:
#         app_config = AppConfig.query.filter_by(
#             id=params['app_config_id']).first()
#         config_params = json.loads(
#             app_config.config) if app_config.config else False

#         screens = []
#         app_queue_params = []
#         screen_queue_params = []
#         if config_params:
#             for screen_index, screen_item in enumerate(config_params['screens']):
#                 screens.append({
#                     'index': screen_index,
#                     'name': screen_item['name'],
#                     'status': 'QUEUED'
#                 })

#         app_config.deploy_status = 'IN-PROGRESS'
#         app_config.deploy_logs = json.dumps({
#             'app': {
#                 'status': 'QUEUED'
#             },
#             'screens': screens
#         })
#         db.session.commit()

#         queued_job_id = queue_job('PLATFORM_APP_DEPLOY', params)

#         return json_response({'status': 'success', 'params': params, 'timetaken': (time.time() - api_start_time), 'data': {'screen_id': app_screen_id}})
#     except Exception as error_msg:
#         ExceptionLogger(error_msg)
#         return json_response({'status': 'failure', 'params': params, 'timetaken': (time.time() - api_start_time), 'error': 'FAILURE | Deploy error: ' + str(error_msg)})


@bp.route(
    "/codex-api/app-configs/<string:access_token>/<int:app_config_id>/users-from-notebook",
    methods=["PUT", "POST"],
)
def users_from_notebook(access_token, app_config_id):
    """Deletes the app access for the given user

    Args:
        access_token ([type]): [description]
        app_config_id ([type]): [description]

    Returns:
        JSON: {'status': 'success'}
    """
    try:
        request_data = get_clean_postdata(request)
        request_users = request_data["users"]
        app_conn_uri = app.config["APPS_DB_URI"]
        conn = apps_dbconn(app_conn_uri)
    except Exception:
        return json_response({"status": "failure", "error": "FAILURE | bad params"})

    try:
        project_nb = ProjectNotebook.query.filter_by(access_token=access_token).first()

        if project_nb:
            app_config = AppConfig.query.filter_by(id=app_config_id).first()
            # app_config_params = json.loads(app_config.config)

            if app_config.deployed_app_id:
                apps_execute_query(
                    conn,
                    "UPDATE app_user SET deleted_at = %s WHERE app_id = %s",
                    (dt.now(), app_config.deployed_app_id),
                )

                app_user_index = 0
                # app_user_roles_index = 0

                # logs += "inserted app_screen_widget_value\n"
                # logging.info("inserted app_screen_widget_value")
                for request_user in request_users:
                    # app_user_role_query = "INSERT INTO app_user_role_identifier (app_user_role_id, app_user_id) VALUES (%s, %s)"
                    app_user_query = "INSERT INTO app_user (app_id, user_email, permissions, is_admin, first_name, last_name) VALUES (%s, %s, %s, %s, %s, %s)"
                    app_user_params = False

                    platform_user = User.query.filter_by(email_address=request_user["email"]).first()
                    if platform_user:
                        pass
                    else:
                        platform_user = User(
                            request_user["name"].split(" ")[0],
                            request_user["name"].split(" ")[1],
                            request_user["email"],
                        )

                        db.session.add(platform_user)

                    if app_user_index == 0:
                        app_user_query += "(%s, %s, %s, %s)"
                        app_user_params = (
                            app_config.deployed_app_id,
                            request_user["email"],
                            json.dumps(request_user["permissions"]) if request_user["permissions"] else None,
                            False,
                        )
                    else:
                        app_user_query += ", (%s, %s, %s, %s)"
                        app_user_params = app_user_params + (
                            app_config.deployed_app_id,
                            request_user["email"],
                            json.dumps(request_user["permissions"]) if request_user["permissions"] else None,
                            False,
                        )
                    app_user_index = app_user_index + 1

                if app_user_params:
                    apps_execute_query(
                        conn,
                        "UPDATE app_user SET deleted_at = %s WHERE app_id = %s",
                        (dt.now(), app_config.deployed_app_id),
                    )
                    apps_insert_query(conn, app_user_query, app_user_params)

                db.session.commit()
                return json_response({"status": "success"})
            else:
                return json_response({"status": "failure", "error": "FAILURE | app not found."})
        else:
            return json_response({"status": "failure", "error": "FAILURE | item not found"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"status": "failure", "error": "FAILURE | error"})


@bp.route("/codex-api/app-configs/gen-map-job", methods=["PUT", "POST"])
@login_required
@app_publish_required
def create_mapping_job():
    """Generates a background job for mapping old story contents with new contents.
    Returns:
        JSON: {'status': 'success'}
    """
    # generating a background job for mapping the old story contents with new contents
    try:
        request_data = get_clean_postdata(request)
        app_conn_uri = app.config["APPS_DB_URI"]
        # will run only if the app has a story
        app_id = request_data["app_id"]
        df = select_data_into_dataframe(
            app_conn_uri,
            "SELECT count(story_id) as cnt_story from story_app_mapping where app_id = %s and deleted_at is null",
            [app_id],
        )
        if df["cnt_story"][0] > 0:
            queue_job("REDEPLOYED_APP_STORY_ID_MAPPING", {"app_id": app_id})
        return json_response({"status": "success"})
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"status": "error", "message": "Error in operation"}, status=500)


@bp.route("/codex-api/app-configs/gen-file", methods=["PUT", "POST"])
@login_required
def create_download_job():
    """Creates and adds background job ID in azure storage

    Raises:
        CustomException: [description]

    Returns:
        JSON: {status, job_id}
    """
    # generating a background job for mapping the old story contents with new contents
    try:
        request_data = get_clean_postdata(request)
        params = {
            # "app_id": request_data.get('app_id', 0),
            "story_id": request_data.get("story_id", 0),
            "file_type": request_data.get("type", ""),
        }
        if params["story_id"] == 0 or params["file_type"] == "":
            raise CustomException("Insufficient Parameters passed", 422)

        job_type = "GENERATE_" + str.upper(params["file_type"])
        job_id = queue_job(job_type, params)
        return json_response({"status": "success", "job_id": job_id})
    except CustomException as cex:
        ExceptionLogger(cex)
        return json_response({"status": "error", "error": "Error in operation"}, cex.code)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"status": "error", "message": "Error in operation"}, status=500)


@bp.route(
    "/codex-api/app-configs/get-result-options-from-nb-id/<int:project_nb_id>",
    methods=["GET"],
)
@login_required
@app_publish_required
def get_result_options_from_nb_id(project_nb_id):
    """Fetches the result options of graphs, metrics, traces and filters for given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        JSON: {graphs, metrics, traces, filters}
    """
    return json_response(get_result_options_helper(project_nb_id), 200)


@bp.route(
    "/codex-api/app-configs/get-result-options-from-deployed-app-id/<int:deployed_app_id>",
    methods=["GET"],
)
@login_required
@app_publish_required
def get_result_options_from_deployed_app_id(deployed_app_id):
    """Fetches the result options of graphs, metrics, traces and filters for given deployed_app_id

    Args:
        deployed_app_id ([type]): [description]

    Returns:
        JSON: ({graphs, metrics, traces, filters}, 200)
    """
    try:
        app_config = AppConfig.query.filter_by(deployed_app_id=deployed_app_id).first()
        return json_response(get_result_options_helper(app_config.notebook_id), 200)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


def get_result_options_helper(project_nb_id):
    """Helper function to fetch the result options of graphs, metrics, traces and filters for given project_nb_id

    Args:
        project_nb_id ([type]): [description]

    Returns:
        JSON: {graphs, metrics, traces, filters}
    """
    # NOTE: MIGHT NEED TO MAKE CHANGES HERE AS WELL IF CHANGES ARE MADE IN project_notebooks.py => get_result_options :311
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
                    )

                #   return {
                #     'graphs': response_graph_options,
                #     'metrics': response_metric_options,
                #     'traces': response_trace_options
                #   }

    return {
        "graphs": response_graph_options,
        "metrics": response_metric_options,
        "traces": response_trace_options,
        "filters": response_filter_options,
        "actions": response_action_options,
        "responsibilities": response_responsibility_options,
    }


@bp.route("/codex-api/stories/download-jobs/status", methods=["GET"])
@login_required
def get_download_job_status():
    """Returns a file of job records for the given user with a link to download it

    Returns:
        JSON: {job status info}
    """
    try:
        app_id = request.args.get("app_id")
        app_conn_uri = app.config["APPS_DB_URI"]

        jobs = JobStatus.query.filter(
            and_(
                or_(
                    JobStatus.job_type == "GENERATE_PPT",
                    JobStatus.job_type == "GENERATE_PDF",
                ),
                JobStatus.created_by == g.user.id,
            ),
            JobStatus.deleted_at.is_(None),
        ).all()
        story_ids = [json.loads(el.parameters).get("story_id") for el in jobs]
        story_ids_str = ", ".join([str(el) for el in story_ids])

        if len(story_ids) == 0:
            return json_response([])

        if app_id:
            story = select_data_into_dataframe(
                app_conn_uri,
                f"select s.* as Story from story s join story_app_mapping sam ON sam.story_id = s.id where sam.app_id = {app_id} and s.id in({story_ids_str}) and s.deleted_at is null and sam.deleted_at is null",
            )
        else:
            story = select_data_into_dataframe(
                app_conn_uri,
                f"select s.* as Story from story s where s.id in({story_ids_str}) and s.deleted_at is null",
            )

        jobs_record = [
            {
                "job_id": el.id,
                "job_created_at": el.created_at,
                "job_updated_at": el.updated_at,
                "story_id": json.loads(el.parameters).get("story_id"),
                "file_type": json.loads(el.parameters).get("file_type").lower(),
                "job_status": el.job_status,
            }
            for el in jobs
        ]

        jobs_record_df = pd.DataFrame.from_records(jobs_record)

        merged_df = (
            story.merge(jobs_record_df, left_on="id", right_on="story_id")
            .sort_values(by="job_created_at", ascending=False)
            .drop_duplicates(["story_id"])
        )

        res = [
            {
                "triggered_at": el.get("job_created_at"),
                "updated_at": el.get("job_updated_at"),
                "story_id": el.get("story_id"),
                "story_name": el.get("name"),
                "download_status": el.get("job_status"),
                "link": get_download_link(
                    json.loads(el.get("story_file_links")) if el.get("story_file_links") else None,
                    el.get("file_type"),
                ),
                "file_type": el.get("file_type"),
                "file_name": get_file_name(
                    json.loads(el.get("story_file_links")) if el.get("story_file_links") else None,
                    el.get("file_type"),
                ),
            }
            for el in json.loads(merged_df.to_json(orient="records"))
        ]
        apps = get_apps(story_ids)
        for el in res:
            story_id = el.get("story_id")
            filtered_apps = apps.loc[apps["story_id"] == story_id]
            app_list = [
                {"id": app.get("id"), "name": app.get("name")}
                for app in json.loads(filtered_apps.to_json(orient="records"))
            ]
            el["apps"] = app_list
        print("response", res)
        return json_response(res)
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"status": "error", "message": "Error in operation"}, status=500)


def get_download_link(file_data, file_type):
    """Generates a url to download the file from blob

    Args:
        file_data ([type]): [description]
        file_type ([type]): [description]

    Returns:
        string: url
    """
    if file_data:
        file_name = file_data.get(file_type)
        link_root = app.config["DOWNLOAD_STORY_BLOB_ROOT"]
        print("filename", file_name)
        print("link_root", link_root)
        return f"{link_root}/{file_name}" if file_name else None
    else:
        return None


def get_file_name(file_data, file_type):
    print("filename", file_data)
    """Returns name of the file

    Args:
        file_data ([type]): [description]
        file_type ([type]): [description]

    Returns:
        string: file name
    """
    if file_data:
        file_name = file_data.get(file_type)
        return file_name
    else:
        return None


def get_apps(storyIds):
    """Returns a list of apps for the given story_id

    Args:
        storyIds ([type]): [description]

    Returns:
        list: [id,name,story_id]
    """
    app_conn_uri = app.config["APPS_DB_URI"]
    story_ids_str = ", ".join([str(el) for el in storyIds])
    apps = select_data_into_dataframe(
        app_conn_uri,
        f"select a.id, a.name, sam.story_id from story_app_mapping sam inner join app a on sam.app_id = a.id where sam.story_id in ({story_ids_str}) and sam.deleted_at is null ",
    )
    return apps
