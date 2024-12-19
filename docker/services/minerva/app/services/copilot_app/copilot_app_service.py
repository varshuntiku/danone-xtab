#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import asyncio
import json
import logging
from typing import AsyncGenerator, List, Tuple

from app.db.crud.copilot_app_crud import copilot_app
from app.db.crud.copilot_app_datasource_published_tool_mapping_crud import (
    copilot_app_datasource_published_tool_mapping,
    tool_datasource_cache,
)
from app.db.crud.copilot_app_deployment_crud import copilot_app_deployment
from app.db.crud.copilot_app_published_tool_mapping_crud import (
    copilot_app_published_tool_mapping,
    copilot_app_tool_cache,
)
from app.db.crud.copilot_context_datasource_app_tool_mapping_crud import (
    copilot_context_datasource_app_tool_mapping,
    tool_context_datasource_cache,
)
from app.db.crud.copilot_context_datasource_crud import (
    context_datasource_cache,
    copilot_context_datasource,
)
from app.db.crud.copilot_conversation_crud import copilot_conversation
from app.db.crud.copilot_conversation_datasource_crud import (
    copilot_conversation_datasource,
)
from app.db.crud.copilot_conversation_window_crud import copilot_conversation_window
from app.db.crud.copilot_datasource_crud import copilot_datasource
from app.db.crud.copilot_tool_version_orchestrator_mapping_crud import (
    minerva_app_consumer_mapping_crud,
)
from app.db.crud.copilot_tool_version_registry_mapping_crud import (
    copilot_tool_version_registry_mapping,
)
from app.db.crud.llm_deployed_model_crud import llm_deployed_model_crud
from app.dependencies.dependencies import get_db
from app.models.copilot_app import CopilotApp
from app.models.copilot_app_deployment import CopilotAppDeployment
from app.schemas.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMappingBase,
    CopilotAppDatasourcePublishedToolMappingCreate,
    CopilotAppDatasourcePublishedToolMappingUpdate,
)
from app.schemas.copilot_app_deployment import (
    CopilotAppDeploymentConfig,
    CopilotAppDeploymentCreate,
    CopilotAppMappingSerialized,
)
from app.schemas.copilot_app_published_tool_mapping import (
    CopilotAppPublishedToolMappingCreate,
    CopilotAppPublishedToolMappingCreatePayload,
    CopilotAppPublishedToolMappingMetaData,
    CopilotAppPublishedToolMappingMetaDataExtended,
    CopilotAppPublishedToolMappingUpdate,
    CopilotAppPublishedToolMappingUpdatePayload,
    CopilotAppPublishedToolMappingUpdateStatusPayload,
    UpgradeCopilotAppPublishedToolPayload,
    UpgradeTypeEnum,
)
from app.schemas.copilot_app_schema import (
    CopilotAppDBBase,
    CopilotAppMetaExtended,
    CopilotAppUpdate,
)
from app.schemas.copilot_context_datasource_app_tool_mapping_schema import (
    CopilotContextDatasourceAppToolMappingBase,
    CopilotContextDatasourceAppToolMappingCreate,
    CopilotContextDatasourceAppToolMappingUpdate,
)
from app.schemas.copilot_conversation_datasource import (
    CopilotConversationDatasource,
    CopilotConversationDatasourceMeta,
)
from app.schemas.copilot_conversation_schema import (
    CopilotConversationBase,
    CopilotConversationCreate,
    CopilotConversationDBBase,
    CopilotConversationUpdate,
    CopilotConversationUpdatePayload,
)
from app.schemas.copilot_conversation_window_schema import (
    ConversationWindowMetadata,
    CopilotConversationWindowCreate,
    CopilotConversationWindowUpdatePayload,
)
from app.schemas.copilot_tool_request import (
    ContextDatasourceConfig,
    CopilotInfo,
    DataSourceConfig,
    LLMConfig,
    OrchestratorInfo,
    PreviousToolData,
    QueryInfo,
    ToolContextDatasourceConfig,
    ToolDatasourceConfig,
    ToolInfo,
)
from app.schemas.services_schema import ConversationResponse, QueryResponse
from app.services.copilot_context.copilot_context_service import CopilotContextService
from app.services.copilot_datasource.copilot_datasource_service import (
    CopilotDatasourceService,
    data_source_cache,
)
from app.services.copilot_orchestrator.copilot_orchestrator_service import (
    CopilotOrchestratorService,
)
from app.utils.config import get_settings
from app.utils.orchestrators.agents.base import OrchestratorRegistry
from app.utils.orchestrators.agents.description import PromptAgent  # noqa: F401
from app.utils.orchestrators.agents.functioncall import FunctionCallAgent  # noqa: F401
from app.utils.orchestrators.tools.base import Tool
from app.utils.tools.storage_util import StorageServiceClient, StorageType
from cachetools import TTLCache, cached
from fastapi import BackgroundTasks, Depends, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from openai import AsyncAzureOpenAI, AzureOpenAI


def llm_cache_key(*args, llm_id, **kwargs):
    return llm_id


def copilot_app_cache_key(*args, id, **kwargs):
    return id


def data_source_cache_key(*args, data_source_id, **kwargs):
    return data_source_id


def context_datasource_cache_key(*args, context_datasource_id, **kwargs):
    return context_datasource_id


llm_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)
copilot_app_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)

settings = get_settings()


