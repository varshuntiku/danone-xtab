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
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text


class MinervaDocument(Base):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_document"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    name = Column(Text)
    meta = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
