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


class CopilotConversationDatasource(BaseModel):
    conversation_id: int
    name: str
    meta: Optional[dict]
    type: Optional[str]


class CopilotConversationDatasourceMeta(BaseModel):
    id: int
    name: str
    url: str
    conversation_id: int
    conversation_window_id: int
