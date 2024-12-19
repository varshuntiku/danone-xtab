from typing import Optional

from pydantic import BaseModel, ConfigDict


class ModelParamsSchema(BaseModel):
    api_base: Optional[str] = None
    api_version: Optional[str] = None
    deployment_name: Optional[str] = None


class ModelRegistryCreateSchema(BaseModel):
    name: str
    source: str = "nulcios"
    model_type: Optional[str] = "text"
    description: Optional[str] = None
    problem_type: Optional[str] = None
    is_active: bool | None
    model_path: str
    model_path_type: str
    api_key: Optional[str]
    model_params: Optional[ModelParamsSchema] = None
    is_active_config: bool | None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))
