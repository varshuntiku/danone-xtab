#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from enum import Enum

from pydantic import BaseModel, root_validator


class MinervaJobStatusBase(BaseModel):
    application_id: int
    run_id: str
    status: str
    name: str
    type: str


class MinervaJobStatusCreate(MinervaJobStatusBase):
    pass


class MinervaJobStatusUpdate(MinervaJobStatusBase):
    application_id: int | None
    name: str | None
    type: str | None

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("application_id, run_id and status must have a value")
        return v


class MinervaJobStatusDBBase(MinervaJobStatusBase):
    id: int

    class Config:
        orm_mode = True


class MinervaJobStatusMetadata(MinervaJobStatusBase):
    id: int


class MinervaJobStatusEnum(str, Enum):
    on_failure = "Failed"
    on_start = "Started"
    on_success = "Completed"
    on_triggered = "Triggered"
