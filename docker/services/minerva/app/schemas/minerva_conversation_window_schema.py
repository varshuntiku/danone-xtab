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


class MinervaConversationWindowBase(BaseModel):
    application_id: int
    user_id: str
    title: Optional[str]
    pinned: Optional[bool]


class MinervaConversationWindowCreate(MinervaConversationWindowBase):
    pass


class MinervaConversationWindowUpdate(MinervaConversationWindowBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("title must have a value")
        return v


class MinervaConversationWindowDBBase(MinervaConversationWindowBase):
    id: int


class MinervaConvoWindowUpdatePayload(BaseModel):
    title: Optional[str]
    pinned: Optional[bool]


class ConversationWindowMetadata(BaseModel):
    id: int
    title: str
    pinned: bool
    created_at: str
