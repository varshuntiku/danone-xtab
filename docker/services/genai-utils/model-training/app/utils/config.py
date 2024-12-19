# import os
import json
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MODEL_PATH: str
    TRAIN_METHOD: str

    # LORA CONFIGURATIONS
    LORA_ALPHA: float
    LORA_DROPOUT: float
    LORA_R: float
    LORA_BIAS: str = "none"
    LORA_TASK_TYPE: str = "CAUSAL_LM"

    # QUANTIZATION PARAMS
    LOAD_IN_8BIT: bool = False
    LOAD_IN_4BIT: bool = True
    LLM_INT8_THRESHOLD: float = 6.0
    LLM_INT8_ENABLE_FP32_CPU_OFFLOAD: bool = False
    LLM_INT8_HAS_FP16_WEIGHTS: bool = False
    BNB_4BIT_QUANT_TYPE: str = "fp4"
    BNB_4BIT_USE_DOUBLE_QUANT: bool = False

    # TRAINING_PARAMS
    BASE_OUTPUT_DIR: str
    BATCH_SIZE: int
    GRADIENT_ACCUMULATION_STEPS: int = 4
    OPTIMIZER: str = "paged_adamw_32bit"
    WARMUP_RATIO: float = 0.03
    SAVE_STEPS: int = 100
    LOGGING_STEPS: int = 100
    LEARNING_RATE: float
    MAX_GRAD_NORM: float = 0.3
    LR_SCHEDULAR_TYPE: str = "linear"
    EVALUATION_STRATEGY: str = "steps"
    EVAL_STEPS: int = 100
    EPOCHS: int
    FP16: bool = True
    LOGGING_STRATEGY: str = "steps"
    GROUP_BY_LENGTH: bool = True
    DATASET_TEXT_FIELD: str
    MAX_SEQ_LENGTH: int = 512


@lru_cache()
def get_settings(config_path):
    with open(config_path) as f:
        data = json.load(f)
        finetuning_data = Settings(**data)
    return finetuning_data
