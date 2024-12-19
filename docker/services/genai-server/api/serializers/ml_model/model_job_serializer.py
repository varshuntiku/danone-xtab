from typing import Optional
from uuid import UUID, uuid4

from api.serializers.base_serializers import BaseResponseSerializer
from pydantic import BaseModel, Field


class ModelJobSerializer(BaseModel):
    type: str
    uuid: UUID = Field(default_factory=uuid4)
    created_at: str | None
    started_at: str | None
    ended_at: str | None
    status: str | None
    approval_status: str | None
    progress: int | None
    user_id: int | None
    configuration: str | None = Field(..., validation_alias="config")  # Renaming field from config to configuration
    result: Optional[str] = None

    class config:
        orm_mode = True


class ModelJobStatusResponseSerializer(BaseModel):
    status: str
    progress: int | None
    job_id: UUID | None = Field(default_factory=uuid4)


class ModelJobEventDetailSerializer(BaseModel):
    message: Optional[str]
    status: Optional[str]
    progress: Optional[int] = None
    type: Optional[str] = None
    created_at: Optional[str] = None
    is_set: Optional[bool] = False

    class config:
        orm_mode = True


class ModelJobEventSerializer(BaseResponseSerializer):
    pass
