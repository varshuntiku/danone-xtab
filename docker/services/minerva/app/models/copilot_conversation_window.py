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
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func


class CopilotConversationWindow(Base):
    """
    Table for capturing copilot user conversations
    """

    __tablename__ = "copilot_conversation_window"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(CopilotApp.id, ondelete="CASCADE"))
    user_id = Column(String, nullable=False)
    title = Column(String(1000))
    pinned = Column(Boolean)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
