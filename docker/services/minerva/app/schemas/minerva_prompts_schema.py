#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import List

from pydantic import BaseModel


class MinervaPromptsDBBase(BaseModel):
    id: int
    model_id: int
    tool_type: str
    prompt: List[str]

    class Config:
        orm_mode = True
