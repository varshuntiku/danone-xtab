# import json


class AppConfig:
    def __init__(self, config_file_path="tool_impl/config.ini"):
        # with open('tool_impl/config.json', 'r') as json_file:
        #     parameters = json.load(json_file)
        parameters = {
            "pipeline_name": "databricks",
            "database_connection_string": "postgresql://ergo42:Mathco_42@minerva-server.postgres.database.azure.com:5432/dev",
            "database_schema_name": "minerva_pgvector_1",
            "temp_folder_env_separator": "preprod",
            "azure_storage_connection_string": "DefaultEndpointsProtocol=https;AccountName=minervastorage;AccountKey=mM37gaXLkN1oHvWLd0wQI8UP7qiI00bhf4Zrz2W2TlhknHVcJC360H/tj4CA7gOUoTLghvuEwzmK+AStW4QDzA==;EndpointSuffix=core.windows.net",
            "config_container_name": "copilot-tool-configs",
            "image_unstructured_container_name": "copilot-tool-document-image",
            "env_config": {
                "azure_databricks_pgvector_pipeline_token": "dapic56a002c3181968e56e403a94352d7fb-2",
                "azure_databricks_pgvector_pipeline_job_id": "609006867194374",
                "pipeline_url": "https://adb-1373835178231560.0.azuredatabricks.net/api/2.0/jobs/run-now",
            },
            "image_limit_no": 5,
        }
        self.pipeline_name = parameters.get("pipeline_name")
        self.database_connection_string = parameters.get("database_connection_string")
        self.database_schema_name = parameters.get("database_schema_name")
        self.temp_folder_env_separator = parameters.get("temp_folder_env_separator")
        self.azure_storage_connection_string = parameters.get("azure_storage_connection_string")
        self.config_container_name = parameters.get("config_container_name")
        self.image_unstructured_container_name = parameters.get("image_unstructured_container_name")
        self.env_config = parameters.get("env_config")
        self.image_limit_no = parameters.get("image_limit_no")
