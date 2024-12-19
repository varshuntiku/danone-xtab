from enum import Enum
from typing import Optional

from app.schemas.copilot_tool_version import CopilotTolVersionConfig
from pydantic import BaseModel


class CopilotToolVersionRegistryMappingInfo(BaseModel):
    access_url: Optional[str]


class CopilotToolVersionRegistryMappingBase(BaseModel):
    tool_version_id: int
    registry_id: int
    approved: bool
    deprecated: bool
    deployment_status: str
    info: CopilotToolVersionRegistryMappingInfo
    version: str
    deployment_agent_id: int


class CopilotToolVersionRegistryMappingCreate(CopilotToolVersionRegistryMappingBase):
    created_by: int
    pass


class CopilotToolVersionRegistryMappingUpdate(CopilotToolVersionRegistryMappingBase):
    approved: Optional[bool]
    deprecated: Optional[bool]
    deployment_status: Optional[str]
    info: Optional[CopilotToolVersionRegistryMappingInfo]


class CopilotToolVersionRegistryMappingMetaData(CopilotToolVersionRegistryMappingBase):
    id: int
    created_at: str


class ToolVersionPublishPayload(BaseModel):
    registry_id: Optional[int] = 1
    release_type: str = "minor"


class PublishedToolVersionsMetaData(CopilotToolVersionRegistryMappingBase):
    id: int
    created_at: str
    tool_name: str
    tool_id: int
    tool_version_config: CopilotTolVersionConfig
    input_params: dict
    orchestrators: list[int]
    verified: bool
    is_test: bool


class CopilotToolDeployStatusEnum(str, Enum):
    Failed = "Failed"
    Started = "Started"
    Completed = "Completed"
    Triggered = "Triggered"


class CopilotToolDeploymentAgentEnum(str, Enum):
    DEE = "dee"
    FISSION = "fission"


class CopilotToolVersionRegistryMappingUpdatePayload(BaseModel):
    approved: Optional[bool]
    deprecated: Optional[bool]


class ToolDeployStatusUpdatePayloadItem(BaseModel):
    id: int
    deployment_status: str
    info: Optional[CopilotToolVersionRegistryMappingInfo]


class ToolDeployStatusUpdatePayload(BaseModel):
    items: list[ToolDeployStatusUpdatePayloadItem]
