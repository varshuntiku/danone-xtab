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

import plotly.graph_objects as go
from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.charts.generate_widget import WidgetGenerator

# from app.utils.socket.connection_events import emit_query_processing_step
from app.utils.tools.text_to_sql_utils import (
    download_csv,
    fix_query_prompt,
    generate_data_summary,
    generate_dataframe,
    generate_schema_csv,
    generateWidgetTitle_test,
    question_scope,
    text_to_sql_prompt,
)
from app.utils.tools.tool_utils import summarize_question_context
from langchain.tools import BaseTool
from sqlalchemy.orm import Session


class TextToSQL(BaseTool):
    llm: Any
    tool_config: dict
    history: List[MinervaConversationDBBase]
    max_retries: int = 3
    db: Session
    minerva_application_id: int
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None

    # Tool methods that have to be defined
    async def _run(self, query: str) -> dict:
        """Use the tool."""
        try:
            # extract required config of app
            memory_flag = self.tool_config.get("memory", False)
            app_context = self.tool_config["config"].get("additional_prompt", None)
            sql_dialect = self.tool_config["config"]["context"].get("dialect", "postgres")

            if self.tool_config["type"] == "csv_file":
                # csv data source
                document = download_csv(db=self.db, minerva_application_id=self.minerva_application_id)
                df_csv = generate_dataframe(document=document)
                schema_info = generate_schema_csv(dataframe=df_csv)
            else:
                # sql db
                schema_info = self.__parse_db_context()

            # add context to question based on convo history
            if memory_flag and len(self.history) > 0:
                # await emit_query_processing_step(
                #     room=self.user_info["email"],
                #     data={
                #         "progress_message": "Generating relevant context for your query",
                #         "query_trace_id": self.query_trace_id,
                #         "window_id": self.window_id,
                #     },
                # )
                modified_user_query = summarize_question_context(
                    convo_history=self.history,
                    user_query=query,
                    llm=self.llm,
                )
            else:
                modified_user_query = query

            # check if query is answerable
            if memory_flag:
                # await emit_query_processing_step(
                #     room=self.user_info["email"],
                #     data={
                #         "progress_message": "Examining if the query can be answered using available data and context",
                #         "query_trace_id": self.query_trace_id,
                #         "window_id": self.window_id,
                #     },
                # )
                scope_response = question_scope(
                    schema_info=schema_info,
                    context=app_context,
                    user_query=modified_user_query,
                    llm=self.llm,
                )
                if "<No>" in scope_response:
                    return {
                        "type": "sql",
                        "response": {
                            "text": "I'm unable to answer this question at the moment as this falls outside the realm of what I am equipped to do right now. Kindly ask me another question",
                            "sql_query": scope_response.replace("<No>", ""),
                            "widgets": None,
                            "processed_query": modified_user_query,
                        },
                    }
                elif "<Maybe>" in scope_response:
                    return {
                        "type": "sql",
                        "response": {
                            "text": scope_response.replace("<Maybe>", ""),
                            "sql_query": "",
                            "widgets": None,
                            "processed_query": modified_user_query,
                        },
                    }
            # generate sql query
            # await emit_query_processing_step(
            #     room=self.user_info["email"],
            #     data={
            #         "progress_message": "Generating an SQL query for your query",
            #         "query_trace_id": self.query_trace_id,
            #         "window_id": self.window_id,
            #     },
            # )
            sql_query = text_to_sql_prompt(
                schema_info=schema_info,
                context=app_context,
                dialect=sql_dialect,
                user_question=modified_user_query,
                llm=self.llm,
            )
            # preprocessing for vicuna output
            sql_query = " ".join(sql_query.split("\n")).replace("\\", "")
            # end of preprocessing
            # for loop to fix query if error occurs, max retries var to set loop control
            # await emit_query_processing_step(
            #     room=self.user_info["email"],
            #     data={
            #         "progress_message": "Querying the data and generating visual results",
            #         "query_trace_id": self.query_trace_id,
            #         "window_id": self.window_id,
            #     },
            # )
            for i in range(self.max_retries):
                widget = WidgetGenerator(
                    config=self.tool_config,
                    sql_query=sql_query,
                    user_query=modified_user_query,
                    query_dataframe=df_csv if self.tool_config["type"] == "csv_file" else None,
                )
                if widget.df is None:
                    sql_query = fix_query_prompt(
                        schema_info=schema_info,
                        sql_query=widget.sql_query,
                        error_message=widget.error,
                        llm=self.llm,
                        dialect=sql_dialect,
                    )
                    logging.info("Fixing query error, attempt number = " + str(i))
                new_title = generateWidgetTitle_test(user_query=modified_user_query, llm=self.llm)

                if "connected_system" in self.tool_config:
                    if self.tool_config["connected_system"]:
                        if len(widget.df) > 2:
                            cat_cols = 0
                            cont_cols = 0
                            for col_info in widget.metadata:
                                if col_info["dataType"] == "categorical":
                                    cat_cols += 1
                                elif col_info["dataType"] == "continuous":
                                    cont_cols += 1

                            if (
                                (cat_cols == 1 or cat_cols == 2)
                                and cont_cols > 1
                                and self.tool_config["name"] == "pricing_data"
                            ):
                                if cat_cols == 2 and "performance" in widget.df.columns[-1].lower():
                                    widget.df = widget.df.iloc[:, :-1]
                                traces = []
                                # Iterate over columns to create traces dynamically
                                for i, column in enumerate(
                                    widget.df.columns[1:]
                                ):  # Skip the first column assuming it's x-axis data
                                    trace = go.Bar(
                                        x=widget.df[widget.df.columns[0]].tolist(),
                                        y=widget.df[column].tolist(),
                                        name=column,
                                    )
                                    traces.append(trace)
                                # Add the traces to the figure
                                fig = go.Figure(data=traces)
                                fig.update_layout(barmode="group")
                                fig.update_layout(
                                    legend=dict(
                                        x=1,
                                        y=1.1,
                                        xanchor="auto",
                                        yanchor="auto",
                                        orientation="h",
                                        traceorder="normal",
                                        valign="top",
                                    )
                                )
                                chart = {
                                    "name": "grouped bar",
                                    "type": "chart",
                                    "title": widget.widgets[0]["title"],
                                    "value": fig.to_dict(),
                                }

                                widget.widgets.insert(0, chart)

                            if self.tool_config["name"] == "price_simulator":
                                if "performance" in widget.df.columns[-1].lower():
                                    df = widget.df.iloc[:, :-1]
                                else:
                                    df = widget.df
                                # Initialize figure
                                fig = go.Figure()
                                # Extract unique SKUs
                                unique_skus = df[df.columns[1]].unique()

                                # Add traces for each SKU
                                for sku in unique_skus:
                                    # filtered_df = df[df['SKU'] == sku]
                                    filtered_df = df[df[df.columns[1]] == sku]
                                    fig.add_trace(
                                        go.Scatter(
                                            x=filtered_df[filtered_df.columns[0]].to_numpy().tolist(),
                                            y=filtered_df[filtered_df.columns[2]].to_numpy().tolist(),
                                            mode="lines",
                                            name=f"Baseline {sku}",
                                            visible=(sku == unique_skus[0]),
                                        )
                                    )
                                    fig.add_trace(
                                        go.Scatter(
                                            x=filtered_df[filtered_df.columns[0]].to_numpy().tolist(),
                                            y=filtered_df[filtered_df.columns[3]].to_numpy().tolist(),
                                            mode="lines",
                                            name=f"Updated {sku}",
                                            visible=(sku == unique_skus[0]),
                                        )
                                    )
                                # Create buttons for each SKU
                                buttons = []
                                for sku in unique_skus:
                                    buttons.append(
                                        dict(
                                            label=sku,
                                            method="update",
                                            args=[
                                                {
                                                    "visible": [
                                                        (sku == trace_sku)
                                                        for trace_sku in unique_skus
                                                        for _ in range(2)
                                                    ]
                                                },
                                                # {'title': f'Sales Data for {sku}'}
                                            ],
                                        )
                                    )

                                # Update layout with buttons
                                fig.update_layout(
                                    updatemenus=[dict(active=0, buttons=buttons)],
                                    title=f"Sales Data for {unique_skus[0]}",
                                    xaxis_title="Date",
                                    yaxis_title="Sales",
                                )
                                fig.update_layout(
                                    legend=dict(
                                        x=1,
                                        y=1.1,
                                        xanchor="auto",
                                        yanchor="auto",
                                        orientation="h",
                                        traceorder="normal",
                                        valign="top",
                                    )
                                )
                                chart = {
                                    "name": "Multiline chart",
                                    "type": "chart",
                                    "title": widget.widgets[0]["title"],
                                    "value": fig.to_dict(),
                                }

                                widget.widgets.insert(0, chart)

                # Replace with the desired new title
                for item in widget.widgets:
                    item["title"] = new_title
                else:
                    break

            # await emit_query_processing_step(
            #     data={
            #         "output": {
            #             "type": "sql",
            #             "response": {
            #                 "widgets": [widget.widgets] if widget is not None else None,
            #             },
            #         },
            #         "query_trace_id": self.query_trace_id,
            #         "window_id": self.window_id,
            #     },
            #     room=self.user_info["email"],
            # )

        except Exception as e:
            logging.error(e)
            widget = None
        # TODO - update error message
        if widget is None or widget.df is None:
            query_text_summary = "I'm sorry, I am unable to answer this question at the moment."
            formatted_hint = "No hints available!"
        else:
            query_text_summary = "What else would you like to know?"
            if self.tool_config.get("data_summary", False):
                # await emit_query_processing_step(
                #     data={
                #         "progress_message": "Generating a smart narrative based on the result",
                #         "query_trace_id": self.query_trace_id,
                #         "window_id": self.window_id,
                #     },
                #     room=self.user_info["email"],
                # )
                query_text_summary = generate_data_summary(
                    llm=self.llm,
                    query=modified_user_query,
                    sql_query=sql_query,
                    df=widget.df,
                )
            formatted_hint = f"""
#### SQL Query

```sql
{sql_query.strip()}
```

"""
        return {
            "type": "sql",
            "response": {
                "text": query_text_summary,
                "sql_query": formatted_hint,
                "widgets": [widget.widgets] if widget is not None else None,
                "processed_query": modified_user_query,
            },
        }

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")

    def __parse_db_context(self):
        table_metadata_dict = {}
        table_metadata_list = []
        for tab in self.tool_config["config"]["context"]["table_config"]:
            if tab["enabled"]:
                table_metadata_dict[tab["name"]] = []
        for col in self.tool_config["config"]["context"]["columns"]:
            if col["table"] in table_metadata_dict:
                table_metadata_dict[col["table"]].append({"name": col["name"], "data_type": col["type"]})

        table_metadata_list = [{"name": key, "columns": value} for key, value in table_metadata_dict.items()]
        message = ""
        if "schema" in self.tool_config["config"]["context"]:
            message = self.tool_config["config"]["context"]["schema"]
        else:
            for tab in table_metadata_list:
                columns_str = [
                    col["name"] + "(Date)" if col["data_type"] == "datetime" else col["name"] for col in tab["columns"]
                ]
                columns_str = ",".join(columns_str)
                message += f"Table = {tab['name']} Columns = {columns_str}" + "\n"
        return message

    def __parse_convo_history(self):
        convo_history = [
            "User Question - " + convo.user_query + "\nSystem Response - " + convo.minerva_response["response"]["text"]
            for convo in self.history
            if convo.minerva_response["type"] == "sql" and "sql_query" in convo.minerva_response["response"]
        ]
        convo_history = "\n".join(convo_history)
        return convo_history
