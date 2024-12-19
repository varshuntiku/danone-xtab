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
from app.models.minerva_models import MinervaModels
from sqlalchemy import JSON, Column, ForeignKey, Integer, String


class MinervaPrompts(Base):
    """
    Table for capturing Minerva user prompts
    """

    __tablename__ = "minerva_prompts"

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey(MinervaModels.id, ondelete="CASCADE"))
    tool_type = Column(String, nullable=False)
    prompt = Column(JSON)
