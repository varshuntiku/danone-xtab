#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

# from flask.current_app import logging
import logging

from tool_impl.tool_params import ToolParams
from utils.base_tool import BaseTool
from utils.llm_interface import LLMInterface  # noqa: F401
from utils.schema import (  # noqa: F401
    EntityObject,
    PreprocessResponse,
    PreprocessStatusMessage,
    QueryInfo,
    QueryRun,
    ResponseObject,
    ValidationResponse,
)


class Tool(BaseTool):
    def run(self, query_info: QueryInfo, user_info) -> QueryRun:
        user_input_query = query_info["text_input"]  # noqa: F841
        user_form_input = query_info["form_input"]  # noqa: F841
        convo_history = query_info["convo_history"]  # noqa: F841
        user_info = user_info  # noqa: F841
        tool_info = self.tool_info  # noqa: F841
        llm_config = self.llm_config  # noqa: F841
        copilot_info = self.copilot_info  # noqa: F841
        data_sources = self.data_sources  # noqa: F841
        tool_params = ToolParams(**query_info["tool_params"])  # noqa: F841

        try:
            # TO-DO - Add your code here

            # return response
            return QueryRun(response=ResponseObject(text="Sample response"))

        except Exception as e:
            print(e)
            logging.error(e)
            return QueryRun(
                response=ResponseObject(
                    text="Oops! I am experiencing technical difficulties at the moment and am unable to fulfill your request. Our team has been alerted, and we're working hard to fix the issue. In the meantime, you might try rephrasing your question or checking back later. Thank you for your patience."
                )
            )

    def validate_tool_config(self) -> ValidationResponse:
        """
        This method is called to validate your tool config and return True or False
        """
        tool_input_config = self.tool_info.get("input_config") if self.tool_info else None  # noqa: F841
        tool_config = self.tool_info.get("config") if self.tool_info else None  # noqa: F841

        # TO-DO - Add your code here

        return ValidationResponse(validation_flag=True, message="Tool config validated successfully")

    def tool_preprocess(self) -> PreprocessResponse:
        """
        This method is called to preprocess tool config provided by user and return preprocess_config dictionary
        """
        try:
            # TO-DO - Add your code here
            preprocess_config = {"sample key": "sample value"}
            # return response including preprocess_config which is stored in the database
            return PreprocessResponse(
                status=PreprocessStatusMessage.Completed,
                preprocess_config=preprocess_config,
                message="Preprocessing completed successfully",
            )
        except Exception as e:
            logging.error(e)
            return PreprocessResponse(
                status=PreprocessStatusMessage.Failed,
                preprocess_config=None,
                message=str(e),
            )
