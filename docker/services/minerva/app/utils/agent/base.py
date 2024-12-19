#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#
import logging
from datetime import datetime, timedelta

import requests
from app.schemas.copilot_tool_request import (
    CopilotEnvironment,
    CopilotInfo,
    DataSourceConfigList,
    LLMConfigList,
    ToolInfo,
    ToolRequestRun,
    ToolRequestValidate,
)
from app.utils.auth.token import encode_payload
from app.utils.config import get_settings
from app.utils.tools.tool_utils import summarize_question_context
from langchain.chat_models.azure_openai import AzureChatOpenAI

settings = get_settings()


def get_copilot_tool_auth_token(copilot_tool_id: int):
    token_payload = {
        "exp": datetime.utcnow() + timedelta(days=5),
        "iat": datetime.utcnow(),
        "sub": "job_status_update",
        "iss": "minerva_server",
        "aud": "copilot_tool_task",
        "copilot_tool_id": copilot_tool_id,
    }
    token = encode_payload(token_payload)
    return token


class Agent:
    def __init__(self, copilot_info, tools, agent_llm, query_info, user_info):
        self.copilot_info = copilot_info
        self.tools = tools
        self.llm = agent_llm
        # Set up tool selector template
        self.__tool_selector_template: str = """
You are an expert data analyst. Based on the user question, you should always think about what to do, the action to take. It should be one of the following tools, their names are - {tool_names}.
Use the following information to decide the tool -
{tools}.

Return only the tool name as the output in the format <Tool_Name>

Question: {input}
Output:
"""

    def __create_agent(self, query):
        self.__tool_selector_prompt = self.__tool_selector_template.format(
            tool_names=",".join(["<" + str(tool.tool_info.copilot_tool_id) + ">" for tool in self.tools]),
            tools="\n".join(
                ["<" + str(tool.tool_info.copilot_tool_id) + "> = " + tool.tool_info.description for tool in self.tools]
            ),
            input=query,
        )

    async def __emit_message(self, msg: str, query_info, user_info, progress_icon):
        pass
        # await emit_query_processing_step(
        #     room=user_info["email"],
        #     data={"progress_message": msg, "query_trace_id": query_info.query_trace_id, "progress_icon": progress_icon},
        # )

    async def execute_query(self, query_info, user_info):
        await self.__emit_message("Picking up skillset for you", query_info, user_info, "search")
        # check for user input form value - call tool directly based on user input form
        if query_info.form_input is not None and query_info.form_input != {}:
            input_tool = query_info.form_input["button"]["tool"]
            tool = next(
                (tool_item for tool_item in self.tools if tool_item.name == input_tool),
                None,
            )
            tool.user_input_form = query_info.form_input
            await self.__emit_message("A skillset has started processing your query.", query_info, user_info, "search")
            return tool.run()
        else:
            # call the tool based on user query
            if len(self.tools) > 1:
                llm_obj = LLMInterface(self.llm)
                updated_query = summarize_question_context(
                    convo_history=query_info.convo_history,
                    user_query=query_info.text_input,
                    llm=llm_obj.llm,
                )
                self.__create_agent(query=updated_query)
                tool_selector_response = str(llm_obj.llm.predict(self.__tool_selector_prompt))
                tool = next(
                    (
                        tool_item
                        for tool_item in self.tools
                        if str(tool_item.tool_info.copilot_tool_id) in tool_selector_response
                    ),
                    None,
                )
                await self.__emit_message(
                    "A skillset has started processing your query.", query_info, user_info, "search"
                )
                return tool.run()
            else:
                await self.__emit_message(
                    "A skillset has started processing your query.", query_info, user_info, "search"
                )
                response = self.tools[0].run()
                return response


class Tool:
    def __init__(
        self,
        tool_info: ToolInfo,
        copilot_info: CopilotInfo,
        deployment_url: str,
        llm_config: LLMConfigList = [],
        data_sources: DataSourceConfigList = [],
    ):
        self.tool_info = tool_info
        self.copilot_info = copilot_info
        self.llm_config = llm_config
        self.data_sources = data_sources
        self.deployment_url = deployment_url
        self.copilot_env = CopilotEnvironment(base_url=settings.MINERVA_HOST_URL)

    def run(self, query_info, user_info):
        try:
            params = {"type": "run"}
            data = ToolRequestRun(
                tool_info=self.tool_info,
                copilot_info=self.copilot_info,
                llm_config=self.llm_config,
                data_sources=self.data_sources,
                query_info=query_info,
                user_info=user_info,
                copilot_env=self.copilot_env,
                copilot_tool_auth_token=get_copilot_tool_auth_token(self.tool_info.copilot_tool_id),
            )
            response = requests.get(self.deployment_url, params=params, json=data.dict())
            response.raise_for_status()  # Raise an exception for non-2xx status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            return {
                "response": {
                    "text": "Oops! I am experiencing technical difficulties at the moment and am unable to fulfill your request. Our team has been alerted, and we're working hard to fix the issue. In the meantime, you might try rephrasing your question or checking back later. Thank you for your patience.",
                    "hint": str(e),
                    "widgets": None,
                    "processed_query": "",
                }
            }

    def validate(self, previous_data: dict):
        try:
            params = {"type": "validate"}
            data = ToolRequestValidate(
                tool_info=self.tool_info,
                copilot_info=self.copilot_info,
                llm_config=self.llm_config,
                data_sources=self.data_sources,
                copilot_env=self.copilot_env,
                copilot_tool_auth_token=get_copilot_tool_auth_token(self.tool_info.copilot_tool_id),
                previous_data=previous_data,
            )
            response = requests.get(self.deployment_url, params=params, json=data.dict())
            response.raise_for_status()  # Raise an exception for non-2xx status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            return {
                "validation_flag": False,
                "message": "Tool config validated successfully",
            }

    def pre_process(self, previous_data: dict):
        try:
            params = {"type": "preprocess"}
            data = ToolRequestValidate(
                tool_info=self.tool_info,
                copilot_info=self.copilot_info,
                llm_config=self.llm_config,
                data_sources=self.data_sources,
                copilot_env=self.copilot_env,
                copilot_tool_auth_token=get_copilot_tool_auth_token(self.tool_info.copilot_tool_id),
                previous_data=previous_data,
            )
            response = requests.get(self.deployment_url, params=params, json=data.dict())
            response.raise_for_status()  # Raise an exception for non-2xx status codes
            return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            return {
                "status": "error",
                "preprocess_config": {},
                "message": f"Preprocessing API call failed. {e}",
            }


class LLMInterface:
    def __init__(self, llm_config):
        self.llm_config = llm_config
        self.__generate_llm()
        pass

    def __generate_llm(self):
        self.llm = AzureChatOpenAI(
            openai_api_key=self.llm_config.config["openai_api_key"],
            openai_api_base=self.llm_config.config["api_base"],
            deployment_name=self.llm_config.config["deployment_name"],
            model_name=self.llm_config.config["model_name"],
            openai_api_version=self.llm_config.config["api_version"],
            temperature=self.llm_config.config["temperature"],
        )
