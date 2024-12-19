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
from typing import List, Optional

from pydantic import BaseModel, Extra


class LLMConfig(BaseModel):
    name: str = None
    type: str
    config: dict
    key: str = None


class LLMConfigList(BaseModel):
    __root__: List[LLMConfig]


class ToolInfo(BaseModel):
    copilot_tool_id: int
    description: str
    config: dict
    input_params: dict
    preprocess_config: dict


class CopilotInfo(BaseModel):
    id: int
    description: str


class CopilotEnvironment(BaseModel):
    base_url: str


class CopilotConversationDatasourceMeta(BaseModel):
    id: int
    name: str
    url: str
    conversation_id: int
    conversation_window_id: int


class QueryInfo(BaseModel):
    text_input: str
    form_input: dict = None
    window_id: int
    query_trace_id: int
    convo_history: List[dict] = []
    query_datasource: List[CopilotConversationDatasourceMeta] = []


class DataSourceConfig(BaseModel):
    name: str = None
    type: str
    config: dict
    key: str = None


class DataSourceConfigList(BaseModel):
    __root__: List[DataSourceConfig]


class ValidationResponse(BaseModel):
    validation_flag: bool
    message: str


class PreprocessStatusMessage(str, Enum):
    Failed = "Failed"
    Completed = "Completed"
    InProgress = "InProgress"


class PreprocessResponse(BaseModel):
    status: PreprocessStatusMessage
    message: str
    preprocess_config: dict = None


class EntityObject(BaseModel):
    key: str
    value: str


class ResponseObject(BaseModel):
    text: Optional[str] = ""
    processed_query: Optional[str] = ""
    hint: Optional[str] = ""
    entities: Optional[List[EntityObject]]
    widgets: Optional[List] = None

    class Config:
        allow_population_by_field_name = True
        extra = Extra.allow


class QueryRun(BaseModel):
    response: ResponseObject

    class Config:
        allow_population_by_field_name = True
        extra = Extra.allow
