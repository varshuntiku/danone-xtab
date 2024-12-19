import gzip
import io
import json
import logging
import os
import runpy
import shutil
import sys
import time
import traceback
from typing import Any, Dict, List

from api.configs.settings import get_app_settings
from api.daos.apps.app_dao import AppDao
from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.databases.dependencies import get_db
from api.helpers.apps.execution_env_helper import ExecutionEnvDynamicViz
from cryptography.fernet import Fernet
from html_sanitizer import Sanitizer

sanitizer = Sanitizer()
settings = get_app_settings()


def sanitize_content(payload: Any) -> Any:
    """Sanitizes the payload passed

    Args:
        payload: the payload to sanitize

    Returns:
        the sanitized payload
    """
    if isinstance(payload, str):
        return sanitizer.sanitize(payload)
    elif isinstance(payload, dict):
        return {key: sanitize_content(value) for key, value in payload.items()}
    elif isinstance(payload, list):
        return [sanitize_content(value) for value in payload]
    else:
        return payload


def execute_code_string_exec_env(
    exec_env_id: int,
    exec_env_version: str,
    injected_vars: Dict,
    code_string: str,
    access_token: str,
    app_functions: List,
) -> Dict:
    """
    Function that executes a code string on remote execution environment

    Args:
        exec_env_id: execution environment id
        exec_env_version: execution environment python version
        injected_vars: injected variables
        code_string: code string to execute
        access_token: access token string
        app_functions: list of app functions

    Returns:
        Dictionary containing code string output, logs, status, lineno after execution
    """
    try:
        exec_env_obj = ExecutionEnvDynamicViz()
        exec_env_response = exec_env_obj.run_interface_api(
            params={
                "env_id": exec_env_id,
                "py_version": exec_env_version,
                "params": injected_vars,
                "code_string": code_string,
                "app_functions": app_functions,
            },
            endpoint="execute",
            access_token=access_token,
        )
        exec_env_response_data = json.loads(gzip.decompress(exec_env_response.content).decode("utf-8"))
        exec_env_response_data["code_string_output"] = {"code_outputs": exec_env_response_data["code_string_output"]}
        return exec_env_response_data
    except Exception as e:
        logging.exception(e)
        response = {
            "code_string_output": {"code_outputs": "{}"},
            "logs": str(e),
            "status": "error",
        }
        return response


def execute_code_string_server(
    code_string: str, injected_vars: Dict, app_functions: List = [], file_prefix: str = "code_string_exec_"
) -> Dict:
    """
    Function that executes a code string locally(same server) using the runpy module

    Args:
        code_string: code string to execute
        injected_vars: injected variables
        app_functions: list of app fucntions
        file_prefix: file prefix

    Returns:
        Dictionary containing code string output, logs, status, lineno after execution
    """
    try:
        # write code string as file to disk
        file_name = (file_prefix + str(time.time())).replace(".", "_").replace("@", "_")
        execution_filename = file_name + ".py"

        code_string = (
            f"""
def import_app_func(key):
    import imp
    return imp.load_source("module_name", "app_func_{file_name}/"  + key.replace("/", "_") + ".py")

"""
            + code_string
        )

        with open(execution_filename, "w") as code_file:
            code_file.write(code_string)
        # execute code string using runpy
        # capture output
        for app_func in app_functions:
            app_func_file_name = "app_func_" + file_name + "/" + app_func["key"].replace("/", "_") + ".py"
            os.makedirs(os.path.dirname(app_func_file_name), exist_ok=True)
            with open(app_func_file_name, "w") as code_file:
                app_fuc_code = (
                    f"""
def import_app_func(key):
    import imp
    return imp.load_source("module_name", "app_func_{file_name}/"  + key.replace("/", "_") + ".py")

_codx_app_vars_={injected_vars['_codx_app_vars_']}

"""
                    + app_func["value"]
                )
                code_file.write(app_fuc_code)

        injected_vars["func_apps_path"] = "app_func_" + file_name + "/"
        old_std_out = sys.stdout
        capture_io = io.StringIO()
        sys.stdout = capture_io
        # BEFORE MAKING RUNPY NEED TO MAKE SURE THERE ARE NO MALICIOUS CODE
        logging.info(f"Before running UIAC:  API: fileprefix: {file_prefix}")
        code_outputs = runpy.run_path(execution_filename, init_globals=injected_vars)
        # close output
        stdout = capture_io.getvalue()
        sys.stdout = old_std_out
        capture_io.close()
        response = {
            "code_string_output": code_outputs,
            "logs": stdout,
            "status": "success",
        }
        return response
    except Exception as error_msg:
        logging.exception(error_msg)
        _, _, exc_tb = sys.exc_info()
        trace = next(
            (trace for trace in traceback.extract_tb(exc_tb) if trace.filename == execution_filename),
            None,
        )
        lineno = (trace.lineno - 5) if trace else (error_msg.lineno - 5) if hasattr(error_msg, "lineno") else None
        response = {
            "code_string_output": {"code_outputs": "{}"},
            "logs": f"line no: {lineno}\n" + str(error_msg) if lineno else str(error_msg),
            "lineno": lineno,
            "status": "error",
        }
        return response
    finally:
        if "capture_io" in vars() or "capture_io" in globals():
            capture_io.close()
        os.remove(execution_filename)
        # os.rmdir("app_func_" + file_postfix+"/")
        shutil.rmtree("app_func_" + file_name + "/", ignore_errors=True)


