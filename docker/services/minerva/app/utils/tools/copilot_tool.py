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
from typing import Any, List

import numpy as np
import pandas as pd
from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.charts.generate_widget import WidgetGenerator

# from app.utils.socket.connection_events import emit_query_processing_step
from app.utils.tools.copilot_utils.config import Config
from app.utils.tools.copilot_utils.helper_functions import copilot_api
from app.utils.tools.copilot_utils.plot import get_simulator_plot
from langchain.tools import BaseTool
from sqlalchemy.orm import Session


def tts_simulator_selection():
    """
    Text2SQL with Simulator pipeline
    """
    widgets = []  # List to add the widgets to be displayed on UI

    text = "Great! Let's get started on planning your next meeting."
    widgets.append({"type": "markdown", "value": text})  # Widget to display message
    response = {
        "type": "copilot",
        "response": {
            "pipeline": "pipeline1",
            "stage": "completed",
            "question": None,
            "widgets": None if widgets == [] else widgets,
        },
    }

    return response


def rag_pipeline_selection():
    """
    RAG pipeline
    """
    widgets = []  # List to add the widgets to be displayed on UI
    text = "Sure! Let me guide you through the details and answer any questions you might have."
    widgets.append({"type": "markdown", "value": text})  # Widget to display message
    response = {
        "type": "copilot",
        "response": {
            "pipeline": "pipeline2",
            "stage": "completed",
            "question": None,
            "widgets": None if widgets == [] else widgets,
        },
    }

    return response


def dashboard_generation_flow():
    """
    Dashboard creation for seleted codx components
    """
    widgets = []  # List to add the widgets to be displayed on UI
    dashboard_msg = "Success! Dashboard for selected components has beeen created."
    dashboard_url = "https://codex-products-preprod-sec.azurewebsites.net/app/1395/"
    widgets.append({"type": "markdown", "value": dashboard_msg})
    widgets.append({"type": "markdown", "value": dashboard_url})  # Widget to display summary
    response = {
        "type": "copilot",
        "response": {
            "called_functions_list": "",
            "stage": "completed",
            "question": None,
            "widgets": None if widgets == [] else widgets,
        },
    }
    return response


def report_generaton_flow():
    """
    Report creation for seleted codx components
    """
    widgets = []  # List to add the widgets to be displayed on UI
    report_url = "https://stinnovationcats.blob.core.windows.net/walmart-reports/report.docx"
    report_msg = "Success! Report generated with the following sections:"
    r_sections = """
        * Introduction
        * Overall Business Performance
        * Earnings and Profitability
        * Revenue across Segments
                    """
    widgets.append({"type": "markdown", "value": report_msg})
    widgets.append({"type": "markdown", "value": r_sections})
    widgets.append({"type": "markdown", "value": report_url})  # Widget to display the report url
    response = {
        "type": "copilot",
        "response": {
            "called_functions_list": "",
            "stage": "completed",
            "question": None,
            "widgets": None if widgets == [] else widgets,
        },
    }
    return response


def presentation_generation_flow():
    """
    Presentation creation for seleted codx components
    """
    widgets = []  # List to add the widgets to be displayed on UI
    presentation_url = "https://stinnovationcats.blob.core.windows.net/walmart-reports/walmart.pptx"
    presentation_msg = "Success! Presentation generated with the following sections:"

    p_sections = """
* Overall Business Performance
* Earnings and Profitability
* Revenue across Segments
    """

    widgets.append({"type": "markdown", "value": presentation_msg})
    widgets.append({"type": "markdown", "value": p_sections})
    widgets.append({"type": "markdown", "value": presentation_url})  # Widget to display the presentation url
    response = {
        "type": "copilot",
        "response": {
            "called_functions_list": "",
            "stage": "completed",
            "question": None,
            "widgets": None if widgets == [] else widgets,
        },
    }
    return response


