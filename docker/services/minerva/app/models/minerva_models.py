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
from sqlalchemy import JSON, Column, DateTime, Integer, String


class MinervaModels(Base):
    """
    Table for capturing Minerva user llm models
    """

    __tablename__ = "minerva_models"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    host = Column(String, nullable=False)
    type = Column(String, nullable=False)
    config = Column(JSON)
    features = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
