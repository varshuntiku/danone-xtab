#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class QueryResponseOutput(BaseModel):
    type: Optional[str]
    response: dict


class QueryResponse(BaseModel):
    id: int
    input: str
    output: QueryResponseOutput | Dict[str, Any]
    window_id: int
    feedback: Optional[int]
    pinned: Optional[bool]
    comment: Optional[dict]
    interrupted: Optional[bool]
    datasource: Optional[list] = []
    request_type: Optional[str]
    request_payload: Optional[dict] = None
    error: Optional[str] = None


class ConversationResponse(BaseModel):
    list: List[QueryResponse]
    next_offset: int
    total_count: int

    class Config:
        arbitrary_types_allowed = True
