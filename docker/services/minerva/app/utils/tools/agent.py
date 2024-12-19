#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.utils.config import get_settings
from app.utils.tools.base_agent import BaseAgent
from app.utils.tools.copilot_tool import COPILOT
from app.utils.tools.document_query import DocumentQuery
from app.utils.tools.out_of_context import OutContext
from app.utils.tools.promotion_simulator_tool import PromoSimulator
from app.utils.tools.query_index_file import QueryIndexFile

# import tools
from app.utils.tools.text_to_sql_index_tool import TextToSQLWithContext
from app.utils.tools.text_to_sql_tool import TextToSQL
from langchain_community.embeddings import HuggingFaceEmbeddings

# other imports
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

settings = get_settings()


class Agent:
    def __init__(self, config, history, db, query_trace_id=None, window_id=None, user_info=None):
        self.config = config
        self.history = history
        self.db = db
        self.query_trace_id = query_trace_id
        self.window_id = window_id
        self.user_info = user_info
        self.tools = []
        self.__generate_agent()

    def __generate_llm(self, tool_config):
        llm_config = tool_config["llm_model"]
        # Azure Openai LLM
        if llm_config.host == "azure-openai":
            llm = AzureChatOpenAI(
                openai_api_key=llm_config.config["openai_api_key"],
                azure_endpoint=llm_config.config["api_base"],
                azure_deployment=llm_config.config["deployment_name"],
                model_name=llm_config.config["model_name"],
                openai_api_version=llm_config.config["api_version"],
                temperature=llm_config.config["temperature"],
            )
            return llm

    def __generate_embedding(self, tool_config):
        embedding_config = tool_config["embedding_model"]
        # Azure Openai Embedding
        if embedding_config.config["model_name"] == "text-embedding-ada-002":
            embeddings = AzureOpenAIEmbeddings(
                openai_api_key=embedding_config.config["openai_api_key"],
                azure_endpoint=embedding_config.config["api_base"],
                openai_api_type="azure",
                azure_deployment=embedding_config.config["deployment_name"],
                model=embedding_config.config["model_name"],
                chunk_size=1,
            )
        elif embedding_config.host == "optimus_contract":
            embeddings = HuggingFaceEmbeddings(model_name=embedding_config.config["model_name"])
        return embeddings

    def __generate_agent(self):
        agent_tools = []
        for tool_config in self.config.app_config:
            llm = self.__generate_llm(tool_config=tool_config)
            if tool_config["embedding_model"] is not None:
                embeddings = self.__generate_embedding(tool_config=tool_config)
            match tool_config["type"]:
                case "sql" | "csv_file":
                    agent_class = TextToSQL(
                        tool_config=tool_config,
                        llm=llm,
                        name=tool_config.get("name", "TextToSQL"),
                        db=self.db,
                        minerva_application_id=str(self.config.id),
                        description=tool_config["description"],
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                    )
                    agent_tools.append(agent_class)

                case "copilot":
                    agent_class = COPILOT(
                        tool_config=tool_config,
                        llm=llm,
                        name=tool_config.get("name", "COPILOT"),
                        db=self.db,
                        minerva_application_id=str(self.config.id),
                        description=tool_config["description"],
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                    )
                    agent_tools.append(agent_class)

                case "index_file":
                    agent_class = QueryIndexFile(
                        tool_config=tool_config,
                        llm=llm,
                        embedding=embeddings,
                        name=tool_config.get("name", "QueryIndexFile"),
                        description=tool_config["description"],
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                    )
                    agent_tools.append(agent_class)

                case "document_query":
                    agent_class = DocumentQuery(
                        tool_config=tool_config,
                        llm=llm,
                        embedding=embeddings,
                        minerva_app_id=self.config.id,
                        name=tool_config.get("name", "DocumentQuery"),
                        description=tool_config["description"],
                        db=self.db,
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                    )
                    agent_tools.append(agent_class)

                case "sql_with_context":
                    agent_class = TextToSQLWithContext(
                        tool_config=tool_config,
                        llm=llm,
                        name=tool_config.get("name", "TextToSQLWithContext"),
                        description="This tool is used to convert user's query in natural language to SQL query. \
                                                The tool returns a SQL query which is rendered as a plot on the UI."
                        + tool_config["description"],
                        history=self.history,
                        return_direct=True,
                    )
                    agent_tools.append(agent_class)

                case "promotion_simulator":
                    agent_class = PromoSimulator(
                        tool_config=tool_config,
                        llm=llm,
                        name=tool_config.get("name", "PromoSimulator"),
                        db=self.db,
                        minerva_application_id=str(self.config.id),
                        description=tool_config["description"],
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                    )
                    agent_tools.append(agent_class)

                # this should always be defined the last
                case "out_of_context":
                    agent_class = OutContext(
                        tool_config=tool_config,
                        llm=llm,
                        name=tool_config.get("name", "OutContext"),
                        db=self.db,
                        minerva_application_id=str(self.config.id),
                        description=tool_config["description"],
                        history=self.history,
                        return_direct=True,
                        query_trace_id=self.query_trace_id,
                        window_id=self.window_id,
                        user_info=self.user_info,
                        tools=agent_tools,
                    )
                    agent_tools.append(agent_class)

        self.agent = BaseAgent(tools=agent_tools, llm=agent_tools[0].llm)

    def generate_response(self, user_input_text, user_input_form=None):
        response = self.agent.execute_query(
            user_input_text=user_input_text,
            user_input_form=user_input_form,
            convo_history=self.history,
        )
        return response
