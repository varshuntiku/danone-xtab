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

from pydantic import BaseModel, validator


class CopilotConversationBase(BaseModel):
    application_id: int
    user_id: str
    user_query: Optional[str]
    copilot_response: Optional[dict]
    feedback: Optional[int]
    conversation_window_id: Optional[int]
    pinned: Optional[bool]
    comment: Optional[dict]
    interrupted: Optional[bool]
    request_type: Optional[str]
    input_mode: Optional[str]
    extra_query_param: Optional[str]
    request_payload: Optional[dict] = None
    extra_info: Optional[dict] = None
    error: Optional[str] = None


class CopilotConversationCreate(CopilotConversationBase):
    pass


class CopilotConversationUpdate(BaseModel):
    user_query: Optional[str]
    copilot_response: Optional[dict]
    feedback: Optional[int]
    pinned: Optional[bool]
    comment: Optional[dict]
    interrupted: Optional[bool]
    extra_info: Optional[dict]
    request_type: Optional[str]
    request_payload: Optional[dict] = None
    error: Optional[str] = None

    @validator("error", pre=True)
    def transform_error(cls, value: str | bool):
        if value is True:
            return str(value)
        elif value is False or value is None:
            return None
        elif isinstance(value, str):
            return value


class CopilotConversationUpdatePayload(BaseModel):
    feedback: Optional[int]
    pinned: Optional[bool]
    comment: Optional[dict]
    output: Optional[dict]


class CopilotConversationUpdateResponse(BaseModel):
    id: int
    feedback: Optional[int]
    pinned: Optional[bool]
    comment: Optional[dict]
    output: Optional[dict]


class CopilotConversationDBBase(CopilotConversationBase):
    id: int

    class Config:
        orm_mode = True
