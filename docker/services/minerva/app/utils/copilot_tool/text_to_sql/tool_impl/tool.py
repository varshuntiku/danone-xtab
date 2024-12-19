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

from tool_impl.charts.generate_df_widget import DataframeVizGenerator
from tool_impl.text_to_sql_utils import (
    config_generation,
    extract_sql_entities,
    fix_query_prompt,
    format_sql_query_markdown,
    generate_data_summary,
    generate_follow_up_question,
    generateWidgetTitle_test,
    query_sql_data,
    summarize_question_context,
    text_to_sql_prompt,
)
from utils.base_tool import BaseTool
from utils.llm_interface import LLMInterface  # noqa: F401
from utils.schema import (  # noqa: F401
    EntityObject,
    PreprocessResponse,
    PreprocessStatusMessage,
    QueryRun,
    ResponseObject,
    ValidationResponse,
)


class Tool(BaseTool):
    def run(self, query_info, user_info) -> QueryRun:
        # user_input_query = self.query_info["text_input"]  # noqa: F841
        # user_form_input = self.query_info["form_input"]  # noqa: F841
        # convo_history = self.query_info["convo_history"]  # noqa: F841
        # user_info = self.user_info  # noqa: F841
        user_input_query = query_info["text_input"]  # noqa: F841
        user_form_input = query_info["form_input"]  # noqa: F841
        convo_history = query_info["convo_history"]  # noqa: F841
        user_info = user_info  # noqa: F841
        tool_info = self.tool_info  # noqa: F841
        llm_config = self.llm_config  # noqa: F841
        copilot_info = self.copilot_info  # noqa: F841
        data_sources = self.data_sources  # noqa: F841
        # TO-DO - Add your code here
        try:
            llm_obj = LLMInterface(llm_config=llm_config[0])
            # extract required config of app
            memory_flag = tool_info["config"].get("conversation_memory", False)
            data_summary_flag = tool_info["config"].get("output_summary", False)
            app_context = tool_info["config"].get("additional_prompt", None)
            connection_string = data_sources[0]["config"].get("context_db_connection_uri", None)
            connection_schema = data_sources[0]["config"].get("context_db_connection_schema", None)
            sql_dialect = tool_info["config"]["preprocess_config"].get("dialect", "postgres")
            schema_info = tool_info["config"]["preprocess_config"]["schema"]
            max_retries = tool_info["config"].get("max_retries", 3)

            # add context to question based on convo history
            if memory_flag and len(convo_history) > 0:
                # await emit_query_processing_step(
                # "progress_message": "Generating relevant context for your query",
                modified_user_query = summarize_question_context(
                    convo_history=convo_history,
                    user_query=user_input_query,
                    llm=llm_obj.llm,
                )
            else:
                modified_user_query = user_input_query

            # check if query is answerable - only works with gpt 3.5 and above
            if memory_flag:
                # "progress_message": "Examining if the query can be answered using available data and context"
                follow_up_question = generate_follow_up_question(
                    schema_info=schema_info, context=app_context, user_query=modified_user_query, llm=llm_obj.llm
                )
                # return follow up question if available
                if follow_up_question is not None:
                    return {
                        "type": "sql",
                        "response": {
                            "text": follow_up_question["text"],
                            "hint": follow_up_question["hint"],
                            "widgets": None,
                            "processed_query": modified_user_query,
                        },
                    }
            # generate sql query
            # "progress_message": "Generating an SQL query for your query"
            sql_query = text_to_sql_prompt(
                schema_info=schema_info,
                context=app_context,
                dialect=sql_dialect,
                user_question=modified_user_query,
                llm=llm_obj.llm,
            )
            # end of preprocessing
            # for loop to fix query if error occurs, max retries var to set loop control
            # "progress_message": "Querying the data and generating visual results"
            for i in range(max_retries):
                query_result = query_sql_data(
                    sql_query=sql_query,
                    connection_string=connection_string,
                    schema=connection_schema,
                    dialect=sql_dialect,
                )
                if query_result["error"] is not None:
                    sql_query = fix_query_prompt(
                        schema_info=schema_info,
                        sql_query=sql_query,
                        error_message=query_result["error"],
                        llm=llm_obj.llm,
                        dialect=sql_dialect,
                    )
                    logging.info("Fixing query error, attempt number = " + str(i))
                else:
                    break

            # generate responses
            # check if query has an error
            if query_result["error"] is None:
                # check if query has a result
                if query_result["dataframe"].empty is False:
                    # generate widget title based on query
                    title = generateWidgetTitle_test(user_query=modified_user_query, llm=llm_obj.llm)
                    # generate visualizations
                    widget = DataframeVizGenerator(data_frame=query_result["dataframe"], title=title)
                    # "progress_message": "Generating a smart narrative based on the result"
                    query_text_summary = (
                        generate_data_summary(
                            llm=llm_obj.llm,
                            query=modified_user_query,
                            sql_query=sql_query,
                            df=query_result["dataframe"],
                        )
                        if data_summary_flag
                        else "What else would you like to know?"
                    )
                    formatted_hint = format_sql_query_markdown(sql_query)
                    entities = extract_sql_entities(query=sql_query, llm=llm_obj.llm)
                else:
                    query_text_summary = "Sorry, but I couldn't find any data based on your query. It's possible that the query parameters such as filters need adjustment. Please double-check your input or try a different query. If you have any specific requirements, feel free to provide more details, and I will my best to assist you."
                    formatted_hint = format_sql_query_markdown(sql_query)
                    widget = None
                    entities = None
            else:
                query_text_summary = "Oops! It seems like I am experiencing a technical issue while executing your query against the database. Our team has been notified, and we're working to resolve this issue as quickly as possible. It's possible that the data you're looking for isn't available in our database. In the meantime, you might try rephrasing your question or asking another question. I apologize for any inconvenience and appreciate your understanding."
                formatted_hint = format_sql_query_markdown(sql_query, error_message=query_result["error"])
                widget = None
                entities = None
            # return response
            citation = {"id": "sql", "type": "markdown", "data": formatted_hint}
            return QueryRun(
                response=ResponseObject(
                    text=query_text_summary,
                    hint=formatted_hint,
                    widgets=[widget.chart_objects] if widget is not None else None,
                    entities=entities,
                    processed_query=user_input_query,
                    citation=citation,
                )
            )
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
        tool_input_config = self.tool_info["input_config"]  # noqa: F841
        tool_config = self.tool_info["config"]  # noqa: F841

        # TO-DO - Add your code here

        return ValidationResponse(validation_flag=True, message="Tool config validated successfully")

    def tool_preprocess(self):
        """
        Add code here
        """
        try:
            tool_config = self.tool_info["config"]
            connection_string = self.data_sources[0]["config"].get("context_db_connection_uri", None)
            connection_schema = self.data_sources[0]["config"].get("context_db_connection_schema", None)
            table_list = tool_config.get("datasource_table", None)
            # table_list = tool_datasource_config[0]["config"].get("datasource_table", None)
            preprocess_config = config_generation(
                connection_string=connection_string, schema_name=connection_schema, tablename_list=table_list
            )
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
