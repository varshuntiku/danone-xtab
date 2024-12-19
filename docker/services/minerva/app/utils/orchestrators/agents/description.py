#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.schemas.copilot_tool_request import OrchestratorInfo
from app.utils.config import get_settings
from app.utils.orchestrators.agents.base import Orchestrator, OrchestratorRegistry
from app.utils.orchestrators.llms.openai import OpenAILLM
from app.utils.tools.tool_utils import parse_convo_history

settings = get_settings()


@OrchestratorRegistry.register_orchestrator("PromptAgent")
class PromptAgent(Orchestrator):
    def __init__(self, copilot_info, tools, agent_llm, orchestrator_info):
        self.copilot_info = copilot_info
        self.tools = tools
        self.llm = agent_llm
        self.orchestrator_info: OrchestratorInfo = orchestrator_info

        # Set up tool selector template
        self.__tool_selector_template: str = """
You are an expert data analyst. Based on the user question, you should always think about what to do, the action to take. It should be one of the following tools, their names are - {tool_names}.
Use the following information to decide the tool -
{tools}.

Return only the tool name as the output in the format <Tool_Name>
"""

    def __create_agent(self):
        self.__tool_selector_prompt = self.__tool_selector_template.format(
            tool_names=",".join(["<" + str(tool.tool_info.copilot_tool_id) + ">" for tool in self.tools]),
            tools="\n".join(
                ["<" + str(tool.tool_info.copilot_tool_id) + "> = " + tool.tool_info.description for tool in self.tools]
            ),
        )

    async def __emit_message(self, msg: str, query_info, user_info, progress_icon):
        processing_step_data = {
            "progress_message": msg,
            "query_trace_id": query_info.query_trace_id,
            "window_id": query_info.window_id,
            "progress_icon": progress_icon,
        }
        yield processing_step_data

    async def execute_query(self, query_info, user_info):
        # self.__emit_message("Picking up skillset for you", query_info, user_info, "search")
        yield {"progress_message": "Picking up skillset for you"}
        # check for user input form value - call tool directly based on user input form
        if (
            query_info.form_input is not None
            and query_info.form_input != {}
            and query_info.form_input.get("button", False)
        ):
            input_tool = query_info.form_input["button"]["tool"]
            tool = next(
                (tool_item for tool_item in self.tools if tool_item.tool_info.name == input_tool),
                None,
            )
            tool.user_input_form = query_info.form_input
            yield {"progress_message": "A skillset has started processing your query."}
            query_info.tool_params["question"] = query_info.text_input
            async for response in tool.run(query_info=query_info, user_info=user_info):
                yield response
        else:
            # call the tool based on user query
            if len(self.tools) > 1:
                llm_obj = OpenAILLM(self.llm).generate_llm()

                updated_query = (
                    summarize_conversation_context(
                        convo_history=query_info.convo_history,
                        user_query=query_info.text_input,
                        llm=llm_obj,
                        deployment_name=self.llm.config["deployment_name"],
                    )
                    if self.orchestrator_info.convo_memory_enabled
                    else query_info.text_input
                )

                if len(query_info.query_datasource):
                    updated_query += " <provided datasource-"
                    for datasource in query_info.query_datasource:
                        updated_query += f" {datasource.name}"
                    updated_query += ">"

                self.__create_agent()
                completion = llm_obj.chat.completions.create(
                    model=self.llm.config["deployment_name"],
                    messages=[
                        {"role": "system", "content": self.__tool_selector_prompt},
                        {"role": "user", "content": updated_query},
                    ],
                )

                tool_selector_response = completion.choices[0].message.content

                tool = next(
                    (
                        tool_item
                        for tool_item in self.tools
                        if str(tool_item.tool_info.copilot_tool_id) in tool_selector_response
                    ),
                    None,
                )
                query_info.tool_params["question"] = updated_query
                yield {"progress_message": "A skillset has started processing your query."}
                async for response in tool.run(query_info=query_info, user_info=user_info):
                    yield response
            else:
                query_info.tool_params["question"] = query_info.text_input
                yield {"progress_message": "A skillset has started processing your query."}
                async for response in self.tools[0].run(query_info=query_info, user_info=user_info):
                    yield response


def summarize_conversation_context(convo_history, user_query, llm, deployment_name):
    """
    Function to
    """
    context_template = """"
Here are some examples of context enrichment of a user's question -
################################
Example 1:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?

Modified Question -
Who is the 45th president of the united states of america?

################################
Example 2:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 45th?
System Response - Donald Trumph is the 45th President of the united states of america
User Question - What is the capital of Finland?

Modified Question -
What is the capital of Finland?
################################
Example 3:

Conversation -
User Question - Who is the current president of the united states of america?
System Response - Joe Biden is the 46th President of the united states of america
User Question - What about the 43rd?
System Response - Donald Trumph is the 45th President of the united states of america
User Question - What is the capital of Finland?
System Response - Helsinki is the capital of finland
User Question - What about Poland

Modified Question -
What is the capital of Poland?
################################

Based on these examples and the conversation below, modify the final User Question to add any relevant context if needed.
1. Any modifications made to the question has to be inferred from the context of the conversation below.
2. If no context can be inferred from the conversation, return the question as is without any modifications.


Conversation -
{convo_history}

User Question -
{user_query}
Modified Question -
""".format(
        convo_history=parse_convo_history(convo_history), user_query=user_query
    )

    completion = llm.chat.completions.create(
        model=deployment_name,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": context_template},
        ],
    )
    result = completion.choices[0].message.content
    return result
