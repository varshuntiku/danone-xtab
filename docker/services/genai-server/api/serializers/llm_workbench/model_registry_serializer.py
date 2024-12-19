from typing import List, Optional

from api.serializers.base_serializers import PaginatedSerializer
from pydantic import BaseModel, ConfigDict


class ModelParamsSerializer(BaseModel):
    api_base: Optional[str] = None
    api_version: Optional[str] = None
    deployment_name: Optional[str] = None


class ModelConfigSerializer(BaseModel):
    id: int
    model_path: Optional[str] = None
    model_path_type: Optional[str] = None
    api_key: Optional[str] = None
    model_params: Optional[ModelParamsSerializer] = None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))


class ModelRegistrySerializer(BaseModel):
    id: int
    name: Optional[str] = None
    source: Optional[str] = None
    description: Optional[str] = None
    problem_type: Optional[str] = None
    model_type: Optional[str] = None
    config: Optional[ModelConfigSerializer] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))


class PaginatedModelRegistrySerializer(PaginatedSerializer):
    items: List[ModelRegistrySerializer]
