import json
import logging
import time
from datetime import datetime as dt

from .flask_app import create_app
from .helpers import apps_execute_query, apps_insert_query
from .schema import AppConfig, ProjectNotebookConfig, db

app = create_app()
app.app_context().push()
# a2f6bc7e-0f2d-4c5c-8023-a5672b93ee3e


def execute(app_params, logs, job_id):
    api_start_time = time.time()
    logs += f"starting execution for PLATFORM_APP_DEPLOY: {job_id}\n"
    logging.info(f"starting execution for PLATFORM_APP_DEPLOY: {job_id}")

    try:
        logs += "getting app_config object\n"
        logging.info("getting app_config object")

        overwrite = app_params["overwrite"]
        app_id = app_params["app_id"]
        params = {
            "type": app_params["type"],
            "index": app_params["index"],
            "name": app_params["name"],
        }
        # deploy_logs={"app":{"status":None}}
        app_config = AppConfig.query.filter_by(id=1).first()  # S
        if not app_config.deploy_logs:  # S Writes default values in app_config.deploy_logs
            deploy_logs = {"app": {"status": "IN-PROGRESS"}, "screens": {}}
        else:
            deploy_logs = json.loads(app_config.deploy_logs)
            deploy_logs["app"]["status"] = "IN-PROGRESS"
        app_config.deploy_logs = json.dumps(deploy_logs)
        db.session.commit()

        app_config_params = json.loads(app_config.config)
        app_conn_uri = app.config["APPS_DB_URI"]

        # product_server_url = app.config['BACKEND_PRODUCT_APP_URI'] + "/admin/"

        # list of dataframes to store the old data in case of redeployment
        # list_old_data = {}
        # list_new_data = {}

        if params["type"] == "app":
            # Add App
            api_start_time = time.time()
            # add_app_url = product_server_url + "app/" + app.config['BACKEND_PRODUCT_APP_SECRET']

            if overwrite and app_config.deployed_app_id:
                # setting same delete time for all rows
                list
                delete_time = dt.now()
                # Update old app
                apps_execute_query(
                    app_conn_uri,
                    "UPDATE app SET name = %s, contact_email = %s, modules = %s WHERE id = %s",
                    (
                        app_config.name,
                        app_config.contact_email,
                        json.dumps(app_config_params["modules"]),
                        app_config.deployed_app_id,
                    ),
                )
                # removing last_deleted flag from older app screens and widgets
                apps_execute_query(
                    "UPDATE app_screen SET last_deleted= false where app_id = %s and deleted_at is not null",
                    (app_config.deployed_app_id),
                )
                apps_execute_query(
                    "UPDATE app_screen_widget SET last_deleted= false where app_id = %s and deleted_at is not null",
                    (app_config.deployed_app_id),
                )
                apps_execute_query(
                    "UPDATE app_screen_widget_value SET last_deleted= false where app_id = %s and deleted_at is not null",
                    (app_config.deployed_app_id),
                )
                apps_execute_query(
                    "UPDATE app_screen_widget_filter_value SET last_deleted= false where app_id = %s and deleted_at is not null",
                    (app_config.deployed_app_id),
                )

                # Delete old app screens and widgets here
                apps_execute_query(
                    app_conn_uri,
                    "UPDATE app_screen SET deleted_at = %s ,last_deleted= true WHERE app_id = %s and deleted_at is null",
                    (delete_time, app_config.deployed_app_id),
                )
                apps_execute_query(
                    app_conn_uri,
                    "UPDATE app_screen_widget SET deleted_at = %s ,last_deleted= true  WHERE app_id = %s and deleted_at is null",
                    (delete_time, app_config.deployed_app_id),
                )
                apps_execute_query(
                    app_conn_uri,
                    "UPDATE app_screen_widget_value SET deleted_at = %s ,last_deleted= true WHERE app_id = %s  and deleted_at is null",
                    (delete_time, app_config.deployed_app_id),
                )
                apps_execute_query(
                    app_conn_uri,
                    "UPDATE app_screen_widget_filter_value SET deleted_at = %s ,last_deleted= true WHERE app_id = %s  and deleted_at is null",
                    (delete_time, app_config.deployed_app_id),
                )
                app_id = app_config.deployed_app_id
            else:
                app_id = apps_insert_query(
                    app_conn_uri,
                    "INSERT INTO app (name, contact_email, modules) VALUES (%s, %s, %s)",
                    (
                        app_config.name,
                        app_config.contact_email,
                        json.dumps(app_config_params["modules"]),
                    ),
                )

            app_config.last_deployed_at = dt.now()
            # app_config.last_deployed_by = g.user.id
            deploy_logs["app"]["status"] = "SUCCESS"
            deploy_logs["app"]["timetaken"] = time.time() - api_start_time
            app_config.deploy_logs = json.dumps(deploy_logs)
            logs += f"execution for PLATFORM_APP_DEPLOY complete: {job_id}\n"
            logging.info(f"execution for PLATFORM_APP_DEPLOY complete: {job_id}")
            db.session.commit()

        elif params["type"] == "screen":
            if "screens" not in deploy_logs.keys():  # S Adding screen key in deploy logs
                deploy_logs["screens"] = {}
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
            logging.info("1")
            # Setup settings
            screen_settings = []
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
                    logging.info("2")
                    project_nb_configs = ProjectNotebookConfig.query.filter_by(
                        project_nb_id=app_config.notebook_id
                    ).all()
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
                                if (
                                    setting["item_is_label"]
                                    and "metrics" in nb_config_result
                                    and setting["item"] in nb_config_result["metrics"]
                                ):
                                    response_value = nb_config_result["metrics"][setting["item"]]
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
                                    elif "tables" in nb_config_result and setting["item"] in nb_config_result["tables"]:
                                        response_value = nb_config_result["tables"][setting["item"]]
                                    elif (
                                        "table_simulators" in nb_config_result
                                        and setting["item"] in nb_config_result["table_simulators"]
                                    ):
                                        response_value = nb_config_result["tables"][setting["item"]]
                                    elif (
                                        "gantt_table" in nb_config_result
                                        and setting["item"] in nb_config_result["gantt_table"]
                                    ):
                                        response_value = nb_config_result["tables"][setting["item"]]
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
                            logging.info("3")
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
                            logging.info("4")
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
                            logging.info("5-assumptions")

                        # ProjectNotebookConfigTag.query.filter_by(project_nb_config_id=project_nb_config.id).all()
                        project_nb_config_tags = project_nb_config.tags
                        for project_nb_config_tag in project_nb_config_tags:
                            response_filters.append(
                                {
                                    "key": project_nb_config_tag.tag_name,
                                    "value": project_nb_config_tag.tag_value,
                                }
                            )
                        logging.info("5")
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
                    logging.info("6")
            screen_response = {
                "screen_index": screen_index,
                "screen_name": screen["name"] if "name" in screen else False,
                "screen_description": screen["description"] if "description" in screen else "",
                "screen_filters_open": screen["filters_open"] if "filters_open" in screen else False,
                "screen_auto_refresh": screen["auto_refresh"] if "auto_refresh" in screen else False,
                "screen_image": screen["image"] if "image" in screen else False,
                "level": screen["level"] if "level" in screen else False,
                "horizontal": screen["horizontal"] if "horizontal" in screen else False,
                "graph_type": screen["graph_type"] if "graph_type" in screen else False,
                "settings": screen_settings,
            }

            app_screen_id = apps_insert_query(
                app_conn_uri,
                "INSERT INTO app_screen (app_id, screen_index, screen_name, screen_description, screen_filters_open, screen_auto_refresh, screen_image, level, graph_type, horizontal) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
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
                ),
            )

            # logs += "inserted app_screen\n"
            # logging.info("inserted app_screen")

            if "settings" in screen_response and screen_response["settings"]:
                for setting in screen_response["settings"]:
                    app_screen_widget_id = apps_insert_query(
                        app_conn_uri,
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
                        app_conn_uri,
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
                            app_conn_uri,
                            app_screen_widget_filter_value_query,
                            app_screen_widget_filter_value_params,
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

            # app_config.deployed_app_id = app_id
            app_config.last_deployed_at = dt.now()
            # app_config.last_deployed_by = g.user.id
            try:
                deploy_logs["screens"][screen_index]["status"] = "SUCCESS"
                deploy_logs["screens"][screen_index]["timetaken"] = time.time() - api_start_time
            except KeyError:  # S Handling key error for multiple screen indices
                deploy_logs["screens"][screen_index] = {
                    "status": "SUCCESS",
                    "timetaken": (time.time() - api_start_time),
                }

            app_config.deploy_logs = json.dumps(deploy_logs)
            db.session.commit()

            # logs += f"execution for PLATFORM_APP_DEPLOY screen COMPLETE: {screen_index} | {deploy_screen_item['name']}\n"
            # logging.info(f"execution for PLATFORM_APP_DEPLOY screen COMPLETE: {screen_index} | {deploy_screen_item['name']}")

        app_config.deploy_status = "SUCCESS"
        db.session.commit()
        return logs, "SUCCESS"

    except Exception as error_msg:
        logs += f"error during job execution: {str(error_msg)}\n"
        logging.info(f"error during job execution: {str(error_msg)}")
        deploy_logs["app"]["status"] = "FAILURE"
        deploy_logs["app"]["timetaken"] = time.time() - api_start_time
        app_config.deploy_logs = json.dumps(deploy_logs)
        app_config.deploy_status = "FAILURE"
        db.session.commit()
        return logs, "FAILURE"


""" Code for debugging
  except Exception as e:
    exception_type, exception_object, exception_traceback = sys.exc_info()
    filename = exception_traceback.tb_frame.f_code.co_filename
    line_number = exception_traceback.tb_lineno
    logging.info(f'Exception type: {exception_type}:{exception_object}')
    logging.info(f'Line number: {line_number}')
"""
