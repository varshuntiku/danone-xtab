#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#
import asyncio
import json
import logging
from datetime import datetime, timedelta

import requests
from app.main import websocket_manager
from app.schemas.copilot_tool_request import (
    ContextDatasourceConfigList,
    CopilotEnvironment,
    CopilotInfo,
    DataSourceConfigList,
    LLMConfigList,
    PreviousToolData,
    ToolInfo,
    ToolRequestRun,
    ToolRequestValidate,
)
from app.utils.auth.token import encode_payload
from app.utils.config import get_settings
from app.utils.websocket.request import Request as MockRequest

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


class Tool:
    def __init__(
        self,
        tool_info: ToolInfo,
        copilot_info: CopilotInfo,
        deployment_url: str,
        llm_config: LLMConfigList = [],
        data_sources: DataSourceConfigList = [],
        is_test: bool = False,
        websocket_conn: str = "",
        context_datasources: ContextDatasourceConfigList = [],
    ):
        self.tool_info = tool_info
        self.copilot_info = copilot_info
        self.llm_config = llm_config
        self.data_sources = data_sources
        self.deployment_url = deployment_url
        self.copilot_env = CopilotEnvironment(base_url=settings.MINERVA_HOST_URL)
        self.is_test = is_test
        self.websocket_conn = websocket_conn
        self.context_datasources = context_datasources

    async def run(self, query_info, user_info):
        try:
            params = {"type": "run"}
            # self.llm_config[0].type = "azure-openai"  # TODO: hotfix
            data = ToolRequestRun(
                tool_info=self.tool_info,
                copilot_info=self.copilot_info,
                llm_config=self.llm_config,
                data_sources=self.data_sources,
                query_info=query_info,
                user_info=user_info,
                copilot_env=self.copilot_env,
                copilot_tool_auth_token=get_copilot_tool_auth_token(self.tool_info.copilot_tool_id),
                context_datasources=self.context_datasources,
            )
            await asyncio.sleep(0.01)
            final_output_json = {}
            if self.is_test:
                response = await websocket_manager.request(
                    conn_id=self.websocket_conn,
                    req=MockRequest(path="/", method="get", params=params, data=data.dict()),
                )
                async for chunk in response.iter_lines():
                    await asyncio.sleep(0.01)
                    if chunk:
                        tool_response_json = json.loads(chunk)
                        response_output_json = {"response": tool_response_json["response"]}
                        final_output_json = {
                            key: tool_response_json[key] for key in tool_response_json if key != "response"
                        }
                        final_output_json["output"] = response_output_json
                        yield final_output_json
            else:
                try:
                    response = requests.get(self.deployment_url, params=params, json=data.dict(), stream=True)
                    for chunk in response.iter_lines(decode_unicode=True):
                        await asyncio.sleep(0.01)
                        if chunk:
                            tool_response_json = json.loads(chunk)
                            response_output_json = {"response": tool_response_json["response"]}
                            final_output_json = {
                                key: tool_response_json[key] for key in tool_response_json if key != "response"
                            }
                            final_output_json["output"] = response_output_json
                            yield final_output_json
                except Exception as e:
                    logging.warning(e)
                    response.raise_for_status()  # Raise an exception for non-2xx status codes

        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            exception_output = {
                "output": {
                    "response": {
                        "hint": str(e),
                        "widgets": [
                            {
                                "type": "markdown",
                                "value": 'Sorry, it looks like there was an issue while generating the response. Please try again or <a id="support-email" href="mailto:nuclios_support@mathco.com">Contact Support</a> if the problem persists. Thank you for your patience!',
                            }
                        ],
                        "processed_query": "",
                    }
                },
                "error": True,
            }
            yield exception_output

    async def validate(self, previous_data: PreviousToolData = None):
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
                context_datasources=self.context_datasources,
            )
            if self.is_test:
                try:
                    response = await websocket_manager.request(
                        conn_id=self.websocket_conn,
                        req=MockRequest(path="/", method="get", params=params, data=data.dict()),
                    )
                    return await response.json()
                except Exception as e:
                    logging.error(e)
                    return {
                        "validation_flag": False,
                        "message": "Tool config validated successfully",
                    }
            else:
                response = requests.get(self.deployment_url, params=params, json=data.dict())
                response.status_code
                response.raise_for_status()  # Raise an exception for non-2xx status codes
                return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            return {
                "validation_flag": False,
                "message": "Tool config validated successfully",
            }

    async def pre_process(self, previous_data: PreviousToolData = None):
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
                context_datasources=self.context_datasources,
            )
            if self.is_test:
                try:
                    response = await websocket_manager.request(
                        conn_id=self.websocket_conn,
                        req=MockRequest(path="/", method="get", params=params, data=data.dict()),
                    )
                    return await response.json()
                except Exception as e:
                    logging.error(e)
                    return {
                        "validation_flag": False,
                        "message": "Tool config validated successfully",
                    }
            else:
                response = requests.get(self.deployment_url, params=params, json=data.dict())
                response.status_code
                response.raise_for_status()  # Raise an exception for non-2xx status codes
                return response.json()
        except requests.exceptions.RequestException as e:
            logging.error(f"An error occurred during the tool API call: {e}")
            return {
                "status": "error",
                "preprocess_config": {},
                "message": f"Preprocessing API call failed. {e}",
            }
