from typing import List
from uuid import UUID, uuid4

from api.serializers.base_serializers import PaginatedSerializer
from pydantic import BaseModel, Field, field_validator


class BaseModelSerializer(BaseModel):
    id: int
    models_name: str | None = Field(..., validation_alias="name")  # Renaming field from name to models_name
    size: str | None
    cost: int | None = Field(..., validation_alias="estimated_cost")  # Renaming field from estimated_cost to cost
    job_id: UUID | None = Field(default_factory=uuid4)
    description: str | None
    is_finetunable: bool | None = False
    imported_by: str | None = Field(..., validation_alias="created_by")  # Renaming field from created_by to imported_by
    created_at: str | None

    @field_validator("is_finetunable")
    @classmethod
    def validate_is_finetunable(cls, value: str):
        try:
            if value is None:
                return False
            return value
        except ValueError:
            raise ValueError("Please include valid uuid in id field.")

    class config:
        orm_mode = True
        # allow_population_by_field_name = True


class PaginatedBaseModelSerializer(PaginatedSerializer):
    items: List[BaseModelSerializer]
