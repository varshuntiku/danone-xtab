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
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text, func


class CopilotTool(Base):
    """
    Table for capturing Copilot user tools
    """

    __tablename__ = "copilot_tool"

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)
