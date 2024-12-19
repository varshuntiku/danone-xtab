from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class LLMDataRegistry(BaseModelMixin):
    __tablename__ = "llm_data_registry"

    dataset_name = Column(String(255))
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(255), nullable=True)
    file_type = Column(String(255), nullable=True)
    access_token = Column(String(255), nullable=True)
    source_id = Column(Integer, ForeignKey("llm_dataset_source.id"))
    source = relationship("LLMDatasetSource", backref="data_registries")
    dataset_folder = Column(String(255), nullable=True)
    access_token = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMDatasetSource(BaseModelMixin):
    __tablename__ = "llm_dataset_source"

    source_type = Column(String(255))
    is_active = Column(Boolean, default=False)
