#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#
from typing import Any

from app.utils.tools.tool_utils import summarize_question_context
from pydantic import BaseModel


class BaseAgent(BaseModel):
    llm: Any
    tools: Any
    # Set up the base template
    tool_selector_template: str = """
You are an expert data analyst. Based on the user question, you should always think about what to do, the action to take. It should be one of the following tools - [{tool_names}]. Use the following information to decide the tool - {tools}.

Return only the tool name as the output in the format <Tool_Name>

Question: {input}
Output:
"""

    def __create_agent(self, query):
        self.tool_selector_template = self.tool_selector_template.format(
            tool_names=",".join([tool.name for tool in self.tools]),
            tools=",".join([tool.name + " = " + tool.description for tool in self.tools]),
            input=query,
        )

    def execute_query(self, user_input_text, user_input_form, convo_history):
        # check for user input form value - call tool directly based on user input form
        if (
            user_input_form is not None
            and user_input_form != {}
            and user_input_form.get("button")
            and user_input_form.get("button").get("tool")
        ):
            input_tool = user_input_form["button"]["tool"]
            tool = next(
                (tool_item for tool_item in self.tools if tool_item.name == input_tool),
                None,
            )
            tool.user_input_form = user_input_form
            return tool.run(user_input_text)
        else:
            # call the tool based on user query
            if len(self.tools) > 1:
                updated_query = summarize_question_context(
                    convo_history=convo_history,
                    user_query=user_input_text,
                    llm=self.llm,
                )
                self.__create_agent(query=updated_query)
                tool_selector_response = str(self.llm.predict(self.tool_selector_template))
                tool = next(
                    (tool_item for tool_item in self.tools if tool_item.name in tool_selector_response),
                    None,
                )
                return tool.run(user_input_text)
            else:
                response = self.tools[0].run(user_input_text)
                return response
