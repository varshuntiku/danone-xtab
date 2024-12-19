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
from app.models.copilot_tool import CopilotTool
from app.models.copilot_tool_base_version import CopilotToolBaseVersion
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship


class CopilotToolVersion(Base):
    """
    Table for capturing Copilot Tool Version
    """

    __tablename__ = "copilot_tool_version"

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    tool_id = Column(Integer, ForeignKey(CopilotTool.id))
    commit_id = Column(String(100), unique=True)
    desc = Column(Text)
    input_params = Column(JSON)
    config = Column(JSON)
    verified = Column(Boolean)
    is_test = Column(Boolean, nullable=True, default=False)
    base_version_id = Column(Integer, ForeignKey(CopilotToolBaseVersion.id))
    tool_base_version = relationship(CopilotToolBaseVersion)
