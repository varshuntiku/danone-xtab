from app.db.crud.base import CRUDBase
from app.models.llm_model_type_mapping import LLMModelTypeMapping


class CRUDLLMModelTypeMapping(CRUDBase[LLMModelTypeMapping, LLMModelTypeMapping, LLMModelTypeMapping]):
    pass


llm_model_type_mapping = CRUDLLMModelTypeMapping(LLMModelTypeMapping)
