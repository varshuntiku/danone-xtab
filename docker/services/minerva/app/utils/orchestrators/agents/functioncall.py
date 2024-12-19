import json
from typing import List

from app.schemas.copilot_tool_request import CopilotInfo, LLMConfig, OrchestratorInfo
from app.utils.orchestrators.agents.base import Orchestrator, OrchestratorRegistry
from app.utils.orchestrators.llms.openai import OpenAILLM
from app.utils.orchestrators.tools.base import Tool


@OrchestratorRegistry.register_orchestrator("FunctionCallAgent")
class FunctionCallAgent(Orchestrator):
    """
    Orchestration using OpenAI Function
    """

    def __init__(self, copilot_info, tools, agent_llm, orchestrator_info):
        self.copilot_info: CopilotInfo = copilot_info
        self.tools: List[Tool] = tools
        self.llm: LLMConfig = agent_llm
        self.orchestrator_info: OrchestratorInfo = orchestrator_info
        self.no_of_convo = 5

    def preprocess_tool_name(self, tool_name):
        """
        Function to preprocess the tool name. It replaces the empty spaces with underscores.
        """
        return tool_name.replace(" ", "_").replace(".", "").lower()

    def get_attachment_details(self, tool_item):
        """
        Function to get the attachment support details for a tool.
        """
        supports_attachments = False
        supported_file_types = []

        input_elements = tool_item.tool_info.input_params.get("input_elements", [])
        for element in input_elements:
            if element["type"] == "attachments":
                supports_attachments = True
                params = element.get("params", {})
                supported_file_types = params.get("accept", [])
                break
        if supports_attachments:
            supported_file_types_str = ", ".join(supported_file_types)
            return f" This tool supports attachments. Supported file types: {supported_file_types_str}."
        else:
            return ""

    def __create_agent(self):
        """
        Create a function mapper list by looping over all the tools
        """
        self.function_mapper_list = [
            {
                "name": self.preprocess_tool_name(tool_item.tool_info.name),
                "description": tool_item.tool_info.description + "." + self.get_attachment_details(tool_item),
                "parameters": tool_item.tool_info.input_params["function_params"],
            }
            for tool_item in self.tools
        ]

    def __sanitize_history(self, query_info):
        """
        Function  to convert minerva history to Openai type history messages
        [{role:user,message:message}]
        """
        convo_history = query_info.convo_history

        # Add the Orchestrator prompt to the history
        history = [{"role": "system", "content": self.orchestrator_info.system_message}]

        # loop through the conversations if conversation memory is enabled
        if self.orchestrator_info.convo_memory_enabled:
            for conversation in convo_history[-self.no_of_convo :]:
                user_msg = {"role": "user", "content": conversation.user_query}
                convo_response = conversation.copilot_response
                asst_content = ""
                if "text" in convo_response.get("response", {}) and convo_response["response"]["text"] != "":
                    asst_content = str(convo_response["response"]["text"])
                elif "widgets" in convo_response.get("response", {}):
                    for widget in convo_response["response"]["widgets"] or []:
                        # check if widget is of type array, then iterate over the array
                        if isinstance(widget, list):
                            for w in widget[:1]:
                                if not w["type"] == "chart":
                                    asst_content = asst_content + str(w["value"])[:20000]
                        elif not widget["type"] == "chart":
                            asst_content = asst_content + str(widget["value"])[:20000]
                if conversation.extra_info:
                    asst_content = asst_content + str(conversation.extra_info)[:5000]

                assistant_msg = {"role": "assistant", "content": asst_content}
                history.extend([user_msg, assistant_msg])

        text_input = query_info.text_input or ""

        if len(query_info.query_datasource):
            if not text_input:
                text_input = "Summarize the content of the files"
            text_input += " <Attached datasource-"
            for datasource in query_info.query_datasource:
                text_input += f" {datasource.name}"
            text_input += ">"

        if query_info.query_type:
            text_input += f" <query_type: {query_info.query_type}> "

        history.append({"role": "user", "content": text_input})
        return history

    async def execute_query(self, query_info, user_info):
        """
        Function to execute the User query using the OpenAI function method
        """
        progress_data = {
            "progress_message": "Picking up  skillset for you",
            "progress_icon": "search",
        }
        yield progress_data

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
            query_info.tool_params["question"] = query_info.text_input
            query_info.tool_params["query_type"] = query_info.query_type
            yield {"progress_message": "A skillset has started processing your query."}
            async for response in tool.run(query_info=query_info, user_info=user_info):
                yield response
        else:
            client = OpenAILLM(self.llm).generate_llm()  # Load the LLM client
            messages = self.__sanitize_history(query_info)  # Sanitize the conversation history
            self.__create_agent()  # Create the function mapper

            # Make an OpenAI function call and generate the response
            response = client.chat.completions.create(
                model=self.llm.config["deployment_name"],
                temperature=self.llm.config.get("temperature", 0),
                seed=self.llm.config.get("seed", 42),
                messages=messages,
                functions=self.function_mapper_list,
                function_call=self.llm.config.get("function_call", "auto"),
            )

            # Get the Response message
            response_message = response.choices[0].message

            if response_message.function_call:
                # Name of the function to be called
                function_name = response_message.function_call.name
                # Arguments to simulate
                function_args = json.loads(response_message.function_call.arguments)

                # loop over each tool and get the tool being executed
                tool = next(
                    (
                        tool_item
                        for tool_item in self.tools
                        if self.preprocess_tool_name(tool_item.tool_info.name) == function_name
                    ),
                    None,
                )
                # Add the tool arguments to Query Info
                query_info.tool_params = function_args

                progress_data = {
                    "progress_message": "A skillset has started processing your query.",
                    "progress_icon": "search",
                }
                yield progress_data

                # Call the selected tool with the arguments
                async for response in tool.run(query_info=query_info, user_info=user_info):
                    yield response

            else:
                # If no tool is selected or if there is ambiguity, return the message to the User
                response = {
                    "output": {
                        "response": {
                            "text": response_message.content,
                            "widgets": [],
                            "processed_query": query_info.text_input,
                        }
                    }
                }
                yield response
