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

from app.schemas.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMappingBase,
)
from app.schemas.copilot_context_datasource_app_tool_mapping_schema import (
    CopilotContextDatasourceAppToolMappingBase,
)
from app.schemas.copilot_conversation_datasource import (
    CopilotConversationDatasourceMeta,
)
from app.schemas.copilot_conversation_schema import CopilotConversationBase
from pydantic import BaseModel


class LLMConfig(BaseModel):
    name: str = None
    type: str
    config: dict
    key: str = None
    id: int
    env: str


class LLMConfigList(BaseModel):
    __root__: List[LLMConfig]


class DataSourceConfig(BaseModel):
    name: str = None
    type: str
    config: dict


class ToolDatasourceConfig(CopilotAppDatasourcePublishedToolMappingBase):
    base_datasource: DataSourceConfig


class DataSourceConfigList(BaseModel):
    __root__: List[ToolDatasourceConfig]


class ToolInfo(BaseModel):
    copilot_tool_id: int
    name: str
    description: str
    config: dict
    input_params: dict
    preprocess_config: dict


class CopilotInfo(BaseModel):
    id: int
    description: str


class OrchestratorInfo(BaseModel):
    system_message: str = ""
    convo_memory_enabled: bool = False


class ContextDatasourceConfig(BaseModel):
    name: str = None
    config: dict
    context_name: str
    context_type: str
    context_source_type: str
    url: Optional[str]


class ToolContextDatasourceConfig(CopilotContextDatasourceAppToolMappingBase):
    base_context_datasource: ContextDatasourceConfig


class ContextDatasourceConfigList(BaseModel):
    __root__: List[ToolContextDatasourceConfig]


class QueryInfo(BaseModel):
    id: int
    text_input: str
    form_input: dict = None
    window_id: int
    tool_params: dict = {}
    query_trace_id: str
    convo_history: List[CopilotConversationBase] = []
    query_datasource: List[CopilotConversationDatasourceMeta] = []
    query_type: str = ""
    input_mode: str = ""
    extra_query_param: str = ""
    selected_conversations: list[int] = []


class CopilotEnvironment(BaseModel):
    base_url: str


class PreviousToolData(BaseModel):
    tool_info: ToolInfo
    llm_config: LLMConfigList
    data_sources: DataSourceConfigList
    context_datasources: ContextDatasourceConfigList


class ToolRequestValidate(BaseModel):
    tool_info: ToolInfo
    copilot_info: CopilotInfo
    llm_config: LLMConfigList = []
    data_sources: DataSourceConfigList = []
    copilot_env: CopilotEnvironment
    copilot_tool_auth_token: str
    previous_data: PreviousToolData = None
    context_datasources: ContextDatasourceConfigList = []


class ToolRequestRun(ToolRequestValidate):
    query_info: QueryInfo
    user_info: dict
