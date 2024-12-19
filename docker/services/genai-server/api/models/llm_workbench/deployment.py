from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from pydantic import ConfigDict
from sqlalchemy import JSON, Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class LLMDeployedModel(BaseModelMixin):
    __tablename__ = "llm_deployed_model"

    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="llm_deployed_models")
    name = Column(String(500))
    description = Column(Text, nullable=True)
    endpoint = Column(String(500), nullable=True)
    status = Column(String(255), nullable=True)
    approval_status = Column(String(255), default="pending")
    deployment_type_id = Column(Integer, ForeignKey("llm_deployment_type.id"))
    deployment_type = relationship("LLMDeploymentType", backref="deployments")
    is_active = Column(Boolean, default=False)
    progress = Column(Integer, default=0)
    model_params = Column(JSON)

    model_config = ConfigDict(protected_namespaces=("protect_me_", "also_protect_"))

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMDeploymentType(BaseModelMixin):
    __tablename__ = "llm_deployment_type"

    name = Column(String(255))
    is_active = Column(Boolean, default=False)

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMDeploymentExperimentMapping(BaseModelMixin):
    __tablename__ = "llm_deployment_experiment_mapping"

    deployment_id = Column(Integer, ForeignKey("llm_deployed_model.id"))
    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    checkpoint_id = Column(Integer, ForeignKey("llm_experiment_checkpoint.id"))
    is_active = Column(Boolean, default=False)

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)
