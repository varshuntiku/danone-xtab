from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, DateTime, Integer, String


@mapper_registry.mapped
class MinervaModels(BaseModelMixin):
    """
    Table for capturing Minerva user llm models
    """

    __tablename__ = "minerva_models"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    host = Column(String, nullable=False)
    type = Column(String, nullable=False)
    config = Column(JSON)
    features = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
