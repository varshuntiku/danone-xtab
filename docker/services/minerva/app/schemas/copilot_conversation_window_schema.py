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


class CopilotConversationWindowBase(BaseModel):
    application_id: int
    user_id: str
    title: Optional[str]
    pinned: Optional[bool]


class CopilotConversationWindowCreate(CopilotConversationWindowBase):
    pass


class CopilotConversationWindowUpdate(CopilotConversationWindowBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("title must have a value")
        return v


class CopilotConversationWindowDBBase(CopilotConversationWindowBase):
    id: int


class CopilotConversationWindowUpdatePayload(BaseModel):
    title: Optional[str]
    pinned: Optional[bool]


class ConversationWindowMetadata(BaseModel):
    id: int
    title: str
    pinned: bool
    created_at: str
