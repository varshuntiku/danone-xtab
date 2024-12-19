import json
import uuid

from api.constants.ml_model.variables import ApprovalStatus, JobStatus, ModelStatus
from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    Boolean,
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
from sqlalchemy.orm import relationship, validates


@mapper_registry.mapped
class ModelJob(BaseModelMixin):
    __tablename__ = "model_job"
    type = Column(String(100))
    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(100), default=JobStatus.CREATED.value)
    progress = Column(Integer, nullable=True)
    approval_status = Column(String(100), default=ApprovalStatus.PENDING.value)
    approval_status_updated_by = Column(Integer, ForeignKey("user.id"), nullable=True)
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

    __table_args__ = (UniqueConstraint("uuid", name="uq_model_job_uuid"),)


@mapper_registry.mapped
class SupportedModel(BaseModelMixin):
    __tablename__ = "supported_model"
    name = Column(String(1000))
    description = Column(String(5000), nullable=True)
    tags = Column(String(5000), nullable=True)
    task_type = Column(String(500), nullable=True)
    size = Column(String(10), nullable=True)
    estimated_cost = Column(Float, nullable=True)
    version = Column(String(2000), nullable=True)
    is_finetunable = Column(Boolean, default=False)
    is_finetuned = Column(Boolean, default=False)
    config = Column(Text(), nullable=True)  # holds Job JSON and other Configs.
    is_submitted = Column(Boolean, default=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    job_id = Column(Integer, ForeignKey("model_job.id"))
    job = relationship("ModelJob", backref="jobs")
    parent_model_id = Column(Integer, ForeignKey("supported_model.id"), nullable=True)
    parent_model = relationship("SupportedModel", backref="parent_models", remote_side="SupportedModel.id")

    __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class HostedModel(BaseModelMixin):
    __tablename__ = "hosted_model"
    name = Column(String(1000))
    endpoint = Column(String(5000), nullable=True)
    # source = Column(String(1000), nullable=True)
    main_access_key = Column(String(1000))  # uuid4
    aux_access_key = Column(String(1000), nullable=True)  # uuid4
    status = Column(String(100), default=ModelStatus.ACTIVE.value)  # active, inactive, archieved and deleted
    type = Column(String(100), nullable=True)
    description = Column(String(5000), nullable=True)
    cost = Column(Float, nullable=True)  # Future Use
    # quantization = Column(Boolean, default=False)
    # quantization_type = Column(String(200), nullable=True)
    # number_of_bits = Column(String(100), nullable=True)  # 4 bit/8 bit
    # compute_data_type = Column(String(200), nullable=True)
    # use_double_quantization = Column(Boolean, default=False)
    config = Column(Text(), nullable=True)  # holds Job JSON and other Configs.
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    original_model_id = Column(Integer, ForeignKey(SupportedModel.id))
    original_model = relationship("SupportedModel", backref="base_model")
    job_id = Column(Integer, ForeignKey("model_job.id"))
    job = relationship("ModelJob", backref="deployed_models")

    __table_args__ = (UniqueConstraint("name", name="uq_hosted_model_name"),)


# @mapper_registry.mapped
# class ModelTransaction(BaseModelMixin):
#     __tablename__ = "model_transaction"
#     execution_time = Column(Integer)
#     app_id = Column(Integer, ForeignKey("app.id"))
#     # TODO: Enable this once db migration is done
#     # project_id = Column(Integer, ForeignKey("project.id"))
#     called_by = Column(Integer, ForeignKey("user.id"), nullable=True)
#     input = Column(Text)
#     output = Column(Text)
#     other_info = Column(Text)
#     vm_id = Column(Integer, ForeignKey("virtual_machine.id"))

#     def __init__(self, input, output, execution_time, other_info=None, vm_id=None):
#         self.input = input
#         self.output = output
#         self.execution_time = execution_time
#         self.other_info = other_info
#         self.vm_id = vm_id

#     # TODO: Uncomment when needed.
#     # @property
#     # def project_id(self):
#     #     return self.project_id

#     # @project_id.setter
#     # def project_id(self, project_id):
#     #     self.status = project_id

#     # @property
#     # def called_by(self):
#     #     return self.called_by

#     # @called_by.setter
#     # def called_by(self, called_by):
#     #     self.status = called_by


# @mapper_registry.mapped
# class VirtualMachine(BaseModelMixin):
#     """Can be used to track each VM. or List the types of VM being used."""

#     __tablename__ = "virtual_machine"

#     name = Column(String(100))
#     cost_per_hour = Column(Float)
#     uptime = Column(Float)

#     def __init__(self, name, cost_per_hour) -> None:
#         self.name = name
#         self.cost_per_hour = cost_per_hour
