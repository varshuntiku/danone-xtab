import app.utils.pipeline_engine.pipeline_classes.databricks_pipeline  # noqa: F401
from app.schemas.pipeline_engine_schema import JobConfig, MinervaApplicationDocuments
from app.utils.pipeline_engine.pipeline_base_class import pipeline_registry


def run_pipeline(
    pipeline_name: str,
    data: MinervaApplicationDocuments,
    job_config: JobConfig,
    vector_db_conn_string: str,
    minerva_host_url: str,
    job_status_update_auth_token: str,
    unstructured_schema_name: str,
    blob_metadata: dict,
):
    if pipeline_registry.get(pipeline_name) is None:
        raise KeyError(f"{pipeline_name} Pipeline, Doesn't Exist.")
    else:
        return pipeline_registry[pipeline_name]().invoke_pipeline(
            data,
            job_config,
            vector_db_conn_string,
            minerva_host_url,
            job_status_update_auth_token,
            unstructured_schema_name,
            blob_metadata,
        )
