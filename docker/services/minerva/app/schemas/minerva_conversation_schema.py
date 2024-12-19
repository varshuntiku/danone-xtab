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


class MinervaConversationBase(BaseModel):
    application_id: int
    user_id: str
    user_query: Optional[str]
    minerva_response: Optional[dict]
    feedback: Optional[int]
    conversation_window_id: Optional[int]


class MinervaConversationCreate(MinervaConversationBase):
    pass


class MinervaConversationUpdate(MinervaConversationBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of user query, response or feedback must have a value")
        return v


class MinervaConversationDBBase(MinervaConversationBase):
    id: int

    class Config:
        orm_mode = True
