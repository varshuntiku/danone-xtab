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


class MinervaModelBase(BaseModel):
    name: str
    host: str
    type: str
    config: dict = {}
    features: dict = {}


class MinervaModelCreate(MinervaModelBase):
    pass


class MinervaModelMetadata(MinervaModelBase):
    id: int


class MinervaModelUpdate(MinervaModelBase):
    name: Optional[str] = None
    host: Optional[str] = None
    type: Optional[str] = None
    config: Optional[dict] = {}
    features: Optional[dict] = {}


class MinervaModelsDBBase(BaseModel):
    id: int
    name: str
    host: str
    type: str
    config: dict = {}
    features: dict = {}

    class Config:
        orm_mode = True
