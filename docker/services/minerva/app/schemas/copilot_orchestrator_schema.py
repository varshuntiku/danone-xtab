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


class CopilotOrchestratorConfig(BaseModel):
    input_params_enabled: Optional[bool]
    system_message: Optional[str]
    suggested_lang_model: Optional[int]


class CopilotOrchestratorBase(BaseModel):
    name: str
    identifier: str
    desc: str
    config: CopilotOrchestratorConfig
    disabled: bool


class CopilotOrchestratorCreate(CopilotOrchestratorBase):
    pass


class CopilotOrchestratorCreatePayload(CopilotOrchestratorBase):
    name: str
    identifier: str
    desc: Optional[str]
    config: Optional[CopilotOrchestratorConfig]
    disabled: Optional[bool]


class CopilotOrchestratorMetadata(CopilotOrchestratorBase):
    id: int
    config: Optional[CopilotOrchestratorConfig]


class CopilotOrchestratorUpdate(CopilotOrchestratorBase):
    name: Optional[str]
    identifier: Optional[str]
    desc: Optional[str]
    config: Optional[CopilotOrchestratorConfig]
    disabled: Optional[bool]


class CopilotOrchestratorDBBase(BaseModel):
    id: int
    name: str
    identifier: str
    desc: str
    config: CopilotOrchestratorConfig
    disabled: bool

    class Config:
        orm_mode = True
