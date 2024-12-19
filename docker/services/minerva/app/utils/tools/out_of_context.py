#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

# import datetime
import re
from typing import Any, List

from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.tools.tool_utils import parse_convo_history
from langchain.tools import BaseTool
from sqlalchemy.orm import Session


class OutContext(BaseTool):
    llm: Any
    tool_config: dict
    history: List[MinervaConversationDBBase]
    max_retries: int = 3
    db: Session
    minerva_application_id: int
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None
    user_input_form: dict = None
    tools: list

    # Tool methods that have to be defined
    async def _run(self, query: str) -> dict:
        """Use the out of context tool."""
        widgets = []
        # TODO - make it scalable - save example questions in db
        # Recommended question when the given question is Out of context
        # check for context
        context_info = self.in_out_context(
            convo_history=self.history,
            user_query=query,
            llm=self.llm,
            tool_names=",".join([tool.name for tool in self.tools if tool.name != "OutContext"]),
            tools=",".join([tool.name + " = " + tool.description for tool in self.tools if tool.name != "OutContext"]),
        )
        in_context, reason = self.extract_context_reason(context_info)
        error_message = self.error_message(
            convo_history=self.history,
            user_query=query,
            llm=self.llm,
            tool_names=",".join([tool.name for tool in self.tools]),
            tools=",".join([tool.name + " = " + tool.description for tool in self.tools]),
        )
        widgets.append({"type": "markdown", "value": error_message})
        widgets.append(
            {
                "type": "markdown",
                "value": "For Example - I can assist with questions like:",
            }
        )
        widgets.append({"type": "markdown", "value": "\n\n"})
        widgets.append(
            {
                "name": "Recommendations",
                "type": "recommendation-cards",
                "title": "",
                "value": {
                    "items": [
                        "Compare SKU 3 prices against competitors for November 2023",
                        "What effect would a 5% price increase for SKU_2 in January 2024 have on my sales?",
                        "What are the steps to check SKU price effectiveness?",
                    ]
                },
            }
        )
        response = {
            "type": "recommend_question",
            "response": {
                "text": "",
                "sql_query": reason,
                # minerva_agent.generate_response(user_input_text=user_query, user_input_form=request_body)
                "widgets": widgets if len(widgets) > 0 else None,
                "processed_query": "",
            },
        }
        return response

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")

    def error_message(self, convo_history, user_query, llm, tool_names, tools):
        error_template = """"
    You are an expert data analyst. You were not able to answer the user question. You have the following tools - [{tool_names}]. Use the following information to understand your capabilities - {tools}.
    Use this information to return a message to the user about not being able to answer the question and let them know of your capabilities that you might be able to help out with instead. keep in short under 50 words.
    Conversation - {convo_history}
    User Question - {user_query}
    """.format(
            convo_history=parse_convo_history(convo_history),
            user_query=user_query,
            tool_names=tool_names,
            tools=tools,
        )
        result = str(llm.predict(error_template))
        return result

    def in_out_context(self, convo_history, user_query, llm, tool_names, tools):
        # Context classification Prompt
        #  Business description: {business_description}
        # Data dictionary: {data_dictionary}
        # 2)	The 'data dictionary' contains information about the user question, or it can be derived through further clarification. If data dictionary does not have the information, then it can be obtained from the ‘API description’.
        business_description = """Sparklewave is a NARTD (non alcoholic ready to beverage) brand.
        With a keen focus on financial performance, the company meticulously tracks its revenues,
        sales metrics, and product performance across various SKUs, retailers, and cities in the USA.
        It also invests significantly in various pillars of RGM (Revenue growth management) , closely monitoring their costs
        and resultant sales uplift.Their comprehensive data collection emphasizes Sparklewave's dedication to creating pricing guidelines, understanding market dynamics, optimizing promotional strategies, and ensuring consistent growth.
        They are currently performing mid-year pricing review.
        """
        # Return the responses in the same format
        context_classification = """

            You are a business analysis bot. Do not make any assumptions beyond what is provided below to answer the query including any derived metrics or KPIs.
            the business description, the tools, and the tool description.
            you need to return a 'Reason' along with an 'Answer: In context: True' or 'Answer: In context: False' for the user question.

            Business description: {business_description}
            Tools: [{tool_names}]
            Tool's description: {tools}
            Conversation history: {convo_history}
            A question is only 'In context: True' if the following reasons are satisfied:

            1)	The user question is in the same business field and scope as the 'business description'.
            2)	Apart from standard data manipulation no other activity can be done beyond those in 'tool description'.

            Else it is 'In context: False'.

            Examples:
            ###

            User question: "I am new to Sparklewave. What are some steps I need to take to analyze SKU price effectiveness?"
            Reason: Sparklewave is in our 'business description'. SKU price effectiveness is mentioned in the 'tool description'. So, this question can be answered by one of the tools.
            Answer: In context: True

            ###

            User question: "What is the weather today?"
            Reason: This question is not related to whats given in the 'business description'. Information about weather was also not found in the 'tools' or 'tool description'. So, this question cannot be answered.
            Answer: In context: False

            ###

            User Question: "How much profit did APPLE make?"
            Reason: This question is not related to the given field in 'business description'. There is no available data about APPLE in the ' tool description'. Our API can provide this information, but it is outside the scope of our 'business description'. So, this question cannot be answered.
            Answer: In context: False

            ###

            User Question: "How will a 5 percent increase in price of SKU_2 impact my business?"
            Reason: Business can refer to sales or revenue of Sparklewave and SKU 2 which is available in 'tool description' and 'business context'. The 'tool description' shows that  text2sql tool can be used to answer this question. So, this question can possibly be answered.
            Answer: In context: True

            ###

            User question: "What is the first step of SKU price effectiveness?"
            Reason: SKU price effectiveness is mentioned in the tool description and it is within the scope of the 'business context' domain - revenue growth management. So, this question can be answered by one of the tools.
            Answer: In context: True

            ###

            User question: "What is the first line of Take Me Home, Country Roads?"
            Reason: It is outside the scope of the 'business context' domain and is it not available in 'tool description'. So, this question can not be answered by one of the tools.
            Answer: In context: False

            ###
            Based on these examples and the user question below, return the reason and answer to if it is context.
            User Question: {user_query}
            Reason:
            Answer: In context:

        """.format(
            convo_history=parse_convo_history(convo_history),
            user_query=user_query,
            tool_names=tool_names,
            tools=tools,
            business_description=business_description,
        )
        result = str(llm.predict(context_classification))
        return result

    def extract_context_reason(self, text):
        # Define patterns for extracting information
        reason_pattern = r"Reason: (.+?)\s+Answer:"
        in_context_pattern = r"In context: (.+)"

        # Extract information using regular expressions
        reason_match = re.search(reason_pattern, text)
        in_context_match = re.search(in_context_pattern, text)
        reason = reason_match.group(1)
        in_context = in_context_match.group(1)
        # return the extracted information
        return (in_context, reason)
