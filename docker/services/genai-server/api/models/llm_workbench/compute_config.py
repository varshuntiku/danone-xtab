from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class LLMComputeConfig(BaseModelMixin):
    __tablename__ = "llm_compute_config"

    sku = Column(String(255))
    type = Column(String(255), nullable=True)
    vcpu = Column(Integer, nullable=True)
    ram = Column(Integer, nullable=True)
    iops = Column(Integer, nullable=True)
    storage_size = Column(String(255), nullable=True)
    estimated_cost = Column(Float, nullable=True)
    data_disks = Column(Integer, nullable=True)
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="cloud_providers")
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMCloudProvider(BaseModelMixin):
    __tablename__ = "llm_cloud_provider"

    name = Column(String(255))
    is_active = Column(Boolean, default=False)
