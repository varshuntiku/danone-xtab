#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import json
import urllib.parse
from typing import Any, List

from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.config import get_settings

# from app.utils.socket.connection_events import emit_query_processing_step
from app.utils.tools.metadata_fetch_unstructured import extract_metadata_bulk_upload
from app.utils.tools.query_unstructured_files_utils.model_classes import (
    Embedding_Vector_Retriever,
)
from app.utils.tools.tool_utils import summarize_question_context
from langchain.tools import BaseTool
from sqlalchemy.orm import Session

settings = get_settings()


class DocumentQuery(BaseTool):
    llm: Any
    embedding: Any
    minerva_app_id: int
    tool_config: dict
    return_direct: bool = True
    history: List[MinervaConversationDBBase]
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None
    db: Session = None

    # Tool methods that have to be defined
    async def _run(self, query: str) -> str:
        """Use the tool."""

        minerva_application_id = self.minerva_app_id

        # add context to question based on convo history
        memory_flag = self.tool_config.get("memory", False)
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

        # await emit_query_processing_step(
        #     room=self.user_info["email"],
        #     data={
        #         "progress_message": "Retrieving relevant content based on your query & Summarizing information",
        #         "query_trace_id": self.query_trace_id,
        #         "window_id": self.window_id,
        #     },
        # )
        Retriever_object = Embedding_Vector_Retriever(
            llm_model=self.llm,
            embedding_model=self.embedding,
            minerva_application_id=minerva_application_id,
            db=self.db,
            image_limit_no=self.tool_config.get("image_limit_no"),
        )

        result, has_source_image = Retriever_object.run_query(modified_user_query)

        if has_source_image:
            widgets = []
            widgets.append({"type": "text", "value": result[0]})
            sql_query = "####Source References:\n\n"
            list_images_url_html = []
            for key, value in result[1].items():
                if self.tool_config.get("bluk_upload_metadata"):
                    url = extract_metadata_bulk_upload(key, self.tool_config.get("bluk_upload_metadata"))
                else:
                    url = None
                for val in value:
                    if val[0] is not None:
                        list_images_url_html.append(
                            {"url": f"private:{val[0]}", "caption": "Slide Number : " + str(val[1]), "source_link": url}
                        )
                    else:
                        list_images_url_html.append(
                            {"url": "", "caption": "Slide Number : " + str(val[1]), "source_link": url}
                        )
            sql_query += (
                f"""<ImageList params="{urllib.parse.quote(json.dumps(list_images_url_html))}" width="22em" />"""
            )
            response = {
                "type": "index_file",
                "response": {
                    "widgets": widgets,
                    "processed_query": modified_user_query,
                    "sql_query": sql_query,
                },
            }
        else:
            response = {
                "type": "index_file",
                "response": {"text": result, "processed_query": modified_user_query},
            }
        return response

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")
