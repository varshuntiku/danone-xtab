from typing import List

from pydantic import BaseModel, StrictInt


class Document(BaseModel):
    url: str
    minerva_document_id: StrictInt


class MinervaApplicationDocuments:
    minerva_application_id: StrictInt
    documents: List[Document]


class OpenAIConfigLLM:
    api_base: str
    api_version: str
    deployment_name: str
    model_name: str
    openai_api_key: str
    temperature: float


class OptimusConfigLLM:
    temperature: float
    model: str


class OpenAIConfigEmbedding:
    api_base: str
    api_version: str
    deployment_name: str
    model_name: str
    openai_api_key: str
    temperature: int


class OptimusConfigEmbedding:
    pass


class LLMModelMeta:
    host: str
    config: OpenAIConfigLLM | OptimusConfigLLM


class EmbeddingModelMeta:
    host: str
    config: OpenAIConfigEmbedding | OptimusConfigEmbedding


class JobConfig:
    llm_model: LLMModelMeta
    embedding_model: EmbeddingModelMeta
