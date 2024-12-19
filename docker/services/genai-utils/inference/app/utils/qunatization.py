from app.utils.config import get_settings
from transformers import BitsAndBytesConfig

# import accelerate

settings = get_settings()


def quantization() -> BitsAndBytesConfig:
    config = BitsAndBytesConfig(
        load_in_8bit=settings.LOAD_IN_8BIT,
        load_in_4bit=settings.LOAD_IN_4BIT,
        llm_int8_threshold=settings.LLM_INT8_THRESHOLD,
        # llm_int8_skip_modules=settings.LLM_INT8_SKIP_MODULES,
        # llm_int8_enable_fp32_cpu_offload=settings.LLM_INT8_ENABLE_FP32_CPU_OFFLOAD,
        llm_int8_has_fp16_weight=settings.LLM_INT8_HAS_FP16_WEIGHTS,
        # bnb_4bit_compute_dtype=settings.BNB_4BIT_COMPUTE_DTYPE,
        bnb_4bit_quant_type=settings.BNB_4BIT_QUANT_TYPE,
        bnb_4bit_use_double_quant=settings.BNB_4BIT_USE_DOUBLE_QUANT,
    )
    return config
