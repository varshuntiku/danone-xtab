from app.db.crud.base import CRUDBase
from app.models.llm_model_config import LLMModelConfig


class CRUDLLMModelConfig(CRUDBase[LLMModelConfig, LLMModelConfig, LLMModelConfig]):
    pass


llm_model_config = CRUDLLMModelConfig(LLMModelConfig)
