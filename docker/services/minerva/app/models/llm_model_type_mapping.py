from app.db.base_class import Base
from app.models.llm_model_registry import LLMModelRegistry
from app.models.llm_model_type import LLMModelType
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship


class LLMModelTypeMapping(Base):
    __tablename__ = "llm_model_type_mapping"

    model_id = Column(Integer, ForeignKey(LLMModelRegistry.id), primary_key=True)
    type_id = Column(Integer, ForeignKey(LLMModelType.id), primary_key=True)
    model_type = relationship(LLMModelType)
    model_registry = relationship(LLMModelRegistry, backref="type_info")
