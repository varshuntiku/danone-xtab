#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import Any, List, Optional

from pydantic import BaseModel, root_validator


class MinervaApplicationBase(BaseModel):
    name: str
    description: Optional[str] = None


class MinervaApplicationCreate(MinervaApplicationBase):
    pass


class MinervaApplicationUpdate(MinervaApplicationBase):
    name: Optional[str] = None
    description: Optional[str] = None
    app_config: Optional[List] = None

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of name, description or app_config must have a value")
        return v


class MinervaApplicationDBBase(MinervaApplicationBase):
    id: int
    app_config: Optional[Any]
    status: str | None
    source_type: str | None

    class Config:
        orm_mode = True


class MinervaApplicationMetadata(MinervaApplicationBase):
    id: int
    status: str | None
    source_type: str | None


class MinervaApplicationExtended(MinervaApplicationBase):
    id: int
    app_config: Optional[Any]
    documents: Optional[List[dict]]
