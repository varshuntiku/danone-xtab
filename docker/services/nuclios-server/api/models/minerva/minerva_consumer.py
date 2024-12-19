from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, DateTime, Integer, String, Text, text
from sqlalchemy.dialects.postgresql import UUID


@mapper_registry.mapped
class MinervaConsumer(BaseModelMixin):
    """
    Table for capturing Minerva consumers
    """

    __tablename__ = "minerva_consumer"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    access_key = Column(UUID, nullable=False, unique=True, server_default=text("uuid_generate_v4()"))
    allowed_origins = Column(JSON)
    features = Column(JSON)
    auth_agents = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
