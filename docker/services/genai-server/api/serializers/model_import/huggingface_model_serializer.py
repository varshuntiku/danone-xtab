from typing import List

from pydantic import BaseModel


class ModelSerializer(BaseModel):
    downloads: int
    lastModified: str
    pipeline_tag: str | None
    likes: int
    id: str
    avatarUrl: str | None


class HuggingfaceModelSerializer(BaseModel):
    models: List[ModelSerializer]
    numItemsPerPage: int
    numTotalItems: int
    pageIndex: int


class HuggingfaceTaskSerializer(BaseModel):
    tasks: List[str]
