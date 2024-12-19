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
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func


class MinervaConversationWindow(Base):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_conversation_window"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    user_id = Column(String, nullable=False)
    title = Column(String(1000))
    pinned = Column(Boolean)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
