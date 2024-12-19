from sqlalchemy import TIMESTAMP, Column, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

desired_timezone = "Asia/Kolkata"


class Document_Table(Base):
    __tablename__ = "copilot_unstructured_documents"
    id = Column(Integer, primary_key=True, autoincrement=True)
    copilot_tool_id = Column(Integer)
    name = Column(Text)
    document_status = Column(Text, default="NA")
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.timezone(desired_timezone, func.now()))
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.timezone(desired_timezone, func.now()),
        onupdate=func.timezone(desired_timezone, func.now()),
        nullable=True,
    )
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)


class Status_Table(Base):
    __tablename__ = "copilot_unstructured_pipeline_status"
    id = Column(Integer, primary_key=True, autoincrement=True)
    copilot_tool_id = Column(Integer)
    run_id = Column(Text)
    job_status = Column(Text, default="NA")
    pipeline_type = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.timezone(desired_timezone, func.now()))
    updated_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.timezone(desired_timezone, func.now()),
        onupdate=func.timezone(desired_timezone, func.now()),
        nullable=True,
    )
    deleted_at = Column(TIMESTAMP(timezone=True), nullable=True)
