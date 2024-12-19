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

from app.schemas.minerva_application_schema import MinervaApplicationMetadata
from app.schemas.minerva_models_schema import MinervaModelsDBBase
from pydantic import BaseModel


class MinervaAppsResponse(BaseModel):
    minerva_apps: List[MinervaApplicationMetadata]


class ValidConnectionStringResponse(BaseModel):
    valid_connection_string: bool
    schema_required: bool


class TableConfig(BaseModel):
    name: str
    alias: str
    enabled: bool


class ConnectionStringTableListResponse(BaseModel):
    table_config: List[TableConfig]


class StorageFileListResponse(BaseModel):
    file_list: List[str]


class MinervaModelsResponse(BaseModel):
    minerva_models: List[MinervaModelsDBBase]
