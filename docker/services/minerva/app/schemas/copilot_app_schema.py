#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import Optional

from pydantic import BaseModel


class CopilotAppConfig(BaseModel):
    industry: Optional[str]
    org_name: Optional[str]
    identity: Optional[str]
    persona: Optional[str]
    lang_model: Optional[int]
    capabilities: Optional[bool]
    avatar_url: Optional[str]
    empty_state_message_desc: Optional[str]
    suggested_queries: Optional[list[str]]
    text_to_speech_model: Optional[int]


class CopilotAppOrchestratorConfig(BaseModel):
    lang_model: Optional[int]
    system_message: Optional[str]
    convo_memory_enabled: Optional[bool] = False


class CopilotAppBase(BaseModel):
    name: str
    desc: str
    config: CopilotAppConfig
    orchestrator_id: int
    orchestrator_config: CopilotAppOrchestratorConfig
    is_test: Optional[bool] = False


class CopilotAppCreatePayload(CopilotAppBase):
    desc: Optional[str]
    config: Optional[CopilotAppConfig]
    orchestrator_id: Optional[int]
    orchestrator_config: Optional[CopilotAppOrchestratorConfig]


class CopilotAppCreate(CopilotAppBase):
    created_by: Optional[int] = None
    desc: Optional[str] = None
    config: Optional[CopilotAppConfig] = None
    orchestrator_id: Optional[int] = None
    orchestrator_config: Optional[CopilotAppOrchestratorConfig] = None


class CopilotAppUpdate(CopilotAppBase):
    name: Optional[str] = None
    desc: Optional[str] = None
    config: Optional[CopilotAppConfig] = None
    orchestrator_id: Optional[int] = None
    orchestrator_config: Optional[CopilotAppOrchestratorConfig] = None

    # @root_validator
    # def any_of(cls, v):
    #     if not any(v.values()):
    #         raise ValueError("one of industry, organization, description, personas or copilot_config must have a value")
    #     return v


class CopilotAppDBBase(CopilotAppBase):
    id: int
    config: Optional[CopilotAppConfig]
    orchestrator_id: Optional[int]
    orchestrator_config: Optional[CopilotAppOrchestratorConfig]

    class Config:
        orm_mode = True


class CopilotAppMeta(BaseModel):
    id: int
    name: Optional[str]
    desc: Optional[str]


class CopilotAppMetaExtended(CopilotAppBase):
    id: int
    name: Optional[str]
    desc: Optional[str]
    config: Optional[CopilotAppConfig]
    orchestrator_id: Optional[int]
    orchestrator_config: Optional[CopilotAppOrchestratorConfig]
