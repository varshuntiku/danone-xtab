from typing import Optional

from pydantic import BaseModel


class LLMExperimentSettingSchema(BaseModel):
    peft_method: Optional[str] = None
    quantization: Optional[bool] = None
    gradient_acc_steps: Optional[int] = None
    logging_steps: Optional[int] = None
    save_steps: Optional[int] = None
    lr_scheduler_type: Optional[str] = None
    lora_alpha: Optional[int] = None
    lora_rank: Optional[int] = None


class LLMExperimentCreateSchema(BaseModel):
    name: str
    base_model_id: int
    problem_type: str | None
    epochs: int | None
    test_size: float | None
    batch_size: int | None
    max_tokens: int | None = None
    error_metric_type: str | None = None
    learning_rate: float | None = None
    status: str | None = "In-Progress"
    compute_id: Optional[int] = None
    settings: Optional[LLMExperimentSettingSchema] = None
    # dataset: DatasetSchema | None = None
    dataset_id: int | None = None

    class config:
        orm_mode = True


class LLMExperimentUpdateSchema(BaseModel):
    id: int
    name: str
    problem_type: str | None = None
    epochs: int | None = None
    test_size: float | None = None
    batch_size: int | None = None
    max_tokens: int | None = None
    learning_rate: float | None = None
    error_metric_type: str | None = None
    status: str | None = "In-Progress"
    compute_id: Optional[int] = None
    settings: Optional[LLMExperimentSettingSchema] = None
    # dataset: DatasetSchema | None = None
    dataset_id: int | None = None

    class config:
        orm_mode = True


class LLMExperimentValidateSchema(BaseModel):
    name: str
    base_model_id: int
