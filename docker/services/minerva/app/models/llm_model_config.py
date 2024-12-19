from app.db.base_class import Base
from app.models.llm_model_registry import LLMModelRegistry
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class LLMModelConfig(Base):
    __tablename__ = "llm_model_config"
    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey(LLMModelRegistry.id))
    model = relationship(LLMModelRegistry, backref="configs")
    model_path = Column(String(255), nullable=True)
    model_path_type = Column(String(255), nullable=True)
    api_key = Column(String(255), nullable=True)
    model_params = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))

    # model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))
