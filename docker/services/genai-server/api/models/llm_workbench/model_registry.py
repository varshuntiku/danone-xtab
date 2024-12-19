from api.databases.base_class import Base, mapper_registry
from api.models.mixins import BaseModelMixin
from pydantic import ConfigDict
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship

llm_model_type_mapping = Table(
    "llm_model_type_mapping",
    Base.metadata,
    Column("model_id", ForeignKey("llm_model_registry.id"), primary_key=True),
    Column("type_id", ForeignKey("llm_model_type.id"), primary_key=True),
)


@mapper_registry.mapped
class LLMModelRegistry(BaseModelMixin):
    __tablename__ = "llm_model_registry"

    name = Column(String(255))
    source = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)
    problem_type = Column(String(255), nullable=True)
    model_type = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)
    # types = relationship("LLMModelType", secondary=lambda: llm_model_type_mapping, backref="model")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMModelConfig(BaseModelMixin):
    __tablename__ = "llm_model_config"

    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="configs")
    model_path = Column(String(255), nullable=True)
    model_path_type = Column(String(255), nullable=True)
    api_key = Column(String(255), nullable=True)
    model_params = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=False)

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMModelType(BaseModelMixin):
    __tablename__ = "llm_model_type"

    type = Column(String(255))
    is_active = Column(Boolean, default=False)
    # models = relationship("LLMModelRegistry", secondary=lambda: llm_model_type_mapping, backref="type")
