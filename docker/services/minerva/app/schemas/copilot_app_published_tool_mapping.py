#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from enum import Enum
from typing import Optional

from app.schemas.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMappingBase,
    CopilotAppDatasourcePublishedToolMappingCreatePayload,
    CopilotAppDatasourcePublishedToolMappingUpdatePayload,
)
from app.schemas.copilot_context_datasource_app_tool_mapping_schema import (
    CopilotContextDatasourceAppToolMappingBase,
    CopilotContextDatasourceAppToolMappingCreatePayload,
    CopilotContextDatasourceAppToolMappingUpdatePayload,
)
from app.schemas.copilot_tool_version import CopilotTolVersionConfig
from pydantic import BaseModel


class CopilotAppPublishedToolMappingBase(BaseModel):
    copilot_app_id: int
    tool_version_registry_mapping_id: int
    name: str
    desc: Optional[str]
    status: Optional[str]
    config: Optional[dict]
    preprocess_config: Optional[dict]
    input_params: Optional[dict]


class CopilotAppPublishedToolMappingCreate(CopilotAppPublishedToolMappingBase):
    pass


class CopilotAppPublishedToolMappingUpdate(CopilotAppPublishedToolMappingBase):
    copilot_app_id: Optional[int]
    tool_version_registry_mapping_id: Optional[int]
    name: Optional[str]


class CopilotAppPublishedToolMappingMetaData(CopilotAppPublishedToolMappingBase):
    id: int
    selected_datasources: Optional[list[CopilotAppDatasourcePublishedToolMappingBase]]
    selected_context_datasources: Optional[list[CopilotContextDatasourceAppToolMappingBase]]


class CopilotAppPublishedToolMappingMetaDataExtended(CopilotAppPublishedToolMappingBase):
    id: int
    tool_version_config: CopilotTolVersionConfig
    selected_datasources: Optional[list[CopilotAppDatasourcePublishedToolMappingBase]]
    orchestrators: list[int]
    tool_version_deprecated: Optional[bool]
    tool_id: Optional[int]
    tool_version_id: Optional[int]
    is_test: Optional[bool]
    registry_id: Optional[int]
    selected_context_datasources: Optional[list[CopilotContextDatasourceAppToolMappingBase]]


class CopilotAppDeployedToolMappingStatusEnum(str, Enum):
    Failed = "Failed"
    Started = "Started"
    Completed = "Completed"
    Triggered = "Triggered"


class CopilotAppPublishedToolMappingCreatePayload(BaseModel):
    tool_version_registry_mapping_id: int
    name: str
    desc: Optional[str]
    config: Optional[dict]
    input_params: Optional[dict]
    selected_datasources: Optional[list[CopilotAppDatasourcePublishedToolMappingCreatePayload]]
    selected_context_datasources: Optional[list[CopilotContextDatasourceAppToolMappingCreatePayload]]


class CopilotAppPublishedToolMappingUpdatePayload(BaseModel):
    name: Optional[str]
    desc: Optional[str]
    config: Optional[dict]
    input_params: Optional[dict]
    selected_datasources: Optional[list[CopilotAppDatasourcePublishedToolMappingUpdatePayload]]
    selected_context_datasources: Optional[list[CopilotContextDatasourceAppToolMappingUpdatePayload]]


class CopilotAppPublishedToolMappingUpdateStatusPayload(BaseModel):
    status: CopilotAppDeployedToolMappingStatusEnum


class UpgradeTypeEnum(str, Enum):
    complete = "complete"
    partial = "partial"


class UpgradeCopilotAppPublishedToolPayload(BaseModel):
    old_published_tool_id: int
    new_published_tool_id: int
    upgrade_all_apps: bool
    apps: list[int]
    upgrade_type: UpgradeTypeEnum = UpgradeTypeEnum.partial
    suppress_base_tool_check: bool
