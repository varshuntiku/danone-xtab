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

import boto3
from app.db.crud.copilot_app_datasource_published_tool_mapping_crud import (
    copilot_app_datasource_published_tool_mapping,
)
from app.db.crud.copilot_app_published_tool_mapping_crud import (
    copilot_app_published_tool_mapping,
)
from app.db.crud.copilot_datasource_crud import copilot_datasource
from app.db.crud.copilot_datasource_document_crud import copilot_datasource_document
from app.dependencies.dependencies import get_db
from app.schemas.copilot_datasource_document_schema import (
    CopilotDatasourceDocumentCreate,
)
from app.schemas.copilot_datasource_schema import (
    AmazonS3Buckets,
    AzureBlobContainers,
    CopilotAmazonS3FileStorageInputConfig,
    CopilotAmazonS3FileStoragePayload,
    CopilotAzureBlobFileStorageInputConfig,
    CopilotAzureBlobFileStoragePayload,
    CopilotDatasourceCreate,
    CopilotDatasourceDBBase,
    CopilotDatasourceExtended,
    CopilotDatasourceMetadata,
    CopilotDatasourceValidationConfig,
    CopilotDatasourceValidationPayload,
    CopilotMicrosoftSharepointFileStorageConfig,
)
from app.utils.config import get_settings
from app.utils.tools.storage_util import StorageServiceClient, StorageType
from azure.core.exceptions import HttpResponseError, ResourceNotFoundError
from azure.storage.blob import BlobServiceClient
from cachetools import TTLCache
from fastapi import Depends, HTTPException
from office365.runtime.auth.client_credential import ClientCredential
from office365.sharepoint.client_context import ClientContext
from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

data_source_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)

settings = get_settings()


