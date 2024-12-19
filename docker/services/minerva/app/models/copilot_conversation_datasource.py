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
from app.models.copilot_conversation import CopilotConversation
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import relationship


class CopilotConversationDatasource(Base):
    """
    Table for capturing Copilot conversation datasource document
    """

    __tablename__ = "copilot_conversation_datasource"

    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey(CopilotConversation.id, ondelete="CASCADE"))
    name = Column(Text)
    meta = Column(JSON)
    type = Column(Text)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    convresation = relationship(CopilotConversation, backref="datasource")
