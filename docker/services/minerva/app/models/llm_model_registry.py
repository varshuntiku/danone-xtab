from app.db.base_class import Base
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func


class LLMModelRegistry(Base):
    __tablename__ = "llm_model_registry"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    source = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)
    problem_type = Column(String(255), nullable=True)
    model_type = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_at = Column(DateTime, nullable=True, default=func.now())
