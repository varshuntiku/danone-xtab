from app.db.base_class import Base
from app.models.llm_deployment_type import LLMDeploymentType
from app.models.llm_model_registry import LLMModelRegistry
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship


class LLMDeployedModel(Base):
    __tablename__ = "llm_deployed_model"
    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey(LLMModelRegistry.id))
    model = relationship(LLMModelRegistry)
    name = Column(String(500))
    description = Column(Text, nullable=True)
    endpoint = Column(String(500), nullable=True)
    status = Column(String(255), nullable=True)
    approval_status = Column(String(255), default="pending")
    deployment_type_id = Column(Integer, ForeignKey(LLMDeploymentType.id))
    deployment_type = relationship(LLMDeploymentType)
    is_active = Column(Boolean, default=False)
    progress = Column(Integer, default=0)
    model_params = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    updated_by = Column(Integer, ForeignKey(NucliOSUser.id))
    updated_at = Column(DateTime, nullable=True, default=func.now())
