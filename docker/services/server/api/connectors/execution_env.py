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

    def run_interface_api(self, endpoint, params):
        return requests.post(endpoint, json=params)


class ExecutionEnvDynamicViz(ExecutionEnvInterface):
    def __init__(self, py_version=False, py_requirements=False):
        self.py_version = py_version
        self.py_requirements = py_requirements
        self.logs = ""

    def run_interface_api(self, endpoint, params):
        DOMAIN = app.config["DYNAMIC_EXEC_ENV_URL"]

        return requests.post("%s/%s" % (DOMAIN, endpoint), json=params)

    def create_env(self, name, exec_env_id, py_version=False, py_requirements=False):
        params = {"env_id": str(exec_env_id)}

        if py_version:
            params["py_version"] = py_version

        if py_requirements:
            params["package_list"] = py_requirements

        response = self.run_interface_api("create-env", params)

        if response.status_code == 200:
            return response.json()
        else:
            print("Error launching cluster: %s: %s" % (response.json()["error_code"], response.json()["message"]))


class ExecutionEnvAzureDatabricks(ExecutionEnvInterface):
    def __init__(self, py_version=False, py_requirements=False, codx_widget_factory_version=False):
        self.py_version = py_version
        self.py_requirements = py_requirements
        self.codx_widget_factory_version = codx_widget_factory_version
        self.logs = ""

    def run_interface_api(self, endpoint, params):
        DOMAIN = app.config["AZURE_DATABRICKS_DOMAIN"]
        TOKEN = app.config["AZURE_DATABRICKS_PERSONALACCESSTOKEN"]

        return requests.post(
            "%s/%s" % (DOMAIN, endpoint),
            headers={"Authorization": "Bearer %s" % TOKEN},
            json=params,
        )

    def create_env(self, name, exec_env_id=False, config=False):
        init_scripts = []

        if not config:
            config = {"codex_widget_factory": False, "cats": False}

        if config["codex_widget_factory"]:
            init_scripts.append({"dbfs": {"destination": app.config["AZURE_DATABRICKS_INSTALL_CODX_WF_SCRIPTPATH"]}})

        if config["cats"]:
            init_scripts.append({"dbfs": {"destination": app.config["AZURE_DATABRICKS_INSTALL_CATS_SCRIPTPATH"]}})

        response = self.run_interface_api(
            "api/2.0/clusters/create",
            {
                "cluster_name": name,
                "spark_version": "9.1.x-scala2.12",
                "node_type_id": "Standard_DS3_v2",
                "num_workers": 0,
                "spark_conf": {
                    "spark.databricks.cluster.profile": "singleNode",
                    "spark.master": "local[*]",
                    "CODX_EXEC_ENV_ID": exec_env_id,
                },
                "spark_env_vars": {"CODX_EXEC_ENV_ID": exec_env_id},
                "init_scripts": init_scripts,
                "custom_tags": {
                    "ResourceClass": "SingleNode",
                    "CODX_EXEC_ENV_ID": exec_env_id,
                },
            },
        )

        if response.status_code == 200:
            return response.json()["cluster_id"]
        else:
            print("Error launching cluster: %s: %s" % (response.json()["error_code"], response.json()["message"]))

    def check_env_status(self, cluster_id):
        response = self.run_interface_api("api/2.0/clusters/get", {"cluster_id": cluster_id})

        if response.status_code == 200:
            return response.json()["state"]
        else:
            print("Error launching cluster: %s: %s" % (response.json()["error_code"], response.json()["message"]))

    def stop_env(self, cluster_id):
        response = self.run_interface_api("api/2.0/clusters/permanent-delete", {"cluster_id": cluster_id})

        if response.status_code == 200:
            print(response.json())
        else:
            print("Error launching cluster: %s: %s" % (response.json()["error_code"], response.json()["message"]))

    def start_env(self, cluster_id):
        response = self.run_interface_api("api/2.0/clusters/start", {"cluster_id": cluster_id})

        if response.status_code == 200:
            print(response.json())
        else:
            print("Error launching cluster: %s: %s" % (response.json()["error_code"], response.json()["message"]))

    def submit_job(self, job_params):
        if not job_params["job_id"]:
            response = self.run_interface_api(
                "api/2.0/jobs/create",
                {
                    "name": job_params["name"],
                    "existing_cluster_id": job_params["cluster_id"],
                    "spark_python_task": {
                        "python_file": job_params["exec_filepath"],
                        "parameters": ["yes" if job_params["notebook_execute"] else "no"],
                    },
                },
            )

            if response.status_code == 200:
                job_id = response.json()["job_id"]
            else:
                print(
                    "Error submitting job to cluster: %s: %s"
                    % (response.json()["error_code"], response.json()["message"])
                )
        else:
            job_id = job_params["job_id"]

        exec_response = self.run_interface_api("api/2.0/jobs/run-now", {"job_id": job_id})

        if exec_response.status_code == 200:
            return {"run_id": exec_response.json()["run_id"], "job_id": job_id}
        else:
            print(
                "Error submitting job to cluster: %s: %s"
                % (exec_response.json()["error_code"], exec_response.json()["message"])
            )
