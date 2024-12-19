import uuid

from app.db.base_class import Base
from sqlalchemy import JSON, Column, DateTime, Integer, String, Text


class MinervaConsumer(Base):
    """
    Table for capturing Minerva consumers
    """

    __tablename__ = "minerva_consumer"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    access_key = Column(Text, nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    allowed_origins = Column(JSON)
    features = Column(JSON)
    auth_agents = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
