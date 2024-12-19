#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import ast

from api.models import Widget
from azure.devops.connection import Connection
from azure.devops.v6_0.git.models import GitVersionDescriptor
from flask import current_app as app
from flask import json
from msrest.authentication import BasicAuthentication

component_types = {
    "INGEST": {"get_ingested_data": {"output_type": "DATA"}},
    "AGGREGATE": {"get_aggregated_data": {"output_type": "DATA"}},
    "TRANSFORM": {"get_transformed_data": {"output_type": "DATA"}},
    "EXPLORE": {
        "summary": {"output_type": "METADATA"},
        "visualize_results": {"output_type": "VISUALS"},
    },
    "MODEL_BUILD": {
        "build": {"output_type": "MODEL"},
        "summary": {"output_type": "METADATA"},
        "visualize_results": {"output_type": "VISUALS", "specific_render": True},
        "get_default_accuracy_metrics": {
            "output_type": "METADATA",
            "specific_render": True,
        },
        "predict": {"output_type": "PREDICTIONS"},
        "get_tuned_model_params": {"output_type": "METADATA", "specific_render": True},
    },
    "MODEL_EVAL": {
        "visualize_results": {"output_type": "VISUALS"},
        "summary": {"output_type": "METADATA"},
        "get_specific_accuracy_metrics": {"output_type": "METADATA"},
    },
    "PREDICT": {
        "​get_specific_accuracy_metrics": {"output_type": "METADATA"},
        "visualize_results": {"output_type": "VISUALS"},
    },
    "PUBLISH": {"publish": {"output_type": "METADATA"}},
    "DEMOCRATIZE": {},
    "UTILITIES": {"get_config": {"output_type": "DATA"}},
    "DEPLOY": {"get_deployment_code": {"output_type": "DATA"}},
}


def preview_code(code_details):
    """Authenticates the user access token,
    then connects to azure client to access the specified repository,
    branch and path to fetch the code details.

    Args:
        code_details ([type]): [description]

    Returns:
        [type]: [description]
    """
    organization_url = app.config["AZURE_DEVOPS_ORG_URL"]
    personal_access_token = app.config["AZURE_DEVOPS_REPO_PAT"]
    project_name = app.config["AZURE_DEVOPS_PROJECT"]

    credentials = BasicAuthentication("", personal_access_token)
    connection = Connection(base_url=organization_url, creds=credentials)

    git_client = connection.clients.get_git_client()

    repos = git_client.get_repositories(project_name)
    repo_id = None

    for repo in repos:
        if repo.name == code_details["repo"]:
            repo_id = repo.id

    # .replace("\\", "/").replace(f"{code_details['repo']}/", '', 1)
    file_path = code_details["path"]
    version_descriptor = GitVersionDescriptor(version=code_details["branch"])

    item_response = git_client.get_item_text(
        repository_id=repo_id, path=file_path, version_descriptor=version_descriptor
    )

    file_content = ""

    for line in item_response:
        file_content += line.decode("utf-8")

    return file_content


def code_demo(code_details):
    """Authenticates the user access token,
    then connects to azure client to access the specified repository,
    branch and path to fetch the code.

    Args:
        code_details ([type]): [description]

    Returns:
        [type]: [description]
    """
    organization_url = app.config["AZURE_DEVOPS_ORG_URL"]
    personal_access_token = app.config["AZURE_DEVOPS_REPO_PAT"]
    project_name = app.config["AZURE_DEVOPS_PROJECT"]

    credentials = BasicAuthentication("", personal_access_token)
    connection = Connection(base_url=organization_url, creds=credentials)

    git_client = connection.clients.get_git_client()

    repos = git_client.get_repositories(project_name)
    repo_id = None

    for repo in repos:
        print(repo.name)
        if repo.name == code_details["repo"]:
            repo_id = repo.id

    # .replace("\\", "/").replace(f"{code_details['repo']}/", '', 1)
    file_path = code_details["path"].replace(".py", ".json")
    version_descriptor = GitVersionDescriptor(version=code_details["branch"])

    try:
        git_client.get_item_text(repository_id=repo_id, path=file_path, version_descriptor=version_descriptor)
        return True
    except Exception:
        return False


