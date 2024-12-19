#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

"""
This is the entry point of the fission function.
"""
import json

from flask import current_app, request
from tool_impl.tool import Tool


def main():
    try:
        # TO-DO - Add authentication logic here
        # myHeader = request.headers['authorization']
        request_type = request.args.get("type")
        request_data = request.get_json()
        if request_type == "validate":
            tool_obj = Tool(
                tool_info=request_data.get("tool_info", None),
                copilot_info=request_data.get("copilot_info", None),
                llm_config=request_data.get("llm_config", []),
                data_sources=request_data.get("data_sources", []),
                copilot_env=request_data.get("copilot_env", None),
                copilot_tool_auth_token=request_data.get("copilot_tool_auth_token", None),
            )
            response = tool_obj.validate_tool_config()
            if isinstance(response, dict):
                return json.dumps(response)
            else:
                return response.json()
        elif request_type == "preprocess":
            tool_obj = Tool(
                tool_info=request_data.get("tool_info", None),
                copilot_info=request_data.get("copilot_info", None),
                llm_config=request_data.get("llm_config", []),
                data_sources=request_data.get("data_sources", []),
                copilot_env=request_data.get("copilot_env", None),
                copilot_tool_auth_token=request_data.get("copilot_tool_auth_token", None),
            )
            response = tool_obj.tool_preprocess()
            if isinstance(response, dict):
                return json.dumps(response)
            else:
                return response.json()
        elif request_type == "run":
            tool_obj = Tool(
                tool_info=request_data.get("tool_info", None),
                copilot_info=request_data.get("copilot_info", None),
                llm_config=request_data.get("llm_config", []),
                data_sources=request_data.get("data_sources", []),
                copilot_env=request_data.get("copilot_env", None),
                copilot_tool_auth_token=request_data.get("copilot_tool_auth_token", None),
                # query_info=request_data.get("query_info", None),
                # user_info=request_data.get("user_info", None),
            )
            query_info = (request_data.get("query_info", None),)
            user_info = (request_data.get("user_info", None),)
            response = tool_obj.run(query_info, user_info)
            if isinstance(response, dict):
                return json.dumps(response)
            else:
                return response.json()
        elif request_type == "test":
            return json.dumps(
                {
                    "request_type": request_type,
                    "request_data": request_data,
                    "response": "Function Call Success",
                    "response_code": 200,
                }
            )
        else:
            return json.dumps(
                {
                    "response": "Unknown request type",
                    "response_code": 404,
                }
            )
    except Exception as e:
        current_app.logger.error("Error in main function: {}".format(e))
        return "Internal Server Error", 400
