from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class DeployedModelSchema(BaseModel):
    name: str
    endpoint: str | None = None
    status: str | None = None
    type: str | None = None
    description: str | None = None
    cost: float | None = None
    quantization: Optional[bool] = None
    quantization_type: str | None = None
    number_of_bits: str | None = None
    compute_data_type: str | None = None
    use_double_quantization: Optional[bool] = None
    vm_config: Optional[str] = None
    job_id: Optional[str] = None
    original_model_id: int

    class config:
        orm_mode = True


class DeployedModelUpdateSchema(BaseModel):
    id: int
    name: str
    endpoint: str | None = None
    status: str | None = None
    type: str | None = None
    description: str | None = None
    cost: float | None = None
    quantization: Optional[bool] = None
    quantization_type: str | None = None
    number_of_bits: str | None = None
    compute_data_type: str | None = None
    use_double_quantization: Optional[bool] = None
    vm_config: Optional[str] = None

    class config:
        orm_mode = True


class DeployedModelValidationSchema(BaseModel):
    name: str


class DeployedModelExecuteSchema(BaseModel):
    job_id: UUID = Field(default_factory=uuid4)
    id: int
    name: str
    execution_type: str

    class config:
        orm_mode = True
