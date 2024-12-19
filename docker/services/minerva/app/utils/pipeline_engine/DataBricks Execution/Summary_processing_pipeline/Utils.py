import concurrent.futures  # noqa: F401
import logging
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import cpu_count
from typing import Dict

import Loader_classes.base_class as base_class
import Loader_classes.Loader_classes as Loader_classes  # noqa: F401
from custom_pgvector import PGVector
from pydantic import parse_obj_as


class Loaderfactory:
    minerva_file_metadata: Dict
    embedding_pgvector_metadata: Dict
    temp_folder_path_preprocessing: str

    def __init__(self, minerva_file_metadata, embedding_pgvector_metadata, temp_folder_path_preprocessing):
        parse_obj_as(base_class.MinervaApplicationDocuments, minerva_file_metadata)
        self.minerva_file_metadata = minerva_file_metadata
        self.embedding_pgvector_metadata = embedding_pgvector_metadata
        self.temp_folder_path_preprocessing = temp_folder_path_preprocessing

    def get_document_loader_class(self, file_url, llm_obj, app_id, document_id):
        file_extension = file_url.split(".")[-1].split("?")[0]
        loader_factory_class = base_class.loader_registry[file_extension]
        return loader_factory_class().load(file_url, llm_obj, app_id, document_id, self.temp_folder_path_preprocessing)

    def load_documents(self, llm_obj, doc_detail):
        document_store = []
        document_chunks = self.get_document_loader_class(
            doc_detail["url"],
            llm_obj,
            self.minerva_file_metadata["minerva_application_id"],
            doc_detail["minerva_document_id"],
        )
        if document_chunks == []:
            return doc_detail["minerva_document_id"]
        else:
            try:
                for doc in document_chunks:
                    doc.metadata.update({"minerva_document_id": doc_detail["minerva_document_id"]})
                    document_store.append(doc)
                self.add_files_vector_db(
                    document_store,
                    str(self.minerva_file_metadata["minerva_application_id"]),
                    self.embedding_pgvector_metadata["CONNECTION_STRING"],
                    self.embedding_pgvector_metadata["embedding_model"],
                    self.embedding_pgvector_metadata["unstructured_schema_name"],
                )
                return None
            except Exception as e:
                logging.warning(e)
                return doc_detail["minerva_document_id"]

    def load_files(self, llm_obj):
        not_processed_documents = []

        num_cpus = cpu_count()
        with ProcessPoolExecutor(max_workers=num_cpus) as executor:
            results2 = list(
                executor.map(
                    self.load_documents,
                    [llm_obj] * len(self.minerva_file_metadata["documents"]),
                    self.minerva_file_metadata["documents"],
                )
            )
        for doc_id in results2:
            if doc_id is not None:
                not_processed_documents.append(doc_id)
        # for doc_detail in self.minerva_file_metadata["documents"]:
        #     result = self.load_documents(llm_obj, doc_detail)
        #     if result is not None:
        #         not_processed_documents.append(result)

        print(not_processed_documents)
        return not_processed_documents

    def add_files_vector_db(
        self, Document_list, COLLECTION_NAME, CONNECTION_STRING, embedding_model, unstructured_schema_name
    ):
        db_pgvector = PGVector.from_documents(
            embedding=embedding_model,
            documents=Document_list,
            collection_name=COLLECTION_NAME,
            connection_string=CONNECTION_STRING,
            schema_name=unstructured_schema_name,
        )
        return db_pgvector
