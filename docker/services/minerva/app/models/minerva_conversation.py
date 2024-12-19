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
from app.models.minerva_application import MinervaApplication
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func


class MinervaConversation(Base):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_conversation"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    user_id = Column(String, nullable=False)
    user_query = Column(String(1000))
    minerva_response = Column(JSON)
    feedback = Column(String(1000), nullable=True)
    conversation_window_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"), nullable=True)
