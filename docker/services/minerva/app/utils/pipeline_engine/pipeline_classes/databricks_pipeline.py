import json
from io import BytesIO

import requests
from app.schemas.pipeline_engine_schema import JobConfig, MinervaApplicationDocuments
from app.utils.config import get_settings
from app.utils.pipeline_engine.pipeline_base_class import PipelineBase
from app.utils.tools.storage_util import StorageServiceClient, StorageType

settings = get_settings()


class DatabricksPipeline(PipelineBase):
    pipeline_name = "databricks"

    def setup_pipeline_parameters(
        self,
        data: MinervaApplicationDocuments,
        job_config: JobConfig,
        vector_db_conn_string: str,
        minerva_host_url: str,
        job_status_update_auth_token: str,
        unstructured_schema_name: str,
        blob_metadata: dict,
        temp_folder_path: str = "/dbfs/FileStore/minerva_embedding_preprocessing_temp_"
        + settings.MINERVA_ENVIRONMENT_NAME
        + "/preprocessing_temp_folder",
    ):
        azure_databricks_pgvector_pipeline_token = settings.AZURE_DATABRICKS_PGVECTOR_PIPELINE_TOKEN
        azure_databricks_pgvector_pipeline_job_id = settings.AZURE_DATABRICKS_PGVECTOR_PIPELINE_JOB_ID
        self.pipeline_url = settings.AZURE_DATABRICKS_PGVECTOR_PIPELINE_URL

        self.headers = {
            "Authorization": "Bearer " + azure_databricks_pgvector_pipeline_token,
            "Content-Type": "application/json",
        }

        docs_list = data["documents"]

        list_document_configs = []
        if len(docs_list) <= 40:
            docs_index_increment = 8
        elif len(docs_list) <= 500:
            docs_index_increment = len(docs_list) // 5
        else:
            docs_index_increment = 100
        for doc_index in range(0, len(docs_list), docs_index_increment):
            next_range = doc_index + docs_index_increment
            list_document_configs.append(
                {"minerva_application_id": data["minerva_application_id"], "documents": docs_list[doc_index:next_range]}
            )
        if docs_list[next_range:] != []:
            list_document_configs.append(
                {"minerva_application_id": data["minerva_application_id"], "documents": docs_list[next_range:]}
            )

        params_list = []
        for sub_data in list_document_configs:
            params_list.append(
                {
                    "data": json.dumps(sub_data),
                    "job_config": json.dumps(job_config),
                    "connection_string": vector_db_conn_string,
                    "minerva_host_url": minerva_host_url,
                    "job_status_update_auth_token": job_status_update_auth_token,
                    "unstructured_schema_name": unstructured_schema_name,
                    "blob_metadata": json.dumps(blob_metadata),
                }
            )

        storage_client = StorageServiceClient.get_storage_client(StorageType.AZURE_BLOB)
        config_file_names = []
        for i, data_dict in enumerate(params_list):
            json_string = json.dumps(data_dict)
            blob_name = f'config_{data["minerva_application_id"]}_{i}.json'
            config_file_names.append(blob_name)
            data_stream = BytesIO(json_string.encode("utf-8"))
            storage_client.upload(
                container=settings.MINERVA_DATABRICKS_CONFIG_CONTAINER_NAME,
                file_name=blob_name,
                data=data_stream,
                overwrite=True,
            )
            data_stream.close()

        params_dict = {}

        params_dict.update(
            {
                "config_file_names": json.dumps(config_file_names),
                "blob_connection_url": settings.AZURE_STORAGE_CONNECTION_STRING,
                "container_name": settings.MINERVA_DATABRICKS_CONFIG_CONTAINER_NAME,
                "job_status_update_auth_token": job_status_update_auth_token,
                "minerva_host_url": minerva_host_url,
                "azure_databricks_token": azure_databricks_pgvector_pipeline_token,
                "azure_databricks_pipeline_url": self.pipeline_url,
                "minerva_application_id": data["minerva_application_id"],
                "minerva_env_name": settings.MINERVA_ENVIRONMENT_NAME,
                "temp_folder_path_preprocessing": temp_folder_path,
            }
        )

        self.request_body = {"job_id": azure_databricks_pgvector_pipeline_job_id, "notebook_params": params_dict}

    def invoke_pipeline(
        self,
        data: MinervaApplicationDocuments,
        job_config: JobConfig,
        vector_db_conn_string: str,
        minerva_host_url: str,
        job_status_update_auth_token: str,
        unstructured_schema_name: str,
        blob_metadata: dict,
    ):
        self.setup_pipeline_parameters(
            data,
            job_config,
            vector_db_conn_string,
            minerva_host_url,
            job_status_update_auth_token,
            unstructured_schema_name,
            blob_metadata,
        )
        response = requests.post(self.pipeline_url, headers=self.headers, json=self.request_body)
        return response
