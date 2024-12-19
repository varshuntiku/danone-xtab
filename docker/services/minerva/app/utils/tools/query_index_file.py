#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import Any, List

from app.schemas.minerva_conversation_schema import MinervaConversationDBBase
from app.utils.config import get_settings

# from app.utils.socket.connection_events import emit_query_processing_step
from app.utils.tools.download_zip_from_blob_utils import download_from_blob
from langchain.chains import ConversationalRetrievalChain
from langchain.tools import BaseTool
from langchain_community.vectorstores import FAISS

settings = get_settings()


class QueryIndexFile(BaseTool):
    llm: Any
    tool_config: dict
    return_direct: bool = True
    history: List[MinervaConversationDBBase]
    name: str
    description: str
    embedding: Any
    query_trace_id: str = None
    window_id: int = None
    user_info: dict = None

    # Tool methods that have to be defined
    async def _run(self, query: str) -> str:
        """Use the tool."""
        # download file from blob if not already downloaded
        # await emit_query_processing_step(
        #     room=self.user_info["email"],
        #     data={
        #         "progress_message": "Loading index file",
        #         "query_trace_id": self.query_trace_id,
        #         "window_id": self.window_id,
        #     },
        # )
        self.download_index_file()
        # initialise embeddings
        embeddings = self.embedding
        # load vector db
        store = FAISS.load_local("./indexes/" + self.tool_config["config"]["index_name"].split(".zip")[0], embeddings)
        # query vector db
        vector_chain_obj = ConversationalRetrievalChain.from_llm(
            llm=self.llm, retriever=store.as_retriever(), return_source_documents=False
        )
        chat_history = [
            (convo.user_query, convo.minerva_response["response"]["text"])
            for convo in self.history
            if convo.minerva_response["type"] == "index_file"
        ]
        # await emit_query_processing_step(
        #     room=self.user_info["email"],
        #     data={
        #         "progress_message": "Retriving result",
        #         "query_trace_id": self.query_trace_id,
        #         "window_id": self.window_id,
        #     },
        # )
        result = vector_chain_obj({"question": query, "chat_history": chat_history})
        response = {
            "type": "index_file",
            "response": {"text": result["answer"] if "answer" in result else "I am unable to answer the question"},
        }
        return response

    async def _arun(self, query: str) -> str:
        """Use the tool asynchronously."""
        raise NotImplementedError("Does not support async")

    def download_index_file(self):
        download_from_blob(self.tool_config["config"]["index_name"])
