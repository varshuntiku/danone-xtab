#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.db.base_class import Base
from app.models.copilot_tool_deployment_agent_base_version_mapping import (
    CopilotToolDeploymentAgentBaseVersionMapping,
)
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship


class CopilotToolDeploymentAgent(Base):
    """
    Table for capturing Copilot tool deployment agent
    """

    __tablename__ = "copilot_tool_deployment_agent"

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON, nullable=True)
    base_versions = relationship(
        "CopilotToolBaseVersion",
        secondary=CopilotToolDeploymentAgentBaseVersionMapping.__table__,
        back_populates="deployment_agents",
    )
