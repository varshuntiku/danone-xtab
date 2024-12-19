#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import os
import time

import nbformat as nbf
from api.codex_models.code_utils import component_types
from api.codex_models.code_utils import get_code_metadata as git_code_metadata
from api.codex_models.code_utils import preview_code as git_preview_code
from api.constants.functions import ExceptionLogger
from api.models import ProjectNotebook, Widget, WidgetGroup, db
from flask import current_app as app
from flask import g


class BlueprintNotebook:
    def __init__(
        self,
        project,
        project_nb=False,
        project_nb_config=False,
        export_executable=False,
    ):
        self.project = project
        self.project_nb = project_nb
        self.project_nb_config = project_nb_config
        self.export_executable = export_executable
        self.config_params = False
        self.backend_app_uri = app.config["BACKEND_APP_URI"]

        if self.project_nb_config:
            self.response_nb_fname = (
                f"{self.project.name}_config_{self.project_nb_config.id}_{time.strftime('%Y%m%d%H%M')}.ipynb"
            )
        elif self.project_nb:
            self.response_nb_fname = f"{self.project.name}_nb_{self.project_nb.id}_{time.strftime('%Y%m%d%H%M')}.ipynb"
        else:
            self.response_nb_fname = f"{self.project.name}_{time.strftime('%Y%m%d%H%M')}.ipynb"

    def get_blueprint_code(self):
        if self.project.blueprint:
            # Create project_notebook
            self.project_nb = ProjectNotebook(
                project_id=self.project.id,
                blueprint=self.project.blueprint,
                created_by=g.user.id,
            )
            db.session.add(self.project_nb)
            db.session.commit()

            self.project_nb_id = self.project_nb.id

            blueprint_data = json.loads(self.project.blueprint)

            self.blueprint_nodes = blueprint_data["nodes"]

            return self.get_widgets_code()
        else:
            return False

    def get_nb_config_code(self):
        if self.project_nb and self.project_nb.blueprint:
            blueprint_data = json.loads(self.project_nb.blueprint)

            self.blueprint_nodes = blueprint_data["nodes"]

            if self.project_nb_config and self.project_nb_config.config_params:
                # print(self.project_nb_config.config_params)
                self.config_params = json.loads(self.project_nb_config.config_params)

            return self.get_widgets_code()
        else:
            return False

    def get_widgets_code(self):
        if len(self.blueprint_nodes) > 0:
            self.downstream_widgets_exist = True
        else:
            self.downstream_widgets_exist = False

        self.rendered_node_ids = []
        self.rendered_node_names = []
        self.nb = nbf.v4.new_notebook()

        if os.environ.get("FLASK_ENV") == "development" or os.environ.get("FLASK_ENV") == "test":
            codex_wf_version = '"codex-widget-factory<=0.1rc0"'
        elif os.environ.get("FLASK_ENV") == "stage" or os.environ.get("FLASK_ENV") == "dev":
            codex_wf_version = '"codex-widget-factory<=0.1"'
        else:
            codex_wf_version = "codex-widget-factory"

        if self.export_executable:
            import_source = "import sys, subprocess\n\n"
            import_source += (
                "subprocess.call([sys.executable, '-m', 'pip', 'install', 'keyring', 'artifacts-keyring'])\n"
            )
            import_source += (
                "subprocess.call([sys.executable, '-m', 'pip', 'install', '--upgrade', '--extra-index-url', 'https://pkgs.dev.azure.com/mathco-products/_packaging/pip-codex-wf%40Local/pypi/simple/', "
                + codex_wf_version
                + "])\n\n"
            )
        else:
            import_source = "import sys\n\n"
            import_source += "!{sys.executable} -m pip install keyring artifacts-keyring\n"
            import_source += (
                '!{sys.executable} -m pip install --pre --upgrade --trusted-host pkgs.dev.azure.com --trusted-host pypi.org --trusted-host "*.blob.core.windows.net" --trusted-host files.pythonhosted.org --extra-index-url https://pkgs.dev.azure.com/mathco-products/_packaging/pip-codex-wf%40Local/pypi/simple/ '
                + codex_wf_version
                + "\n\n"
            )

        tags_source = "# tags to identify this iteration when submitted\n"
        tags_source += "# example: codex_tags = {'env': 'dev', 'region': 'USA', 'product_category': 'A'}\n\n"
        tags_source += "codex_tags = {\n"

        if self.config_params and "tags" in self.config_params:
            for tag_key in self.config_params["tags"]:
                tag_value = self.config_params["tags"][tag_key]
                tags_source += f"  '{tag_key}': '{tag_value}',\n"

        tags_source += "}\n\n"

        tags_source += "from codex_widget_factory import utils\nresults_json=[]\n\n"

        if self.export_executable:
            self.cells = [import_source, tags_source]
        else:
            self.cells = [
                nbf.v4.new_markdown_cell(source="## This is your Downloaded Blueprint Notebook ##"),
                nbf.v4.new_code_cell(source=tags_source),
            ]

        self.nb_response_index = 0
        self.data_structure = []

        current_item_count = 0
        run_count = 0
        while self.downstream_widgets_exist:
            run_count += 1

            # print(f"------------------------ Run: {run_count} ------------------------")
            self.render_blueprint_widgets()
            if current_item_count != len(self.data_structure):
                current_item_count = len(self.data_structure)
            else:
                break

        self.render_widget_code()

        if self.export_executable:
            pass
        else:
            nbconvert_source = f"\ncurrentNotebook = '{self.response_nb_fname}'\n\n!jupyter nbconvert --to script {{currentNotebook}} \n\n"

            submit_params_source = (
                f"\nutils.submit_config_params(url='{self.backend_app_uri}/projects/upload-config-params/{self.project_nb.access_token}', nb_name=currentNotebook, results=results_json, codex_tags=codex_tags, args="
                + "{})"
            )

            self.cells.append(
                nbf.v4.new_markdown_cell(source="### Please save and checkpoint notebook before submitting params")
            )

            self.cells.append(nbf.v4.new_code_cell(source=nbconvert_source))

            self.cells.append(nbf.v4.new_code_cell(source=submit_params_source))

            self.nb["cells"] = self.cells

            nbf.write(self.nb, self.response_nb_fname)

            return self.response_nb_fname

    def render_blueprint_widgets(self):
        starting_nodes = []
        self.downstream_widgets_exist = False
        for widget in self.blueprint_nodes:
            if widget["id"] not in self.rendered_node_ids:
                # Find starting nodes
                if len(widget["ports"]) > 0:
                    render_widget = True
                    for port in widget["ports"]:
                        if port["in"]:
                            # print(f">>> Found in port")
                            if len(port["links"]) > 0:
                                # print(f">>> Has widgets linked to inports")
                                # print(f">>> Looking at {widget['name']} {port}")
                                for in_port_link in port["links"]:
                                    in_port_widget = self.get_widget_from_link(widget, in_port_link)
                                    if in_port_widget and in_port_widget not in self.rendered_node_ids:
                                        # print(f">>> upstream widget not rendered yet: {in_port_widget}")
                                        # print(f">>> current rendered node ids are: {self.rendered_node_ids}")
                                        render_widget = False

                    if render_widget:
                        # print(f">>> adding for rendering: {widget['name']}")
                        starting_nodes.append(widget)
                    else:
                        self.downstream_widgets_exist = True

        # Start generating the jupyter file here with the starting nodes
        for starting_node in starting_nodes:
            self.setup_widget_structure(starting_node)
            self.rendered_node_ids.append(starting_node["id"])
            self.rendered_node_names.append(starting_node["name"])

    def get_widget_from_link(self, current_node, in_port_link):
        for node in self.blueprint_nodes:
            if current_node["id"] != node["id"]:
                for port in node["ports"]:
                    if in_port_link in port["links"]:
                        # print(node['name'])
                        return node["id"]

        return False

    def setup_widget_structure(self, node):
        if node["extras"]["widget_type"] == "CUSTOM":
            if node["extras"]["widget_id"] != "PLACEHOLDER":
                return
            else:
                data_structure_item = {
                    "node": node,
                    "components": [
                        {
                            "name": "custom",
                            "output": f"response_{self.nb_response_index}",
                            "previous_output": f"response_{str(self.nb_response_index - 1)}",
                            "params": self.find_upstream_params(node, "CUSTOM"),
                        }
                    ],
                    "widget_group_code": "CUSTOM",
                    "widget_group_name": "Custom",
                }
                self.nb_response_index += 1
        else:
            widget_group = WidgetGroup.query.filter_by(id=node["extras"]["widget_type"]).first()
            data_structure_item = {
                "node": node,
                "components": [],
                "widget_group_code": widget_group.code,
                "widget_group_name": widget_group.name,
            }

        if node["extras"]["widget_id"]:
            if node["extras"]["widget_id"] == "PLACEHOLDER":
                pass
            else:
                widget = Widget.query.filter_by(id=node["extras"]["widget_id"]).first()

                if widget and widget.test_code_params:
                    try:
                        test_code_details = json.loads(widget.test_code_params)
                        test_code_import = (
                            test_code_details["path"]
                            .replace("codex_widget_factory/", "")
                            .replace(".py", "")
                            .replace("/", ".")
                        )
                        test_code_import_details = test_code_import.split(".")
                        test_code_import_group = test_code_import_details[0]
                        test_code_import_widget = test_code_import_details[1]
                        test_code_name_prefix = test_code_import.replace(".", "_")
                        widget_components = component_types[widget_group.code]

                        widget_code = git_preview_code(test_code_details)
                        metadata = git_code_metadata(widget_code, widget.widget_group.code)
                        metadata_components = []

                        for metadata_item in metadata:
                            metadata_components.append(metadata_item["name"])

                        for widget_component in widget_components:
                            if (
                                "specific_render" not in widget_components[widget_component]
                                and widget_component in metadata_components
                            ):
                                data_structure_item["components"].append(
                                    {
                                        "name": widget_component,
                                        "output": f"response_{self.nb_response_index}",
                                        "previous_output": f"response_{str(self.nb_response_index - 1)}",
                                        "params": self.find_upstream_params(node, widget_group.code),
                                        "group": widget_group,
                                    }
                                )
                                self.nb_response_index += 1

                        data_structure_item["test_code_name_prefix"] = test_code_name_prefix
                        data_structure_item["test_code_import"] = test_code_import
                        data_structure_item["test_code_import_group"] = test_code_import_group
                        data_structure_item["test_code_import_widget"] = test_code_import_widget
                    except Exception as error_msg:
                        ExceptionLogger(error_msg)
                        print(str(error_msg))

        if len(data_structure_item["components"]) == 0:
            data_structure_item["components"] = [
                {
                    "output": f"response_{self.nb_response_index}",
                    "previous_output": f"response_{str(self.nb_response_index - 1)}",
                    "params": self.find_upstream_params(node, widget_group.code),
                }
            ]
            self.nb_response_index += 1

        self.data_structure.append(data_structure_item)

    def render_widget_code(self):
        for node in self.data_structure:
            if self.export_executable:
                self.cells.append(f"### {node['widget_group_name']} {node['node']['name']}")
            else:
                self.cells.append(
                    nbf.v4.new_markdown_cell(source=f"### {node['widget_group_name']} {node['node']['name']}")
                )
            for component in node["components"]:
                code_source = ""
                if "test_code_import" in node and "test_code_name_prefix" in node and "name" in component:
                    code_source += "#BEGIN WIDGET CODE BELOW...\n\n"
                    code_source += f"from codex_widget_factory.{node['test_code_import']} import {component['name']} as {node['test_code_name_prefix']}_{component['name']}\n"
                    code_source += self.get_widget_func_call(node, component)

                    code_source += "results_json.append({{\n"
                    code_source += f"  'type': '{node['widget_group_name']}',\n"
                    code_source += f"  'name': '{node['node']['name']}',\n"
                    code_source += f"  'component': '{component['name']}',\n"
                    code_source += f"  'visual_results': utils.get_response_visuals({component['output']}),\n"
                    code_source += "  'metrics': False\n"
                    code_source += "})\n"

                    code_source += f"utils.render_response({component['output']})\n\n"
                    code_source += "#END WIDGET CODE\n\n"
                elif "test_code_import" in node and "test_code_name_prefix" in node:
                    code_source += "#BEGIN WIDGET CODE BELOW...\n\n"
                    code_source += "#importing the base widget code\n"
                    code_source += f"from codex_widget_factory.{node['test_code_import_group']} import {node['test_code_import_widget']} as {node['test_code_name_prefix']}\n"
                    if len(component["params"]) > 0:
                        code_source += "#upstream params found\n"
                        code_source += f"# {','.join(component['params'])}\n\n"
                    code_source += "#put your output in this response param for connecting to downstream widgets\n"
                    code_source += f"{component['output']}\n\n"
                    code_source += "#END WIDGET CODE\n\n"
                elif "name" in component and component["name"] == "custom" and node["widget_group_code"] == "CUSTOM":
                    code_source += "#BEGIN CUSTOM CODE BELOW...\n\n"
                    code_source += self.get_custom_widget_code(node, component)
                    code_source += "#END CUSTOM CODE\n\n"
                else:
                    if len(component["params"]) > 0:
                        code_source += "#upstream params found\n"
                        code_source += f"# {','.join(component['params'])}\n\n"
                    code_source += "#put your output in this response param for connecting to downstream widgets\n"
                    code_source += f"{component['output']}\n"

                if self.export_executable:
                    self.cells.append(code_source)
                else:
                    self.cells.append(nbf.v4.new_code_cell(source=code_source))

    def get_widget_func_call(self, node, component):
        code_source = ""
        found_config_params = False

        if self.config_params:
            for config_param in self.config_params["widgets"]:
                # print(f"Params : {json.dumps(config_param)}")
                if (
                    "output_var" in config_param
                    and config_param["output_var"] == component["output"]
                    and component["name"] == config_param["component_name"]
                    and node["test_code_name_prefix"] == f"{config_param['group']}_{config_param['name']}"
                ):
                    found_config_params = config_param

                    #  print(f"Found params for {node['test_code_name_prefix']}: {json.dumps(found_config_params)}")

        if found_config_params:
            code_source += f"{component['output']} = {node['test_code_name_prefix']}_{component['name']}("
            param_index = 0
            for func_param in found_config_params["params"]:
                if param_index > 0:
                    code_source += ", "
                code_source += self.get_func_arg_value(func_param)
                param_index += 1

            for func_param in found_config_params["keyword_params"]:
                if param_index > 0:
                    code_source += ", "
                code_source += f"{func_param['name']}={self.get_func_arg_value(func_param)}"
                param_index += 1

            code_source += ")\n"
        else:
            if node["widget_group_code"] == "MODEL_BUILD" and component["name"] == "summary":
                code_source += f"{component['output']} = {node['test_code_name_prefix']}_{component['name']}({','.join(component['params'])}, dep_var='', model_obj={component['previous_output']})\n"
            elif node["widget_group_code"] == "MODEL_EVAL" and len(component["params"]) == 1:
                code_source += f"{component['output']} = {node['test_code_name_prefix']}_{component['name']}({component['params'][0]})\n"
            elif node["widget_group_code"] == "MODEL_EVAL" and len(component["params"]) > 1:
                code_source += f"{component['output']} = {node['test_code_name_prefix']}_{component['name']}([{','.join(component['params'])}])\n"
            else:
                code_source += f"{component['output']} = {node['test_code_name_prefix']}_{component['name']}({','.join(component['params'])})\n"

        return code_source

    def get_custom_widget_code(self, node, component):
        code_source = ""
        found_config_params = False

        if self.config_params:
            for config_param in self.config_params["widgets"]:
                if (
                    "output_var" in config_param
                    and config_param["output_var"] == component["output"]
                    and config_param["group"] == "custom"
                ):
                    found_config_params = config_param

        if found_config_params:
            code_source += found_config_params["code"]
        else:
            if len(component["params"]) > 0:
                code_source += "#upstream params found\n"
                code_source += f"# {','.join(component['params'])}\n\n"
            code_source += "#put your output in this response param for connecting to downstream widgets\n"
            code_source += f"{component['output']}\n\n"

        return code_source

    def get_func_arg_value(self, func_param):
        if func_param["value_type"] == "String":
            return f"'{func_param['value']}'"
        else:
            return f"{func_param['value']}"

    def find_upstream_params(self, current_node, current_widget_group_code):
        in_port_link_widgets = []
        for port in current_node["ports"]:
            if port["in"]:
                for link in port["links"]:
                    in_port_link_widgets.append(self.get_widget_from_link(current_node, link))

        params = []
        for in_port_link_widget in in_port_link_widgets:
            for widget in self.data_structure:
                if widget["node"]["id"] == in_port_link_widget:
                    for component in widget["components"]:
                        if "name" not in component:
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "CUSTOM":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "INGEST" and component["name"] == "get_ingested_data":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "TRANSFORM" and component["name"] == "get_transformed_data":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "AGGREGATE" and component["name"] == "get_aggregated_data":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "EXPLORE" and component["name"] == "visualize_results":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "MODEL_BUILD" and component["name"] == "summary":
                            params.append(component["output"])
                        elif widget["widget_group_code"] == "MODEL_EVAL" and component["name"] == "summary":
                            params.append(component["output"])

        return params
