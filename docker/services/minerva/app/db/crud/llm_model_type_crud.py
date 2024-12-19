from app.db.crud.base import CRUDBase
from app.models.llm_model_type import LLMModelType
from sqlalchemy.orm import Session


class CRUDLLMModelType(CRUDBase[LLMModelType, LLMModelType, LLMModelType]):
    def get_llm_model_type_by_type(self, db: Session, type: str):
        query = db.query(self.model).filter(self.model.type == type)
        return query.first()


llm_model_type = CRUDLLMModelType(LLMModelType)
