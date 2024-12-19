from typing import Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class FinetunedModelSchema(BaseModel):
    name: str
    description: str | None = None
    tags: str | None = None
    task_type: str | None = None
    job_id: Optional[str] = None
    parent_model_id: int

    class config:
        orm_mode = True


class FinetunedModelConfigSchema(BaseModel):
    finetuned_model_id: int
    finetuned_model_path: Optional[str] = None
    train_method: Optional[str] | None = None
    lora_alpha: Optional[str] | None = None
    lora_dropout: Optional[str | float] | None = None
    lora_r: Optional[str] = None
    number_of_bits: Optional[int] = None
    batch_size: int
    learning_rate: Optional[float] = 0.005
    epochs: Optional[int] = 10
    max_seq_length: int = 1024
    sanity_check: bool = True
    multi_checkpoint_analysis: bool = True
    vm_config: Optional[str] = None


class FinetunedModelExecuteSchema(BaseModel):
    job_id: UUID = Field(default_factory=uuid4)
    id: int
    name: str
    execution_type: str

    class config:
        orm_mode = True
