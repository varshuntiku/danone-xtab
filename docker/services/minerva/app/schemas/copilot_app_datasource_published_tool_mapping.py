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


class CopilotAppDatasourcePublishedToolMappingBase(BaseModel):
    datasource_id: int
    app_published_tool_id: int
    config: Optional[dict] = {}
    key: Optional[str]


class CopilotAppDatasourcePublishedToolMappingCreate(CopilotAppDatasourcePublishedToolMappingBase):
    pass


class CopilotAppDatasourcePublishedToolMappingCreatePayload(BaseModel):
    datasource_id: int
    config: Optional[dict] = {}
    key: Optional[str]


class CopilotAppDatasourcePublishedToolMappingUpdate(CopilotAppDatasourcePublishedToolMappingBase):
    pass


class CopilotAppDatasourcePublishedToolMappingUpdatePayload(CopilotAppDatasourcePublishedToolMappingCreatePayload):
    pass


class CopilotAppDatasourcePublishedToolMappingExtended(BaseModel):
    datasource_id: int
    app_published_tool_id: Optional[int]
    config: Optional[dict]
    key: Optional[str]
