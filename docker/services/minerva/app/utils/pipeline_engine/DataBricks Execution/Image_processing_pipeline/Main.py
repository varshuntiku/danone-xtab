# Databricks notebook source
import json
import logging

from azure.storage.blob import BlobServiceClient

connection_string = dbutils.widgets.get("blob_connection_url")  # noqa: F821
container_name = dbutils.widgets.get("container_name")  # noqa: F821
json_file_name = dbutils.widgets.get("config_file_name")  # noqa: F821
temp_folder_path_preprocessing = dbutils.widgets.get("temp_folder_path_preprocessing")  # noqa: F821
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_client = blob_service_client.get_container_client(container_name)
blob_client = container_client.get_blob_client(json_file_name)
content = blob_client.download_blob().readall()
json_data = json.loads(content.decode("utf-8"))

pipeline_failed = False

# COMMAND ----------

# MAGIC %sh
# MAGIC sudo apt-get clean
# MAGIC sudo rm -rf /var/lib/apt/lists/*
# MAGIC sudo apt-get update
# MAGIC sudo apt install -y libreoffice
# MAGIC apt-get install -y libmagickwand-dev

# COMMAND ----------

import subprocess

policy_file = "/etc/ImageMagick-6/policy.xml"  # Adjust the path as needed

policy_command = f'sudo sed -i \'s/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/\' {policy_file}'

try:
    subprocess.run(policy_command, shell=True, check=True)
    logging.warning("ImageMagick policy updated successfully.")
except subprocess.CalledProcessError as e:
    logging.warning(f"Error updating ImageMagick policy: {e}")
    pipeline_failed = True

# COMMAND ----------

try:
    from Utils import Loaderfactory
except Exception as e:
    logging.warning(e)
    pipeline_failed = True

# COMMAND ----------

try:
    job_config = json.loads(json_data.get("job_config"))  # noqa: F821

    config_host_type = job_config["embedding_model"]["host"]

    unstructured_schema_name = json_data.get("unstructured_schema_name")  # noqa: F821

    CONNECTION_STRING = json_data.get("connection_string")  # noqa: F821

    Metadata_documents = json.loads(json_data.get("data"))  # noqa: F821

    blob_Metadata = None

    blob_Metadata = json.loads(json_data.get("blob_metadata"))  # noqa: F821

except Exception as e:
    logging.warning(e)
    pipeline_failed = True


# COMMAND ----------

try:
    not_Processed_Document_List = Loaderfactory(
        Metadata_documents, blob_Metadata, temp_folder_path_preprocessing
    ).load_files()
except Exception as e:
    logging.error(e)
    pipeline_failed = True