def execute_code_string(
    app_id: int,
    code_string: str,
    injected_vars: Dict,
    access_token: str,
    exclude_app_functions: bool = False,
    app_functions: List = [],
    file_prefix: str = "code_string_exec_",
) -> Dict:
    """
    This method decides how to execute the UiaC -
     - If exec env configured
        * if app id mapped to app exec env, call execution service
        * if mapping not present - execute on same service (dont call exec service)
    - If exec env not configured - execute on same service (dont call exec service)
    TODO: Add default exec env if exec env URL is configured

    Args:
        app_id: app id
        code_string: code string to execute
        injected_vars: injected variables
        access_token: user auth access token
        exclude_app_functions: flag to exclude app functions
        app_function: list of app functions
        file_prefix: file prefix

    Returns:
        Dictionary containing code string output, logs, status, lineno after execution
    """
    try:
        # get app vars to be injected into the UIaC
        db_session = get_db()
        app_dao = AppDao(db_session)
        execution_env_dao = ExecutionEnvDao(db_session)
        app_info = app_dao.get_app_by_id(app_id=app_id)
        fernet = Fernet(settings.CRYPTO_ENCRYPTION_KEY)
        app_variables = (
            json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
        )

        if exclude_app_functions:
            app_functions = []
        elif not app_functions:
            if app_info.function_defns:
                app_functions = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
            else:
                app_functions = []

        injected_vars["_codx_app_vars_"] = app_variables

        # execute based on dynamic env config
        if settings.DYNAMIC_EXEC_ENV_URL is not None:
            app_exec_env = execution_env_dao.get_app_dynamic_execution_env_by_app_id(app_id=app_id)
            if app_exec_env is not None and app_exec_env.dynamic_env_id is not None:
                exec_env = execution_env_dao.get_dynamic_execution_env_by_id(id=app_exec_env.dynamic_env_id)
                return execute_code_string_exec_env(
                    exec_env.id,
                    exec_env.py_version,
                    injected_vars,
                    code_string,
                    access_token,
                    app_functions,
                )
            else:
                return execute_code_string_server(
                    code_string,
                    injected_vars,
                    app_functions=app_functions,
                    file_prefix=file_prefix,
                )
        else:
            return execute_code_string_server(
                code_string,
                injected_vars,
                app_functions=app_functions,
                file_prefix=file_prefix,
            )
    except Exception as e:
        logging.exception(e)
        return {"code_string_output": None, "status": "error"}
    finally:
        db_session.close()
