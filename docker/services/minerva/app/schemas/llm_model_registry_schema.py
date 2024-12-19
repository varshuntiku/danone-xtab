from typing import Optional

from pydantic import BaseModel


class ModelParamsSchema(BaseModel):
    api_base: Optional[str] = None
    api_version: Optional[str] = None
    deployment_name: Optional[str] = None


class ModelRegistryCreatePayload(BaseModel):
    name: str
    source: str = "azure-openai"
    model_type: Optional[str] = "text-to-text"
    description: Optional[str] = None
    problem_type: Optional[str] = None
    is_active: bool | None
    model_path: str
    model_path_type: str
    api_key: Optional[str]
    model_params: Optional[dict] = {}
    is_active_config: bool | None


class ModelConfigSchema(BaseModel):
    id: int
    model_path: Optional[str] = None
    model_path_type: Optional[str] = None
    api_key: Optional[str] = None
    model_params: Optional[dict] = None


class ModelRegistryResponse(BaseModel):
    id: int
    name: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    problem_type: Optional[str] = None
    model_type: Optional[str] = None
    config: Optional[ModelConfigSchema] = None
