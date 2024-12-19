#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import json
import logging
import os
from datetime import datetime, timedelta
from typing import Annotated, Optional

from app.db.crud.minerva_app_consumer_mapping_crud import minerva_app_consumer_mapping
from app.db.crud.minerva_application_crud import minerva_application
from app.db.crud.minerva_consumer_crud import minerva_consumer
from app.db.crud.minerva_document_crud import minerva_document
from app.db.crud.minerva_job_status_crud import minerva_job_status
from app.db.crud.minerva_models_crud import minerva_models
from app.dependencies.dependencies import get_db

# from app.models.minerva_document import MinervaDocument
from app.schemas.admin_schema import (
    MinervaAppsResponse,
    MinervaModelsResponse,
    StorageFileListResponse,
    ValidConnectionStringResponse,
)
from app.schemas.minerva_application_schema import (  # MinervaApplicationUpdate,
    MinervaApplicationCreate,
    MinervaApplicationDBBase,
    MinervaApplicationExtended,
    MinervaApplicationMetadata,
)
from app.schemas.minerva_consumer_schema import (
    MinervaConsumerCreate,
    MinervaConsumerDBBase,
    MinervaConsumerMetadata,
    MinervaConsumerUpdate,
)
from app.schemas.minerva_document_schema import MinervaDocumentCreate
from app.schemas.minerva_job_status_schema import (
    MinervaJobStatusCreate,
    MinervaJobStatusDBBase,
    MinervaJobStatusEnum,
    MinervaJobStatusUpdate,
)
from app.schemas.minerva_models_schema import (
    MinervaModelCreate,
    MinervaModelMetadata,
    MinervaModelsDBBase,
    MinervaModelUpdate,
)
from app.utils.auth.middleware import validate_auth_token, validate_user
from app.utils.auth.token import encode_payload
from app.utils.config import get_settings
from app.utils.config_generation.sql_config_generation import (
    context_config_automation_sql,
)
from app.utils.pipeline_engine.main import run_pipeline

# from app.utils.socket.connection_events import emit_message
# from app.utils.socket.model import SocketEvent
from app.utils.tools.delete_embedded_document_tool.requests import (
    delete_document_by_id,
    delete_documents_app_id,
)
from app.utils.tools.reload_index_file_utils import reload_index_file
from app.utils.tools.remove_file_folder_utils import remove_file
from app.utils.tools.storage_util import StorageServiceClient, StorageType
from app.utils.tools.text_to_sql_utils import (
    context_creation_csv,
    download_csv,
    generate_dataframe,
)
from azure.storage.blob import BlobServiceClient
from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from fastapi.security import HTTPBearer
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import Session, sessionmaker

settings = get_settings()

auth_scheme = HTTPBearer()


router = APIRouter()


@router.get("/apps", status_code=200)
async def get_apps(db: Session = Depends(get_db), user_info: dict = Depends(validate_user)) -> MinervaAppsResponse:
    """
    Get all Minerva application metadata.
    """
    try:
        minerva_apps = minerva_application.get_apps(db=db)
        return {"minerva_apps": minerva_apps}
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching minerva apps")


