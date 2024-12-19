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
from app.models.copilot_orchestrator import CopilotOrchestrator
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


class CopilotApp(Base):
    """
    Table for capturing Copilot application metadata
    """

    __tablename__ = "copilot_app"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    desc = Column(Text, nullable=True)
    config = Column(JSON, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    orchestrator_id = Column(Integer, ForeignKey(CopilotOrchestrator.id))
    orchestrator_config = Column(JSON)
    is_test = Column(Boolean, nullable=True, default=False)
