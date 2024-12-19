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


class CopilotContextDatasourceAppToolMappingBase(BaseModel):
    context_datasource_id: int
    app_tool_id: int
    config: Optional[dict] = {}


class CopilotContextDatasourceAppToolMappingCreate(CopilotContextDatasourceAppToolMappingBase):
    pass


class CopilotContextDatasourceAppToolMappingCreatePayload(BaseModel):
    context_datasource_id: int
    config: Optional[dict] = {}


class CopilotContextDatasourceAppToolMappingUpdate(CopilotContextDatasourceAppToolMappingBase):
    pass


class CopilotContextDatasourceAppToolMappingUpdatePayload(CopilotContextDatasourceAppToolMappingCreatePayload):
    pass


class CopilotContextDatasourceAppToolMappingExtended(BaseModel):
    context_datasource_id: int
    app_tool_id: Optional[int]
    config: Optional[dict]
