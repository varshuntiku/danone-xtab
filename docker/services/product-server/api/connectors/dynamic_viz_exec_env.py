import gzip
import json

import requests
from flask import current_app as app


class ExecutionEnvInterface:
    def check_env_status(self) -> bool:
        pass

    def create_env(self):
        pass

    def stop_env(self):
        pass

    def start_env(self):
        pass

    def submit_job(self, job_params):
        pass

    def run_interface_api(self, params, endpoint):
        return requests.post(endpoint, json=params)


class ExecutionEnvDynamicViz(ExecutionEnvInterface):
    def __init__(self, py_version=False, py_requirements=False):
        self.py_version = py_version
        self.py_requirements = py_requirements
        self.logs = ""

    def run_interface_api(self, params, endpoint, access_token):
        DOMAIN = app.config["DYNAMIC_EXEC_ENV_URL"]

        return requests.post(
            "%s/%s" % (DOMAIN, endpoint),
            data=gzip.compress(bytes(json.dumps(params), "utf-8")),
            headers={"Authorization": access_token, "content-encoding": "gzip"},
        )

    def create_env(self, name, exec_env_id, access_token, py_version=False, py_requirements=False):
        params = {"env_id": str(exec_env_id)}

        if py_version:
            params["py_version"] = py_version

        if py_requirements:
            params["package_list"] = py_requirements

        response = self.run_interface_api(params, "create-env", access_token)
        response_data = json.loads(gzip.decompress(response.content).decode("utf-8"))
        if response.status_code == 200:
            return response_data
        else:
            print(
                "Error launching cluster: %s: %s"
                % (
                    response_data["status"],
                    (response_data["pyenv_creation_logs"] + response_data["pyenv_package_installation_logs"]),
                )
            )
