# Databricks notebook source
import json
import logging

import requests

job_status_update_auth_token = dbutils.widgets.get("job_status_update_auth_token")  # noqa: F821
minerva_host_url = dbutils.widgets.get("minerva_host_url")  # noqa: F821

context = json.loads(dbutils.notebook.entry_point.getDbutils().notebook().getContext().toJson())  # noqa: F821
run_id = context["tags"]["multitaskParentRunId"]
headers = {"token": job_status_update_auth_token}
payload = {"run": {"run_id": run_id}, "event_type": "jobs.on_start"}

requests.post(minerva_host_url + "/admin/app/job/status", data=json.dumps(payload), headers=headers)

pipeline_failed = False

# COMMAND ----------

api_token = dbutils.widgets.get("azure_databricks_token")  # noqa: F821
api_endpoint = dbutils.widgets.get("azure_databricks_pipeline_url")  # noqa: F821
api_url = "/".join(api_endpoint.split("/")[:3])

# COMMAND ----------

pipeline_failed = False

try:
    config_file_names = json.loads(dbutils.widgets.get("config_file_names"))  # noqa: F821
    blob_connection_url = dbutils.widgets.get("blob_connection_url")  # noqa: F821
    container_name = dbutils.widgets.get("container_name")  # noqa: F821
    minerva_application_id = dbutils.widgets.get("minerva_application_id")  # noqa: F821
    minerva_env_name = dbutils.widgets.get("minerva_env_name")  # noqa: F821
    temp_folder_path_preprocessing = dbutils.widgets.get("temp_folder_path_preprocessing")  # noqa: F821
except Exception as e:
    logging.warning(e)
    pipeline_failed = True


# COMMAND ----------

tasks_lists = []
depends_on_list = []
for i in range(len(config_file_names)):
    task_1_image = {
        "task_key": "Minerva_summary_task_" + str(i),
        "new_cluster": {
            "num_workers": 0,
            "spark_version": "13.0.x-scala2.12",
            "spark_conf": {"spark.databricks.cluster.profile": "singleNode", "spark.master": "local[*, 8]"},
            "azure_attributes": {"first_on_demand": 1, "availability": "ON_DEMAND_AZURE", "spot_bid_max_price": -1},
            "node_type_id": "Standard_DS4_v2",
            "driver_node_type_id": "Standard_DS4_v2",
            "ssh_public_keys": [],
            "custom_tags": {"ResourceClass": "SingleNode"},
            "spark_env_vars": {},
            "enable_elastic_disk": True,
            "init_scripts": [],
            "enable_local_disk_encryption": False,
            "data_security_mode": "NONE",
            "runtime_engine": "STANDARD",
        },
        "libraries": [
            {"pypi": {"package": "python-pptx==0.6.22"}},
            {"pypi": {"package": "langchain==0.0.304"}},
            {"pypi": {"package": "BeautifulSoup4==4.12.2"}},
            {"pypi": {"package": "openai==0.28.1"}},
            {"pypi": {"package": "pgvector==0.2.0"}},
            {"pypi": {"package": "docx2txt==0.8"}},
            {"pypi": {"package": "pypdf==3.16.2"}},
        ],
        "notebook_task": {
            "notebook_path": "/Repos/Minerva_Pgvector_embedding_"
            + minerva_env_name
            + "/codex/docker/services/minerva/app/utils/pipeline_engine/DataBricks Execution/Summary_processing_pipeline/Main",
            "base_parameters": {
                "config_file_name": config_file_names[i],
                "blob_connection_url": blob_connection_url,
                "container_name": container_name,
                "temp_folder_path_preprocessing": temp_folder_path_preprocessing,
            },
        },
    }

    task2_summary = {
        "task_key": "Minerva_image_task_" + str(i),
        "new_cluster": {
            "num_workers": 0,
            "spark_version": "13.0.x-scala2.12",
            "spark_conf": {"spark.databricks.cluster.profile": "singleNode", "spark.master": "local[*, 8]"},
            "azure_attributes": {"first_on_demand": 1, "availability": "ON_DEMAND_AZURE", "spot_bid_max_price": -1},
            "node_type_id": "Standard_DS4_v2",
            "driver_node_type_id": "Standard_DS4_v2",
            "ssh_public_keys": [],
            "custom_tags": {"ResourceClass": "SingleNode"},
            "spark_env_vars": {},
            "enable_elastic_disk": True,
            "init_scripts": [],
            "enable_local_disk_encryption": False,
            "data_security_mode": "NONE",
            "runtime_engine": "STANDARD",
        },
        "libraries": [
            {"pypi": {"package": "python-pptx==0.6.22"}},
            {"pypi": {"package": "unoconv==0.9.0"}},
            {"pypi": {"package": "Wand==0.6.13"}},
        ],
        "notebook_task": {
            "notebook_path": "/Repos/Minerva_Pgvector_embedding_"
            + minerva_env_name
            + "/codex/docker/services/minerva/app/utils/pipeline_engine/DataBricks Execution/Image_processing_pipeline/Main",
            "base_parameters": {
                "config_file_name": config_file_names[i],
                "blob_connection_url": blob_connection_url,
                "container_name": container_name,
                "temp_folder_path_preprocessing": temp_folder_path_preprocessing,
            },
        },
    }
    if len(config_file_names) == 1:
        del task_1_image["new_cluster"]
        del task2_summary["new_cluster"]
        del task_1_image["libraries"]
        del task2_summary["libraries"]
        task_1_image.update({"existing_cluster_id": "0303-085103-xqgn6ndh"})
        task2_summary.update({"existing_cluster_id": "0303-085103-xqgn6ndh"})
    depends_on_list += [{"task_key": "Minerva_image_task_" + str(i)}, {"task_key": "Minerva_summary_task_" + str(i)}]
    tasks_lists += [task_1_image, task2_summary]

tasks_lists.append(
    {
        "task_key": "Minerva_clean_up_task",
        "existing_cluster_id": "0303-085103-xqgn6ndh",
        "notebook_task": {
            "notebook_path": "/Repos/Minerva_Pgvector_embedding_"
            + minerva_env_name
            + "/codex/docker/services/minerva/app/utils/pipeline_engine/DataBricks Execution/parallel_dynamic_end_task",
            "base_parameters": {
                "config_file_names": json.dumps(config_file_names),
                "api_url": api_url,
                "api_token": api_token,
                "job_status_update_auth_token": job_status_update_auth_token,
                "minerva_host_url": minerva_host_url,
                "blob_connection_url": blob_connection_url,
                "container_name": container_name,
                "minerva_application_id": minerva_application_id,
                "start_task_run_id": run_id,
            },
        },
        "depends_on": depends_on_list,
    }
)

# COMMAND ----------

job_config_tasks = {"name": "JOB", "tasks": tasks_lists}

# COMMAND ----------

api_endpoint = api_url + "/api/2.1/jobs/runs/submit"

job_config_tasks_json = json.dumps(job_config_tasks)

headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json",
}

response = requests.post(api_endpoint, headers=headers, data=job_config_tasks_json)

if response.status_code == 200:
    print("Job created successfully.")
    print(response.json())
else:
    print(f"Job creation failed with status code {response.status_code}.")
    print(response.text)
