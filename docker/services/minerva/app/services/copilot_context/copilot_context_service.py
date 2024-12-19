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

from app.db.crud.copilot_app_published_tool_mapping_crud import (
    copilot_app_published_tool_mapping,
)
from app.db.crud.copilot_context_crud import copilot_context
from app.db.crud.copilot_context_datasource_app_tool_mapping_crud import (
    copilot_context_datasource_app_tool_mapping,
)
from app.db.crud.copilot_context_datasource_crud import copilot_context_datasource
from app.dependencies.dependencies import get_db
from app.schemas.copilot_context_datasource_schema import (
    CopilotContextDatasourceCreate,
    CopilotContextDatasourceExtended,
)
from app.schemas.copilot_context_schema import (
    CopilotContextCreate,
    CopilotContextDBBase,
    CopilotContextMetadata,
)
from app.utils.config import get_settings
from app.utils.tools.storage_util import StorageServiceClient, StorageType
from fastapi import Depends, HTTPException, UploadFile

settings = get_settings()


class CopilotContextService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def create_context(
        self, copilot_app_id: int, creator_id: int | None, payload_obj: dict, new_documents: list
    ) -> CopilotContextMetadata:
        app_context = None

        if payload_obj["type"] == "data_metadata":
            app_context = self.__create_data_and_metadata_context__(
                context_obj=payload_obj,
                copilot_app_id=copilot_app_id,
                creator_id=creator_id,
                documents=new_documents,
            )

        elif payload_obj["type"] == "metrics_kpi":
            app_context = self.__create_metrics_and_kpi_context__(
                context_obj=payload_obj,
                copilot_app_id=copilot_app_id,
                creator_id=creator_id,
                documents=new_documents,
            )

        return app_context

    def __create_data_and_metadata_context__(
        self, context_obj: dict, copilot_app_id: int, creator_id: int | None, documents: list
    ):
        context_data = CopilotContextCreate(
            name=context_obj["name"],
            type=context_obj["type"],
            copilot_app_id=copilot_app_id,
            source_type=context_obj["source_type"],
            created_by=creator_id,
        )
        context = copilot_context.create(self.db, obj_in=context_data)

        if context_obj["source_type"] == "csv":
            container = settings.MINERVA_DOCS_CONTAINER_NAME

            if documents:
                for doc in documents:
                    file_name = "context" + "/" + str(context.id) + "/" + doc.filename
                    self.__add_upload_context_datasource_docs__(
                        container=container, file_name=file_name, document=doc, context_id=context.id
                    )
        return CopilotContextMetadata(
            name=context.name,
            type=context.type,
            source_type=context.source_type,
            id=context.id,
            copilot_app_id=context.copilot_app_id,
        )

    def __create_metrics_and_kpi_context__(
        self, context_obj: dict, copilot_app_id: int, creator_id: int | None, documents: list
    ):
        context_data = CopilotContextCreate(
            name=context_obj["name"],
            type=context_obj["type"],
            copilot_app_id=copilot_app_id,
            source_type=context_obj["source_type"],
            created_by=creator_id,
        )
        context = copilot_context.create(self.db, obj_in=context_data)

        if context_obj["source_type"] == "upload":
            container = settings.MINERVA_DOCS_CONTAINER_NAME

            if documents:
                for doc in documents:
                    file_name = "context" + "/" + str(context.id) + "/" + doc.filename
                    self.__add_upload_context_datasource_docs__(
                        container=container, file_name=file_name, document=doc, context_id=context.id
                    )

        return CopilotContextMetadata(
            name=context.name,
            type=context.type,
            source_type=context.source_type,
            id=context.id,
            copilot_app_id=context.copilot_app_id,
        )

    def __add_upload_context_datasource_docs__(
        self, container: str, file_name: str, document: UploadFile, context_id: int
    ):
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        storage_client.upload(container=container, file_name=file_name, data=document.file.read(), overwrite=True)
        copilot_context_datasource.create(
            db=self.db,
            obj_in=CopilotContextDatasourceCreate(context_id=context_id, name=document.filename, config={}),
        )

    def update_context(
        self, context_id: int, payload_obj: dict, new_documents: list, deleted_documents: str
    ) -> list[CopilotContextDatasourceExtended]:
        copilot_context.update(db=self.db, id=context_id, obj_in=payload_obj)

        if payload_obj["source_type"] == "csv" or payload_obj["source_type"] == "upload":
            self.__update_context_datasource_documents__(
                context_id=context_id, deleted_documents=deleted_documents, new_documents=new_documents
            )

        context_datasources = copilot_context_datasource.get_datasources_by_context_id(
            db=self.db, context_id=context_id
        )

        context_datasource_list = [
            CopilotContextDatasourceExtended(
                context_id=context_id,
                context_name=item.context.name,
                context_type=item.context.type,
                context_source_type=item.context.source_type,
                id=item.id,
                name=item.name,
                config=item.config,
                url=self.get_context_datasource_info(context_id=context_id, datasource_name=item.name)
                if item.context.source_type in ["csv", "upload"]
                else None,
            )
            for item in context_datasources
        ]

        return context_datasource_list

    def __update_context_datasource_documents__(
        self, context_id: int, deleted_documents: str, new_documents: list
    ) -> list:
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        if deleted_documents:
            deleted_documents = json.loads(deleted_documents)
            context_datasource_ids = [datasource["id"] for datasource in deleted_documents]
            for item in context_datasource_ids:
                is_active_datasource_mapping = (
                    copilot_context_datasource_app_tool_mapping.is_context_datasource_app_tool_mapping_active(
                        db=self.db, context_datasource_id=item
                    )
                )
                if is_active_datasource_mapping:
                    raise HTTPException(status_code=409, detail="One or more document is linked to some app tool")

            for doc in deleted_documents:
                copilot_context_datasource.soft_delete(db=self.db, id=doc["id"])
                filename = "context" + "/" + str(context_id) + "/" + doc["name"]
                storage_client.delete(container=container, file_name=filename)

        if new_documents:
            existing_datasources = copilot_context_datasource.get_datasources_by_context_id(
                db=self.db, context_id=context_id
            )
            existing_doc_names = [item.name for item in existing_datasources]
            for doc in new_documents:
                if doc.filename in existing_doc_names:
                    raise HTTPException(status_code=409, detail="Document with same name already exists")

            for doc in new_documents:
                file_name = "context" + "/" + str(context_id) + "/" + doc.filename
                self.__add_upload_context_datasource_docs__(
                    container=container, file_name=file_name, document=doc, context_id=context_id
                )

    def get_context_datasource_list(
        self, copilot_app_id: int, context_id: int
    ) -> list[CopilotContextDatasourceExtended]:
        context_datasources = copilot_context_datasource.get_datasources_by_context_id(
            db=self.db, context_id=context_id
        )

        context_datasource_list = [
            CopilotContextDatasourceExtended(
                context_id=context_id,
                context_name=item.context.name,
                context_type=item.context.type,
                context_source_type=item.context.source_type,
                id=item.id,
                name=item.name,
                config=item.config,
                url=self.get_context_datasource_info(context_id=context_id, datasource_name=item.name)
                if item.context.source_type in ["csv", "upload"]
                else None,
            )
            for item in context_datasources
        ]

        return context_datasource_list

    def get_context_datasource_info(self, context_id: int, datasource_name: str) -> list:
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        filename = "context" + "/" + str(context_id) + "/" + datasource_name
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        url = storage_client.get_url(container=container, file_name=filename)
        return url

    def get_app_context_datasource_list(self, copilot_app_id: int) -> list[CopilotContextDatasourceExtended]:
        context_datasource_list = copilot_context_datasource.get_datasources_by_app_id(
            db=self.db, copilot_app_id=copilot_app_id
        )
        app_context_datasource_list = [
            CopilotContextDatasourceExtended(
                context_id=item[1].id,
                context_name=item[1].name,
                context_type=item[1].type,
                context_source_type=item[1].source_type,
                id=item[0].id,
                name=item[0].name,
                config=item[0].config,
                url=self.get_context_datasource_info(context_id=item[1].id, datasource_name=item[0].name)
                if item[1].source_type in ["csv", "upload"]
                else None,
            )
            for item in context_datasource_list
        ]
        return app_context_datasource_list

    def delete_context(self, copilot_app_id: int, context_id: int) -> CopilotContextDBBase:
        # TODO: add logic to check if context is linked to orchestrator
        app_tools = copilot_app_published_tool_mapping.get_all(db=self.db, copilot_app_id=copilot_app_id)
        context_datasource_list = copilot_context_datasource.get_datasources_by_context_id(
            db=self.db, context_id=context_id
        )
        context_datasource_ids = [datasource.id for datasource in context_datasource_list]
        for tool in app_tools:
            tool_context_mapped_ids = copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
                db=self.db, tool_id=tool.id
            )
            for item in tool_context_mapped_ids:
                if item.context_datasource_id in context_datasource_ids:
                    raise HTTPException(
                        detail="Unable to delete the context as some config(s) are mapped to one or more tool",
                        status_code=409,
                    )
        return copilot_context.soft_delete(db=self.db, id=context_id)

    def validate_context_config(self, context_type: str, validation_obj: dict):
        # TODO: implementing the validation logic for context
        return {"message": "Validated Successfully"}
