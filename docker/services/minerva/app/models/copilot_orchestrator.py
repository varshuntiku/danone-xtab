from app.db.base_class import Base
from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text


class CopilotOrchestrator(Base):
    """
    Table for capturing Copilot orchestrators
    """

    __tablename__ = "copilot_orchestrator"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    identifier = Column(String(100))
    desc = Column(Text, nullable=True)
    config = Column(JSON)
    disabled = Column(Boolean)
    deleted_at = Column(DateTime, nullable=True)
