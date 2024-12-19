# import base64

# import plotly.graph_objects as go
import logging

from app.db.crud.minerva_document_crud import minerva_document
from app.utils.config import get_settings
from app.utils.tools.query_unstructured_files_utils.custom_pgvector import PGVector
from azure.storage.blob import BlobServiceClient
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.retrievers.multi_query import MultiQueryRetriever
from sqlalchemy.orm import Session

settings = get_settings()


class Embedding_Vector_Retriever:
    def __init__(self, llm_model, embedding_model, minerva_application_id: int, db: Session, image_limit_no: int):
        self.llm_model = llm_model
        self.embedding_model = embedding_model
        self.minerva_application_id = minerva_application_id
        self.pgvector_object = None
        self.retriever_object = None
        self.retriever_object_multiquery = None
        self.db = db
        self.image_limit_no = 2 if image_limit_no is None else image_limit_no

    def func_pgvector_object(self):
        db_pgvector = PGVector.from_documents(
            embedding=self.embedding_model,
            documents=[],
            collection_name=str(self.minerva_application_id),
            connection_string=settings.VECTOR_EMBEDDING_CONNECTION_STRING,
            schema_name=settings.UNSTRUCTURED_SCHEMA_NAME,
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

    def get_images(self, source_documents):
        temp_img_list = []
        image_names_dict = {}
        temp_document_added = []
        documents_info = minerva_document.get_documents(self.db, minerva_application_id=self.minerva_application_id)
        for doc in source_documents:
            if len(temp_img_list) >= self.image_limit_no:
                break
            if (
                doc.metadata.get("minerva_document_id") is not None
                and doc.metadata.get("minerva_document_id") not in temp_document_added
            ):
                temp_document_added.append(doc.metadata.get("minerva_document_id"))
                if image_names_dict.get(doc.metadata.get("minerva_document_id")) is None:
                    for i in documents_info:
                        if i.id == doc.metadata.get("minerva_document_id"):
                            file_name = i.name
                    image_names_dict[doc.metadata.get("minerva_document_id")] = {
                        "file_name": file_name,
                        "slide_details": [],
                    }
            if doc.metadata.get("image_name") is not None and doc.metadata.get("image_name") not in temp_img_list:
                temp_img_list.append(doc.metadata.get("image_name"))
                image_names_dict[doc.metadata.get("minerva_document_id")]["slide_details"].append(
                    {
                        "image": doc.metadata.get("image_name"),
                        "slide_number": doc.metadata.get("slide_number"),
                    }
                )
        if temp_img_list == []:
            return None
        else:
            return image_names_dict

    def image_exists(self, image_name):
        try:
            blob_service_client = BlobServiceClient.from_connection_string(settings.AZURE_STORAGE_CONNECTION_STRING)
            container_client = blob_service_client.get_container_client(settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME)
            blob_client = container_client.get_blob_client(image_name)
            blob_client.get_blob_properties()
            return True
        except Exception as e:
            logging.warning(e)
            return False

    def get_image_urls(self, response, images):
        image_urls_objects = {}
        connection_string = settings.AZURE_STORAGE_CONNECTION_STRING
        container_name = settings.IMAGE_UNSTRUCTURED_CONTAINER_NAME
        blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        for image in images.values():
            if image_urls_objects.get(image["file_name"]) is None:
                image_urls_objects[image["file_name"]] = []
            for img in image["slide_details"]:
                blob_name = img["image"]
                url_blob = (
                    f"https://{blob_service_client.account_name}.blob.core.windows.net/{container_name}/{blob_name}"
                )
                image_urls_objects[image["file_name"]].append([url_blob, img["slide_number"]])
        return [response, image_urls_objects]

    def run_query(self, user_query: str) -> str:
        if self.retriever_object is None:
            self.func_retriever_object()
        result = self.retriever_object({"query": user_query})
        response = result["result"]
        first_ten_words = " ".join(response.lower().split(" ")[:10])
        dont_keywords = ["do not", "don't", "does not", "doesn't"]
        other_keywords = ["sorry", "context", "provide", "information"]
        if any(keyword in first_ten_words for keyword in dont_keywords) and any(
            keyword in first_ten_words for keyword in other_keywords
        ):
            result = self.retriever_object_multiquery({"query": user_query})
            response = result["result"]
        images = self.get_images(result["source_documents"])
        if images is None:
            return response, False
        else:
            image_urls_temp = self.get_image_urls(response, images)
            return image_urls_temp, True
