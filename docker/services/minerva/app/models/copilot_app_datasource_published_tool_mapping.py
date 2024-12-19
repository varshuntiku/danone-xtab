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
from app.models.copilot_app_published_tool_mapping import CopilotAppPublishedToolMapping
from app.models.copilot_datasource import CopilotDatasource
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.ext.mutable import MutableDict


class CopilotAppDatasourcePublishedToolMapping(Base):
    """
    Table for capturing the Copilot App Datasource and Copilot App Published Tools mapping
    """

    __tablename__ = "copilot_app_datasource_published_tool_mapping"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    datasource_id = Column(Integer, ForeignKey(CopilotDatasource.id))
    app_published_tool_id = Column(Integer, ForeignKey(CopilotAppPublishedToolMapping.id))
    key = Column(String(100))
    config = Column(MutableDict.as_mutable(JSON))
