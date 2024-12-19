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
from app.models.copilot_tool_version_registry_mapping import (
    CopilotToolVersionRegistryMapping,
)
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.ext.mutable import MutableDict


class CopilotAppPublishedToolMapping(Base):
    """
    Table for capturing Minerva application nad published tool's mapping
    """

    __tablename__ = "copilot_app_published_tool_mapping"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    tool_version_registry_mapping_id = Column(Integer, ForeignKey(CopilotToolVersionRegistryMapping.id))
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    status = Column(String(100))
    config = Column(MutableDict.as_mutable(JSON))
    preprocess_config = Column(JSON)
    input_params = Column(JSON)
