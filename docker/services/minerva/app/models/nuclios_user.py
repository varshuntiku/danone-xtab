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
from sqlalchemy import Column, DateTime, Integer, String


class NucliOSUser(Base):
    """
    Table for capturing user metadata
    """

    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email_address = Column(String(1000), nullable=True)
    first_name = Column(String(1000), nullable=True)
    last_name = Column(String(1000), nullable=True)
    deleted_at = Column(DateTime, nullable=True)
