import tool_impl.pipeline_engine.pipeline_classes.databricks_pipeline  # noqa: F401
from tool_impl.pipeline_engine.pipeline_base_class import pipeline_registry


def run_pipeline(
    pipeline_name: str,
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
    data_source: dict,
    copilot_host_url: str,
    copilot_auth_token: str,
):
    if pipeline_registry.get(pipeline_name) is None:
        raise KeyError(f"{pipeline_name} Pipeline, Doesn't Exist.")
    else:
        return pipeline_registry[pipeline_name]().invoke_pipeline(
            database_connection_string,
            pipeline_authentication_token,
            database_schema_name,
            image_blob_metadata,
            temp_folder_env_separator,
            env_config,
            llm_config,
            embedding_config,
            copilot_tool_id,
            blob_connection_url,
            config_container_name,
            data_source,
            copilot_host_url,
            copilot_auth_token,
        )