def get_code_metadata(file_content, widget_group_code):
    """Iterates over children of nodes and returns details for each node.

    Args:
        file_content ([type]): [description]
        widget_group_code ([type]): [description]

    Returns:
        [type]: [description]
    """
    components = component_types[widget_group_code]

    code_tree = ast.parse(file_content)
    code_tree_nodes = ast.iter_child_nodes(code_tree)

    response_metadata = []

    for code_tree_node in code_tree_nodes:
        if isinstance(code_tree_node, ast.FunctionDef):
            response_metadata.append(
                {
                    "name": code_tree_node.name,
                    # 'args': code_tree_node.args,
                    "doc_string": ast.get_docstring(code_tree_node),
                    "return_type": components[code_tree_node.name]["output_type"]
                    if code_tree_node.name in components
                    else False,
                }
            )

    return response_metadata


def get_default_code(widget_id):
    """Get default code snippet for usage of a widget.

    Args:
        widget_id ([type]): [description]

    Returns:
        [type]: [description]
    """

    widget = Widget.query.filter_by(id=widget_id).first()
    widget_group = widget.widget_group

    widget_metadata = {
        "components": [],
        "widget_group_code": widget_group.code,
        "widget_group_name": widget_group.name,
    }

    if widget and widget.test_code_params:
        test_code_details = json.loads(widget.test_code_params)
        test_code_import = (
            test_code_details["path"].replace("codex_widget_factory/", "").replace(".py", "").replace("/", ".")
        )
        test_code_import_details = test_code_import.split(".")
        test_code_import_group = test_code_import_details[0]
        test_code_import_widget = test_code_import_details[1]
        test_code_name_prefix = test_code_import.replace(".", "_")
        widget_components = component_types[widget_group.code]

        widget_code = preview_code(test_code_details)
        metadata = get_code_metadata(widget_code, widget.widget_group.code)
        metadata_components = []
        metadata_docstrings = []

        for metadata_item in metadata:
            metadata_components.append(metadata_item["name"])
            metadata_docstrings.append(metadata_item["doc_string"])
            # print(f"-----{metadata_item['name']}-----")
            # for arg in metadata_item['args'].args:
            #     print(arg.arg)
            # for default in metadata_item['args'].defaults:
            #     if isinstance(default, ast.NameConstant):
            #         print(default.value)
            #     elif isinstance(default, ast.Num):
            #         print(default.n)
            #     elif isinstance(default, ast.Str):
            #         print(default.s)
            #     elif isinstance(default, ast.Tuple):
            #         print(default.elts)
            #     else:
            #         print(default)

        response_index = 1
        for widget_component in widget_components:
            if "specific_render" not in widget_components[widget_component] and widget_component in metadata_components:
                widget_metadata["components"].append(
                    {
                        "name": widget_component,
                        "group": widget_group,
                        "output": f"response_{response_index}",
                        "docstring": metadata_docstrings[metadata_components.index(widget_component)],
                    }
                )
                response_index += 1

        widget_metadata["test_code_name_prefix"] = test_code_name_prefix
        widget_metadata["test_code_import"] = test_code_import
        widget_metadata["test_code_import_group"] = test_code_import_group
        widget_metadata["test_code_import_widget"] = test_code_import_widget

    response_docstrings = []
    response_codesource = "#BEGIN WIDGET CODE BELOW...\n\n"
    current_lineno = 3
    for component in widget_metadata["components"]:
        if "test_code_import" in widget_metadata and "test_code_name_prefix" in widget_metadata and "name" in component:
            response_codesource += f"from codex_widget_factory.{widget_metadata['test_code_import']} import {component['name']} as {widget_metadata['test_code_name_prefix']}_{component['name']}\n"
            response_codesource += (
                f"{component['output']} = {widget_metadata['test_code_name_prefix']}_{component['name']}()\n\n"
            )
            response_docstrings.append({"docstring": component["docstring"], "lineno": current_lineno + 1})
            current_lineno += 3
        elif "test_code_import" in widget_metadata and "test_code_name_prefix" in widget_metadata:
            response_codesource += "#importing the base widget code\n"
            response_codesource += f"from codex_widget_factory.{widget_metadata['test_code_import_group']} import {widget_metadata['test_code_import_widget']} as {widget_metadata['test_code_name_prefix']}\n\n"
            current_lineno += 3
    response_codesource += "\n#END WIDGET CODE\n\n"

    return {"sourcecode": response_codesource, "docstrings": response_docstrings}
