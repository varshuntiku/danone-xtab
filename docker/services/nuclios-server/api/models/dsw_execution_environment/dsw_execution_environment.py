from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, String, Text


@mapper_registry.mapped
class DSWExecutionEnvironment(BaseModelMixin):
    __tablename__ = "dsw_execution_environment"

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)

    def __init__(self, name, desc, config):
        self.name = name
        self.desc = desc
        self.config = config
