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
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)


class CopilotToolRegistry(Base):
    """
    Table for capturing Copilot user tool registry
    """

    __tablename__ = "copilot_tool_registry"

    id = Column(Integer, primary_key=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    deleted_at = Column(DateTime, nullable=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)
    is_test = Column(Boolean, nullable=True, default=False)
