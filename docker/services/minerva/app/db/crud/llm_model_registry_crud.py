from app.db.crud.base import CRUDBase
from app.models.llm_model_registry import LLMModelRegistry
from sqlalchemy.orm import Session


class CRUDLLMModelRegistry(CRUDBase[LLMModelRegistry, LLMModelRegistry, LLMModelRegistry]):
    def is_model_exists(self, db: Session, name: str):
        query = db.query(self.model).filter(self.model.name == name)
        return query.first()


llm_model_registry = CRUDLLMModelRegistry(LLMModelRegistry)
