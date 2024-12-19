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
from app.models.copilot_context import CopilotContext
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import relationship


class CopilotContextDatasource(Base):
    """
    Table for capturing Copilot context datasource
    """

    __tablename__ = "copilot_context_datasource"

    id = Column(Integer, primary_key=True)
    context_id = Column(Integer, ForeignKey(CopilotContext.id, ondelete="CASCADE"))
    name = Column(Text)
    config = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    context = relationship(CopilotContext, backref="context_datasource")