class COPILOT(BaseTool):
    llm: Any
    tool_config: dict
    history: List[MinervaConversationDBBase]
    minerva_application_id: str
    max_retries: int = 3
    db: Session
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None

    # Tool methods that have to be defined
    async def _run(self, query: str) -> dict:
        """Use the tool."""
        try:
            # await emit_query_processing_step(
            #     room=self.user_info["email"],
            #     data={
            #         "progress_message": "Evaluating Question",
            #         "query_trace_id": self.query_trace_id,
            #         "window_id": self.window_id,
            #         "progress_percentage": 10,
            #     },
            # )

            # Socket details
            required_socket_details = {
                "minerva_application_id": self.minerva_application_id,
                "query_trace_id": self.query_trace_id,
                "window_id": self.window_id,
                "email": self.user_info["email"],
            }

            ###############################################################
            # RepGPT Implementation
            # 1) Do you want to plan your next meet?
            # 2) Would you like information about the product?
            # TODO: Remove pipeline code
            # text2sql_simulator_pipeline = (
            #     True if query == "I want to plan my next meet" else False
            # )  # Text2SQL + Simulator pipeline

            # rag_pipeline = (
            #     True if query == "I want to know more information about my product and HCPs" else False
            # )  # RAG pipeline

            # if text2sql_simulator_pipeline:
            #     return tts_simulator_selection()

            # if rag_pipeline:
            #     return rag_pipeline_selection()

            #############################################################################
            skip_resolution = True if query == "skip resolution" else False  # Skip Resolution
            show_summary = True if query == "Show Summary" else False  # Show summary

            simulator_insights = (
                True if query == "Could you provide me with insights?" else False
            )  # Show simulator insights

            dashboard_generation_flag = (
                True if query in ["Deploy as dashboard", "deploy as dashboard"] else False
            )  # Deploy the dashboard report

            presentation_generation_flag = (
                True if query in ["Deploy as presentation", "deploy as presentation"] else False
            )  # Deploy the presentation

            # Deploy the report
            report_generation_flag = True if query in ["Deploy as report", "deploy as report"] else False

            if self.history != []:  # When the conversation history is not empty
                latest_history = self.history[-1]  # get the latest convo
                stage = latest_history.minerva_response["response"]["stage"]  # get the latest stage

                # Simulator Insights
                if simulator_insights:
                    sorry_text = "Sorry! Not able to generate insights at the moment"  # Sorry message, when there are no insights
                    simulator_insights = latest_history.minerva_response.get("simulator_insights", sorry_text)
                    widgets = []  # List to add the widgets to be displayed on UI

                    widgets.append({"type": "markdown", "value": simulator_insights})  # Widget to display summary
                    response = {
                        "type": "copilot",
                        "response": {
                            "called_functions_list": latest_history.minerva_response["response"].get(
                                "called_functions_list"
                            ),
                            "stage": "completed",
                            "question": None,
                            "widgets": None if widgets == [] else widgets,
                        },
                    }
                    return response

                # Show summary of Regression
                if show_summary:
                    summary_text = latest_history.minerva_response.get("copilot_summary")
                    widgets = []  # List to add the widgets to be displayed on UI

                    widgets.append({"type": "markdown", "value": summary_text})  # Widget to display summary
                    response = {
                        "type": "copilot",
                        "response": {
                            "called_functions_list": latest_history.minerva_response["response"].get(
                                "called_functions_list"
                            ),
                            "stage": "completed",
                            "question": None,
                            "widgets": None if widgets == [] else widgets,
                        },
                    }
                    return response

                # To show the dashboard URL
                if dashboard_generation_flag:
                    response = dashboard_generation_flow()
                    return response

                # To display the report URL
                if report_generation_flag:
                    response = report_generaton_flow()
                    return response

                # To display the Presentation URL
                if presentation_generation_flag:
                    response = presentation_generation_flow()
                    return response

                # Planner History for Autogen implementation
                planner_history = latest_history.minerva_response.get("planner_response")

                # Previous conversation history for copilot
                copilot_history = list()
                [copilot_history.extend(msg.minerva_response.get("copilot_response", [])) for msg in self.history]

            if self.history == []:  # or stage is None:  # When the conversation is in new window
                stage = "context_classify"  # Set stage to context classification
                op = copilot_api(
                    question=query,
                    user_input=query,
                    pipeline=None,  # Pipeline parameter
                    copilot_history=[],
                    called_functions_list=[],
                    planner_history=None,
                    stage=stage,
                    session_id=None,
                    skip_resolution=skip_resolution,
                    required_socket_details=required_socket_details,
                )
            else:  # When the conversation is in old window
                latest_pipeline = None
                # From the conversation list, get the latest selected pipeline name
                for convo in self.history:
                    if convo.minerva_response["response"].get("pipeline"):
                        latest_pipeline = convo.minerva_response["response"].get("pipeline")

                op = copilot_api(
                    question=latest_history.minerva_response["response"]["question"],
                    user_input=query,
                    pipeline=latest_pipeline,
                    copilot_history=copilot_history,
                    called_functions_list=latest_history.minerva_response["response"].get("called_functions_list", []),
                    planner_history=planner_history,
                    stage=stage,
                    session_id=None,
                    skip_resolution=skip_resolution,
                    required_socket_details=required_socket_details,
                )

            # await emit_query_processing_step(
            #     room=required_socket_details["email"],
            #     data={
            #         "progress_message": "Generating Response",
            #         "query_trace_id": required_socket_details["query_trace_id"],
            #         "window_id": required_socket_details["window_id"],
            #         "progress_percentage": 90,
            #     },
            # )

            widgets = []  # List to add the widgets to be displayed on UI
            temp_widget = []  # Temperory widget list

            result = op.get("text")  # Result with Markdown formatting
            stage = op.get("stage")  # Current stage
            generated_sql_query = op.get("sql_query", None)  # Generated SQL query
            reasoning = op.get("reasoning", None)  # Just the LLM response

            # Display the reframed question only if its different from the original question
            if op.get("question", "") != query:
                widgets.append({"type": "markdown", "value": "####" + op.get("question", "")})
                widgets.append({"type": "markdown", "value": "\n\n"})

            # Component to show the table summary
            if op.get("table_summary"):
                widgets.append({"type": "markdown", "value": "\n\n"})
                widgets.append({"type": "markdown", "value": op.get("table_summary")})
                widgets.append({"type": "markdown", "value": "\n\n"})

            data_table = None
            drop_down_widgets = []
            # Table formatting
            if op.get("table") is not None:
                # TODO: Hardcoded!! rounded of table floats to 2 decimal values
                datatable_df = pd.read_json(op["table"]).round(2)
                if not datatable_df.empty:
                    if "Date" in datatable_df.columns:
                        datatable_df["Date"] = datatable_df["Date"].dt.round("D")
                    self.tool_config["config"] = {"context": self.get_column_dict(datatable_df)}

                    # get a figure only when there is simulation data
                    if op.get("called_functions_list"):
                        if op.get("called_functions_list")[-1] == "simulate_sales":
                            data_table_fig = get_simulator_plot(datatable_df)  # Get Simulator plot
                            fig_dict = data_table_fig.to_dict()
                            fig_dict = self.numpy_arrays_to_lists(fig_dict)
                            drop_down_widgets.append(
                                {"name": "chart", "type": "chart", "title": "Sales Over Time", "value": fig_dict}
                            )

                    # Widget generator for generating table and figure
                    widget = WidgetGenerator(
                        config=self.tool_config,
                        sql_query=None,
                        user_query="",
                        copilot_dataframe=datatable_df,
                    )
                    temp_widget = widget.widgets

                    # Displaying widgets based on the function called
                    for widget in temp_widget:
                        if op.get("called_functions_list"):
                            if op.get("called_functions_list")[-1] != "simulate_sales":
                                if widget.get("name") in ["dataTable"]:
                                    space_value = """


                                    """
                                    widgets.append({"type": "markdown", "selectable": False, "value": ""})
                                    widgets.append({"type": "markdown", "value": space_value})
                                    widgets.append({"type": "markdown", "value": space_value})
                                    widgets.append({"type": "markdown", "value": space_value})
                                    # widget.update({"selectable": True})
                                    widgets.append(widget)

                                elif widget.get("type") in ["chart"]:
                                    widget.update({"title": op.get("chart_title")})
                            else:
                                if widget.get("name") in ["dataTable"]:
                                    drop_down_widgets.append(widget)

                        if widget.get("name") in ["bar", "line", "scatter"]:
                            widget.update({"selectable": False})
                            widgets.append(widget)

                # Remove the Chart object for Autogen module
                if op.get("is_autogen"):
                    widgets = [d for d in widgets if d.get("type") != "chart"]
            if drop_down_widgets != []:
                widgets.append(drop_down_widgets)  # Drop down for table and graph
            widgets.append({"type": "markdown", "value": "\n\n"})

            # Show the result text when the result is not None and there is no summary
            if result is not None and not op.get("is_summary_generated"):
                widgets.append({"type": "markdown", "value": "\n\n"})
                widgets.append({"type": "markdown", "value": result})
                widgets.append({"type": "markdown", "value": "\n\n"})

            # Recommended question when the given question is Out of context
            if op.get("suggested_initial_questions"):
                widgets.append({"type": "markdown", "value": "\n\n"})
                widgets.append(
                    {
                        "name": "Recommendations",
                        "type": "recommendation-cards",
                        "title": "",
                        "value": {"items": op.get("suggested_initial_questions")},
                    }
                )

            # Suggested follow up quetsions - Recommendation List
            if op.get("suggested_followup_questions"):
                widgets.append({"type": "markdown", "value": "\n\n"})
                widgets.append({"type": "markdown", "value": "#### I can also assist you with other questions like: "})
                widgets.append(
                    {
                        "name": "Recommendations",
                        "type": "recommendation-list",
                        "title": "",
                        "value": {
                            "items": op.get("suggested_followup_questions")[:2]
                            + ["Could you provide me with insights?"]
                        },
                    }
                )

            # TODO Ambiguity Questions display - Required questions and Optional questions
            if op.get("ambiguity_questions"):
                widgets.append({"type": "markdown", "value": reasoning})
                widgets.append({"type": "markdown", "value": "\n\n"})
            #     if (
            #         "required_questions" in op["ambiguity_questions"].keys()
            #         and op["ambiguity_questions"].get("required_questions") != []
            #     ):
            #         widgets.append({"type": "markdown", "value": "\n\n"})
            #         widgets.append(
            #             {
            #                 "name": "Information ",
            #                 "type": "recommendation-box",
            #                 "title": "",
            #                 "value": {"title": "", "items": op["ambiguity_questions"]["required_questions"]},
            #             }
            #         )

            #     if (
            #         "optional_questions" in op["ambiguity_questions"].keys()
            #         and op["ambiguity_questions"].get("optional_questions") != []
            #     ):
            #         widgets.append({"type": "markdown", "value": "\n\n"})
            #         widgets.append(
            #             {
            #                 "name": "Information ",
            #                 "type": "recommendation-box",
            #                 "title": "Also, it will be helpful if you can provide some additional information:",
            #                 "value": {"title": "", "items": op["ambiguity_questions"]["optional_questions"]},
            #             }
            #         )

            widgets.append({"type": "markdown", "value": "\n\n"})

            widgets.append({"type": "markdown", "selectable": False, "value": "\n\n"})
            if op.get("insights"):
                widgets.append({"type": "markdown", "value": "\n\n"})
                widgets.append({"type": "markdown", "value": "<b> Insights:<b>"})
                widgets.append({"type": "markdown", "value": op.get("insights")})

            # Autogen - Summary
            if op.get("is_summary_generated"):
                widgets.append(Config.autogen_summary_button_config)

            # Button to show Skip Resolution
            if op.get("skip_resolution_show"):
                widgets.append(Config.skip_resolution_button_config)

            # Button to proceed with the planner
            if op.get("show_planner_button"):
                widgets.append(Config.show_planner_button_config)

            # TODO: REPGPT CARDS
            # if stage == "completed" and required_socket_details["minerva_application_id"] in Config.repgpt_app_id:
            #     widgets.append({"type": "markdown", "value": "\n\n"})
            #     widgets.append(
            #         {
            #             "name": "Recommendations",
            #             "type": "recommendation-cards",
            #             "title": "",
            #             "value": {"items": Config.repgpt_main_pipeline_questions},
            #         }
            #     )

            # Final response
            response = {
                "type": "copilot",
                "copilot_response": [
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": reasoning},
                ],
                "planner_response": {
                    "plan": op.get("plan"),
                    "planned_function_list": op.get("planned_function_list"),
                    "current_step_idx": op.get("current_step_idx"),
                },
                "response": {
                    "stage": stage,
                    "question": op["question"],
                    "called_functions_list": op.get("called_functions_list"),
                    "widgets": None if widgets == [] else widgets,
                },
            }

            # Reason when the given question is Out of context
            if op.get("suggested_initial_questions"):
                # Out of context reasoning
                reasoning = op.get("reasoning")
                formatted_hint = f"""\n####Reason\n\n```\n{reasoning.strip()}\n```\n\n"""
                response["response"]["sql_query"] = formatted_hint

            # To show additional SQL query
            if generated_sql_query:
                formatted_hint = f"""\n#### SQL Query\n\n```sql\n{generated_sql_query.strip()}\n```\n\n"""
                response["response"]["sql_query"] = formatted_hint

            if data_table:
                response.update({"data_table": data_table})

            # In case the summary was generated, store it in the db - Autogen
            if op.get("is_summary_generated"):
                response.update({"copilot_summary": op.get("text")})

            # Actions for Simulator
            if op.get("actions"):
                response.update({"simulator_actions": op.get("actions")})

            # Insights for Simulator
            if op.get("insights"):
                response.update({"simulator_insights": op.get("insights")})

            return response
        except Exception as e:
            logging.error(e)
            raise (e)

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")

    def __parse_convo_history(self):
        convo_history = [
            "Question - " + convo.user_query + "\nAnswer - " + convo.minerva_response["response"]["sql_query"]
            for convo in self.history
            if convo.minerva_response["type"] == "sql" and "sql_query" in convo.minerva_response["response"]
        ]
        convo_history = "\n".join(convo_history)
        return convo_history

    def get_column_dict(self, dataframe_table):
        final_config_dict = {}
        final_config_dict["columns"] = []
        columns = dataframe_table.columns
        for c in columns:
            temp_obj = {
                "name": c,
                "datatype": dataframe_table[c].dtype.name,
                "table": "query_dataframe",
            }
            col_type = str(dataframe_table[c].dtype.name).lower()
            if col_type in ["int64", "float64"]:
                temp_obj["type"] = "continuous"
            elif col_type == "datetime64[ns]":
                temp_obj["type"] = "datetime"
            else:
                temp_obj["type"] = "categorical"
            final_config_dict["columns"].append(temp_obj)
        return final_config_dict

    def numpy_arrays_to_lists(self, data):
        if isinstance(data, dict):
            return {key: self.numpy_arrays_to_lists(value) for key, value in data.items()}
        elif isinstance(data, list):
            return [self.numpy_arrays_to_lists(item) for item in data]
        elif isinstance(data, np.ndarray):
            return data.tolist()
        else:
            return data
