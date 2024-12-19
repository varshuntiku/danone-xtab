#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging
import os
import subprocess
import time

from api.constants.functions import get_clean_postdata, json_response
from api.middlewares import login_required
from flask import Blueprint, current_app, json, request
from flask_cors import CORS

bp = Blueprint("App", __name__)

CORS(bp)

# helpers


def create_python_version(python_version):
    """
    Create python execution environment with python version as parameter

    Parameters:
    python_version (str): python version of execution environment to be created

    Returns:
    None
    """
    commands = """
    source ~/.bashrc
    conda install python={version} -y
    """.format(
        version=python_version
    )

    logs = ""
    status = True
    newline_break = "\n"

    result = subprocess.run(commands, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    if result.stderr:
        logs += newline_break.join([res.decode() for res in result.stderr.splitlines()])
        status = False

    logs += newline_break.join([res.decode() for res in result.stdout.splitlines()])

    return {"status": status, "logs": logs}


def create_python_virtual_environment(python_version, environment_name):
    """
    Create a virtual environemnt within a specificed python execution environment
    Parameters:
    python_version (str): python version of virtual environment
    environment_name (str): Virtual environemnt name

    Returns:
    pyenv output
    """

    commands = """
    source ~/.bashrc
    if ! {{ conda env list | grep '{env_name}_{version}'; }} >/dev/null 2>&1;
    then
        if {{ conda env list | grep 'base_{version}'; }} >/dev/null 2>&1;
        then
            conda create -n {env_name}_{version} --clone base_{version} -y
        else
            conda create -n {env_name}_{version} python={version} -y
        fi;
    fi;
    """.format(
        version=python_version, env_name=environment_name
    )
    result = subprocess.run(commands, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    stdout = [res.decode() for res in result.stdout.splitlines()]
    stderr = [res.decode() for res in result.stderr.splitlines()]
    logging.info(stdout)
    if stderr:
        # do not throw error for case where venv already exists
        if any("CondaValueError: prefix already exists:" in stderrVal for stderrVal in stderr):
            stdout = stdout + stderr[:]
            stderr = []
        else:
            logging.error(stderr)
    return "\n".join(stdout), "\n".join(stderr)


def install_venv_packages(python_version, environment_name, package_list, root_path=False):
    """
    Install list of packages in a specified virtual environment

    Parameters:
    python_version (str): python version of virtual environment
    environment_name (str): Virtual environemnt name
    package_list (list): List of packages with package name and description

    Returns:
    None

    _________________________________________________________________________

    The dictonary structure for the `package_list` parameter is as follows -
    ```
    numpy==1.20.0
    pandas==1.3.0
    ```
    """
    try:
        requirement_filename = "requirements_" + str(time.time()) + ".txt"
        if root_path is not True:
            requirement_filename = os.path.join(
                os.path.dirname(current_app.instance_path),
                "widget_factory_lite_module",
                requirement_filename,
            )
        with open(requirement_filename, "w") as req_file:
            req_file.write(package_list)
        commands = """
        source ~/.bashrc
        conda install -n {env_name}_{version} -c conda-forge --file {requirements_file} -y
        """.format(
            version=python_version,
            env_name=environment_name,
            requirements_file=requirement_filename,
        )
        result = subprocess.run(commands, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout = [res.decode() for res in result.stdout.splitlines()]
        stderr = [res.decode() for res in result.stderr.splitlines()]
        logging.info(stdout)
        if stderr:
            logging.error(stderr)
        return "\n".join(stdout), "\n".join(stderr)
    except Exception as e:
        return str(e)
    finally:
        os.remove(requirement_filename)


def execute_code_string(python_version, environment_name, code_string, injected_vars):
    """
    Execute a python script within a specified virtual environemnt and
    parse the output variable back using stdout

    Parameters:
    python_version (str): python version of virtual environment
    environment_name (str): Virtual environemnt name
    code_string (str): code string to be executed
    injected_vars (dict): dictionary of variables to be injected

    Returns:
    status (str): success or failure
    code_string_output (dict): dict of code string output stored in `code_outputs` variable
    logs (list): execution logs - stdout and stderr
    _________________________________________________________________________

    The variable `code_outputs` needs to be defined in order to return data from python script.
    """
    try:
        # import widget factory lite and inject required vars to code
        # append print statement to final output - this is required to parse the final output from stdlogs
        code_string = """
import json
__injected_variables__ = json.loads('{injected_vars}')
if __injected_variables__:
    for k, v in __injected_variables__.items():
        exec("{{var_name}} = v".format(var_name=k))
######### Begin UIaC #########

{uiac_code}

######### End of UIaC #########

print("___EXEC_ENV_JSON_OUTPUT___",json.dumps(code_outputs))
""".format(
            injected_vars=json.dumps(injected_vars), uiac_code=code_string
        )
        # write to file
        # TODO: BEFORE MAKING RUNPY NEED TO MAKE SURE THERE ARE NO MALICIOUS CODE
        execution_filename = "code_string_exec_" + str(time.time()) + ".py"
        execution_filename = os.path.join(
            os.path.dirname(current_app.instance_path),
            "widget_factory_lite_module",
            execution_filename,
        )
        with open(execution_filename, "w") as code_file:
            code_file.write(code_string)
        commands = """
            source ~/.bashrc
            conda activate {env_name}_{version}
            python -W ignore {file}
            """.format(
            version=python_version, env_name=environment_name, file=execution_filename
        )
    except Exception as e:
        return {"status": "error", "code_string_output": "{}", "logs": str(e)}
    try:
        result = subprocess.run(commands, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout = [res.decode() for res in result.stdout.splitlines()]
        # ignore warning on pyenv shell activation
        stderr = [
            res.decode()
            for res in result.stderr.splitlines()
            if "pyenv-virtualenv: prompt changing will be removed from future release." not in res.decode()
        ]
        logging.info("======== Code String execution logs  ========")
        if stderr:
            logging.error("code string logs = {var}".format(var=str(stdout + stderr)))
        else:
            logging.info("code string logs = {var}".format(var=str(stdout)))
        logging.info("==============================================")
        code_string_output = {}
        for index, output in enumerate(stdout):
            if "___EXEC_ENV_JSON_OUTPUT___" in output:
                code_string_output = json.loads(output.split("___EXEC_ENV_JSON_OUTPUT___", 1)[1])
                del stdout[index]
                break
    except Exception as e:
        logging.error("######### Error executing code string #########" + str(e))
        code_string_output = "{}"
    finally:
        os.remove(execution_filename)
    return {
        "status": "error" if stderr else "success",
        "code_string_output": code_string_output,
        "logs": "\n".join(stdout + stderr),
    }


@bp.route("/codex-exec-api/create-env", methods=["POST"])
@login_required
def create_env():
    try:
        request_data = get_clean_postdata(request)
        env_id = request_data["env_id"]
        py_version = request_data["py_version"]
        if "package_list" in request_data:
            package_list = request_data["package_list"]
        else:
            package_list = ""
    except Exception as error_msg:
        logging.error("Error extracting request data - " + str(error_msg))
        return json_response({"status": "error", "msg": "Error while loading post-data"})
    # create virtual environment
    try:
        pyenv_create_stdout, pyenv_create_stderr = create_python_virtual_environment(
            python_version=py_version, environment_name=env_id
        )
        if pyenv_create_stderr:
            logging.error("Error creating python environment - " + str(pyenv_create_stderr))
            return json_response(
                {
                    "status": "error",
                    "pyenv_creation_logs": "Error creating python environment" + str(pyenv_create_stderr),
                }
            )
    except Exception as error_msg:
        logging.error("Error creating python environment - " + str(error_msg))
        return json_response(
            {
                "status": "error",
                "pyenv_creation_logs": "Error creating python environment" + str(error_msg),
            }
        )
    # install packages
    if package_list != "":
        try:
            (
                pyenv_package_install_stdout,
                pyenv_package_install_stderr,
            ) = install_venv_packages(
                python_version=py_version,
                environment_name=env_id,
                package_list=package_list,
            )
            if pyenv_package_install_stderr:
                logging.error("Error installing packages in pyenv environment - " + str(pyenv_package_install_stderr))
                return json_response(
                    {
                        "status": "error",
                        "pyenv_creation_logs": pyenv_create_stdout,
                        "pyenv_package_installation_logs": "Error installing packages - "
                        + str(pyenv_package_install_stderr),
                    }
                )
        except Exception as error_msg:
            logging.error("Error installing packages in pyenv environment - " + str(error_msg))
            return json_response(
                {
                    "status": "error",
                    "pyenv_creation_logs": pyenv_create_stdout,
                    "pyenv_package_installation_logs": "Error installing packages - " + str(error_msg),
                }
            )
    else:
        pyenv_package_install_stdout = "No packages installed"
    return json_response(
        {
            "status": "success",
            "pyenv_creation_logs": pyenv_create_stdout,
            "pyenv_package_installation_logs": pyenv_package_install_stdout,
        },
        content_encoding="gzip",
    )


@bp.route("/codex-exec-api/install-env-packages", methods=["POST"])
@login_required
def install_env_packages():
    try:
        request_data = get_clean_postdata(request)
        env_id = request_data["env_id"]
        if "py_version" in request_data:
            py_version = request_data["py_version"]
        else:
            logging.error("Unable to install packages, python version needs to passed as a parameter")
            return json_response(
                {
                    "status": "error",
                    "msg": "Unable to install packages, python version needs to passed as a parameter",
                }
            )
        if "package_list" in request_data:
            package_list = request_data["package_list"]
        else:
            package_list = ""
            logging.error("No package list sent")
            return json_response(
                {
                    "status": "error",
                    "msg": "Unable to install packages, no package list sent",
                }
            )
    except Exception as error_msg:
        logging.error("Error extracting request data - " + str(error_msg))
        return json_response({"status": "error", "msg": "Error while loading post-data"})
    # install packages
    if package_list != "":
        try:
            (
                pyenv_package_install_stdout,
                pyenv_package_install_stderr,
            ) = install_venv_packages(
                python_version=py_version,
                environment_name=env_id,
                package_list=package_list,
            )
            if pyenv_package_install_stderr:
                logging.error("Error installing packages in pyenv environment - " + str(pyenv_package_install_stderr))
                return json_response(
                    {
                        "status": "error",
                        "pyenv_package_installation_logs": "Error installing packages - "
                        + str(pyenv_package_install_stderr),
                    }
                )
            else:
                return json_response(
                    {
                        "status": "success",
                        "pyenv_package_installation_logs": pyenv_package_install_stdout,
                    }
                )
        except Exception as error_msg:
            logging.error("Error installing packages in pyenv environment - " + str(error_msg))
            return json_response(
                {
                    "status": "error",
                    "pyenv_package_installation_logs": "Error installing packages - " + str(error_msg),
                },
                content_encoding="gzip",
            )


@bp.route("/codex-exec-api/execute", methods=["POST"])
@login_required
def execute():
    try:
        request_data = get_clean_postdata(request)
        code_string = request_data["code_string"]
        params = request_data["params"]
        py_version = request_data["py_version"]
        env_id = request_data["env_id"]
    except Exception as error_msg:
        return json_response(
            {
                "status": "error",
                "msg": "Error while loading post-data: " + str(error_msg),
            }
        )
    result = execute_code_string(
        python_version=py_version,
        environment_name=env_id,
        code_string=code_string,
        injected_vars=params,
    )
    return json_response(result, content_encoding="gzip")
