from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class DynamicVizExecutionEnvironment(BaseModelMixin):
    __tablename__ = "dynamic_viz_execution_environment"

    name = Column(String(100))
    requirements = Column(Text, nullable=True)
    py_version = Column(String(100), nullable=True)
    status = Column(String(100), nullable=True)

    def __init__(self, name, requirements, py_version, created_by):
        self.name = name
        self.requirements = requirements
        self.py_version = py_version
        self.created_by = created_by


@mapper_registry.mapped
class DynamicVizExecutionEnvironmentDefaults(BaseModelMixin):
    __tablename__ = "dynamic_viz_execution_environment_defaults"

    requirements = Column(Text, nullable=True)
    py_version = Column(String(100), nullable=True)

    def __init__(self, requirements, py_version, created_by):
        self.requirements = requirements
        self.py_version = py_version
        self.created_by = created_by


@mapper_registry.mapped
class AppDynamicVizExecutionEnvironment(BaseModelMixin):
    __tablename__ = "app_dynamic_viz_execution_environment"

    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    dynamic_env_id = Column(Integer, ForeignKey("dynamic_viz_execution_environment.id"), index=True)

    def __init__(self, dynamic_env_id, app_id, created_by):
        self.dynamic_env_id = dynamic_env_id
        self.app_id = app_id
        self.created_by = created_by
