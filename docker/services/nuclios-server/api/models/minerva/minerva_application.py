from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, DateTime, Integer, String


@mapper_registry.mapped
class MinervaApplication(BaseModelMixin):
    """
    Table for capturing Minerva application metadata
    """

    __tablename__ = "minerva_apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    description = Column(String(1000), nullable=True)
    app_config = Column(JSON, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
