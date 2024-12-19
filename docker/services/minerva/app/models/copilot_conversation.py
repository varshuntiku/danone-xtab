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
from app.models.copilot_conversation_window import CopilotConversationWindow
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


class CopilotConversation(Base):
    """
    Table for capturing copilot user conversations
    """

    __tablename__ = "copilot_conversation"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    application_id = Column(Integer, ForeignKey(CopilotApp.id, ondelete="CASCADE"))
    user_id = Column(String, nullable=False)
    user_query = Column(String(1000))
    copilot_response = Column(JSON)
    feedback = Column(Integer, nullable=True)
    pinned = Column(Boolean, nullable=True)
    comment = Column(JSON)
    conversation_window_id = Column(
        Integer, ForeignKey(CopilotConversationWindow.id, ondelete="CASCADE"), nullable=True
    )
    interrupted = Column(Boolean)
    extra_info = Column(JSON, nullable=True)
    request_type = Column(String(100), nullable=True)
    input_mode = Column(String(100), nullable=True)
    extra_query_param = Column(Text, nullable=True)
    request_payload = Column(JSON, nullable=True)
    error = Column(String(1000))
