#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.schemas.copilot_app_published_tool_mapping import (
    CopilotAppPublishedToolMappingMetaData,
)
from app.schemas.copilot_app_schema import CopilotAppMetaExtended
from app.schemas.copilot_datasource_schema import CopilotDatasourceMetadata
from pydantic import BaseModel


class CopilotAppDeploymentBase(BaseModel):
    created_by: int
    copilot_app_id: int
    config: dict


class CopilotAppDeploymentCreate(CopilotAppDeploymentBase):
    pass


class CopilotAppMappingSerialized(BaseModel):
    copilot_app_meta: CopilotAppMetaExtended
    data_sources: list[CopilotDatasourceMetadata]
    tools: list[CopilotAppPublishedToolMappingMetaData]


class CopilotAppDeploymentConfig(BaseModel):
    data: CopilotAppMappingSerialized
