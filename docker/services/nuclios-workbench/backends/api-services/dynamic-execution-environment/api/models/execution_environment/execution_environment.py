from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import backref, relationship


@mapper_registry.mapped
class InfraType(BaseModelMixin):
    __tablename__ = "infra_type"

    name = Column(String(255))
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="infra_types")


@mapper_registry.mapped
class ExecutionEnvironment(BaseModelMixin):
    __tablename__ = "execution_environment"

    name = Column(String(100))
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="execution_environments")
    infra_type_id = Column(Integer, ForeignKey("infra_type.id"))
    infra_type = relationship("InfraType", backref="execution_environments")
    hosting_type = Column(String(255), nullable=True)
    compute_id = Column(Integer, ForeignKey("llm_compute_config.id"))
    compute = relationship("LLMComputeConfig", backref="execution_environments")
    env_type = Column(String(255))
    compute_type = Column(String(255))
    env_category = Column(String(255))
    run_time = Column(String(255))
    run_time_version = Column(String(255))
    endpoint = Column(String(255))
    replicas = Column(Integer)
    packages = Column(Text, nullable=True)
    index_url = Column(Text, nullable=True)
    status = Column(String(255), nullable=True)
    logs = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentAppMapping(BaseModelMixin):
    __tablename__ = "execution_environment_app_mapping"

    app_id = Column(Integer, ForeignKey("app.id"))
    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentProjectMapping(BaseModelMixin):
    __tablename__ = "execution_environment_project_mapping"

    project_id = Column(Integer, ForeignKey("project.id"))
    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentDeployment(BaseModelMixin):
    __tablename__ = "execution_environment_deployment"

    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    name = Column(String(255))
    namespace = Column(String(255))
    uuid = Column(UUID(as_uuid=True), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentApprovalStatus(BaseModelMixin):
    __tablename__ = "execution_environment_approval_status"

    env_id = Column(Integer, ForeignKey("execution_environment.id"), unique=True, nullable=False)
    approval_status = Column(String(255), default="pending")
    approved_by = Column(String(100), nullable=True)
    environment = relationship("ExecutionEnvironment", backref=backref("approval_status", uselist=False))