@router.post("/app", status_code=200)
async def create_app(
    app_info: MinervaApplicationCreate, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaApplicationMetadata:
    """
    Create new Minerva application
    """
    try:
        new_app_obj = minerva_application.create(db=db, obj_in=app_info)
        return MinervaApplicationMetadata(name=new_app_obj.name, description=new_app_obj.description, id=new_app_obj.id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in creating minerva app")


@router.get("/app/{minerva_application_id}", status_code=200)
async def get_app(
    minerva_application_id: str, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaApplicationExtended:
    """
    Get Minerva application data for the specified minerva application id provided
    """
    try:
        app_data = minerva_application.get(db=db, id=minerva_application_id)
        docs = []
        if app_data.app_config and not app_data.app_config[0].get("bulk_files_source_container"):
            documents = minerva_document.get_documents(db, minerva_application_id=minerva_application_id)
            for doc in documents:
                storagae_client = StorageServiceClient.get_storage_client(StorageType[doc.meta["storage_type"]])
                filename = minerva_application_id + "/" + doc.name
                url = storagae_client.get_url(container="documents", file_name=filename)
                docs.append({"id": doc.id, "name": doc.name, "url": url})

        resp = MinervaApplicationExtended(
            id=app_data.id,
            name=app_data.name,
            description=app_data.description,
            app_config=app_data.app_config,
            documents=docs,
        )
        return resp
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching minerva app details")


@router.put("/app/{minerva_application_id}", status_code=200)
async def update_app(
    minerva_application_id: str,
    app_data: Annotated[str, Form()],
    deleted_documents: Annotated[str, Form()] = None,
    new_documents: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> MinervaApplicationDBBase:
    """
    Update Minerva application
    """
    try:
        app_data = json.loads(app_data)
        if (
            app_data is not None
            and len(app_data) > 0
            and "type" in app_data["app_config"][0]
            and app_data["app_config"][0]["type"] == "sql"
            and (
                "columns" not in app_data["app_config"][0]["config"]["context"]
                or not app_data["app_config"][0]["config"]["context"]["columns"]
                or app_data["app_config"][0]["config"]["context"]["columns"] is None
            )
        ):
            context_config = context_config_automation_sql(
                connection_string=app_data["app_config"][0]["config"]["context_db_connection_uri"],
                schema_name=app_data["app_config"][0]["config"]["context_db_connection_schema"],
                tablename_list=app_data["app_config"][0]["config"]["context"]["table_config"],
            )
            app_data["app_config"][0]["config"]["context"] = context_config

        if app_data["app_config"][0]["type"] == "index_file":
            reload_index_file(index_File_Name=app_data["app_config"][0]["config"]["index_name"])

        storage_client = StorageServiceClient.get_storage_client(StorageType.AZURE_BLOB)
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        app_data_source = app_data["app_config"][0].get("type")
        app_job_status = minerva_job_status.get_job_status_by_app_id(
            db=db, minerva_application_id=int(minerva_application_id)
        )
        if app_job_status in [MinervaJobStatusEnum.on_start, MinervaJobStatusEnum.on_triggered]:
            raise HTTPException(status_code=409, detail="Application pipeline is in progress")
        if deleted_documents:
            deleted_documents = json.loads(deleted_documents)
            image_container = settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME
            blob_image_names_list = []
            for document in deleted_documents:
                if document["name"].endswith(".pptx"):
                    blob_list_image_container = storage_client.list_blobs(container=image_container)
                    for blob in blob_list_image_container:
                        blob_image_names_list.append(blob.name)
                    break
            for doc in deleted_documents:
                pattern = f'Pageimage_{minerva_application_id}_{doc["id"]}_'
                for blob_name in blob_image_names_list:
                    if pattern in blob_name and doc["name"].endswith(".pptx"):
                        storage_client.delete(container=image_container, file_name=blob_name)
                delete_document_by_id(minerva_application_id=int(minerva_application_id), minerva_document_id=doc["id"])
                minerva_document.soft_delete(db=db, id=doc["id"])
                filename = minerva_application_id + "/" + doc["name"]
                storage_client.delete(container=container, file_name=filename)
                if app_data_source == "csv_file":
                    remove_file(os.path.join("./indexes/csvs", doc["name"]))

        bulk_files_source_conn_str = app_data.get("app_config")[0].get("bulk_files_source_conn_str")
        if app_data.get("app_config")[0].get("bulk_files_source_container") is not None:
            bulk_files_source_container = app_data.get("app_config")[0].get("bulk_files_source_container")
            bulk_upload_flag = True
            storage_client_bulk_upload = StorageServiceClient.get_storage_client(
                StorageType.AZURE_BLOB, conn_str=bulk_files_source_conn_str
            )
            blob_list_cognition_files = storage_client_bulk_upload.list_blobs(container=bulk_files_source_container)
        else:
            bulk_files_source_container = None
            bulk_upload_flag = False
        if app_data_source == "csv_file" and new_documents:
            documents = minerva_document.get_documents(db, minerva_application_id=minerva_application_id)
            for doc in documents:
                minerva_document.soft_delete(db=db, id=doc.id)
                filename = minerva_application_id + "/" + doc.name
                storage_client.delete(container=container, file_name=filename)

        if new_documents or bulk_upload_flag:
            # if same file name has been uploaded again -> throw error
            existing_docs = minerva_document.get_documents(db=db, minerva_application_id=minerva_application_id)
            existing_doc_names = [item.name for item in existing_docs]
            for doc in new_documents:
                if doc.filename in existing_doc_names:
                    raise HTTPException(status_code=409, detail="Document with same name already exists")
            docs = []
            if bulk_upload_flag:
                for doc in blob_list_cognition_files:
                    if doc.name not in existing_doc_names:
                        file_name = minerva_application_id + "/" + doc.name
                        doc_rec = minerva_document.create(
                            db=db,
                            obj_in=MinervaDocumentCreate(
                                application_id=minerva_application_id,
                                name=doc.name,
                                meta={"storage_type": StorageType.AZURE_BLOB},
                            ),
                        )
                        url = storage_client_bulk_upload.get_url(
                            container=bulk_files_source_container, file_name=doc.name
                        )
                        docs.append({"url": url, "minerva_document_id": doc_rec.id})

            for doc in new_documents:
                file_name = minerva_application_id + "/" + doc.filename
                storage_client.upload(container=container, file_name=file_name, data=doc.file.read(), overwrite=True)
                doc_rec = minerva_document.create(
                    db=db,
                    obj_in=MinervaDocumentCreate(
                        application_id=minerva_application_id,
                        name=doc.filename,
                        meta={"storage_type": StorageType.AZURE_BLOB},
                    ),
                )
                if app_data_source == "csv_file":
                    document_csv = download_csv(db=db, minerva_application_id=minerva_application_id)
                    dataframe_csv = generate_dataframe(document_csv)
                    context_csv = context_creation_csv(dataframe_csv)
                    app_data["app_config"][0]["config"]["context"] = context_csv
                    app_data["app_config"][0]["config"]["dialect"] = ""
                url = storage_client.get_url(container=container, file_name=file_name)
                docs.append({"url": url, "minerva_document_id": doc_rec.id})

            if docs and app_data_source == "document_query" or app_data_source == "sql":
                lte_payload = {"minerva_application_id": int(minerva_application_id), "documents": docs}
                llm_model = minerva_models.get(db, app_data.get("app_config")[0]["llm_model"])
                embedding_model = minerva_models.get(db, app_data.get("app_config")[0]["embedding_model"])
                model_config = {
                    "llm_model": {"host": llm_model.host, "config": llm_model.config},
                    "embedding_model": {"host": embedding_model.host, "config": embedding_model.config},
                }
                token_payload = {
                    "exp": datetime.utcnow() + timedelta(days=5),
                    "iat": datetime.utcnow(),
                    "sub": "job_status_update",
                    "iss": "minerva_server",
                    "aud": "bg_job_engine",
                }
                job_status_update_auth_token = encode_payload(token_payload)
                blob_metadata = {
                    "container_name": settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME,
                    "blob_connection_url": settings.AZURE_STORAGE_CONNECTION_STRING,
                }
                run_resp = run_pipeline(
                    "databricks",
                    lte_payload,
                    model_config,
                    settings.VECTOR_EMBEDDING_CONNECTION_STRING,
                    settings.MINERVA_HOST_URL,
                    job_status_update_auth_token,
                    settings.UNSTRUCTURED_SCHEMA_NAME,
                    blob_metadata,
                )
                run_resp_json = json.loads(run_resp.content)
                minerva_job_status.create(
                    db=db,
                    obj_in=MinervaJobStatusCreate(
                        application_id=int(minerva_application_id),
                        run_id=str(run_resp_json["run_id"]),
                        status="Triggered",
                        name="Databricks",
                        type=app_data_source,
                    ),
                )
        minerva_app_data = minerva_application.update(db=db, id=minerva_application_id, obj_in=app_data)
        minerva_app_status = (
            minerva_job_status.get_job_status_by_app_id(db=db, minerva_application_id=int(minerva_application_id))
            if minerva_app_data.app_config
            and (
                minerva_app_data.app_config[0].get("type") == "document_query"
                or (
                    minerva_app_data.app_config[0].get("type") == "sql"
                    and minerva_app_data.app_config[0].get("data_summary", False)
                )
            )
            else "N/A"
        )
        minerva_app_metadata = MinervaApplicationDBBase(
            id=minerva_app_data.id,
            name=minerva_app_data.name,
            description=minerva_app_data.description,
            app_config=minerva_app_data.app_config,
            status=minerva_app_status,
            source_type=app_data_source
            if minerva_app_data.app_config and minerva_app_data.app_config[0].get("type")
            else None,
        )
        return minerva_app_metadata
    except HTTPException as e:
        logging.exception(e)
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in updating minerva app details")


@router.delete("/app/{minerva_application_id}", status_code=200)
async def delete_app(
    minerva_application_id: str, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaApplicationDBBase:
    try:
        try:
            delete_documents_app_id(minerva_application_id=minerva_application_id)
            storage_client = StorageServiceClient.get_storage_client(StorageType.AZURE_BLOB)
            container = settings.MINERVA_DOCS_CONTAINER_NAME
            image_container = settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME
            app_data = minerva_application.get(db=db, id=minerva_application_id)
            bluk_upload_flag = False
            if app_data.app_config is not None:
                bluk_upload_flag = False if app_data.app_config[0].get("bulk_files_source_container") is None else True

            documents = minerva_document.get_documents(db, minerva_application_id=minerva_application_id)
            if documents:
                blob_image_names_list = []
                for document in documents:
                    if document.name.endswith(".pptx"):
                        blob_list_image_container = storage_client.list_blobs(container=image_container)
                        for blob in blob_list_image_container:
                            blob_image_names_list.append(blob.name)
                        break
                for document in documents:
                    if document.name.endswith(".pptx"):
                        pattern = f"Pageimage_{minerva_application_id}_{document.id}_"
                        for blob_name in blob_image_names_list:
                            if pattern in blob_name:
                                storage_client.delete(container=image_container, file_name=blob_name)
                    minerva_document.soft_delete(db=db, id=document.id)
                    filename = minerva_application_id + "/" + document.name
                    if not bluk_upload_flag:
                        storage_client.delete(container=container, file_name=filename)
                    if document.name.split(".")[-1].lower() == "csv":
                        remove_file(os.path.join("./indexes/csvs", document.name))

        except Exception as e:
            logging.exception(e)
        return minerva_application.soft_delete(db=db, id=minerva_application_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in deleting minerva app")


@router.get("/validateConnection", status_code=200)
def valid_connection_string(
    connection_string: str, user_info: dict = Depends(validate_user)
) -> ValidConnectionStringResponse:
    """
    API to validate if the connection string is valid or not.
    Besides, it also specifies whether a schema name is required along with the connection string.
    """
    try:
        # will execute if connection string is valid
        db_engine = create_engine(connection_string)
        session = sessionmaker(bind=db_engine)
        session.close_all()
        db_engine.dispose()
        schema_flag = False if "mysql+pymysql://" in connection_string else True
        out = ValidConnectionStringResponse(valid_connection_string=True, schema_required=schema_flag)
    except Exception as e:
        # in case of execution, return connection string as invalid
        logging.exception(e)
        out = ValidConnectionStringResponse(valid_connection_string=False, schema_required=False)
        if "session" in locals():
            session.close_all()
        if "db_engine" in locals():
            db_engine.dispose()
    finally:
        return out


@router.get("/listConnectionTables", status_code=200)
def list_connection_tables(
    connection_string: str, schema: Optional[str] = None, user_info: dict = Depends(validate_user)
) -> dict:
    """
    List the tables for a given connection string and schema(optional).
    """
    try:
        if schema is None or schema == "":
            db_engine = create_engine(connection_string)
        else:
            db_engine = create_engine(connection_string, connect_args={"options": "-csearch_path={}".format(schema)})
        session = sessionmaker(bind=db_engine)
        res = inspect(db_engine).get_table_names()
        # add schema name to table names if needed
        if (schema is not None or schema != "") and len(res) > 0 and "." not in res[0]:
            table_list = [schema + "." + x for x in res]
        else:
            table_list = res

        def get_alias(table_name):
            alias = table_name.split(".")[-1] if "." in table_name else table_name
            alias = alias.replace("_", " ")
            return alias

        # generate result list
        result = [{"name": x, "alias": get_alias(x), "enabled": False} for x in table_list]
        session.close_all()
        db_engine.dispose()
        return {"table_config": result}
    except Exception as e:
        # in case of execution, return connection string as invalid
        logging.exception(e)
        if "session" in locals():
            session.close_all()
        if "db_engine" in locals():
            db_engine.dispose()
        raise HTTPException(status_code=500, detail="Error fetching table list")


@router.get("/listStorageFiles", status_code=200)
def list_storage_files(user_info: dict = Depends(validate_user)) -> StorageFileListResponse:
    """
    API to list files in pre-configured storage account.
    This file is used to query an in-memory vector-embeddings dataset.
    """
    try:
        blob_service_client = BlobServiceClient.from_connection_string(
            conn_str=settings.AZURE_STORAGE_CONNECTION_STRING
        )
        container_client = blob_service_client.get_container_client(container=settings.BLOB_CONTAINER_NAME)
        blob_list = container_client.list_blobs()
        blob_list = [blob.name for blob in blob_list]
        return StorageFileListResponse(file_list=blob_list)
    except Exception as e:
        # in case of execution, return connection string as invalid
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error fetching storage file list")


@router.get("/models", status_code=200)
async def get_models(db: Session = Depends(get_db), user_info: dict = Depends(validate_user)) -> MinervaModelsResponse:
    """
    Get all Minerva application metadata.
    """
    try:
        minerva_mods = minerva_models.get_models(db=db)
        return {
            "minerva_models": [
                MinervaModelsDBBase(
                    id=el["id"],
                    name=el["name"],
                    host=el["host"],
                    type=el["type"],
                    config=el["config"],
                    features=el["features"] or {},
                )
                for el in minerva_mods
            ]
        }
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching minerva models")


@router.post("/app/job/status", status_code=200)
async def update_app_job(
    request_body: dict,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_auth_token),
) -> MinervaJobStatusDBBase:
    """
    Update Minerva application job status
    """
    try:
        pipeline_event = request_body["event_type"].split(".")
        if request_body.get("not_Processed_Document_List") is not None:
            image_container = settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME
            container = settings.MINERVA_DOCS_CONTAINER_NAME
            storagae_client = StorageServiceClient.get_storage_client(StorageType.AZURE_BLOB)
            blob_list_image_container = storagae_client.list_blobs(container=image_container)
            blob_image_names_list = []
            for blob in blob_list_image_container:
                blob_image_names_list.append(blob.name)
            minerva_application_id = request_body.get("minerva_application_id")
            app_data = minerva_application.get(db=db, id=minerva_application_id)
            bluk_upload_flag = False if app_data.app_config[0].get("bulk_files_source_container") is None else True
            for doc_id in json.loads(request_body.get("not_Processed_Document_List")):
                pattern = f"Pageimage_{minerva_application_id}_{doc_id}"
                for blob_name in blob_image_names_list:
                    if pattern in blob_name:
                        storagae_client.delete(container=image_container, file_name=blob_name)
                doc_name = minerva_document.get_document_id(db=db, document_id=doc_id).name
                delete_document_by_id(minerva_application_id=int(minerva_application_id), minerva_document_id=doc_id)
                filename = str(minerva_application_id) + "/" + doc_name
                if not bluk_upload_flag:
                    storagae_client.delete(container=container, file_name=filename)
                minerva_document.soft_delete(db=db, id=doc_id)
        minerva_app_job = MinervaJobStatusUpdate(
            run_id=str(request_body["run"]["run_id"]), status=MinervaJobStatusEnum[pipeline_event[1]].value
        )
        app_job_status = minerva_job_status.update(db=db, id=None, obj_in=minerva_app_job)
        # await emit_message(
        #     socket_event=SocketEvent.job_status_update.value,
        #     data={"id": app_job_status.application_id, "status": app_job_status.status},
        #     room="minerva_job_app_" + str(app_job_status.application_id),
        #     namespace="/minerva",
        # )
        return app_job_status
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in updating minerva app job details")


@router.post("/model", status_code=200)
async def create_model(
    model_info: MinervaModelCreate, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaModelMetadata:
    """
    Create new Minerva model
    """
    try:
        new_model_obj = minerva_models.create(db=db, obj_in=model_info)
        return MinervaModelMetadata(
            name=new_model_obj.name,
            host=new_model_obj.host,
            type=new_model_obj.type,
            config=new_model_obj.config,
            features=new_model_obj.features,
            id=new_model_obj.id,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in creating minerva model")


@router.put("/model/{minerva_model_id}", status_code=200)
async def update_model(
    minerva_model_id: int,
    model_info: MinervaModelUpdate,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> MinervaModelMetadata:
    """
    Update existing Minerva model
    """
    try:
        new_model_obj = minerva_models.update(db=db, id=minerva_model_id, obj_in=model_info)
        return MinervaModelMetadata(
            name=new_model_obj.name,
            host=new_model_obj.host,
            type=new_model_obj.type,
            config=new_model_obj.config,
            features=new_model_obj.features,
            id=new_model_obj.id,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating minerva model")


@router.delete("/model/{minerva_model_id}", status_code=200)
async def delete_model(
    minerva_model_id: int, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaModelsDBBase:
    """
    Deletes existing model
    """
    try:
        return minerva_models.soft_delete(db=db, id=minerva_model_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in deleting minerva model")


@router.post("/consumer", status_code=200)
async def create_client(
    client_obj: MinervaConsumerCreate, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaConsumerDBBase:
    """
    Create Minerva Client
    """
    try:
        return minerva_consumer.create(db=db, obj_in=client_obj)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while creating minerva consumer")


@router.get("/consumers", status_code=200)
async def get_consumers(
    db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> list[MinervaConsumerMetadata]:
    """
    Get Minerva Consumers list
    """
    try:
        return minerva_consumer.get_all(db=db)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while getting minerva consumers list")


@router.get("/consumer/{consumer_id}", status_code=200)
async def get_consumer(
    consumer_id: int, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> MinervaConsumerDBBase:
    """
    Get Minerva Consumer data by id
    """
    try:
        obj = minerva_consumer.get(db=db, id=consumer_id)
        if obj.deleted_at:
            raise HTTPException(status_code=404, detail="Record deleted")
        app_mappings = minerva_app_consumer_mapping.get_all_by_consumer_id(db=db, consumer_id=obj.id)
        return MinervaConsumerDBBase(
            id=obj.id,
            name=obj.name,
            desc=obj.desc,
            allowed_origins=obj.allowed_origins,
            features=obj.features,
            auth_agents=obj.auth_agents,
            access_key=str(obj.access_key),
            copilot_apps=[el.copilot_app_id for el in app_mappings if el.copilot_app_id is not None],
            minerva_apps=[el.minerva_app_id for el in app_mappings if el.minerva_app_id is not None],
        )
    except HTTPException as e:
        logging.exception(e)
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while getting minerva consumer")


@router.put("/consumer/{consumer_id}", status_code=200)
async def update_consumer(
    consumer_id: int,
    client_obj: MinervaConsumerUpdate,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> MinervaConsumerDBBase:
    """
    Update Minerva Consumer
    """
    try:
        return minerva_consumer.update(db=db, id=consumer_id, obj_in=client_obj)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating minerva consumer")


@router.delete("/consumer/{consumer_id}", status_code=200)
async def delete_consumer(
    consumer_id: int, db: Session = Depends(get_db), user_info: dict = Depends(validate_user)
) -> dict:
    """
    Delete Minerva Consumer
    """
    try:
        minerva_consumer.soft_delete(db=db, id=consumer_id)
        return {"msg": "Deleted successfully"}
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deleting minerva consumer")


@router.get("/consumer-data", status_code=200)
async def get_consumer_by_access_key(
    access_key: str, request: Request, db: Session = Depends(get_db)
) -> MinervaConsumerDBBase:
    """
    Get Minerva Consumer data by access_key
    """
    try:
        obj = minerva_consumer.get_by_access_key(db=db, access_key=access_key)
        if obj.deleted_at:
            raise HTTPException(status_code=404, detail="Record deleted")
        if request.headers.get("origin", "") not in obj.allowed_origins:
            if request.headers.get("origin", ""):
                raise HTTPException(status_code=403, detail="Unauthorized Origin")
        app_mappings = minerva_app_consumer_mapping.get_all_by_consumer_id(db=db, consumer_id=obj.id)
        minerva_app_ids = [el.minerva_app_id for el in app_mappings if el.minerva_app_id is not None]
        copilot_app_ids = [el.copilot_app_id for el in app_mappings if el.copilot_app_id is not None]
        return MinervaConsumerDBBase(
            id=obj.id,
            name=obj.name,
            desc=obj.desc,
            allowed_origins=obj.allowed_origins,
            features=obj.features,
            auth_agents=obj.auth_agents,
            access_key=str(obj.access_key),
            minerva_apps=minerva_app_ids,
            copilot_apps=copilot_app_ids,
        )
    except HTTPException as e:
        logging.exception(e)
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while getting minerva consumer")
