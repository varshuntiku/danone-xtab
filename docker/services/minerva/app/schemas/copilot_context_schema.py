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

# TODO: Add dataclass for case like file storage source_type


class CopilotContextBase(BaseModel):
    name: str
    type: str
    copilot_app_id: int
    source_type: str


class CopilotContextCreate(CopilotContextBase):
    created_by: Optional[int] = None


class CopilotContextUpdate(CopilotContextBase):
    name: Optional[str] = None
    type: Optional[str] = None
    copilot_app_id: Optional[int] = None
    source_type: Optional[str] = None

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of name, type, copilot_app_id and source_type must have a value")
        return v


class CopilotContextDBBase(CopilotContextBase):
    id: int
    source_type: str

    class Config:
        orm_mode = True


class CopilotContextMetadata(CopilotContextBase):
    id: int
    name: str | None
    type: str | None
    source_type: str | None
    copilot_app_id: int | None
