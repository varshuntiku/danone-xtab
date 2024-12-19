from typing import List, Optional
from uuid import UUID, uuid4

from api.serializers.base_serializers import BaseResponseSerializer, PaginatedSerializer
from pydantic import BaseModel, Field


class FinetunedModelSerializer(BaseModel):
    id: int
    name: str | None
    description: str | None
    size: str | None
    cost: int | None = Field(..., validation_alias="estimated_cost")
    job_id: UUID | None = Field(default_factory=uuid4)
    job_status: str | None = None
    progress: int | None = None
    is_submitted: bool = False
    started_at: Optional[str] = None
    approval_status: Optional[str] = None
    parent_model_id: int
    parent_model_name: Optional[str]
    created_by: str | None
    created_at: str | None

    class config:
        orm_mode = True


class PaginatedFinetunedModelSerializer(PaginatedSerializer):
    items: List[FinetunedModelSerializer]


class FinetunedFileUploadSerializer(BaseResponseSerializer):
    pass


class FinetunedSubmitSerializer(BaseResponseSerializer):
    pass


class FinetunedModelExecuteSerializer(BaseResponseSerializer):
    pass


class FinetunedModelDeleteSerializer(BaseResponseSerializer):
    pass
