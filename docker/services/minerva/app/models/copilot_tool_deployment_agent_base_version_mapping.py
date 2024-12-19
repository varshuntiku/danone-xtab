from app.db.base_class import Base
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint


class CopilotToolDeploymentAgentBaseVersionMapping(Base):
    """
    Table for capturing copilot tool deployment agent and base version mapping
    """

    __tablename__ = "copilot_tool_deployment_agent_base_version_mapping"
    __table_args__ = (PrimaryKeyConstraint("deployment_agent_id", "base_version_id"),)

    deployment_agent_id = Column("deployment_agent_id", Integer, ForeignKey("copilot_tool_deployment_agent.id"))
    base_version_id = Column("base_version_id", Integer, ForeignKey("copilot_tool_base_version.id"))
