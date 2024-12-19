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
from app.models.copilot_tool_deployment_agent import CopilotToolDeploymentAgent
from app.models.copilot_tool_registry import CopilotToolRegistry
from app.models.copilot_tool_version import CopilotToolVersion
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import relationship


class CopilotToolVersionRegistryMapping(Base):
    """
    Table for capturing Copilot tool version registry mapping
    """

    __tablename__ = "copilot_tool_version_registry_mapping"

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    tool_version_id = Column(Integer, ForeignKey(CopilotToolVersion.id))
    registry_id = Column(Integer, ForeignKey(CopilotToolRegistry.id))
    approved = Column(Boolean)
    deprecated = Column(Boolean)
    deployment_status = Column(String(100))
    info = Column(JSON)
    version = Column(String(100))
    deployment_agent_id = Column(Integer, ForeignKey(CopilotToolDeploymentAgent.id))
    deployment_agent = relationship(CopilotToolDeploymentAgent)
    user = relationship(NucliOSUser)
