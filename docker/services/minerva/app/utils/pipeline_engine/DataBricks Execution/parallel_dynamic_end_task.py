# Databricks notebook source
import json

job_status_update_auth_token = dbutils.widgets.get("job_status_update_auth_token")  # noqa: F821
minerva_host_url = dbutils.widgets.get("minerva_host_url")  # noqa: F821
api_url = dbutils.widgets.get("api_url")  # noqa: F821
api_token = dbutils.widgets.get("api_token")  # noqa: F821
config_file_names = json.loads(dbutils.widgets.get("config_file_names"))  # noqa: F821
minerva_application_id = dbutils.widgets.get("minerva_application_id")  # noqa: F821
start_task_run_id = dbutils.widgets.get("start_task_run_id")  # noqa: F821

# COMMAND ----------

from azure.storage.blob import BlobServiceClient

connection_string = dbutils.widgets.get("blob_connection_url")  # noqa: F821
container_name = dbutils.widgets.get("container_name")  # noqa: F821
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)
for json_file_name in config_file_names:
    blob_client = container_client.get_blob_client(json_file_name)
    blob_client.delete_blob()
    print(f"The blob {json_file_name} has been deleted.")

pipeline_failed = False

# COMMAND ----------

import requests

headers = {
    "Authorization": f"Bearer {api_token}",
    "Content-Type": "application/json",
}

# COMMAND ----------

api_endpoint = api_url + "/api/2.0/clusters/list"
response = requests.get(api_endpoint, headers=headers)

if response.status_code == 200:
    print("Cluster Listed successfully.")
    list_delete_cluster_ids = []
    for cluster in response.json()["clusters"]:
        if (
            cluster["default_tags"].get("RunName") is not None
            and cluster["default_tags"].get("RunName").startswith("Minerva")
            and cluster["state"] == "TERMINATED"
        ):
            list_delete_cluster_ids.append(cluster["cluster_id"])
else:
    print(f"Listing clusters failed with status code {response.status_code}.")
    print(response.text)

# COMMAND ----------

api_endpoint = api_url + "/api/2.0/clusters/permanent-delete"

for cluster_id in list_delete_cluster_ids:
    cluster_data = {"cluster_id": cluster_id}

    cluster_json = json.dumps(cluster_data)

    response = requests.post(api_endpoint, headers=headers, data=cluster_json)

    if response.status_code == 200:
        print("Cluster Deleted successfully.")
    else:
        print(f"Deleting cluster failed with status code {response.status_code}.")
        print(response.text)

# COMMAND ----------

task_output_list = []
for i in range(len(config_file_names)):
    taskkey = "Minerva_summary_task_" + str(i)
    task_output_list += json.loads(
        dbutils.jobs.taskValues.get(taskKey=taskkey, key="not_Processed_Document_List")  # noqa: F821
    )
if task_output_list != []:
    pipeline_failed = True
print(task_output_list)

# COMMAND ----------

headers_job = {"token": job_status_update_auth_token}
payload = {
    "run": {"run_id": start_task_run_id},
    "event_type": "jobs.on_success",
    "not_Processed_Document_List": json.dumps(task_output_list),
    "minerva_application_id": minerva_application_id,
}
if pipeline_failed:
    payload.update({"event_type": "jobs.on_failure"})

requests.post(minerva_host_url + "/admin/app/job/status", data=json.dumps(payload), headers=headers_job)
