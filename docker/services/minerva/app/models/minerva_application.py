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


class MinervaApplication(Base):
    """
    Table for capturing Minerva application metadata
    """

    __tablename__ = "minerva_apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(256), nullable=False)
    description = Column(String(1000), nullable=True)
    app_config = Column(JSON, nullable=True)
    deleted_at = Column(DateTime, nullable=True)
