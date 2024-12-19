import json
import logging
from typing import Any

from api.configs.settings import get_app_settings
from api.daos.apps.app_dao import AppDao

# from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.daos.code_executor.executor_dao import ExecJobDao
from api.utils.http_util import post
from cryptography.fernet import Fernet

settings = get_app_settings()
app_dao = AppDao()
execution_env_dao = ExecJobDao()


def get_dsstore_ingested_code(app_info):
    try:
        app_project_mapping = app_dao.get_app_project_mapping(app_info.id)
        project_id = None
        if app_project_mapping:
            project_id = app_project_mapping.project_id
        if not project_id:
            return ""
        return f"""
import dsstore
dsstore.set_vars(
    dsstore_backend_uri="{settings.DSSTORE_BACKEND_URI}",
    project_id=str({project_id})
)
"""
    except Exception as e:
        logging.error(f"Error in fetching project id for app {app_info.id}: {str(e)}")
        return ""


def generate_service_endpoint(endpoint, namespace):
    # extracting service name from endpoint
    service_name = str(endpoint).split("deployment/")[1].replace("/execute", "")
    return f"http://{service_name}-service.{namespace}.svc.cluster.local/execute"


def fetch_service_endpoint(app_info):
    executor_id = 0
    deployment_name_space = settings.DEPLOYMENT_NAMESPACE
    try:
        executor_app_mapping = execution_env_dao.get_app_dynamic_execution_env_by_app_id(app_info.id)
        if executor_app_mapping:
            executor_id = executor_app_mapping.env_id
            executor_info = execution_env_dao.get_dynamic_execution_env_by_id(executor_id)
            if executor_info and str(executor_info.status).lower() == "running":
                endpoint = generate_service_endpoint(
                    # f"{executor_info.name}-{executor_info.id}-service",
                    executor_info.endpoint,
                    deployment_name_space,
                )
                return True, endpoint, executor_id
        default_exec_env = execution_env_dao.get_default_execution_env()
        if default_exec_env:
            executor_id = default_exec_env.id
            endpoint = generate_service_endpoint(
                # f"{default_exec_env.name}-{default_exec_env.id}-service",
                default_exec_env.endpoint,
                deployment_name_space,
            )
            return True, endpoint, executor_id
        endpoint = (
            app_info.executor_endpoint
            if hasattr(app_info, "executor_endpoint")
            else (settings.DYNAMIC_EXEC_ENV_EXECUTE_URL if settings.DYNAMIC_EXEC_ENV_EXECUTE_URL else None)
        )
        return True, endpoint, executor_id
    except Exception as e:
        return False, str(e), executor_id


def fetch_endpoint(app_info, service_based_connection=settings.INTERNAL_SERVICE_CONNECTION_ENABLED):
    executor_id = 0
    if service_based_connection:
        return fetch_service_endpoint(app_info)
    try:
        executor_app_mapping = execution_env_dao.get_app_dynamic_execution_env_by_app_id(app_info.id)
        if executor_app_mapping:
            executor_id = executor_app_mapping.env_id
            executor_info = execution_env_dao.get_dynamic_execution_env_by_id(executor_id)
            if executor_info and str(executor_info.status).lower() == "running":
                endpoint = executor_info.endpoint
                return True, endpoint, executor_id
        default_exec_env = execution_env_dao.get_default_execution_env()
        if default_exec_env:
            executor_id = default_exec_env.id
            endpoint = default_exec_env.endpoint
            return True, endpoint, executor_id
        endpoint = (
            app_info.executor_endpoint
            if hasattr(app_info, "executor_endpoint")
            else (settings.DYNAMIC_EXEC_ENV_EXECUTE_URL if settings.DYNAMIC_EXEC_ENV_EXECUTE_URL else None)
        )
        return True, endpoint, executor_id
    except Exception as e:
        return False, str(e), executor_id


def get_data_from_api_response(response):
    try:
        return False, response.json()["data"]
    except Exception as e:
        return True, str(e)


def get_logs_errors_time_from_api_response(executor_response):
    try:
        response = executor_response["results"][0]
        return {
            "logs": response["stdout_output"] if response["stdout_output"] else response["stdout_output"],
            "errors": response["stderr_output"],
            "time_taken": executor_response["time_taken"],
        }
    except Exception as e:
        return {
            "logs": "",
            "errors": str(e),
            "time_taken": -1,
        }


def execute_code_string_exec_env(endpoint: str, code_string: str, code_strings: list = []) -> Any:
    """Executes the code string passed

    Args:
        code_string: the code string to execute

    Returns:
        the result of the code execution
    """
    code_string = [
        {
            "code_string": code_string,
        }
    ]
    if len(code_strings) != 0:
        code_string.append({"code_string": code_strings[0]})

    request_body = {
        "code_strings": code_string,
    }
    no_error, response = post(endpoint, data=request_body)
    return no_error, response


def insert_app_functions_variables(app_info, injected_vars, code_string, exclude_app_functions=False):
    fernet = Fernet(settings.CRYPTO_ENCRYPTION_KEY)
    app_variables = (
        json.loads(fernet.decrypt(app_info.variables.encode()).decode()) if app_info.variables is not None else {}
    )

    if exclude_app_functions:
        app_functions = []
    else:
        if app_info.function_defns:
            app_functions = json.loads(fernet.decrypt(app_info.function_defns.encode()).decode())
        else:
            app_functions = []

    app_functions_dict = {x["key"]: x["value"] for x in app_functions}
    if hasattr(app_info, "current_function"):
        app_functions_dict[app_info.current_function["key"]] = app_info.current_function["value"]
    injected_vars["_codx_app_vars_"] = app_variables
    dsstore_ingested_code = get_dsstore_ingested_code(app_info)
    injected_code = f"""
{dsstore_ingested_code}
class DotDict(dict):
    __getattr__ = dict.__getitem__
    __setattr__ = dict.__setitem__
    __dir__ = lambda self: self.keys()

# _codx_app_vars_=injected_vars['_codx_app_vars_']
g_keys = globals()
for var, value in {injected_vars}.items():
    # if var != '_codx_app_vars_':
    g_keys[var] = value
app_functions_dict = {app_functions_dict}
def import_app_func(key):
    d = DotDict()
    d.update(g_keys)
    actual_function = app_functions_dict[key] if key in app_functions_dict else None
    # [x for x in app_functions if x["key"]==key]
    # actual_function = actual_function[0]
    if actual_function:
        exec(actual_function, d)
    return d
"""
    injected_code_lines_len = len(injected_code.splitlines())
    code_string_updated = injected_code + code_string
    return code_string_updated, injected_code_lines_len
