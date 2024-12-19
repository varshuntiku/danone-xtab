import json
import uuid

from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import validates
from sqlalchemy.sql import func


@mapper_registry.mapped
class ExecJob(BaseModelMixin):
    __tablename__ = "executor_jobs"
    type = Column(String(100))
    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    progress = Column(Integer, nullable=True)
    config = Column(Text(), nullable=True)  # holds Job JSON and other Configs.
    result = Column(Text(), nullable=True)  # holds Job result.

    @validates("config")
    def validate_config(self, key, config):
        if config is not None:
            try:
                json.loads(config)  # Checking if string is valid JSON.
            except ValueError:
                # except json.decoder.JSONDecodeError:
                raise ValueError("Not valid JSON provided for field config.")
        return config

    __table_args__ = (UniqueConstraint("uuid", name="executor_job_uuid"),)


@mapper_registry.mapped
class CodeExecutionLogs(object):
    __tablename__ = "code_execution_logs"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    exec_env_id = Column(Integer, ForeignKey("execution_environment.id"))
    execution_time = Column(Float, nullable=True)
    execution_context = Column(Text, nullable=True)
    errors = Column(Text, nullable=True)
    logs = Column(Text, nullable=True)
    execution_type = Column(String(255), nullable=True)
    invoked_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    execution_start_time = Column(DateTime(timezone=True), nullable=True)
    execution_end_time = Column(DateTime(timezone=True), nullable=True)
    execution_status = Column(String(255), nullable=True)
