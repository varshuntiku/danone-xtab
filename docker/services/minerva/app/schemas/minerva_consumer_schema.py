#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import List, Optional

from pydantic import BaseModel


class MinervaConsumerBase(BaseModel):
    name: str
    desc: str
    allowed_origins: List[str]
    features: dict
    auth_agents: List[dict]


class MinervaConsumerCreate(MinervaConsumerBase):
    copilot_apps: List[int]


class MinervaConsumerUpdate(MinervaConsumerBase):
    name: Optional[str]
    desc: Optional[str]
    allowed_origins: Optional[List[str]]
    features: Optional[dict]
    auth_agents: Optional[List[dict]]
    copilot_apps: List[int]


class MinervaConsumerDBBase(MinervaConsumerBase):
    access_key: str
    id: int
    copilot_apps: Optional[List[int]]
    minerva_apps: Optional[List[int]]


class MinervaConsumerMetadata(BaseModel):
    id: int
    name: str
    desc: str
    access_key: str
