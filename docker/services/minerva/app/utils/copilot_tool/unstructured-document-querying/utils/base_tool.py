from abc import ABC, abstractmethod

from utils.schema import (
    CopilotEnvironment,
    CopilotInfo,
    DataSourceConfigList,
    LLMConfigList,
    PreprocessResponse,
    QueryInfo,
    QueryRun,
    ToolInfo,
    ValidationResponse,
)


class BaseTool(ABC):
    def __init__(
        self,
        tool_info: ToolInfo,
        copilot_info: CopilotInfo,
        llm_config: LLMConfigList = [],
        # query_info: QueryInfo = None,
        # user_info: dict = None,
        data_sources: DataSourceConfigList = [],
        copilot_env: CopilotEnvironment = None,
        copilot_tool_auth_token: str = "",
    ):
        self.llm_config = llm_config
        self.tool_info = tool_info
        self.copilot_info = copilot_info
        # self.query_info = query_info
        # self.user_info = user_info
        self.data_sources = data_sources
        self.copilot_env = copilot_env
        self.copilot_tool_auth_token = copilot_tool_auth_token

    @abstractmethod
    def run(self, query, convo_history, user_info, **kwargs) -> QueryRun:
        pass

    @abstractmethod
    def validate_tool_config(self) -> ValidationResponse:
        pass

    @abstractmethod
    def tool_preprocess(self, **kwargs) -> PreprocessResponse:
        pass

    def publish_query_status(self, query_id, status, message):
        """
        Publishes the query status to the UI with the given message
        """
        pass

    def uploaded_file(self, file_name):
        """
        Returns the specified file from the uploaded files in binary format
        """
        pass

    def parse_convo_history(self, query_info: QueryInfo = None):
        convo_history = [
            "User Question - " + convo.user_query + "\nSystem Response - " + convo.minerva_response["response"]["text"]
            for convo in query_info.convo_history
        ]
        convo_history = "\n".join(convo_history)
        return convo_history
