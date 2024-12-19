from abc import ABC, abstractmethod
from typing import List

from langchain.text_splitter import RecursiveCharacterTextSplitter
from pydantic import BaseModel, StrictInt


class Document(BaseModel):
    url: str
    minerva_document_id: StrictInt


class MinervaApplicationDocuments(BaseModel):
    minerva_application_id: StrictInt
    documents: List[Document]


loader_registry = {}


class Loader(ABC):
    def __init_subclass__(cls, **kwargs):
        # always make it colaborative:
        super().__init_subclass__(**kwargs)
        loader_extension = getattr(cls, "extention")
        loader_registry[loader_extension] = cls

    def __init__(self):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
        )

    @abstractmethod
    def load(self, file_path, llm_obj, app_id, document_id, temp_folder_path_preprocessing):
        pass
