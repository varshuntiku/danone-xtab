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


class CopilotDatasourceDocumentBase(BaseModel):
    datasource_id: int
    name: str
    meta: Optional[dict]


class CopilotDatasourceDocumentCreate(CopilotDatasourceDocumentBase):
    pass


class CopilotDatasourceDocumentUpdate(CopilotDatasourceDocumentBase):
    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of datasource_id or name must have a value")
        return v


class CopilotDatasourceDocumentDBBase(CopilotDatasourceDocumentBase):
    id: int

    class Config:
        orm_mode = True


class CopilotDatasourceDocumentMetadata(CopilotDatasourceDocumentBase):
    id: int