class CopilotAppService:
    def __init__(
        self,
        db=Depends(get_db),
        copilot_datasource_service=Depends(CopilotDatasourceService),
        copilot_orchestrator_service=Depends(CopilotOrchestratorService),
        copilot_context_service=Depends(CopilotContextService),
    ):
        self.db = db
        self.copilot_datasource_service = copilot_datasource_service
        self.copilot_orchestrator_service = copilot_orchestrator_service
        self.copilot_context_service = copilot_context_service

    async def add_tool(
        self, copilot_app_id: int, copilot_tool_obj: CopilotAppPublishedToolMappingCreatePayload
    ) -> CopilotAppPublishedToolMappingMetaData:
        # Todo: update code for test skillset
        obj = CopilotAppPublishedToolMappingCreate(
            copilot_app_id=copilot_app_id,
            tool_version_registry_mapping_id=copilot_tool_obj.tool_version_registry_mapping_id,
            name=copilot_tool_obj.name,
            desc=copilot_tool_obj.desc,
            config=copilot_tool_obj.config,
            input_params=copilot_tool_obj.input_params,
        )
        copilot_tool_config = copilot_app_published_tool_mapping.create(db=self.db, obj_in=obj)
        copilot_app_tool_cache.pop(copilot_app_id, None)
        copilot_config = copilot_app.get(db=self.db, id=copilot_app_id)
        copilot_tool_version_registry_mapping_url = copilot_tool_version_registry_mapping.get_tool_deployment_url(
            db=self.db, id=copilot_tool_config.tool_version_registry_mapping_id
        )
        copilot_info = CopilotInfo(id=copilot_config.id, description=copilot_config.desc)
        tool_datasource_payload: list[CopilotAppDatasourcePublishedToolMappingCreate] = []
        for item in copilot_tool_obj.selected_datasources:
            tool_datasource_payload.append(
                CopilotAppDatasourcePublishedToolMappingCreate(
                    datasource_id=item.datasource_id,
                    app_published_tool_id=copilot_tool_config.id,
                    config=item.config,
                    key=item.key,
                )
            )
        tool_datasources = self._add_tool_datasources(selected_datasources=tool_datasource_payload)

        # Add tool context datasource
        tool_context_datasource_payload: list[CopilotContextDatasourceAppToolMappingCreate] = []
        tool_context_datasources = []
        if len(copilot_tool_obj.selected_context_datasources):
            for item in copilot_tool_obj.selected_context_datasources:
                tool_context_datasource_payload.append(
                    CopilotContextDatasourceAppToolMappingCreate(
                        context_datasource_id=item.context_datasource_id,
                        app_tool_id=copilot_tool_config.id,
                        config=item.config,
                    )
                )
            tool_context_datasources = self.__add_tool_context_datasources__(
                selected_context_datasources=tool_context_datasource_payload
            )

        updated_copilot_tool_config = await self._tool_validate_preprocess(
            copilot_app=copilot_config,
            copilot_tool_data=copilot_tool_config,
            copilot_info=copilot_info,
            copilot_tool_url=copilot_tool_version_registry_mapping_url[0]["access_url"],
            copilot_tool_datasources=tool_datasources,
            previous_tool_data=None,
            copilot_tool_context_datasources=tool_context_datasources,
        )
        updated_result = copilot_app_published_tool_mapping.update(
            db=self.db, id=copilot_tool_config.id, obj_in=updated_copilot_tool_config
        )
        copilot_app_tool_cache.pop(copilot_app_id, None)
        return CopilotAppPublishedToolMappingMetaData(
            id=updated_result.id,
            copilot_app_id=updated_result.copilot_app_id,
            tool_version_registry_mapping_id=updated_result.tool_version_registry_mapping_id,
            name=updated_result.name,
            desc=updated_result.desc,
            status=updated_result.status,
            config=updated_result.config,
            input_params=updated_result.input_params,
            preprocess_config=updated_result.preprocess_config,
            selected_datasources=tool_datasources,
            selected_context_datasources=tool_context_datasources,
        )

    def _add_tool_datasources(
        self, selected_datasources: list[CopilotAppDatasourcePublishedToolMappingCreate]
    ) -> list[CopilotAppDatasourcePublishedToolMappingBase]:
        tool_datasource_list = []
        for item in selected_datasources:
            tool_datasource_db_obj = copilot_app_datasource_published_tool_mapping.create(db=self.db, obj_in=item)
            tool_datasource_cache.pop(item.app_published_tool_id, None)
            tool_datasource_list.append(
                CopilotAppDatasourcePublishedToolMappingBase(
                    datasource_id=tool_datasource_db_obj.datasource_id,
                    app_published_tool_id=tool_datasource_db_obj.app_published_tool_id,
                    key=tool_datasource_db_obj.key,
                    config=tool_datasource_db_obj.config,
                )
            )

        return tool_datasource_list

    def __add_tool_context_datasources__(
        self, selected_context_datasources: list[CopilotContextDatasourceAppToolMappingCreate]
    ) -> list[CopilotContextDatasourceAppToolMappingBase]:
        tool_context_datasource_list = []
        for item in selected_context_datasources:
            tool_context_db_obj = copilot_context_datasource_app_tool_mapping.create(db=self.db, obj_in=item)
            tool_context_datasource_cache.pop(item.app_tool_id, None)
            tool_context_datasource_list.append(
                CopilotContextDatasourceAppToolMappingBase(
                    context_datasource_id=tool_context_db_obj.context_datasource_id,
                    app_tool_id=tool_context_db_obj.app_tool_id,
                    config=tool_context_db_obj.config,
                )
            )

        return tool_context_datasource_list

    def _get_orchestrator_ids_by_tool_version(self, tool_version_id: int) -> list[int]:
        orchestrators = minerva_app_consumer_mapping_crud.get_all_by_tool_version_id(
            db=self.db, tool_version_id=tool_version_id
        )
        orchestrators_ids = [el.orchestrator_id for el in orchestrators]
        return orchestrators_ids

    def get_all_tools(self, copilot_app_id: int) -> list[CopilotAppPublishedToolMappingMetaData]:
        result = copilot_app_published_tool_mapping.get_all_extended(db=self.db, copilot_app_id=copilot_app_id)
        return [
            CopilotAppPublishedToolMappingMetaDataExtended(
                id=el[0].id,
                copilot_app_id=el[0].copilot_app_id,
                tool_version_registry_mapping_id=el[0].tool_version_registry_mapping_id,
                name=el[0].name,
                desc=el[0].desc,
                status=el[0].status,
                config=el[0].config,
                input_params=el[0].input_params,
                preprocess_config=el[0].preprocess_config,
                tool_version_config=el[2].config or {},
                selected_datasources=copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
                    db=self.db, tool_id=el[0].id
                ),
                orchestrators=self._get_orchestrator_ids_by_tool_version(el[2].id),
                tool_version_deprecated=True if el[1].deprecated else False,
                tool_version_id=el[1].tool_version_id,
                tool_id=el[3].id,
                is_test=bool(el[2].is_test),
                registry_id=el[1].registry_id,
                selected_context_datasources=copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
                    db=self.db, tool_id=el[0].id
                ),
            )
            for el in result
        ]

    def get_copilot_app_tool(self, copilot_app_tool_id: int) -> CopilotAppPublishedToolMappingMetaData:
        result = copilot_app_published_tool_mapping.get_extended(db=self.db, id=copilot_app_tool_id)
        tool_datasources = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
            db=self.db, tool_id=copilot_app_tool_id
        )
        tool_context_datasources = copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
            db=self.db, tool_id=copilot_app_tool_id
        )
        return CopilotAppPublishedToolMappingMetaDataExtended(
            id=result[0].id,
            copilot_app_id=result[0].copilot_app_id,
            tool_version_registry_mapping_id=result[0].tool_version_registry_mapping_id,
            name=result[0].name,
            desc=result[0].desc,
            status=result[0].status,
            config=result[0].config,
            input_params=result[0].input_params,
            preprocess_config=result[0].preprocess_config,
            tool_version_config=result[2].config or {},
            selected_datasources=tool_datasources,
            orchestrators=self._get_orchestrator_ids_by_tool_version(result[2].id),
            tool_version_deprecated=True if result[1].deprecated else False,
            tool_version_id=result[1].tool_version_id,
            tool_id=result[3].id,
            is_test=bool(result[2].is_test),
            selected_context_datasources=tool_context_datasources,
        )

    def update_tool_status(
        self, copilot_app_tool_id: int, update_obj: CopilotAppPublishedToolMappingUpdateStatusPayload
    ) -> CopilotAppPublishedToolMappingMetaData:
        result = copilot_app_published_tool_mapping.update(db=self.db, id=copilot_app_tool_id, obj_in=update_obj)
        copilot_app_tool_cache.pop(result.copilot_app_id, None)
        return CopilotAppPublishedToolMappingMetaData(
            id=result.id,
            copilot_app_id=result.copilot_app_id,
            tool_version_registry_mapping_id=result.tool_version_registry_mapping_id,
            name=result.name,
            desc=result.desc,
            status=result.status,
            config=result.config,
            input_params=result.config,
            preprocess_config=result.preprocess_config,
        )

    async def update_tool(
        self,
        copilot_app_tool_id: int,
        update_obj: CopilotAppPublishedToolMappingUpdatePayload | CopilotAppPublishedToolMappingUpdateStatusPayload,
    ) -> CopilotAppPublishedToolMappingMetaData:
        """
        Update a tool in the Copilot app.

        Args:
            copilot_app_tool_id (int): The ID of the tool to be updated.
            update_obj (CopilotAppPublishedToolMappingUpdatePayload | CopilotAppPublishedToolMappingUpdateStatusPayload):
                The payload containing the updated tool information.

        Returns:
            CopilotAppPublishedToolMappingMetaData: The metadata of the updated tool.
        """
        # Todo: update code for test skillset
        # creating previous tool data
        previous_tool_obj = copilot_app_published_tool_mapping.get(db=self.db, id=copilot_app_tool_id)
        previous_datasources = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
            db=self.db, tool_id=copilot_app_tool_id
        )
        previous_context_datasources = copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
            db=self.db, tool_id=copilot_app_tool_id
        )
        previous_llm_config = []
        if "llm_model" in previous_tool_obj.config and previous_tool_obj.config["llm_model"]:
            previous_llm_config.append(self._get_llm_config(llm_id=previous_tool_obj.config["llm_model"]))
        if "embedding_model" in previous_tool_obj.config and previous_tool_obj.config["embedding_model"]:
            previous_llm_config.append(self._get_llm_config(llm_id=previous_tool_obj.config["embedding_model"]))
        previous_tool_data = PreviousToolData(
            tool_info=ToolInfo(
                copilot_tool_id=previous_tool_obj.id,
                name=previous_tool_obj.name,
                description=previous_tool_obj.desc or "",
                input_params=previous_tool_obj.input_params or {},
                preprocess_config=previous_tool_obj.preprocess_config or {},
                config=previous_tool_obj.config or {},
            ),
            llm_config=previous_llm_config,
            data_sources=[
                ToolDatasourceConfig(
                    datasource_id=datasource.datasource_id,
                    app_published_tool_id=datasource.app_published_tool_id,
                    config=datasource.config,
                    key=datasource.key,
                    base_datasource=self._get_data_source(data_source_id=datasource.datasource_id),
                )
                for datasource in previous_datasources
            ],
            context_datasources=[
                ToolContextDatasourceConfig(
                    context_datasource_id=item.context_datasource_id,
                    app_tool_id=item.app_tool_id,
                    config=item.config,
                    base_context_datasource=self.__get_context_datasource__(
                        context_datasource_id=item.context_datasource_id
                    ),
                )
                for item in previous_context_datasources
            ],
        )

        # update the db with the payload
        tool_data = copilot_app_published_tool_mapping.update(db=self.db, id=copilot_app_tool_id, obj_in=update_obj)
        copilot_app_tool_cache.pop(tool_data.copilot_app_id, None)
        if update_obj.selected_datasources is not None:
            tool_datasource_payload: list[CopilotAppDatasourcePublishedToolMappingUpdate] = []
            for item in update_obj.selected_datasources:
                tool_datasource_payload.append(
                    CopilotAppDatasourcePublishedToolMappingUpdate(
                        datasource_id=item.datasource_id,
                        app_published_tool_id=copilot_app_tool_id,
                        config=item.config,
                        key=item.key,
                    )
                )

            tool_datasources = self._update_tool_datasources(
                copilot_tool_id=copilot_app_tool_id, selected_datasources=tool_datasource_payload
            )
        else:
            tool_datasources = previous_datasources
        # update tool context
        if update_obj.selected_context_datasources:
            tool_context_payload: list[CopilotContextDatasourceAppToolMappingUpdate] = []
            for item in update_obj.selected_context_datasources:
                tool_context_payload.append(
                    CopilotContextDatasourceAppToolMappingUpdate(
                        context_datasource_id=item.context_datasource_id,
                        app_tool_id=copilot_app_tool_id,
                        config=item.config,
                    )
                )

            tool_context_datasources = self.__update_tool_context_datasources__(
                copilot_tool_id=copilot_app_tool_id, selected_context_datasources=tool_context_payload
            )
        else:
            tool_context_datasources = previous_context_datasources

        # call preprocess method
        copilot_config = copilot_app.get(db=self.db, id=tool_data.copilot_app_id)
        copilot_tool_version_registry_mapping_url = copilot_tool_version_registry_mapping.get_tool_deployment_url(
            db=self.db, id=tool_data.tool_version_registry_mapping_id
        )
        copilot_info = CopilotInfo(id=copilot_config.id, description=copilot_config.desc)

        updated_copilot_tool_config = await self._tool_validate_preprocess(
            copilot_app=copilot_config,
            copilot_tool_data=tool_data,
            copilot_info=copilot_info,
            copilot_tool_url=copilot_tool_version_registry_mapping_url[0]["access_url"],
            copilot_tool_datasources=tool_datasources,
            previous_tool_data=previous_tool_data,
            copilot_tool_context_datasources=tool_context_datasources,
        )
        updated_result = copilot_app_published_tool_mapping.update(
            db=self.db, id=copilot_app_tool_id, obj_in=updated_copilot_tool_config
        )
        copilot_app_tool_cache.pop(updated_result.copilot_app_id, None)

        return CopilotAppPublishedToolMappingMetaData(
            id=updated_result.id,
            copilot_app_id=updated_result.copilot_app_id,
            tool_version_registry_mapping_id=updated_result.tool_version_registry_mapping_id,
            name=updated_result.name,
            desc=updated_result.desc,
            status=updated_result.status,
            config=updated_result.config,
            input_params=updated_result.config,
            preprocess_config=updated_result.preprocess_config,
            selected_datasources=tool_datasources,
            selected_context_datasources=tool_context_datasources,
        )

    def _update_tool_datasources(
        self, copilot_tool_id: int, selected_datasources: list[CopilotAppDatasourcePublishedToolMappingUpdate]
    ) -> list[CopilotAppDatasourcePublishedToolMappingBase]:
        new_datasources: list[CopilotAppDatasourcePublishedToolMappingBase] = []
        modified_datasources: list[CopilotAppDatasourcePublishedToolMappingBase] = []
        unchanged_datasources: list[CopilotAppDatasourcePublishedToolMappingBase] = []
        removed_datasources: list[CopilotAppDatasourcePublishedToolMappingBase] = []

        existing_tool_datasources = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
            db=self.db, tool_id=copilot_tool_id
        )

        # check for removed datasources:
        for item in existing_tool_datasources:
            found_datasource = any(item.datasource_id == el.datasource_id for el in selected_datasources)
            if not found_datasource:
                removed_datasources.append(item)

        # check for newly added and modified datasources:
        for item in selected_datasources:
            exiting_datasource = next(
                (el for el in existing_tool_datasources if item.datasource_id == el.datasource_id), None
            )
            item.app_published_tool_id = copilot_tool_id
            if exiting_datasource:
                if exiting_datasource.config != item.config:
                    modified_datasources.append(item)
                else:
                    unchanged_datasources.append(item)
            else:
                new_datasources.append(item)

        if len(removed_datasources) or len(modified_datasources) or len(new_datasources):
            self._update_tool_datasource_mapping(
                new_datasources=new_datasources,
                modified_datasources=modified_datasources,
                removed_datasources=removed_datasources,
                copilot_tool_id=copilot_tool_id,
            )

        # result = (
        #     [*new_datasources, *modified_datasources, *unchanged_datasources]
        #     if len(new_datasources) or len(modified_datasources) or len(unchanged_datasources)
        #     else existing_tool_datasources
        # )
        # returning the new, modified or unchanged tool data sources, fix for case while removing mapping for all tool data sources
        result = [*new_datasources, *modified_datasources, *unchanged_datasources]
        return result

    def _update_tool_datasource_mapping(
        self,
        new_datasources: list[CopilotAppDatasourcePublishedToolMappingBase],
        modified_datasources: list[CopilotAppDatasourcePublishedToolMappingBase],
        removed_datasources: list[CopilotAppDatasourcePublishedToolMappingBase],
        copilot_tool_id: int,
    ):
        if len(removed_datasources):
            for datasource in removed_datasources:
                copilot_app_datasource_published_tool_mapping.remove_by_tool_id_datasource_id(
                    db=self.db, tool_id=copilot_tool_id, datasource_id=datasource.datasource_id
                )
                tool_datasource_cache.pop(copilot_tool_id, None)

        if len(modified_datasources):
            for datasource in modified_datasources:
                copilot_app_datasource_published_tool_mapping.update(
                    db=self.db, tool_id=copilot_tool_id, obj_in=datasource
                )
                tool_datasource_cache.pop(copilot_tool_id, None)

        if len(new_datasources):
            for datasource in new_datasources:
                copilot_app_datasource_published_tool_mapping.create(db=self.db, obj_in=datasource)
                tool_datasource_cache.pop(datasource.app_published_tool_id, None)

    def __update_tool_context_datasources__(
        self, copilot_tool_id: int, selected_context_datasources: list[CopilotContextDatasourceAppToolMappingUpdate]
    ) -> list[CopilotContextDatasourceAppToolMappingBase]:
        new_context_datasources: list[CopilotContextDatasourceAppToolMappingBase] = []
        modified_context_datasources: list[CopilotContextDatasourceAppToolMappingBase] = []
        unchanged_context_datasources: list[CopilotContextDatasourceAppToolMappingBase] = []
        removed_context_datasources: list[CopilotContextDatasourceAppToolMappingBase] = []

        existing_tool_context_datasources = copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
            db=self.db, tool_id=copilot_tool_id
        )

        # check for removed context datasources:
        for item in existing_tool_context_datasources:
            found_context = any(
                item.context_datasource_id == el.context_datasource_id for el in selected_context_datasources
            )
            if not found_context:
                removed_context_datasources.append(item)

        # check for newly added and modified contexts:
        for item in selected_context_datasources:
            exiting_context = next(
                (
                    el
                    for el in existing_tool_context_datasources
                    if item.context_datasource_id == el.context_datasource_id
                ),
                None,
            )
            item.app_tool_id = copilot_tool_id
            if exiting_context:
                if exiting_context.config != item.config:
                    modified_context_datasources.append(item)
                else:
                    unchanged_context_datasources.append(item)
            else:
                new_context_datasources.append(item)

        if len(removed_context_datasources) or len(modified_context_datasources) or len(new_context_datasources):
            self.__update_tool_context_mapping__(
                new_context_datasources=new_context_datasources,
                modified_context_datasources=modified_context_datasources,
                removed_context_datasources=removed_context_datasources,
                copilot_tool_id=copilot_tool_id,
            )

        result = [*new_context_datasources, *modified_context_datasources, *unchanged_context_datasources]
        return result

    def __update_tool_context_mapping__(
        self,
        new_context_datasources: list[CopilotContextDatasourceAppToolMappingBase],
        modified_context_datasources: list[CopilotContextDatasourceAppToolMappingBase],
        removed_context_datasources: list[CopilotContextDatasourceAppToolMappingBase],
        copilot_tool_id: int,
    ):
        if len(removed_context_datasources):
            for context in removed_context_datasources:
                copilot_context_datasource_app_tool_mapping.remove_by_tool_id_context_datasource_id(
                    db=self.db, tool_id=copilot_tool_id, context_datasource_id=context.context_datasource_id
                )
                tool_context_datasource_cache.pop(copilot_tool_id, None)

        if len(modified_context_datasources):
            for context in modified_context_datasources:
                copilot_context_datasource_app_tool_mapping.update(db=self.db, tool_id=copilot_tool_id, obj_in=context)
                tool_context_datasource_cache.pop(copilot_tool_id, None)

        if len(new_context_datasources):
            for context in new_context_datasources:
                copilot_context_datasource_app_tool_mapping.create(db=self.db, obj_in=context)
                tool_context_datasource_cache.pop(context.app_tool_id, None)

    def delete_tool(self, app_tool_mapping_id: int) -> id:
        result = copilot_app_published_tool_mapping.soft_delete(db=self.db, id=app_tool_mapping_id)
        copilot_app_tool_cache.pop(result.copilot_app_id, None)
        return result.id

    def deploy_app(self, copilot_app_id: int, user_info: dict) -> CopilotAppDeployment:
        obj = CopilotAppDeploymentCreate(
            created_by=user_info["user_id"],
            copilot_app_id=copilot_app_id,
            config=CopilotAppDeploymentConfig(data=self.serialize_copilot_app_data(copilot_app_id)),
        )
        result = copilot_app_deployment.create(db=self.db, obj_in=obj)
        return result

    def serialize_copilot_app_data(self, copilot_app_id: int) -> CopilotAppMappingSerialized:
        app = copilot_app.get(db=self.db, id=copilot_app_id)
        copilot_app_meta = CopilotAppMetaExtended(
            name=app.name,
            desc=app.desc,
            config=app.config,
            id=app.id,
            orchestrator_config=app.orchestrator_config,
            orchestrator_id=app.orchestrator_id,
            is_test=bool(app.is_test),
        )
        tools = self.get_all_tools(copilot_app_id=copilot_app_id)
        data_sources = copilot_datasource.get_copilot_app_datasources(db=self.db, copilot_app_id=copilot_app_id)
        return CopilotAppMappingSerialized(copilot_app_meta=copilot_app_meta, tools=tools, data_sources=data_sources)

    @cached(cache=copilot_app_cache, key=copilot_app_cache_key)
    def _get_copilot_app(self, id: int) -> CopilotAppMetaExtended:
        data = copilot_app.get(db=self.db, id=id)
        return CopilotAppMetaExtended(
            id=data.id,
            name=data.name,
            desc=data.desc,
            config=data.config,
            orchestrator_id=data.orchestrator_id,
            orchestrator_config=data.orchestrator_config,
            is_test=bool(data.is_test),
        )

    def _upload_conversation_datasource(
        self, copilot_conversation_id: int, documents: List[UploadFile], window_id: int
    ) -> List[CopilotConversationDatasourceMeta]:
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        docs = []
        if documents:
            for doc in documents:
                file_name = (
                    "coversation_datasource"
                    + "/"
                    + str(window_id)
                    + "/"
                    + str(copilot_conversation_id)
                    + "/"
                    + doc.filename
                )
                storage_client.upload(container=container, file_name=file_name, data=doc.file.read(), overwrite=True)
                url = storage_client.get_url(container=container, file_name=file_name)
                convo_datasource = copilot_conversation_datasource.create(
                    db=self.db,
                    obj_in=CopilotConversationDatasource(
                        conversation_id=copilot_conversation_id,
                        name=doc.filename,
                        meta={"storage_type": StorageType[settings.STORAGE_SERVICE].value},
                        # type="file",
                    ),
                )
                docs.append(
                    CopilotConversationDatasourceMeta(
                        id=convo_datasource.id,
                        name=convo_datasource.name,
                        url=url,
                        conversation_id=copilot_conversation_id,
                        conversation_window_id=window_id,
                    )
                )
        return docs

    async def query_app(
        self,
        copilot_app_id: int,
        user_info: dict,
        user_query: str,
        query_datasource: List[UploadFile],
        query_trace_id: str = None,
        window_id: int = None,
        user_form_input: dict = None,
        skip_conversation_window: str = "",
        input_mode: str = "text",
        extra_query_param: str = "",
        query_type: str = "",
    ) -> AsyncGenerator:
        convo_response = {}
        extra_info = None
        error = None
        try:
            # emit step 1: started
            # await emit_query_processing_step(
            #     room=user_info["email"],
            #     data={
            #         "progress_message": "Preparing user query",
            #         "query_trace_id": query_trace_id,
            #         "window_id": window_id,
            #     },
            # )

            # Todo: Update code for test app
            # query minerva app config
            copilot_config = self._get_copilot_app(id=copilot_app_id)
            copilot_tools = copilot_app_published_tool_mapping.get_all(db=self.db, copilot_app_id=copilot_app_id)
            copilot_tool_version_registry_mapping_ids = [el.tool_version_registry_mapping_id for el in copilot_tools]
            copilot_tool_version_registry_mapping_urls = copilot_tool_version_registry_mapping.get_tool_deployment_urls(
                db=self.db, ids=copilot_tool_version_registry_mapping_ids
            )
            # generate conversation window if not present
            new_conversation_window = True if not window_id else False
            if not window_id and skip_conversation_window != "true":
                convo_window_obj = CopilotConversationWindowCreate(
                    application_id=copilot_app_id,
                    user_id=user_info["email"],
                    title=user_query,
                )
                convo_window_obj = copilot_conversation_window.create(self.db, obj_in=convo_window_obj)
                window_id = convo_window_obj.id
            # query historical user queries to pass as additional context
            if not new_conversation_window and copilot_config.orchestrator_config.convo_memory_enabled:
                history = copilot_conversation.get_recent_conversations(
                    db=self.db,
                    application_id=copilot_app_id,
                    user_id=user_info["email"],
                    window_id=window_id,
                    limit=5,
                    offset=0,
                )
                history = [
                    CopilotConversationBase(
                        application_id=el.application_id,
                        user_id=el.user_id,
                        user_query=el.user_query,
                        copilot_response=el.copilot_response,
                        feedback=el.feedback,
                        conversation_window_id=el.conversation_window_id,
                        request_type=el.request_type,
                        request_payload=el.request_payload,
                        extra_info=el.extra_info,
                    )
                    for el in history
                ]
            else:
                history = []

            # initialise agent
            # await emit_query_processing_step(
            #     room=user_info["email"],
            #     data={
            #         "progress_message": "An agent is generating the response.",
            #         "query_trace_id": query_trace_id,
            #         "window_id": window_id,
            #     },
            # )

            copilot_info = CopilotInfo(id=copilot_config.id, description=copilot_config.desc)

            # Fetch the Orhestrator LLM ID
            orchestrator_llm_id = (
                copilot_config.orchestrator_config.lang_model
                if copilot_config.orchestrator_config
                else copilot_config.config.lang_model
            )
            # Create the LLM config
            agent_llm = self._get_llm_config(llm_id=orchestrator_llm_id)

            tools = []
            for tool in copilot_tools:
                tool_url = [
                    el
                    for el in copilot_tool_version_registry_mapping_urls
                    if el.id == tool.tool_version_registry_mapping_id
                ][0].info["access_url"]
                # To-do - Standardize llm input for all tools
                llm_model = []
                if "llm_model" in tool.config and tool.config["llm_model"]:
                    llm_model.append(self._get_llm_config(llm_id=tool.config["llm_model"]))
                if "embedding_model" in tool.config and tool.config["embedding_model"]:
                    llm_model.append(self._get_llm_config(llm_id=tool.config["embedding_model"]))
                # To-do - Standardize data source input for all tools
                tool_mapped_datasources = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
                    db=self.db, tool_id=tool.id
                )
                tool_data_sources = []
                for datasource in tool_mapped_datasources:
                    tool_data_sources.append(
                        ToolDatasourceConfig(
                            datasource_id=datasource.datasource_id,
                            app_published_tool_id=datasource.app_published_tool_id,
                            config=datasource.config,
                            key=datasource.key,
                            base_datasource=self._get_data_source(data_source_id=datasource.datasource_id),
                        )
                    )

                tool_mapped_context_datasources = (
                    copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
                        db=self.db, tool_id=tool.id
                    )
                )
                tool_context_datasources = []
                for context in tool_mapped_context_datasources:
                    tool_context_datasources.append(
                        ToolContextDatasourceConfig(
                            context_datasource_id=context.context_datasource_id,
                            app_tool_id=context.app_tool_id,
                            config=context.config,
                            base_context_datasource=self.__get_context_datasource__(
                                context_datasource_id=context.context_datasource_id
                            ),
                        )
                    )
                tool_config = {
                    key: tool.config[key]
                    for key in tool.config
                    if key not in ["desc", "llm_model", "datasource", "embedding_model"]
                }
                tool_info = ToolInfo(
                    copilot_tool_id=tool.id,
                    name=tool.name,
                    description=tool.desc,
                    config=tool_config,
                    input_params=tool.input_params or {},
                    preprocess_config=tool.preprocess_config or {},
                )
                websocket_conn = ""
                if copilot_config.is_test:
                    tool_extended_data = copilot_app_published_tool_mapping.get_extended(db=self.db, id=tool.id)
                    is_test = tool_extended_data[2].is_test
                    websocket_conn = str(tool_extended_data[2].id)
                else:
                    is_test = False
                tools.append(
                    Tool(
                        tool_info=tool_info,
                        copilot_info=copilot_info,
                        llm_config=llm_model,
                        deployment_url=tool_url,
                        data_sources=tool_data_sources,
                        is_test=is_test,
                        websocket_conn=websocket_conn,
                        context_datasources=tool_context_datasources,
                    )
                )

            # For the copilot where the Orchestrator Id is not configured, Use the description based orchestrator
            orchestrator_id = copilot_config.orchestrator_id if copilot_config.orchestrator_id else 1

            # Get the orchestrator details
            orchestrator_details = self.copilot_orchestrator_service.get_orchestrator(id=orchestrator_id)

            # Orchestrator system message
            orchestrator_message = (
                copilot_config.orchestrator_config.system_message
                if isinstance(copilot_config.orchestrator_config, dict)
                and copilot_config.orchestrator_config.system_message
                else orchestrator_details.config.system_message
            )

            # Orchestrator Info
            orchestrator_info = OrchestratorInfo(
                system_message=orchestrator_message,
                convo_memory_enabled=copilot_config.orchestrator_config.convo_memory_enabled,
            )

            # Orchestrator Registry
            agent = OrchestratorRegistry.get_orchestrator(
                orchestrator_details.identifier,
                copilot_info=copilot_info,
                tools=tools,
                agent_llm=agent_llm,
                orchestrator_info=orchestrator_info,
            )

            # insert conversation into db
            convo_obj = CopilotConversationCreate(
                application_id=copilot_app_id,
                user_id=user_info["email"],
                user_query=user_query,
                copilot_response={},
                conversation_window_id=window_id if skip_conversation_window != "true" else None,
                interrupted=False,
                request_type=query_type,
                input_mode=input_mode,
                extra_query_param=extra_query_param,
                request_payload=user_form_input,
            )
            convo_obj = copilot_conversation.create(db=self.db, obj_in=convo_obj)

            # Upload file in blob if any
            uploaded_query_datasource = (
                self._upload_conversation_datasource(
                    copilot_conversation_id=convo_obj.id, documents=query_datasource, window_id=window_id
                )
                if len(query_datasource) > 0
                else []
            )

            query_info = QueryInfo(
                text_input=user_query,
                form_input=user_form_input,
                window_id=window_id,
                query_trace_id=query_trace_id,
                convo_history=history,
                id=convo_obj.id,
                query_datasource=uploaded_query_datasource,
                query_type=query_type,
                input_mode=input_mode,
                extra_query_param=extra_query_param,
            )

            async for query_response in agent.execute_query(query_info, user_info):
                streamed_response_json = {
                    "id": convo_obj.id,
                    "query_trace_id": query_trace_id,
                    "input": user_query,
                    "window_id": window_id,
                    "error": error,
                    **query_response,
                }
                if query_response.get("output", False):
                    convo_response = query_response["output"]
                if query_response.get("extra_info", False):
                    extra_info = query_response["extra_info"]
                if query_response.get("error", False):
                    error = query_response["error"]
                yield json.dumps(streamed_response_json) + "\n"

        except asyncio.CancelledError:
            logging.warning("Generator terminated")
            copilot_conversation.update(db=self.db, id=convo_obj.id, obj_in=CopilotConversationUpdate(interrupted=True))
        except Exception as e:
            logging.warning(e)
            error = True
            exception_output = {
                "id": convo_obj.id if convo_obj else None,
                "query_trace_id": query_trace_id,
                "input": user_query,
                "window_id": window_id,
                "error": str(error) if error else None,
            }
            yield json.dumps(exception_output) + "\n"
        finally:
            copilot_conversation.update(
                db=self.db,
                id=convo_obj.id,
                obj_in=CopilotConversationUpdate(copilot_response=convo_response, extra_info=extra_info, error=error),
            )

    async def _tool_validate_preprocess(
        self,
        copilot_app: CopilotApp,
        copilot_tool_data: CopilotAppPublishedToolMappingMetaData,
        copilot_info: CopilotInfo,
        copilot_tool_url: str,
        copilot_tool_datasources: list[CopilotAppDatasourcePublishedToolMappingBase],
        copilot_tool_context_datasources: list[CopilotContextDatasourceAppToolMappingBase],
        previous_tool_data: PreviousToolData | None,
    ) -> CopilotAppPublishedToolMappingUpdatePayload:
        """
        Validates and preprocesses the copilot tool.

        Args:
            copilot_tool_data (CopilotAppPublishedToolMappingMetaData): The copilot tool data to be validated and preprocessed.
            copilot_info (CopilotInfo): The copilot information.
            copilot_tool_url (str): The URL of the copilot tool.

        Returns:
            CopilotAppPublishedToolMappingUpdatePayload: The updated copilot tool configuration.
        """

        # To-do - Standardize llm input for all tools
        llm_model = []
        if "llm_model" in copilot_tool_data.config:
            llm_model.append(self._get_llm_config(llm_id=copilot_tool_data.config["llm_model"]))
        if "embedding_model" in copilot_tool_data.config:
            llm_model.append(self._get_llm_config(llm_id=copilot_tool_data.config["embedding_model"]))
        # To-do - Standardize data source input for all tools
        tool_datasources = []
        for datasource in copilot_tool_datasources:
            tool_datasources.append(
                ToolDatasourceConfig(
                    datasource_id=datasource.datasource_id,
                    app_published_tool_id=copilot_tool_data.id,
                    config=datasource.config,
                    key=datasource.key,
                    base_datasource=self._get_data_source(data_source_id=datasource.datasource_id),
                )
            )

        tool_context_datasources = []
        for item in copilot_tool_context_datasources:
            tool_context_datasources.append(
                ToolContextDatasourceConfig(
                    context_datasource_id=item.context_datasource_id,
                    app_tool_id=copilot_tool_data.id,
                    config=item.config,
                    base_context_datasource=self.__get_context_datasource__(
                        context_datasource_id=item.context_datasource_id
                    ),
                )
            )
        tool_config = {
            key: copilot_tool_data.config[key]
            for key in copilot_tool_data.config
            if key not in ["desc", "llm_model", "datasource", "embedding_model"]
        }

        websocket_conn = ""
        if copilot_app.is_test:
            tool_extended_data = copilot_app_published_tool_mapping.get_extended(db=self.db, id=copilot_tool_data.id)
            is_test = tool_extended_data[2].is_test
            websocket_conn = str(tool_extended_data[2].id)
        else:
            is_test = False
        tool_obj = Tool(
            tool_info=ToolInfo(
                copilot_tool_id=copilot_tool_data.id,
                description=copilot_tool_data.desc or "",
                input_params=copilot_tool_data.input_params or {},
                preprocess_config=copilot_tool_data.preprocess_config or {},
                config=tool_config or {},
                name=copilot_tool_data.name,
            ),
            copilot_info=copilot_info,
            deployment_url=copilot_tool_url,
            llm_config=llm_model,
            data_sources=tool_datasources,
            is_test=is_test,
            websocket_conn=websocket_conn,
            context_datasources=tool_context_datasources,
        )
        # run tool validation
        validation_result = await tool_obj.validate(previous_data=previous_tool_data)
        if validation_result.get("validation_flag", False) is False:
            # handle case where tool validation fails - update tool status as error
            copilot_tool_data.status = "Failed"
            logging.error(f'Error in validating tool config{validation_result.get("message", "")}')
        else:
            # run tool pre processing
            pre_process_result = await tool_obj.pre_process(previous_data=previous_tool_data)
            if pre_process_result.get("status", "error") in ["error", "Failed"]:
                # handle case where tool processing has failed
                logging.error(f'Error in pre-processing tool config{pre_process_result.get("message", "")}')
            else:
                copilot_tool_data.preprocess_config = pre_process_result.get("preprocess_config", {})
            copilot_tool_data.status = pre_process_result.get("status", "Failed")
        update_obj = CopilotAppPublishedToolMappingUpdatePayload(
            status=copilot_tool_data.status, preprocess_config=copilot_tool_data.preprocess_config
        )
        return update_obj

    @cached(cache=llm_cache, key=llm_cache_key)
    def _get_llm_config(self, llm_id: int) -> LLMConfig:
        llm_config = llm_deployed_model_crud.get(db=self.db, id=llm_id)
        return LLMConfig(
            name=llm_config.name,
            type=llm_config.model.model_type,
            config={
                "api_base": llm_config.endpoint,
                **(llm_config.model_params if llm_config.model_params and llm_config.model_params != "null" else {}),
            },
            id=llm_config.id,
            env=settings.MINERVA_ENVIRONMENT_NAME,
        )

    @cached(cache=data_source_cache, key=data_source_cache_key)
    def _get_data_source(self, data_source_id: int) -> DataSourceConfig:
        data_source = copilot_datasource.get(db=self.db, id=data_source_id)
        if data_source.type == "upload" or data_source.type == "csv" or data_source.type == "storyboard_slidemaster":
            docs = self.copilot_datasource_service.get_datasource_documents(datasource_id=data_source_id)
            data_source.config["documents"] = docs
        return DataSourceConfig(name=data_source.name, type=data_source.type, config=data_source.config)

    @cached(cache=context_datasource_cache, key=context_datasource_cache_key)
    def __get_context_datasource__(self, context_datasource_id: int) -> ContextDatasourceConfig:
        context_item = copilot_context_datasource.get(db=self.db, context_datasource_id=context_datasource_id)
        context_datasource_info = ContextDatasourceConfig(
            context_type=context_item.context.type,
            context_source_type=context_item.context.source_type,
            context_name=context_item.context.name,
            name=context_item.name,
            config=context_item.config,
            url=self.copilot_context_service.get_context_datasource_info(
                context_id=context_item.context.id, datasource_name=context_item.name
            )
            if context_item.context.source_type in ["csv", "upload"]
            else None,
        )
        return context_datasource_info

    def update_conversation(
        self, conversation_id: int, obj_in: CopilotConversationUpdatePayload
    ) -> CopilotConversationDBBase:
        convo_obj = obj_in.dict(exclude_none=True)
        if "output" in convo_obj:
            convo_obj["copilot_response"] = obj_in.output
            del convo_obj["output"]
        return copilot_conversation.update(
            db=self.db, id=conversation_id, obj_in=CopilotConversationUpdate(**convo_obj)
        )

    def get_conversation_windows(self, copilot_app_id: int, user_info: dict):
        res = copilot_conversation_window.get_conversation_windows(
            db=self.db,
            application_id=copilot_app_id,
            user_id=user_info["email"],
        )
        return [
            {
                "id": el.id,
                "title": el.title,
                "pinned": bool(el.pinned),
                "created_at": el.created_at.isoformat(),
            }
            for el in res
        ]

    def update_conversation_window(self, window_id: int, window_obj: CopilotConversationWindowUpdatePayload):
        updated_obj = copilot_conversation_window.update(db=self.db, id=window_id, obj_in=window_obj)
        return ConversationWindowMetadata(
            id=updated_obj.id,
            title=updated_obj.title,
            pinned=bool(updated_obj.pinned),
            created_at=updated_obj.created_at.isoformat(),
        )

    def delete_conversation_window(self, window_id: int):
        deleted_obj = copilot_conversation_window.soft_delete(db=self.db, id=window_id)
        return deleted_obj.id

    def _get_conversation_datasources(self, documents: list, conversation_id: int, window_id: int):
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        container = settings.MINERVA_DOCS_CONTAINER_NAME
        docs = []
        for doc in documents:
            file_name = "coversation_datasource" + "/" + str(window_id) + "/" + str(conversation_id) + "/" + doc.name
            url = storage_client.get_url(container=container, file_name=file_name)
            docs.append({"name": doc.name, "url": url})
        return docs

    def get_conversations(
        self, copilot_app_id: int, window_id: int, user_info: dict, query_limit: int = 0, query_offset: int = 50
    ) -> ConversationResponse:
        minerva_conversations = copilot_conversation.get_recent_conversations(
            db=self.db,
            application_id=copilot_app_id,
            user_id=user_info["email"],
            window_id=window_id,
            limit=query_limit,
            offset=query_offset,
        )
        convo_count = copilot_conversation.get_convo_count(
            db=self.db,
            application_id=copilot_app_id,
            user_id=user_info["email"],
            window_id=window_id,
        )
        return ConversationResponse(
            list=[
                QueryResponse(
                    id=el.id,
                    input=el.user_query,
                    output=el.copilot_response,
                    window_id=el.conversation_window_id,
                    feedback=el.feedback,
                    pinned=el.pinned,
                    comment=el.comment,
                    interrupted=el.interrupted,
                    datasource=self._get_conversation_datasources(
                        documents=el.datasource, conversation_id=el.id, window_id=window_id
                    )
                    if el.datasource
                    else [],
                    request_type=el.request_type,
                    request_payload=el.request_payload,
                    error=el.error,
                )
                for el in minerva_conversations
            ],
            next_offset=query_offset + query_limit,
            total_count=convo_count,
        )

    def upload_copilot_avatar(self, copilot_app_id: int, file: UploadFile):
        storage_client = StorageServiceClient.get_storage_client(storage_type=StorageType[settings.STORAGE_SERVICE])
        container = settings.COPILOT_CONTAINER_NAME

        app = copilot_app.get(db=self.db, id=copilot_app_id)
        current_url = app.config.get("avatar_url", "")
        if current_url:
            file_name = "/".join(current_url.split("/")[4:])
            storage_client.delete(container=container, file_name=file_name)

        original_filename = file.filename
        new_filename = f"avatar/{str(copilot_app_id)}/{original_filename}"
        storage_client.upload(container=container, file_name=new_filename, data=file.file.read(), overwrite=True)
        avatar_url = storage_client.get_plain_url(container=container, file_name=new_filename)
        app_data = copilot_app.get(id=copilot_app_id, db=self.db)
        # app_data.config['avatar_url'] = avatar_url
        updateObj = CopilotAppUpdate(config={**app_data.config, "avatar_url": avatar_url})
        copilot_app.update(db=self.db, id=copilot_app_id, obj_in=updateObj)
        copilot_app_cache.pop(copilot_app_id, None)
        return avatar_url

    def update_copilot_app(self, copilot_app_id: int, obj_in: CopilotAppUpdate):
        app = copilot_app.update(db=self.db, id=copilot_app_id, obj_in=obj_in)
        copilot_app_cache.pop(copilot_app_id, None)
        return CopilotAppDBBase(
            name=app.name,
            desc=app.desc,
            config=app.config,
            id=app.id,
            orchestrator_id=app.orchestrator_id,
            orchestrator_config=app.orchestrator_config,
            is_test=app.is_test,
        )

    def check_tool_versions_compatibility(
        self,
        copilot_app_id: int,
        old_published_tool_id: int,
        new_published_tool_id: int,
        suppress_base_tool_check: bool = False,
    ) -> Tuple[bool, str]:
        copilot_app_data = copilot_app.get(db=self.db, id=copilot_app_id)
        old_published_tool = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping(
            db=self.db, id=old_published_tool_id
        )
        new_published_tool = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping(
            db=self.db, id=new_published_tool_id
        )
        app_orchestrator = copilot_app_data.orchestrator_id
        if not (suppress_base_tool_check):
            if old_published_tool[2].id != new_published_tool[2].id:
                return (
                    False,
                    "Shifting between different base tools is not allowed",
                )
        new_tool_orchestrators = self._get_orchestrator_ids_by_tool_version(new_published_tool[1].id)
        if not (app_orchestrator in new_tool_orchestrators):
            return (
                False,
                "Copilot App's orchestrator is not compatible with the new tool",
            )
        return (
            True,
            "",
        )

    async def complete_upgrade_published_tool_for_copilot_app(
        self,
        copilot_app_id: int,
        old_published_tool_id: int,
        new_published_tool_id: int,
        suppress_base_tool_check: bool = False,
    ):
        (valid, message) = self.check_tool_versions_compatibility(
            copilot_app_id=copilot_app_id,
            old_published_tool_id=old_published_tool_id,
            new_published_tool_id=new_published_tool_id,
            suppress_base_tool_check=suppress_base_tool_check,
        )
        if not valid:
            raise HTTPException(status_code=500, detail=message)
        new_published_tool = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping(
            db=self.db, id=new_published_tool_id
        )
        all_mapped_tools = copilot_app_published_tool_mapping.get_all(db=self.db, copilot_app_id=copilot_app_id)
        for mapped_tool in all_mapped_tools:
            if mapped_tool.tool_version_registry_mapping_id == old_published_tool_id:
                tool_datasources = copilot_app_datasource_published_tool_mapping.get_all_tool_datasource(
                    db=self.db, tool_id=mapped_tool.id
                )
                tool_context_datasources = copilot_context_datasource_app_tool_mapping.get_all_tool_context_datasource(
                    db=self.db, tool_id=mapped_tool.id
                )
                copilot_tool_obj = CopilotAppPublishedToolMappingCreatePayload(
                    tool_version_registry_mapping_id=mapped_tool.tool_version_registry_mapping_id,
                    name=f"{new_published_tool[2].name} - V{new_published_tool[0].version}",
                    desc=mapped_tool.desc,
                    config=mapped_tool.config,
                    input_params=new_published_tool[1].input_params,
                    selected_datasources=tool_datasources,
                    selected_context_datasources=tool_context_datasources,
                )
                await self.add_tool(copilot_app_id=copilot_app_id, copilot_tool_obj=copilot_tool_obj)
                self.delete_tool(app_tool_mapping_id=mapped_tool.id)

    def partial_upgrade_published_tool_for_copilot_app(
        self,
        copilot_app_id: int,
        old_published_tool_id: int,
        new_published_tool_id: int,
        suppress_base_tool_check: bool = False,
    ):
        (valid, message) = self.check_tool_versions_compatibility(
            copilot_app_id=copilot_app_id,
            old_published_tool_id=old_published_tool_id,
            new_published_tool_id=new_published_tool_id,
            suppress_base_tool_check=suppress_base_tool_check,
        )
        if not valid:
            raise HTTPException(status_code=500, detail=message)
        new_published_tool = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping(
            db=self.db, id=new_published_tool_id
        )
        all_mapped_tools = copilot_app_published_tool_mapping.get_all(db=self.db, copilot_app_id=copilot_app_id)
        for mapped_tool in all_mapped_tools:
            if mapped_tool.tool_version_registry_mapping_id == old_published_tool_id:
                obj_in = CopilotAppPublishedToolMappingUpdate(
                    tool_version_registry_mapping_id=new_published_tool[0].id,
                    name=f"{new_published_tool[2].name} - V{new_published_tool[0].version}",
                )
                copilot_app_published_tool_mapping.update(db=self.db, id=mapped_tool.id, obj_in=obj_in)
                copilot_app_tool_cache.pop(copilot_app_id, None)
        return True

    def upgrade_published_tool_for_copilot_app(self, payload: UpgradeCopilotAppPublishedToolPayload):
        app_ids = payload.apps or []
        if payload.upgrade_all_apps:
            apps = copilot_app.get_copilot_apps_by_published_tool(
                db=self.db, published_tool_id=payload.old_published_tool_id
            )
            for app in apps:
                app_ids.append(app.id)

        for app_id in app_ids:
            if payload.upgrade_type == UpgradeTypeEnum.complete:
                bg_task = BackgroundTasks()
                try:
                    bg_task.add_task(
                        self.complete_upgrade_published_tool_for_copilot_app,
                        self,
                        app_id,
                        payload.old_published_tool_id,
                        payload.new_published_tool_id,
                        payload.suppress_base_tool_check,
                    )
                except Exception as e:
                    logging.exception(e)
            else:
                self.partial_upgrade_published_tool_for_copilot_app(
                    copilot_app_id=app_id,
                    old_published_tool_id=payload.old_published_tool_id,
                    new_published_tool_id=payload.new_published_tool_id,
                    suppress_base_tool_check=payload.suppress_base_tool_check,
                )
        return True

    def soft_delete(self, copilot_app_id: int) -> int:
        obj = copilot_app.soft_delete(db=self.db, id=copilot_app_id)
        copilot_app_cache.pop(copilot_app_id, None)
        return obj.id

    async def get_video_stream_and_headers(
        self, url: str, start_time: int, range: str
    ) -> Tuple[StreamingResponse, dict]:
        default_chunk_size = 1024 * 1024
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        stream, start_byte, end_byte, video_size = storage_client.download(
            url, start_time=start_time, range=range, default_chunk_size=default_chunk_size
        )

        content_length = end_byte - start_byte + 1

        headers = {
            "Content-Range": f"bytes {start_byte}-{end_byte}/{video_size}",
            "Accept-Ranges": "bytes",
            "Content-Length": str(content_length),
            "Content-Type": "video/mp4",
        }
        return stream, headers

    async def query_audio(
        self,
        copilot_app_id: int,
        # user_info: dict,
        text_to_audio: str,
        restructure_text: str,
    ) -> AsyncGenerator:
        try:
            async for audio_chunk in self._get_audio_output(copilot_app_id, restructure_text, text_to_audio):
                yield audio_chunk
        except asyncio.CancelledError:
            logging.warning("Generator terminated")
        except Exception as e:
            logging.warning(e)

    async def _get_audio_output(
        self, copilot_app_id, restructure_text: str, output_text: str
    ) -> AsyncGenerator[bytes, None]:
        try:
            copilot_app = self._get_copilot_app(id=copilot_app_id)
            llm_id = copilot_app.config.text_to_speech_model
            if not llm_id:
                yield None
            else:
                llmConfig = self._get_llm_config(llm_id=llm_id)
                speech_client = AzureOpenAI(
                    azure_endpoint=llmConfig.config["api_base"],
                    api_key=llmConfig.config["openai_api_key"],
                    api_version=llmConfig.config["api_version"],
                )
                sentence_buffer = ""
                async for text_chunk in self._get_response_text(copilot_app_id, restructure_text, output_text):
                    if text_chunk is not None:
                        sentence_buffer += text_chunk
                        sentence_buffer = self._convert_bold_to_regular(sentence_buffer)
                        if sentence_buffer.strip().endswith((". ", "\n")):
                            async for chunk in self._speak_text(speech_client, sentence_buffer, llmConfig):
                                if chunk:
                                    yield chunk
                            sentence_buffer = ""
                if sentence_buffer:
                    async for chunk in self._speak_text(speech_client, sentence_buffer, llmConfig):
                        if chunk:
                            yield chunk
        except Exception as e:
            logging.error(f"Error trasmitting audio: {e}")

    def _convert_bold_to_regular(self, text):
        bold_upper_start = ord("A")
        bold_lower_start = ord("a")
        regular_upper_start = ord("A")
        regular_lower_start = ord("a")

        result = []
        for char in text:
            code_point = ord(char)
            if bold_upper_start <= code_point < bold_upper_start + 26:
                # Convert bold uppercase to regular uppercase
                result.append(chr(regular_upper_start + (code_point - bold_upper_start)))
            elif bold_lower_start <= code_point < bold_lower_start + 26:
                # Convert bold lowercase to regular lowercase
                result.append(chr(regular_lower_start + (code_point - bold_lower_start)))
            else:
                # Keep other characters unchanged
                result.append(char)

        return "".join(result)

    async def _speak_text(self, speech_client, text: str, llmConfig) -> AsyncGenerator[bytes, None]:
        try:
            with speech_client.audio.speech.with_streaming_response.create(
                model=llmConfig.config["deployment_name"], voice="alloy", input=text, response_format="mp3"
            ) as response:
                for chunk in response.iter_bytes(1024):
                    yield chunk
        except Exception as e:
            logging.error(f"Error generating speech: {e}")

    async def _get_response_text(self, copilot_app_id, question: str, output_text: str) -> AsyncGenerator[bytes, None]:
        try:
            copilot_app = self._get_copilot_app(id=copilot_app_id)
            llm_id = copilot_app.config.lang_model
            if not llm_id:
                yield output_text
            else:
                llmConfig = self._get_llm_config(llm_id=llm_id)
                client = AsyncAzureOpenAI(
                    azure_endpoint=llmConfig.config["api_base"],
                    api_key=llmConfig.config["openai_api_key"],
                    api_version=llmConfig.config["api_version"],
                )

                summary_prompt = """Provide a concise, 75-word maximum summary for spoken delivery to a business audience, focusing only on the main points of interest. Use formal, polished language that avoids technical jargon, casual expressions, or slang. The tone should be professional, respectful, and suitable for a summary lasting no more than 30 seconds.

                User question: {question}
                Key information: {response}
                """

                second_messages = [
                    {
                        "role": "system",
                        "content": """You are a formal business assistant providing clear, concise responses suitable for spoken delivery. Use a respectful, polished tone that avoids casual language, slang, and technical jargon. Respond with precision, focusing only on the key information the user needs, ensuring that the message is clear, helpful, and within a 75-word maximum for a 30-second spoken summary. Address the user’s question with patience and thoroughness, anticipating their needs in a professional and business-appropriate manner.""",
                    },
                ]

                second_messages.append(
                    {"role": "user", "content": summary_prompt.format(question=question, response=output_text)}
                )

                stream = await client.chat.completions.create(
                    model=llmConfig.config["deployment_name"], messages=second_messages, stream=True, max_tokens=256
                )

                async for message in stream:
                    if len(message.choices):
                        text_chunk = message.choices[0].delta.content
                        yield text_chunk
                    else:
                        yield output_text
        except Exception as e:
            logging.error(f"Error generating conversation Text: {e}")
