from typing import List, Optional

from api.serializers.base_serializers import BaseResponseSerializer, PaginatedSerializer
from api.serializers.llm_workbench.experiment_serializer import (
    LLMExperimentCheckpointSerializer,
    LLMExperimentSerializer,
)
from api.serializers.llm_workbench.model_registry_serializer import (
    ModelRegistrySerializer,
)
from pydantic import BaseModel, ConfigDict


class LLMDeployedModelSerializer(BaseModel):
    id: int
    name: str | None = None
    description: str | None = None
    model_id: int
    model_name: str | None = None
    model_type: str | None = None
    deployment_type: str | None = None
    source: str | None = None
    endpoint: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    approval_status: Optional[str] = None
    is_active: Optional[bool] = None
    created_by: str | None
    created_at: str | None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    class config:
        orm_mode = True


class LLMDeployedModelDetailSerializer(BaseModel):
    id: int
    name: str
    description: str | None = None
    model: Optional[ModelRegistrySerializer] = None
    deployment_type: str | None = None
    source: str | None = None
    endpoint: Optional[str] = None
    status: Optional[str] = "not initialized"
    progress: Optional[int] = 0
    approval_status: Optional[str] = None
    checkpoint: Optional[LLMExperimentCheckpointSerializer] = None
    experiment: Optional[LLMExperimentSerializer] = None
    is_active: Optional[bool] = None
    created_by: str | None
    created_at: str | None

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    class config:
        orm_mode = True


class PaginatedLLMDeployedModelSerializer(PaginatedSerializer):
    items: List[LLMDeployedModelSerializer]


class LLMDeployedModelExecuteSerializer(BaseResponseSerializer):
    pass


class LLMDeployedModelStatusSerializer(BaseModel):
    id: int
    name: str
    status: Optional[str] = "not initialized"
    progress: Optional[int] = 0
