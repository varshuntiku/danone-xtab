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
from app.models.copilot_datasource import CopilotDatasource
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text


class CopilotDatasourceDocument(Base):
    """
    Table for capturing Copilot datasource document
    """

    __tablename__ = "copilot_datasource_minerva_document"

    id = Column(Integer, primary_key=True)
    datasource_id = Column(Integer, ForeignKey(CopilotDatasource.id, ondelete="CASCADE"))
    name = Column(Text)
    meta = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
