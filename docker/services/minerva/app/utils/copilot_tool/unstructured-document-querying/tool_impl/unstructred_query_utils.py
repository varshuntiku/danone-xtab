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
# import base64

# import plotly.graph_objects as go
import logging

import openai  # noqa F401
import psycopg2
from azure.storage.blob import BlobServiceClient
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.retrievers.multi_query import MultiQueryRetriever
from psycopg2 import sql
from tool_impl.citation_udq import response_fact_check
from tool_impl.custom_pgvector_new import PGVector
from tool_impl.database_operations.table_operations import get_documents_copilot_tool
from tool_impl.storage_util import StorageServiceClient, StorageType


class Embedding_Vector_Retriever:
    def __init__(
        self,
        llm_model,
        embedding_model,
        copilot_tool_id: int,
        image_limit_no: int,
        database_connection_string: str,
        database_schema_name: str,
        azure_storage_connection_string: str,
        image_unstructured_container_name: str,
    ):
        self.llm_model = llm_model
        self.embedding_model = embedding_model
        self.copilot_tool_id = copilot_tool_id
        self.pgvector_object = None
        self.retriever_object = None
        self.retriever_object_multiquery = None
        self.image_limit_no = 2 if image_limit_no is None else image_limit_no
        self.database_connection_string = database_connection_string
        self.database_schema_name = database_schema_name
        self.azure_storage_connection_string = azure_storage_connection_string
        self.image_unstructured_container_name = image_unstructured_container_name

    def func_pgvector_object(self):
        db_pgvector = PGVector.from_documents(
            embedding=self.embedding_model,
            documents=[],
            collection_name=str(self.copilot_tool_id),
            connection_string=self.database_connection_string,
            schema_name=self.database_schema_name,
        )

        self.pgvector_object = db_pgvector

    def func_retriever_object(self):
        if self.pgvector_object is None:
            self.func_pgvector_object()
        retriever = self.pgvector_object.as_retriever(search_kwargs={"k": 10})

        retriever_multiquery = MultiQueryRetriever.from_llm(
            retriever=self.pgvector_object.as_retriever(search_kwargs={"k": 10}), llm=self.llm_model
        )

        template = """Answer the user question based on the content provided below: Content: {context} \n If the content doesn’t have the answer for the user asked question. Please respond with Sorry, I am unable to answer your query.
        Question: {question}
        Helpful Answer:"""
        QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

        qa_pgvector = RetrievalQA.from_chain_type(
            llm=self.llm_model,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True,
            chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
        )
        qa_pgvector_multiquery = RetrievalQA.from_chain_type(
            llm=self.llm_model,
            chain_type="stuff",
            retriever=retriever_multiquery,
            return_source_documents=True,
            chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
        )
        self.retriever_object_multiquery = qa_pgvector_multiquery
        self.retriever_object = qa_pgvector

    def get_document_name(self, source_documents):
        source_documents_new = []
        documents_info = get_documents_copilot_tool(
            self.database_connection_string, self.database_schema_name, self.copilot_tool_id
        )
        for doc in source_documents:
            if doc.metadata.get("doc_name") is None:
                for i in documents_info:
                    if i.id == doc.metadata.get("copilot_document_id"):
                        file_name = i.name
                        break
            else:
                file_name = doc.metadata.get("doc_name")
            doc.metadata.update({"doc_name": file_name})
            source_documents_new.append(doc)
        return source_documents_new

    def get_images(self, source_documents):
        temp_img_list = []
        image_names_dict = {}
        try:
            temp_document_added = []
            for doc in source_documents:
                if len(temp_img_list) >= self.image_limit_no:
                    break
                if (
                    doc.metadata.get("copilot_document_id") is not None
                    and doc.metadata.get("copilot_document_id") not in temp_document_added
                ):
                    temp_document_added.append(doc.metadata.get("copilot_document_id"))
                    if image_names_dict.get(doc.metadata.get("copilot_document_id")) is None:
                        file_name = doc.metadata.get("doc_name")
                        image_names_dict[doc.metadata.get("copilot_document_id")] = {
                            "file_name": file_name,
                            "page_slide_detail": [],
                        }
                if doc.metadata.get("image_name") is not None and doc.metadata.get("image_name") not in temp_img_list:
                    temp_img_list.append(doc.metadata.get("image_name"))
                    image_names_dict[doc.metadata.get("copilot_document_id")]["page_slide_detail"].append(
                        {
                            "image": doc.metadata.get("image_name"),
                            "slide_number": doc.metadata.get("slide_number"),
                            "page_number": doc.metadata.get("page_number"),
                        }
                    )
        except Exception as e:
            logging.error("Error in getting images dictionary.")
            logging.error(e)
        if temp_img_list == []:
            return None
        else:
            return image_names_dict

    def image_exists(self, image_name):
        try:
            blob_service_client = BlobServiceClient.from_connection_string(self.azure_storage_connection_string)
            container_client = blob_service_client.get_container_client(self.image_unstructured_container_name)
            blob_client = container_client.get_blob_client(image_name)
            blob_client.get_blob_properties()
            return True
        except Exception as e:
            logging.warning(e)
            return False

    def get_image_urls(self, response, images):
        image_urls_objects = {}
        connection_string = self.azure_storage_connection_string
        container_name = self.image_unstructured_container_name
        storage_client = StorageServiceClient.get_storage_client(StorageType.AZURE_BLOB, conn_str=connection_string)
        for image in images.values():
            try:
                if image_urls_objects.get(image["file_name"]) is None:
                    image_urls_objects[image["file_name"]] = []
                for img in image["page_slide_detail"]:
                    blob_name = img["image"]
                    url_blob = storage_client.get_private_url(container_name, blob_name)
                    if img["slide_number"]:
                        image_urls_objects[image["file_name"]].append([url_blob, img["slide_number"]])
                    else:
                        image_urls_objects[image["file_name"]].append([url_blob, img["page_number"]])
            except Exception as e:
                logging.error("Error in generation of image url for image name :- " + image["file_name"])
                logging.error(e)
        return [response, image_urls_objects]

    def get_citation_response(self, result):
        try:
            paragraph_citation_mapping = response_fact_check().map_response_chunk_to_source_slide(result)
            para_citation_result = []
            storage_client = StorageServiceClient.get_storage_client(
                StorageType.AZURE_BLOB, conn_str=self.azure_storage_connection_string
            )
            for para_mapping in paragraph_citation_mapping:
                citation_data_list = []
                for img_meta in para_mapping[1]:
                    citation_data_list.append(
                        {
                            "name": img_meta.get("doc_name"),
                            "source_url": None,
                            "img_url": storage_client.get_private_url(
                                self.image_unstructured_container_name, img_meta.get("image_name")
                            ),
                        }
                    )
                para_citation_result.append([para_mapping[0], citation_data_list])
            return para_citation_result
        except Exception as e:
            logging.warning(e)
            return None

    def run_query(self, user_query: str) -> str:
        try:
            if self.retriever_object is None:
                self.func_retriever_object()
        except Exception as e:
            logging.error("Error in creation of embedding vector and retriever object.")
            raise Exception(e)
        try:
            result = self.retriever_object({"query": user_query})
        except Exception as e:
            logging.error("Error in getting response from retriever.")
            raise Exception(e)
        response = result["result"]
        first_ten_words = " ".join(response.lower().split(" ")[:10])
        dont_keywords = ["do not", "don't", "does not", "doesn't"]
        other_keywords = ["sorry", "context", "provide", "information"]
        if any(keyword in first_ten_words for keyword in dont_keywords) and any(
            keyword in first_ten_words for keyword in other_keywords
        ):
            try:
                result = self.retriever_object_multiquery({"query": user_query})
                response = result["result"]
            except Exception as e:
                logging.error("Error in getting response from multi query.")
                raise Exception(e)
        result["source_documents"] = self.get_document_name(result["source_documents"])
        images = self.get_images(result["source_documents"])
        if images is None:
            return response, False, None
        else:
            # image_urls_temp = self.get_image_urls(response, images)
            citation_result = self.get_citation_response(result)
            return [response], True, citation_result


def summarize_question_context(convo_history, user_query, llm):
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
    result = str(llm.invoke(context_template).content)
    return result


def parse_convo_history(convo_history_obj):
    convo_history = [
        "User Question - " + convo.user_query + "\nSystem Response - " + convo.minerva_response["response"]["text"]
        for convo in convo_history_obj
    ]
    convo_history = "\n".join(convo_history)
    return convo_history


def extract_cognition(file_name, connection_string, table_name, schema_name):
    try:
        connection = psycopg2.connect(connection_string)
        cursor = connection.cursor()
        query = sql.SQL("""SELECT url FROM {}.{} WHERE name = %s;""").format(
            sql.Identifier(schema_name), sql.Identifier(table_name)
        )
        cursor.execute(query, (file_name,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result[0] if result else None

    except Exception as e:
        print(f"Error: {e}")
        return None


def extract_metadata_bulk_upload(data, data_source_feature):
    if data_source_feature:
        for feature in data_source_feature:
            if feature.get("feature_type") and feature.get("feature_type").lower() == "cognition":
                return extract_cognition(
                    data["file_name"],
                    feature["connection_string"],
                    feature["table_name"],
                    feature["schema_name"],
                )
