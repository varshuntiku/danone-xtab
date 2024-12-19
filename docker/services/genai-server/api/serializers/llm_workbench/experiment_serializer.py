from typing import List, Optional

from api.serializers.base_serializers import BaseResponseSerializer, PaginatedSerializer
from api.serializers.llm_workbench.compute_config_serializer import (
    ComputeConfigSerializer,
)
from api.serializers.llm_workbench.data_registry_serializer import DatasetSerializer
from api.serializers.llm_workbench.model_registry_serializer import (
    ModelRegistrySerializer,
)
from pydantic import BaseModel, ConfigDict


class LLMExperimentSettingSerializer(BaseModel):
    id: int
    peft_method: Optional[str] = None
    quantization: Optional[bool] = None
    gradient_acc_steps: Optional[int] = None
    logging_steps: Optional[int] = None
    save_steps: Optional[int] = None
    lr_scheduler_type: Optional[str] = None
    lora_alpha: Optional[int] = None
    lora_rank: Optional[int] = None


class LLMExperimentSerializer(BaseModel):
    id: int
    name: str
    base_model_id: int
    base_model: str
    problem_type: str | None
    epochs: int | None
    test_size: float | None
    batch_size: int | None
    max_tokens: int | None = None
    learning_rate: float | None = None
    error_metric_type: str | None = None
    status: str | None = None
    compute: Optional[ComputeConfigSerializer] = None
    settings: Optional[LLMExperimentSettingSerializer] = None
    dataset: DatasetSerializer | None = None
    created_by: str | None
    created_at: str | None

    class config:
        orm_mode = True


class PaginatedLLMExperimentSerializer(PaginatedSerializer):
    items: List[LLMExperimentSerializer]


class LLMExperimentCreateSerializer(BaseModel):
    id: int
    name: str
    base_model_id: int
    base_model: ModelRegistrySerializer
    problem_type: str | None
    epochs: int | None
    test_size: float | None
    batch_size: int | None
    max_tokens: int | None = None
    learning_rate: float | None = None
    error_metric_type: str | None = None
    status: str | None = None
    compute: Optional[ComputeConfigSerializer] = None
    settings: Optional[LLMExperimentSettingSerializer] = None
    dataset: DatasetSerializer | None = None
    created_by: str | None
    created_at: str | None

    class config:
        orm_mode = True


class LLMExperimentsStatusSerializer(BaseModel):
    id: int
    status: str | None
    name: str

    class config:
        orm_mode = True


class LLMExperimentErrorMetricsSerializer(BaseModel):
    name: str | None
    untrained: float | None
    trained: float | None

    class config:
        orm_mode = True


class LLMExperimentTrainLossSerializer(BaseModel):
    current_steps: int | None
    total_steps: int | None
    loss: float | None
    eval_loss: float | None
    predict_loss: float | None
    reward: float | None
    learning_rate: float | None
    epoch: float | None
    percentage: float | None
    elapsed_time: str | None
    remaining_time: str | None

    class config:
        orm_mode = True


class LLMExperimentDeepDiveSerializer(BaseModel):
    instruction: str | None
    # actual_response: str | None
    Trained_model_result: str | None
    input: str | None
    prompt: str | None
    output: str | None
    Untrained_model_result: str | None
    data_source: str | None

    class config:
        orm_mode = True


class LLMExperimentResultSerializer(BaseModel):
    id: int
    experiment_id: int
    accuracy: float | None
    run_time: int | None
    log_path: str | None
    error_metrics: List | None
    train_loss: List[LLMExperimentTrainLossSerializer] | None
    deep_dive: List[LLMExperimentDeepDiveSerializer] | None
    is_active: bool

    class config:
        orm_mode = True


class LLMExperimentCheckpointSerializer(BaseModel):
    id: int
    experiment_id: int
    name: str | None
    model_path: str | None
    checkpoint_path: str | None
    train_result_path: str | None
    eval_path: str | None
    error_metrics_path: str | None
    error_metrics: str | None
    is_active: bool

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    class config:
        orm_mode = True


class LLMExperimentValidateResponseSerializer(BaseResponseSerializer):
    pass


class LLMExperimentTrainLogSerializer(BaseModel):
    current_steps: Optional[int]
    total_steps: Optional[int]
    loss: Optional[float]
    eval_loss: Optional[float]
    predict_loss: Optional[float]
    reward: Optional[float]
    learning_rate: Optional[float]
    epoch: Optional[float]
    percentage: Optional[float]
    elapsed_time: Optional[str]
    remaining_time: Optional[str]


class LLMExperimentCheckpointLogSerializer(BaseModel):
    current_steps: Optional[int]
    total_steps: Optional[int]
    loss: Optional[float]
    eval_loss: Optional[float]
    predict_loss: Optional[float]
    reward: Optional[float]
    learning_rate: Optional[float]
    epoch: Optional[float]
    name: Optional[str]
    is_result_generated: Optional[bool]


class LLMExperimentStatusSerializer(BaseModel):
    status: str
    message: Optional[str] = None
    logs: Optional[List[LLMExperimentTrainLogSerializer]] = []
    checkpoints: Optional[List[LLMExperimentCheckpointLogSerializer]] = []
    is_checkpoint_evaluation_enabled: Optional[bool]

    class config:
        orm_mode = True


class LLMExperimentStreamStatusSerializer(BaseModel):
    data: LLMExperimentStatusSerializer | None

    class config:
        orm_mode = True


# class FinetunedFileUploadSerializer(BaseResponseSerializer):
#     pass


# class FinetunedSubmitSerializer(BaseResponseSerializer):
#     pass


# class LLMExperimentExecuteSerializer(BaseResponseSerializer):
#     pass


# class LLMExperimentDeleteSerializer(BaseResponseSerializer):
#     pass
