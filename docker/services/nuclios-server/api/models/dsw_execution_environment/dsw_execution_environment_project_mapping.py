from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, ForeignKey, Integer
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class DSWExecutionEnvironmentProjectMapping(BaseModelMixin):
    __tablename__ = "dsw_execution_environment_project_mapping"

    project_id = Column(Integer, ForeignKey("project.id"))
    execution_environment_id = Column(Integer, ForeignKey("dsw_execution_environment.id"))
    config = Column(JSON)

    project = relationship("Project", backref="dsw_execution_env_project_mappings")
    execution_env = relationship("DSWExecutionEnvironment", backref="dsw_execution_env_project_mappings")
