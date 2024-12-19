from typing import Optional

from app.utils.git_operations.schema import GitFileContentList
from pydantic import BaseModel


class CopilotTolVersionConfig(BaseModel):
    tags: Optional[list[str]]
    suggested_lang_model: Optional[int]
    suggested_embedding_model: Optional[int]
    default_description: Optional[str]
    default_additional_config: Optional[dict]
    configurator_type: Optional[str]
    enable_context: Optional[bool]


class CopilotToolVersionBase(BaseModel):
    tool_id: int
    commit_id: str
    desc: str
    input_params: dict
    config: CopilotTolVersionConfig
    verified: bool
    is_test: bool
    base_version_id: int


class CopilotToolVersionCreate(CopilotToolVersionBase):
    created_by: int
    commit_id: Optional[str]
    input_params: Optional[dict]
    config: Optional[CopilotTolVersionConfig]
    is_test: Optional[bool]


class CopilotToolVersionUpdate(BaseModel):
    desc: Optional[str]
    input_params: Optional[dict]
    config: Optional[CopilotTolVersionConfig]
    is_test: Optional[bool]


class CopilotToolVersionUpdatePayload(CopilotToolVersionUpdate):
    orchestrators: Optional[list[int]] = [1]


class CopilotToolVersionMetaData(CopilotToolVersionBase):
    id: int
    commit_id: Optional[str]
    orchestrators: list[int]
    input_params: Optional[dict]
    config: Optional[CopilotTolVersionConfig]


class CopilotToolVersionDetail(CopilotToolVersionBase):
    id: int
    files: GitFileContentList
    orchestrators: list[int]
    commit_id: Optional[str]
    input_params: Optional[dict]
    config: Optional[CopilotTolVersionConfig]


class CopilotToolVersionCreatePayload(BaseModel):
    files: list[dict]
    desc: Optional[str]
    input_params: Optional[dict]
    config: Optional[CopilotTolVersionConfig]
    orchestrators: Optional[list[int]] = [1]
    is_test: Optional[bool]


class CopilotToolVersionVerifyPayload(BaseModel):
    tool_version_list: list[int]


class CopilotToolVersionVerifyMetaData(BaseModel):
    verified: bool
    tool_version_list: list[int]


# schema as per the skillset requirement
class CopilotRemovableToolVersionMetaData(BaseModel):
    id: int
    name: str | None
    created_at: str
    deprecated: bool
    email_address: str
    copilot_app_id: int | None
    linked_at: str | None


# schema as per the skillset requirement
class CopilotUnusedPublishedToolsMetaData(BaseModel):
    publish_id: int
    version_id: int
    tool_id: int
    name: str
    registry_id: int
    created_at: str
    deprecated: bool
    email_address: str
