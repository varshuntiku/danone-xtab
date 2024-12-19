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

from tool_impl.App_config import AppConfig
from tool_impl.database_operations.table_operations import (
    get_latest_status_copilot_tool,
    insert_status_records,
    unstructured_database_model_generation,
)
from tool_impl.generate_token import generate_token
from tool_impl.pipeline_engine.main import run_pipeline
from tool_impl.unstructred_query_utils import (
    Embedding_Vector_Retriever,
    extract_metadata_bulk_upload,
    summarize_question_context,
)
from utils.base_tool import BaseTool
from utils.embedding_interface import EmbeddingInterface
from utils.llm_interface import LLMInterface  # noqa: F401
from utils.schema import (  # noqa: F401
    EntityObject,
    PipelineStatus,
    PreprocessResponse,
    PreprocessStatusMessage,
    QueryRun,
    ResponseObject,
    ValidationResponse,
)

app_config = AppConfig()


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
        llm_config = self.llm_config[0]  # noqa: F841
        embedding_config = self.llm_config[1]  # noqa: F841
        copilot_info = self.copilot_info  # noqa: F841
        data_sources = self.data_sources  # noqa: F841

        try:
            llm_obj = LLMInterface(llm_config=llm_config).llm
            embedding_obj = EmbeddingInterface(embedding_config=embedding_config).embedding
            memory_flag = tool_info["config"].get("memory", False)
            database_connection_string = app_config.database_connection_string
            database_schema_name = app_config.database_schema_name
            azure_storage_connection_string = app_config.azure_storage_connection_string
            image_unstructured_container_name = app_config.image_unstructured_container_name
            copilot_tool_id = tool_info.get("copilot_tool_id", None)
            data_source_feature = tool_info.get("config").get("additional_features")
            var_image_limit_no = int(app_config.image_limit_no)

            if copilot_tool_id is None:
                raise Exception("Copilot tool id not present")

            if memory_flag and len(convo_history) > 0:
                modified_user_query = summarize_question_context(
                    convo_history=convo_history,
                    user_query=user_input_query,
                    llm=llm_obj,
                )
            else:
                modified_user_query = user_input_query
            try:
                Retriever_object = Embedding_Vector_Retriever(
                    llm_model=llm_obj,
                    embedding_model=embedding_obj,
                    copilot_tool_id=copilot_tool_id,
                    image_limit_no=var_image_limit_no,
                    database_connection_string=database_connection_string,
                    database_schema_name=database_schema_name,
                    azure_storage_connection_string=azure_storage_connection_string,
                    image_unstructured_container_name=image_unstructured_container_name,
                )
            except Exception as e:
                logging.error("Error in assigning Embedding Vector Class Object.")
                logging.error(e)

            try:
                result, has_source_image, para_citation_result = Retriever_object.run_query(modified_user_query)
            except Exception as e:
                logging.error("Error in getting response and source images.")
                logging.error(e)

            if has_source_image:
                widgets = []
                if para_citation_result is None:
                    widgets.append({"type": "text", "value": result[0]})
                else:
                    for index, para_meta in enumerate(para_citation_result):
                        for citation_data in para_meta[1]:
                            citation_data.update(
                                {
                                    "source_url": extract_metadata_bulk_upload(
                                        {"file_name": citation_data["name"]}, data_source_feature
                                    )
                                }
                            )
                        widgets.append(
                            {
                                "type": "text",
                                "value": para_meta[0],
                                "citation": {"id": str(index), "type": "ppt", "data": para_meta[1]},
                            }
                        )
                # sql_query = "####Source References:\n\n"
                # list_images_url_html = []
                # for key, value in result[1].items():
                #     if data_source_feature:
                #         url = extract_metadata_bulk_upload({'file_name': key}, data_source_feature)
                #     else:
                #         url = None
                #     for val in value:
                #         if val[0] is not None:
                #             list_images_url_html.append(
                #                 {"url": f"private:{val[0]}", "caption": "Slide Number : " + str(val[1]), "source_link": url}
                #             )
                #         else:
                #             list_images_url_html.append(
                #                 {"url": "", "caption": "Slide Number : " + str(val[1]), "source_link": url}
                #             )
                # sql_query += (
                #     f"""<ImageList params="{urllib.parse.quote(json.dumps(list_images_url_html))}" width="22em" />"""
                # )
                response = ResponseObject(text="", widgets=widgets, processed_query=modified_user_query, hint=None)
            else:
                response = ResponseObject(text=result, processed_query=modified_user_query)
            return QueryRun(response=response)

        except Exception as e:
            logging.error(e)
            return QueryRun(
                response=ResponseObject(
                    text="Oops! I am experiencing technical difficulties at the moment and am unable to fulfill your request. Our team has been alerted, and we're working hard to fix the issue. In the meantime, you might try rephrasing your question or checking back later. Thank you for your patience.",
                    processed_query=user_input_query,
                )
            )

    def validate_tool_config(self) -> ValidationResponse:
        """
        This method is called to validate your tool config and return True or False
        """
        tool_input_config = self.tool_info["input_config"]  # noqa: F841
        tool_config = self.tool_info["config"]  # noqa: F841
        validation_flag = True
        message = "Tool config validated successfully"

        return ValidationResponse(validation_flag=validation_flag, message=message)

    def tool_preprocess(self) -> PreprocessResponse:
        """
        This method is called to preprocess tool config provided by user and return preprocess_config dictionary
        """
        try:
            llm_config = self.llm_config[0]  # noqa: F841
            embedding_config = self.llm_config[1]  # noqa: F841
            pipeline_name = app_config.pipeline_name
            database_connection_string = app_config.database_connection_string
            database_schema_name = app_config.database_schema_name
            temp_folder_env_separator = app_config.temp_folder_env_separator
            copilot_tool_id = self.tool_info["copilot_tool_id"]
            blob_connection_url = app_config.azure_storage_connection_string
            config_container_name = app_config.config_container_name
            image_container_name = app_config.image_unstructured_container_name
            env_config = app_config.env_config
            data_source = self.data_sources

            try:
                unstructured_database_model_generation(database_schema_name, database_connection_string)
            except Exception as e:
                logging.error("Error in generation of UDQ tables")
                logging.error(e)

            try:
                latest_status = get_latest_status_copilot_tool(
                    copilot_tool_id, database_connection_string, database_schema_name
                )
            except Exception as e:
                logging.error("Error in fetching latest pipeline status")
                logging.error(e)

            if latest_status is None or latest_status.job_status not in [
                PipelineStatus.Triggered,
                PipelineStatus.Started,
            ]:
                image_blob_metadata = {
                    "container_name": image_container_name,
                    "blob_connection_url": blob_connection_url,
                }

                pipeline_authentication_token = generate_token()
                try:
                    status, pipeline_status_dict = run_pipeline(
                        pipeline_name,
                        database_connection_string,
                        pipeline_authentication_token,
                        database_schema_name,
                        image_blob_metadata,
                        temp_folder_env_separator,
                        env_config,
                        llm_config,
                        embedding_config,
                        copilot_tool_id,
                        blob_connection_url,
                        config_container_name,
                        data_source,
                        self.copilot_env.get("base_url"),
                        self.copilot_tool_auth_token,
                    )
                except Exception as e:
                    logging.error("Error in Triggering UDQ Pipeline")
                    logging.error(e)
                    status = False

                if status:
                    insert_status_records(pipeline_status_dict, database_connection_string, database_schema_name)
                    preprocess_status = PreprocessStatusMessage.InProgress
                    preprocess_message = "Preprocessing Triggered successfully"
                else:
                    preprocess_status = PreprocessStatusMessage.Failed
                    preprocess_message = "Failed in Triggering UDQ Pipeline"
            else:
                preprocess_status = PreprocessStatusMessage.InProgress
                preprocess_message = "Preprocessing Failed, Pipeline is already in progress."
            return PreprocessResponse(
                status=preprocess_status,
                preprocess_config=None,
                message=preprocess_message,
            )
        except Exception as e:
            logging.error(e)
            return PreprocessResponse(
                status=PreprocessStatusMessage.Failed,
                preprocess_config=None,
                message=str(e),
            )
