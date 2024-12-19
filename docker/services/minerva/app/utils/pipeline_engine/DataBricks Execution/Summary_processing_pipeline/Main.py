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

try:
    import Model_classes.base as base
    import Model_classes.openai_model as openai_model  # noqa: F401
    from Utils import Loaderfactory
except Exception as e:
    logging.warning(e)
    pipeline_failed = True

# COMMAND ----------

try:
    job_config = json.loads(json_data.get("job_config"))  # noqa: F821

    config_host_type = job_config["embedding_model"]["host"]

    unstructured_schema_name = json_data.get("unstructured_schema_name")  # noqa: F821

    embedding_model = base.model_registry[config_host_type]().embedded_model(job_config)

    llm_model = base.model_registry[config_host_type]().llm_model(job_config)

    CONNECTION_STRING = json_data.get("connection_string")  # noqa: F821

    Metadata_documents = json.loads(json_data.get("data"))  # noqa: F821

except Exception as e:
    logging.warning(e)
    pipeline_failed = True


# COMMAND ----------

try:
    embedding_pgvector_metadata = {
        "CONNECTION_STRING": CONNECTION_STRING,
        "embedding_model": embedding_model,
        "unstructured_schema_name": unstructured_schema_name,
    }
    not_Processed_Document_List = Loaderfactory(
        Metadata_documents, embedding_pgvector_metadata, temp_folder_path_preprocessing
    ).load_files(llm_model)
except Exception as e:
    logging.error(e)
    pipeline_failed = True

# COMMAND ----------

dbutils.jobs.taskValues.set(  # noqa: F821
    key="not_Processed_Document_List", value=json.dumps(not_Processed_Document_List)
)
