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

from pydantic import BaseModel, root_validator


class CopilotContextDatasourceBase(BaseModel):
    context_id: int
    name: Optional[str] = None
    config: Optional[dict]


class CopilotContextDatasourceCreate(CopilotContextDatasourceBase):
    pass


class CopilotContextDatasourceUpdate(CopilotContextDatasourceBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of context_id or name must have a value")
        return v


class CopilotContextDatasourceDBBase(CopilotContextDatasourceBase):
    id: int

    class Config:
        orm_mode = True


class CopilotContextDatasourceMetadata(CopilotContextDatasourceBase):
    id: int


class CopilotContextDatasourceExtended(CopilotContextDatasourceBase):
    id: int
    context_name: str
    context_type: str
    context_source_type: str
    url: Optional[str]
