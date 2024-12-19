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


class MinervaDocumentBase(BaseModel):
    application_id: int
    name: str
    meta: Optional[dict]


class MinervaDocumentCreate(MinervaDocumentBase):
    pass


class MinervaDocumentUpdate(MinervaDocumentBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of user application_id or name must have a value")
        return v


class MinervaDocumentDBBase(MinervaDocumentBase):
    id: int

    class Config:
        orm_mode = True


class MinervaDocumentMetadata(MinervaDocumentBase):
    id: int
