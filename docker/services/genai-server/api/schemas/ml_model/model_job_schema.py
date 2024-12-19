import json
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class ModelJobDetailSchema(BaseModel):
    id: str

    @field_validator("id")
    @classmethod
    def validate_id(cls, value: str):
        try:
            UUID(value, version=4)
        except ValueError:
            raise ValueError("Please include valid uuid in id field.")
        return value


class ModelJobSchema(BaseModel):
    type: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    status: Optional[str] = None
    approval_status: Optional[str] = None
    progress: Optional[int] = None
    config: Optional[str] = None

    # @field_validator("type")
    # @classmethod
    # def validate_type(cls, value: str):
    #     model_types = [e.value for e in ModelType]
    #     if value and value not in model_types:
    #         raise ValueError("Please include valid type field value.")
    #     return value


# class CheckpointData(BaseModel):
#     key: str

# class ScalarData(BaseModel):
#     key: str

# class VectorData(BaseModel):
#     key: str


# class ModelJobResult(BaseModel):
#     checkpoint_data = list[CheckpointData]
#     scalar_data = ScalarData
#     vector_data = VectorData


class ModelJobUpdateSchema(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    status: Optional[str] = None
    approval_status: Optional[str] = None
    progress: Optional[int] = None
    config: Optional[str] = None
    result: Optional[dict] = None

    @field_validator("result")
    @classmethod
    def validate_result(cls, value: str):
        try:
            if value is not None:
                # result = json.loads(value)
                result = value
                if "scalar_data" not in result or "vector_data" not in result:
                    raise ValueError("Scalar and Vector data is required")
            # return value
            return json.dumps(value)
        except ValueError:
            raise ValueError("Please add data in defined format.")


class ModelJobEvent(BaseModel):
    status: Optional[str] = None
    message: Optional[str] = None
    type: Optional[str] = None
    progress: Optional[int] = None
    is_set: Optional[bool] = None
    make_wait: Optional[bool] = None
