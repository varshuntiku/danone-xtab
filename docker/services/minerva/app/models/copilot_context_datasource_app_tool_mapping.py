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
from app.models.copilot_context_datasource import CopilotContextDatasource
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, func
from sqlalchemy.ext.mutable import MutableDict


class CopilotContextDatasourceAppToolMapping(Base):
    """
    Table for capturing the Copilot App Context Datasource and Copilot App Published Tool mapping
    """

    __tablename__ = "copilot_context_datasource_app_tool_mapping"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    context_datasource_id = Column(Integer, ForeignKey(CopilotContextDatasource.id))
    app_tool_id = Column(Integer, ForeignKey(CopilotAppPublishedToolMapping.id))
    config = Column(MutableDict.as_mutable(JSON))
