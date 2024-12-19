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
from app.models.copilot_app import CopilotApp
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func


class CopilotContext(Base):
    """
    Table for capturing Copilot context and  metadata
    """

    __tablename__ = "copilot_context"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    source_type = Column(String(100), nullable=False)
    deleted_at = Column(DateTime, nullable=True)
    created_by = Column(
        Integer,
        ForeignKey(NucliOSUser.id),
        nullable=True,
    )
    created_at = Column(DateTime, nullable=True, default=func.now())
