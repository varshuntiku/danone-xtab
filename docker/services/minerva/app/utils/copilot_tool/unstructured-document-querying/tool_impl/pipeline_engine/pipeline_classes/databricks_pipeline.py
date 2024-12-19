import json
import logging
from io import BytesIO

import requests
from tool_impl.pipeline_engine.pipeline_base_class import PipelineBase
from tool_impl.storage_util import StorageServiceClient, StorageType
from utils.schema import PipelineStatus


class DatabricksPipeline(PipelineBase):
    pipeline_name = "databricks"

    def setup_pipeline_parameters(
        self,
        database_connection_string: str,
        pipeline_authentication_token: str,
        database_schema_name: str,
        image_blob_metadata: dict,
        temp_folder_env_separator: str,
        env_config: dict,
        llm_config: dict,
        embedding_config: dict,
        copilot_tool_id: int,
        blob_connection_url: str,
        config_container_name: str,
        data_sources: list,
        copilot_host_url: str,
        copilot_auth_token: str,
    ):
        temp_folder_path: str = (
            "/dbfs/FileStore/copilot_tool_preprocessing_temp_"
            + temp_folder_env_separator
            + "/preprocessing_temp_folder"
        )
        azure_databricks_pgvector_pipeline_token = env_config.get("azure_databricks_pgvector_pipeline_token")
        azure_databricks_pgvector_pipeline_job_id = env_config.get("azure_databricks_pgvector_pipeline_job_id")
        self.pipeline_url = env_config.get("pipeline_url")

        self.headers = {
            "Authorization": "Bearer " + azure_databricks_pgvector_pipeline_token,
            "Content-Type": "application/json",
        }

        parameters = {
            "llm_config": json.dumps(llm_config),
            "embedding_config": json.dumps(embedding_config),
            "connection_string": database_connection_string,
            "pipeline_authentication_token": pipeline_authentication_token,
            "database_schema_name": database_schema_name,
            "blob_metadata": json.dumps(image_blob_metadata),
            "data_sources": json.dumps(data_sources),
            "copilot_host_url": copilot_host_url,
            "copilot_auth_token": copilot_auth_token,
        }

        try:
            storage_client = StorageServiceClient.get_storage_client(
                StorageType.AZURE_BLOB, conn_str=blob_connection_url
            )
            json_string = json.dumps(parameters)
            blob_name = f"config_{copilot_tool_id}.json"
            config_file_name = blob_name
            data_stream = BytesIO(json_string.encode("utf-8"))
            storage_client.upload(
                container=config_container_name,
                file_name=blob_name,
                data=data_stream,
                overwrite=True,
            )
            data_stream.close()
        except Exception as e:
            logging.error("Error in uploading config file")
            logging.error(e)

        params_dict = {}

        params_dict.update(
            {
                "config_file_name": config_file_name,
                "blob_connection_url": blob_connection_url,
                "config_container_name": config_container_name,
                "pipeline_authentication_token": pipeline_authentication_token,
                "azure_databricks_token": azure_databricks_pgvector_pipeline_token,
                "azure_databricks_pipeline_url": self.pipeline_url,
                "copilot_tool_id": copilot_tool_id,
                "minerva_env_name": temp_folder_env_separator,
                "temp_folder_path_preprocessing": temp_folder_path,
            }
        )

        self.request_body = {"job_id": azure_databricks_pgvector_pipeline_job_id, "notebook_params": params_dict}

    def invoke_pipeline(
        self,
        database_connection_string: str,
        pipeline_authentication_token: str,
        database_schema_name: str,
        blob_metadata: dict,
        temp_folder_env_separator: str,
        env_config: dict,
        llm_config: dict,
        embedding_config: dict,
        copilot_tool_id: int,
        blob_connection_url: str,
        config_container_name: str,
        data_sources: dict,
        copilot_host_url: str,
        copilot_auth_token: str,
    ):
        self.setup_pipeline_parameters(
            database_connection_string,
            pipeline_authentication_token,
            database_schema_name,
            blob_metadata,
            temp_folder_env_separator,
            env_config,
            llm_config,
            embedding_config,
            copilot_tool_id,
            blob_connection_url,
            config_container_name,
            data_sources,
            copilot_host_url,
            copilot_auth_token,
        )
        response = requests.post(self.pipeline_url, headers=self.headers, json=self.request_body)

        run_resp_json = json.loads(response.content)

        pipeline_status_dict = {
            "run_id": str(run_resp_json["run_id"]),
            "copilot_tool_id": copilot_tool_id,
            "job_status": PipelineStatus.Triggered,
            "pipeline_type": "databricks",
        }
        if response.status_code == 200:
            return True, pipeline_status_dict
        else:
            return False, pipeline_status_dict
