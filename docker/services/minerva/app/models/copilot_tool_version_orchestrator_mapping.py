from app.db.base_class import Base
from app.models.copilot_orchestrator import CopilotOrchestrator
from app.models.copilot_tool_version import CopilotToolVersion
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint


class CopilotToolVersionOrchestratorMapping(Base):
    """
    Table for capturing copilot tool version and orchestrator mapping
    """

    __tablename__ = "copilot_tool_version_orchestrator_mapping"
    __table_args__ = (PrimaryKeyConstraint("tool_version_id", "orchestrator_id"),)

    tool_version_id = Column(Integer, ForeignKey(CopilotToolVersion.id))
    orchestrator_id = Column(Integer, ForeignKey(CopilotOrchestrator.id))
