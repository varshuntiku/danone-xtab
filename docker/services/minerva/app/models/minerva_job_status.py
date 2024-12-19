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
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func


class MinervaJobStatus(Base):
    """
    Table for capturing Minerva job status
    """

    __tablename__ = "minerva_job_status"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    run_id = Column(String(100))
    status = Column(Text)
    deleted_at = Column(DateTime, nullable=True)
    name = Column(Text)
    type = Column(Text)
    created_at = Column(DateTime, nullable=True, default=func.now())
