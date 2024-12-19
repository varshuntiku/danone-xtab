from typing import List, Optional
from uuid import UUID, uuid4

from api.serializers.base_serializers import BaseResponseSerializer, PaginatedSerializer
from pydantic import BaseModel, Field


class FormFieldOptionSerializer(BaseModel):
    id: int | str
    title: str


class DeployedModelAdvanceOptionSerializer(BaseModel):
    id: int | str
    label: str | None
    type: str | None
    options: List[FormFieldOptionSerializer] = []


class DeployedModelFormConfigurationSerializer(BaseModel):
    advancedOptions: List[DeployedModelAdvanceOptionSerializer] = []


class DeployedModelSerializer(BaseModel):
    id: int
    name: str
    endpoint: str | None
    status: str | None
    type: str | None
    description: str | None
    cost: float | None
    configuration: str | None = Field(..., validation_alias="config")
    vm_config: str | None
    job_id: UUID | None = Field(default_factory=uuid4)
    job_status: str | None = None
    progress: int | None = None
    started_at: Optional[str] = None
    approval_status: Optional[str] = None
    original_model_id: int
    original_model_name: Optional[str]
    created_by: str | None
    created_at: str | None

    class config:
        orm_mode = True


class PaginatedDeployedModelSerializer(PaginatedSerializer):
    items: List[DeployedModelSerializer]


class DeployedModelCreateSerializer(BaseResponseSerializer):
    job_id: UUID | None = Field(default_factory=uuid4)
    deployed_model_id: int | None = None


class DeployedModelExecuteSerializer(BaseResponseSerializer):
    pass


class DeployedModelValidateFormSerializer(BaseResponseSerializer):
    pass


class DeployedModelDeleteSerializer(BaseResponseSerializer):
    pass