class CopilotDatasourceService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def create_datasource(
        self, copilot_app_id: int, creator_id: int | None, payload_obj: dict, new_documents: list
    ) -> CopilotDatasourceMetadata:
        app_datasource = None

        if payload_obj["type"] == "sql":
            app_datasource = self.__create_sql_datasource__(
                datasource_obj=payload_obj, copilot_app_id=copilot_app_id, creator_id=creator_id
            )
            return app_datasource
        if (
            payload_obj["type"] == "upload"
            or payload_obj["type"] == "csv"
            or payload_obj["type"] == "storyboard_slidemaster"
        ):
            app_datasource = self.__create_upload_datasource__(
                datasource_obj=payload_obj,
                copilot_app_id=copilot_app_id,
                creator_id=creator_id,
                documents=new_documents,
            )

        if payload_obj["type"] == "file_storage":
            datasource_data = CopilotDatasourceCreate(
                name=payload_obj["name"],
                type=payload_obj["type"],
                copilot_app_id=copilot_app_id,
                config=payload_obj["config"],
                created_by=creator_id,
            )
            datasource = copilot_datasource.create(self.db, obj_in=datasource_data)
            app_datasource = CopilotDatasourceMetadata(
                name=datasource.name,
                type=datasource.type,
                config=datasource.config,
                id=datasource.id,
                copilot_app_id=datasource.copilot_app_id,
            )

        return app_datasource

    def __create_sql_datasource__(self, datasource_obj: dict, copilot_app_id: int, creator_id: int | None):
        conn_string = datasource_obj["config"]["context_db_connection_uri"]
        db_engine = create_engine(conn_string)

        try:
            with db_engine.connect():
                datasource_data = CopilotDatasourceCreate(
                    name=datasource_obj["name"],
                    type=datasource_obj["type"],
                    copilot_app_id=copilot_app_id,
                    config=datasource_obj["config"],
                    created_by=creator_id,
                )
                datasource = copilot_datasource.create(self.db, obj_in=datasource_data)
                return CopilotDatasourceMetadata(
                    name=datasource.name,
                    type=datasource.type,
                    config=datasource.config,
                    id=datasource.id,
                    copilot_app_id=datasource.copilot_app_id,
                )
        except OperationalError:
            raise HTTPException(status_code=500, detail="Error connecting to database")

    def __create_upload_datasource__(
        self, datasource_obj: dict, copilot_app_id: int, creator_id: int | None, documents: list
    ):
        datasource_data = CopilotDatasourceCreate(
            name=datasource_obj["name"],
            type=datasource_obj["type"],
            copilot_app_id=copilot_app_id,
            config=datasource_obj["config"],
            created_by=creator_id,
        )
        datasource = copilot_datasource.create(self.db, obj_in=datasource_data)

        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        container = settings.MINERVA_DOCS_CONTAINER_NAME

        if documents:
            for doc in documents:
                file_name = "datasource" + "/" + str(datasource.id) + "/" + doc.filename
                storage_client.upload(container=container, file_name=file_name, data=doc.file.read(), overwrite=True)
                copilot_datasource_document.create(
                    db=self.db,
                    obj_in=CopilotDatasourceDocumentCreate(
                        datasource_id=datasource.id,
                        name=doc.filename,
                        meta={"storage_type": StorageType[settings.STORAGE_SERVICE].value},
                    ),
                )
                data_source_cache.pop(datasource.id, None)

        return CopilotDatasourceMetadata(
            name=datasource.name,
            type=datasource.type,
            config=datasource.config,
            id=datasource.id,
            copilot_app_id=datasource.copilot_app_id,
        )

    def get_datasource(self, copilot_app_id: int, datasource_id: int) -> CopilotDatasourceExtended:
        app_datasource = copilot_datasource.get_copilot_app_datasource(
            db=self.db, datasource_id=datasource_id, copilot_app_id=copilot_app_id
        )
        documents = []
        if (
            app_datasource.type == "upload"
            or app_datasource.type == "csv"
            or app_datasource.type == "storyboard_slidemaster"
        ):
            documents = self.get_datasource_documents(datasource_id=datasource_id)

        return CopilotDatasourceExtended(
            name=app_datasource.name,
            type=app_datasource.type,
            config=app_datasource.config,
            id=app_datasource.id,
            datasource_documents=documents,
            copilot_app_id=app_datasource.copilot_app_id,
        )

    def get_datasource_documents(self, datasource_id: int) -> list:
        docs = []
        datasource_docs = copilot_datasource_document.get_documents(self.db, copilot_datasource_id=datasource_id)
        for doc in datasource_docs:
            storage_client = StorageServiceClient.get_storage_client(StorageType[doc.meta["storage_type"]])
            filename = "datasource" + "/" + str(datasource_id) + "/" + doc.name
            container = settings.MINERVA_DOCS_CONTAINER_NAME
            url = storage_client.get_url(container=container, file_name=filename)
            docs.append({"id": doc.id, "name": doc.name, "url": url})

        return docs

    def update_datasource(
        self, datasource_id: int, payload_obj: dict, new_documents: list, deleted_documents: str
    ) -> CopilotDatasourceExtended:
        app_datasource = None
        documents = []
        if (
            payload_obj["type"] == "upload"
            or payload_obj["type"] == "csv"
            or payload_obj["type"] == "storyboard_slidemaster"
        ):
            documents = self.__update_datasource_documents__(
                datasource_id=datasource_id, deleted_documents=deleted_documents, new_documents=new_documents
            )
        app_datasource = copilot_datasource.update(db=self.db, id=datasource_id, obj_in=payload_obj)
        data_source_cache.pop(datasource_id, None)

        return CopilotDatasourceExtended(
            name=app_datasource.name,
            type=app_datasource.type,
            copilot_app_id=app_datasource.copilot_app_id,
            config=app_datasource.config,
            id=app_datasource.id,
            datasource_documents=documents,
        )

    def __update_datasource_documents__(self, datasource_id: int, deleted_documents: str, new_documents: list) -> list:
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        if deleted_documents:
            deleted_documents = json.loads(deleted_documents)
            for doc in deleted_documents:
                copilot_datasource_document.soft_delete(db=self.db, id=doc["id"])
                data_source_cache.pop(datasource_id, None)
                filename = "datasource" + "/" + str(datasource_id) + "/" + doc["name"]
                storage_client.delete(container=container, file_name=filename)

        if new_documents:
            existing_docs = copilot_datasource_document.get_documents(db=self.db, copilot_datasource_id=datasource_id)
            existing_doc_names = [item.name for item in existing_docs]
            for doc in new_documents:
                if doc.filename in existing_doc_names:
                    raise HTTPException(status_code=409, detail="Document with same name already exists")

            for doc in new_documents:
                file_name = "datasource" + "/" + str(datasource_id) + "/" + doc.filename
                storage_client.upload(container=container, file_name=file_name, data=doc.file.read(), overwrite=True)
                copilot_datasource_document.create(
                    db=self.db,
                    obj_in=CopilotDatasourceDocumentCreate(
                        datasource_id=datasource_id,
                        name=doc.filename,
                        meta={"storage_type": StorageType[settings.STORAGE_SERVICE].value},
                    ),
                )
                data_source_cache.pop(datasource_id, None)

        documents = []
        datasource_docs = copilot_datasource_document.get_documents(self.db, copilot_datasource_id=datasource_id)
        for doc in datasource_docs:
            storage_client = StorageServiceClient.get_storage_client(StorageType[doc.meta["storage_type"]])
            filename = "datasource" + "/" + str(datasource_id) + "/" + doc.name
            url = storage_client.get_url(container=container, file_name=filename)
            documents.append({"id": doc.id, "name": doc.name, "url": url})

        return documents

    def delete_datasource(self, copilot_app_id: int, datasource_id: int) -> CopilotDatasourceDBBase:
        app_tools = copilot_app_published_tool_mapping.get_all(db=self.db, copilot_app_id=copilot_app_id)
        for tool in app_tools:
            tool_datasource_mapped_ids = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
                db=self.db, tool_id=tool.id
            )
            for item in tool_datasource_mapped_ids:
                if item.datasource_id == datasource_id:
                    raise HTTPException(
                        detail="Unable to delete the datasource as it is mapped to one or more tool", status_code=409
                    )
        data_source_cache.pop(datasource_id, None)
        return copilot_datasource.soft_delete(db=self.db, id=datasource_id)

    def validate_datasource_config(
        self, datasource_type: str, validation_obj: CopilotDatasourceValidationPayload
    ) -> CopilotDatasourceValidationConfig:
        if datasource_type == "file_storage":
            if validation_obj.config.file_storage_type == "azure_blob_storage":
                datasource_valid_config_obj = self._validate_azure_blob_config(config_obj=validation_obj.config)
                return CopilotDatasourceValidationConfig(config=datasource_valid_config_obj)
            if validation_obj.config.file_storage_type == "amazon_s3":
                datasource_valid_config_obj = self._validate_amazon_s3_config(config_obj=validation_obj.config)
                return CopilotDatasourceValidationConfig(config=datasource_valid_config_obj)
            if validation_obj.config.file_storage_type == "microsoft_sharepoint":
                datasource_valid_config_obj = self._validate_microsoft_sharepoint_config(
                    config_obj=validation_obj.config
                )
                return CopilotDatasourceValidationConfig(config=datasource_valid_config_obj)

    def _validate_azure_blob_config(
        self, config_obj: CopilotAzureBlobFileStoragePayload
    ) -> CopilotAzureBlobFileStorageInputConfig:
        try:
            blob_service_client = BlobServiceClient.from_connection_string(conn_str=config_obj.blob_connection_string)

            account_info = blob_service_client.get_account_information()  # noqa: F841

            return CopilotAzureBlobFileStorageInputConfig(
                file_storage_type=config_obj.file_storage_type, blob_connection_string=config_obj.blob_connection_string
            )

        except ResourceNotFoundError:
            raise HTTPException(status_code=500, detail="Unable to find blob service or container")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to fetch details from blob configuration",
            )

        finally:
            if blob_service_client:
                blob_service_client.close()

    def fetch_blob_datasource_containers(
        self, blob_storage_config: CopilotAzureBlobFileStoragePayload
    ) -> AzureBlobContainers:
        try:
            blob_service_client = BlobServiceClient.from_connection_string(
                conn_str=blob_storage_config.blob_connection_string
            )

            container_list = blob_service_client.list_containers()

            blob_container_list = []

            for container in container_list:
                blob_container_list.append(
                    {
                        "id": blob_service_client.account_name + "_" + container.name,
                        "name": container.name,
                    }
                )

            return AzureBlobContainers(blob_containers=blob_container_list)

        except ResourceNotFoundError:
            raise HTTPException(status_code=500, detail="Unable to find blob service or container")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to fetch details from blob configuration",
            )

        finally:
            if blob_service_client:
                blob_service_client.close()

    def _validate_amazon_s3_config(
        self, config_obj: CopilotAmazonS3FileStoragePayload
    ) -> CopilotAmazonS3FileStorageInputConfig:
        try:
            amazon_s3_client = boto3.client(
                "s3",
                aws_access_key_id=config_obj.aws_access_key_id,
                aws_secret_access_key=config_obj.aws_secret_access_key,
            )

            bucket_list_data = amazon_s3_client.list_buckets()  # noqa: F841

            return CopilotAmazonS3FileStorageInputConfig(
                file_storage_type=config_obj.file_storage_type,
                aws_access_key_id=config_obj.aws_access_key_id,
                aws_secret_access_key=config_obj.aws_secret_access_key,
            )

        except Exception as e:
            logging.warning(e)
            raise HTTPException(
                status_code=500,
                detail="Unable to fetch details from aws s3",
            )

        finally:
            if amazon_s3_client:
                amazon_s3_client.close()

    def fetch_amazon_s3_buckets(self, azure_storage_config: CopilotAmazonS3FileStoragePayload) -> AmazonS3Buckets:
        try:
            amazon_s3_client = boto3.client(
                "s3",
                aws_access_key_id=azure_storage_config.aws_access_key_id,
                aws_secret_access_key=azure_storage_config.aws_secret_access_key,
            )

            bucket_list_data = amazon_s3_client.list_buckets()

            bucket_list = bucket_list_data.get("Buckets", [])

            aws_bucket_list = []

            for bucket in bucket_list:
                aws_bucket_list.append({"name": bucket.get("Name", "")})

            return AmazonS3Buckets(bucket_names=aws_bucket_list)

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Unable to fetch details from aws s3",
            )

        finally:
            if amazon_s3_client:
                amazon_s3_client.close()

    def _validate_microsoft_sharepoint_config(
        self, config_obj: CopilotMicrosoftSharepointFileStorageConfig
    ) -> CopilotMicrosoftSharepointFileStorageConfig:
        try:
            sharepoint_client_credential_obj = ClientCredential(
                client_id=config_obj.sharepoint_client_id, client_secret=config_obj.sharepoint_client_secret
            )
            sharepoint_context = ClientContext(base_url=config_obj.sharepoint_site_url).with_credentials(
                credentials=sharepoint_client_credential_obj
            )

            sharepoint_web = sharepoint_context.web
            sharepoint_context.load(sharepoint_web)
            sharepoint_context.execute_query()

            return config_obj

        except Exception as e:
            logging.exception(e)
            raise HTTPException(status_code=500, detail="Unable to validate sharepoint credential")

        finally:
            if sharepoint_context:
                sharepoint_context = None
