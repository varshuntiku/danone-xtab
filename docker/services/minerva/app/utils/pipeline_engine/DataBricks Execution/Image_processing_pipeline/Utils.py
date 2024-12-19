import concurrent.futures  # noqa: F401
import copy
from concurrent.futures import ProcessPoolExecutor
from multiprocessing import cpu_count
from typing import Dict

import Loader_classes.base_class as base_class
import Loader_classes.Loader_classes as Loader_classes  # noqa: F401
from pydantic import parse_obj_as


class Loaderfactory:
    minerva_file_metadata: Dict
    blob_Metadata: Dict

    def __init__(self, minerva_file_metadata, blob_Metadata, temp_folder_path_preprocessing):
        parse_obj_as(base_class.MinervaApplicationDocuments, minerva_file_metadata)
        self.minerva_file_metadata = minerva_file_metadata
        self.blob_Metadata = blob_Metadata
        self.temp_folder_path_preprocessing = temp_folder_path_preprocessing

    def get_document_loader_class(self, file_url, app_id, document_id):
        file_extension = file_url.split(".")[-1].split("?")[0]
        loader_factory_class = base_class.loader_registry[file_extension]
        return loader_factory_class().load(
            file_url, app_id, document_id, self.blob_Metadata, self.temp_folder_path_preprocessing
        )

    def preprocess_document_loader_class(self, file_url, app_id, document_id):
        file_extension = file_url.split(".")[-1].split("?")[0]
        loader_factory_class = base_class.loader_registry[file_extension]
        return loader_factory_class().preprocess(
            file_url, app_id, document_id, self.blob_Metadata, self.temp_folder_path_preprocessing
        )

    def postprocess_document_loader_class(self, file_url, app_id, document_id):
        file_extension = file_url.split(".")[-1].split("?")[0]
        loader_factory_class = base_class.loader_registry[file_extension]
        return loader_factory_class().postprocess(document_id, app_id, self.temp_folder_path_preprocessing)

    def load_documents(self, doc_detail):
        image_processed_flag = self.get_document_loader_class(
            doc_detail["url"],
            self.minerva_file_metadata["minerva_application_id"],
            doc_detail["minerva_document_id"],
        )
        if image_processed_flag:
            return None
        else:
            return doc_detail["minerva_document_id"]

    def load_files(self):
        not_processed_documents = []

        temp_meta_data = copy.deepcopy(self.minerva_file_metadata)
        temp_meta_data["documents"] = []

        for doc_detail in self.minerva_file_metadata["documents"]:
            output_preprocess_document_id = self.preprocess_document_loader_class(
                doc_detail["url"],
                self.minerva_file_metadata["minerva_application_id"],
                doc_detail["minerva_document_id"],
            )
            if output_preprocess_document_id is None:
                temp_meta_data["documents"].append(doc_detail)
            else:
                not_processed_documents.append(output_preprocess_document_id)
                self.postprocess_document_loader_class(
                    doc_detail["url"],
                    self.minerva_file_metadata["minerva_application_id"],
                    doc_detail["minerva_document_id"],
                )

        num_cpus = cpu_count()
        with ProcessPoolExecutor(max_workers=num_cpus) as executor:
            results2 = list(
                executor.map(
                    self.load_documents,
                    temp_meta_data["documents"],
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
