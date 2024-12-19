# import os
from functools import lru_cache
from typing import Optional  # , Union  # List,

# # import torch
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Add any base settings here
    MODEL_NAME: Optional[str]
    # quantization params
    CHATCOMPLETION_MODEL: bool
    TEXTGENERATION_MODEL: bool
    EMBEDDING_MODEL: bool
    QUANTIZATION: bool
    LOAD_IN_8BIT: bool
    LOAD_IN_4BIT: bool
    LLM_INT8_THRESHOLD: float
    # LLM_INT8_SKIP_MODULES: Optional[List[str]]
    # LLM_INT8_ENABLE_FP32_CPU_OFFLOAD: bool
    LLM_INT8_HAS_FP16_WEIGHTS: bool
    # BNB_4BIT_COMPUTE_DTYPE: Union[torch.dtype, str]
    BNB_4BIT_QUANT_TYPE: str
    BNB_4BIT_USE_DOUBLE_QUANT: bool
    LF_CHAT: bool

    EMBEDDING_MODEL_NAME: Optional[str]
    MODEL_PATH: Optional[str] = "/data/repo"
    LOAD_FROM_HF: bool = False

    # Application Specific Parameters
    DOCS_URL: str = "/llm-docs"
    APP_VERSION: Optional[str] = "0.1.0"
    APP_MODE: Optional[str] = None
    FOLDER_PATH: Optional[str] = None
    APP_NAME: Optional[str] = "LLM Server"

    model_config = SettingsConfigDict(env_file=".env")


@lru_cache()
def get_settings():
    return Settings()  # type: ignore
