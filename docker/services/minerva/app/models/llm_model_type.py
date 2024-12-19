from app.db.base_class import Base
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String


class LLMModelType(Base):
    __tablename__ = "llm_model_type"
    id = Column(Integer, primary_key=True)
    type = Column(String(255))
    is_active = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
