#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import json
import uuid

from api.databases.base_class import Base, mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, validates


@mapper_registry.mapped
class Function(BaseModelMixin):
    __tablename__ = "function"

    industry = Column(Text)
    name = Column(Text)
    logo = Column(Text)
    orderby = Column(Integer, default=0)


# user_group_identifier = Table(
#     "user_group_identifier",
#     Column("user_group_id", Integer, ForeignKey("user_group.id")),
#     Column("user_id", Integer, ForeignKey("user.id")),
# )


# class User(BaseModelMixin):
#     first_name = Column(String(1000), nullable=True)
#     last_name = Column(String(1000), nullable=True)
#     email_address = Column(String(1000), nullable=True)
#     last_login = Column(DateTime(timezone=True))
#     access_key = Column(String(1000), nullable=True)
#     user_groups = relationship("UserGroup", secondary=user_group_identifier)

#     query_class = QueryWithSoftDelete

#     def __init__(
#         self,
#         first_name,
#         last_name,
#         email_address,
#         created_by=False,
#         login=False,
#         access_key=False,
#         user_groups=False,
#     ):
#         self.first_name = first_name
#         self.last_name = last_name
#         self.email_address = email_address

#         if created_by:
#             self.created_by = created_by

#         if login:
#             self.last_login = func.now()

#         if access_key:
#             self.access_key = secrets.token_urlsafe(16)

#         self.user_groups.append(UserGroup.query.filter_by(name="default-user").first())
#         if user_groups:
#             for user_group_item in user_groups:
#                 self.user_groups.append(UserGroup.query.filter_by(id=user_group_item).first())


# class UserGroup(BaseModelMixin):
#     name = Column(String(1000), nullable=True)
#     user_group_type = Column(Integer, default=1)
#     config = Column(Text)
#     rbac = Column(Boolean, default=False)
#     users = relationship("User", secondary=user_group_identifier, overlaps="user_groups")

#     query_class = QueryWithSoftDelete

#     def __init__(self, name, created_by, user_group_type=1, rbac=False):
#         self.name = name
#         self.rbac = rbac
#         self.user_group_type = user_group_type
#         self.created_by = created_by


@mapper_registry.mapped
class MinervaApps(BaseModelMixin):
    __tablename__ = "minerva_apps"
    """
    Minerva Application Table
    """
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(250), nullable=False)
    description = Column(String(1000))
    app_config = Column(JSON)

    def __init__(self, name, description, app_config):
        self.name = name
        self.description = description
        self.app_config = app_config


@mapper_registry.mapped
class MinervaConversationWindow(BaseModelMixin):
    __tablename__ = "minerva_conversation_window"
    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApps.id))
    user_id = Column(String, nullable=False)
    title = Column(String(1000))
    pinned = Column(Boolean)

    def __init__(self, application_id, user_id, user_query=None, title=None, pinned=False):
        self.application_id = application_id
        self.user_id = user_id
        self.user_query = user_query
        self.title = title
        self.pinned = pinned


@mapper_registry.mapped
class MinervaConversation(BaseModelMixin):
    __tablename__ = "minerva_conversation"
    """
    Table for capturing Minerva user conversations
    """

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApps.id))
    user_id = Column(String, nullable=False)
    user_query = Column(String(1000))
    minerva_response = Column(JSON)
    feedback = Column(Integer, nullable=True)
    conversation_window_id = Column(Integer, ForeignKey(MinervaConversationWindow.id))

    def __init__(
        self,
        application_id,
        user_id,
        user_query=None,
        minerva_response=None,
        feedback=None,
        conversation_window_id=None,
    ):
        self.application_id = application_id
        self.user_id = user_id
        self.user_query = user_query
        self.minerva_response = minerva_response
        self.feedback = feedback
        self.conversation_window_id = conversation_window_id


@mapper_registry.mapped
class MinervaModels(BaseModelMixin):
    __tablename__ = "minerva_models"
    """
    Table for capturing Minerva models
    """

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    host = Column(String, nullable=False)
    type = Column(String, nullable=False)
    config = Column(JSON)
    features = Column(JSON)

    def __init__(self, host, type, config={}, features={}):
        self.host = host
        self.type = type
        self.config = config
        self.features = features


@mapper_registry.mapped
class MinervaPrompts(BaseModelMixin):
    __tablename__ = "minerva_prompts"
    """
    Table for capturing Minerva prompts
    """

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey(MinervaModels.id))
    tool_type = Column(String, nullable=False)
    prompt = Column(JSON)

    def __init__(self, model_id, tool_type, prompt=[]):
        self.model_id = model_id
        self.tool_type = tool_type
        self.prompt = prompt


@mapper_registry.mapped
class MinervaDocument(BaseModelMixin):
    __tablename__ = "minerva_document"
    application_id = Column(Integer, ForeignKey(MinervaApps.id))
    name = Column(Text)
    meta = Column(JSON)

    def __init__(self, application_id, name, url, meta):
        self.application_id = application_id
        self.name = name
        self.meta = meta


@mapper_registry.mapped
class MinervaJobStatus(BaseModelMixin):
    __tablename__ = "minerva_job_status"
    application_id = Column(Integer, ForeignKey(MinervaApps.id))
    run_id = Column(String(100))
    status = Column(Text)
    name = Column(Text)
    type = Column(Text)

    def __init__(self, application_id, run_id, status, name, type):
        self.application_id = application_id
        self.run_id = run_id
        self.status = status
        self.name = name
        self.type = type


@mapper_registry.mapped
class MinervaConsumer(BaseModelMixin):
    __tablename__ = "minerva_consumer"
    """
    Table for capturing Minerva consumers
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    # To be added: op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"') in alembic
    access_key = Column(Text, nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    allowed_origins = Column(JSON)
    features = Column(JSON)
    auth_agents = Column(JSON)


minerva_app_consumer_mapping = Table(
    "minerva_app_consumer_mapping",
    Base.metadata,
    Column("minerva_app_id", Integer, ForeignKey("minerva_apps.id"), nullable=True),
    Column("consumer_id", Integer, ForeignKey("minerva_consumer.id")),
    Column("copilot_app_id", Integer, ForeignKey("copilot_app.id"), nullable=True),
)


@mapper_registry.mapped
class CopilotOrchestrator(BaseModelMixin):
    __tablename__ = "copilot_orchestrator"
    name = Column(String(100))
    identifier = Column(String(100))
    desc = Column(Text, nullable=True)
    config = Column(JSON)
    disabled = Column(Boolean)


@mapper_registry.mapped
class CopilotApp(BaseModelMixin):
    __tablename__ = "copilot_app"
    """
    Table for capturing Copilot App
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)
    orchestrator_id = Column(Integer, ForeignKey(CopilotOrchestrator.id))
    orchestrator_config = Column(JSON)
    is_test = Column(Boolean, default=False, nullable=True)


@mapper_registry.mapped
class CopilotConversationWindow(BaseModelMixin):
    __tablename__ = "copilot_conversation_window"
    """
    Table for capturing copilot conversations
    """

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(CopilotApp.id))
    user_id = Column(String, nullable=False)
    title = Column(String(1000))
    pinned = Column(Boolean)


@mapper_registry.mapped
class CopilotConversation(BaseModelMixin):
    __tablename__ = "copilot_conversation"
    """
    Table for capturing copilot and user messages
    """

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(CopilotApp.id))
    user_id = Column(String, nullable=False)
    user_query = Column(String(1000))
    copilot_response = Column(JSON)
    feedback = Column(Integer, nullable=True)
    comment = Column(JSON)
    conversation_window_id = Column(Integer, ForeignKey(CopilotConversationWindow.id))
    pinned = Column(Boolean)
    interrupted = Column(Boolean)
    extra_info = Column(JSON, nullable=True)
    request_type = Column(String(100))
    input_mode = Column(String(100))
    extra_query_param = Column(Text)
    request_payload = Column(JSON)
    error = Column(String(1000))


@mapper_registry.mapped
class CopilotToolBaseVersion(BaseModelMixin):
    __tablename__ = "copilot_tool_base_version"
    """
    Table for capturing copilot tool base version
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)


@mapper_registry.mapped
class CopilotToolDeploymentAgent(BaseModelMixin):
    __tablename__ = "copilot_tool_deployment_agent"
    """
    Table for capturing copilot tool deployment agent
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)


copilot_tool_deployment_agent_base_version_mapping = Table(
    "copilot_tool_deployment_agent_base_version_mapping",
    Base.metadata,
    Column("deployment_agent_id", Integer, ForeignKey(CopilotToolDeploymentAgent.id)),
    Column("base_version_id", Integer, ForeignKey(CopilotToolBaseVersion.id)),
)


@mapper_registry.mapped
class CopilotTool(BaseModelMixin):
    __tablename__ = "copilot_tool"
    """
    Table for capturing copilot Tool Definition
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)


@mapper_registry.mapped
class CopilotToolVersion(BaseModelMixin):
    __tablename__ = "copilot_tool_version"
    """
    Table for capturing copilot Tool Version
    """

    tool_id = Column(Integer, ForeignKey(CopilotTool.id))
    commit_id = Column(String(100), unique=True)
    desc = Column(Text)
    input_params = Column(JSON)
    config = Column(JSON)
    verified = Column(Boolean, default=False)
    is_test = Column(Boolean, default=False, nullable=True)
    base_version_id = Column(Integer, ForeignKey(CopilotToolBaseVersion.id))


@mapper_registry.mapped
class CopilotToolRegistry(BaseModelMixin):
    __tablename__ = "copilot_tool_registry"
    """
    Table for capturing copilot Tool Registry
    """

    name = Column(String(100), nullable=False)
    desc = Column(Text)
    config = Column(JSON)
    is_test = Column(Boolean, default=False, nullable=True)


@mapper_registry.mapped
class CopilotToolVersionRegistryMapping(BaseModelMixin):
    __tablename__ = "copilot_tool_version_registry_mapping"
    """
    Table for capturing CopilotToolVersion & Registry mapping
    """

    tool_version_id = Column(Integer, ForeignKey(CopilotToolVersion.id))
    registry_id = Column(Integer, ForeignKey(CopilotToolRegistry.id))
    approved = Column(Boolean)
    deprecated = Column(Boolean)
    deployment_status = Column(String(100))
    info = Column(JSON)
    version = Column(String(100))
    deployment_agent_id = Column(Integer, ForeignKey(CopilotToolDeploymentAgent.id))


@mapper_registry.mapped
class CopilotDataSource(BaseModelMixin):
    __tablename__ = "copilot_data_source"
    """
    Table for capturing Copilot Data Source
    """

    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    config = Column(JSON)


@mapper_registry.mapped
class CopilotAppDeployment(BaseModelMixin):
    __tablename__ = "copilot_app_deployment"
    """
    Table for capturing the Copilot App Deployment
    """

    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    config = Column(JSON)


@mapper_registry.mapped
class CopilotAppPublishedToolMapping(BaseModelMixin):
    __tablename__ = "copilot_app_published_tool_mapping"
    """
    Table for capturing the Copilot App and Published Tools mapping
    """

    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    tool_version_registry_mapping_id = Column(Integer, ForeignKey(CopilotToolVersionRegistryMapping.id))
    name = Column(String(100), nullable=False)
    desc = Column(Text)
    status = Column(String(100))
    config = Column(JSON)
    preprocess_config = Column(JSON)
    input_params = Column(JSON)


@mapper_registry.mapped
class CopilotConversationDatasource(BaseModelMixin):
    __tablename__ = "copilot_conversation_datasource"
    """
    Table for capturing conversation datasource
    """
    conversation_id = Column(Integer, ForeignKey(CopilotConversation.id))
    name = Column(Text)
    meta = Column(JSON)
    type = Column(Text)


@mapper_registry.mapped
class CopilotDatasourceMinervaDocument(BaseModelMixin):
    __tablename__ = "copilot_datasource_minerva_document"
    datasource_id = Column(Integer, ForeignKey(CopilotDataSource.id))
    name = Column(Text)
    meta = Column(JSON)

    def __init__(self, datasource_id, name, url, meta):
        self.datasource_id = datasource_id
        self.name = name
        self.meta = meta


@mapper_registry.mapped
class CopilotAppDatasourcePublishedToolMapping(BaseModelMixin):
    __tablename__ = "copilot_app_datasource_published_tool_mapping"
    """
    Table for capturing the Copilot App Datasource and Copilot App Published Tools mapping
    """

    datasource_id = Column(Integer, ForeignKey(CopilotDataSource.id))
    app_published_tool_id = Column(Integer, ForeignKey(CopilotAppPublishedToolMapping.id))
    key = Column(String(100))
    config = Column(JSON)


copilot_tool_version_orchestrator_mapping = Table(
    "copilot_tool_version_orchestrator_mapping",
    Base.metadata,
    Column("tool_version_id", Integer, ForeignKey(CopilotToolVersion.id)),
    Column("orchestrator_id", Integer, ForeignKey(CopilotOrchestrator.id)),
)


# class AIResponseTracker(BaseModelMixin):
#     app_id = Column(Integer, ForeignKey('app.id'), index=True)
#     screen_id = Column(Integer, ForeignKey('app_screen.id'), index=True)
#     event_type = Column(String(100), nullable=False)
#     event_response = Column(String(), nullable=False)
#     user_email = Column(String(100), nullable=False)

#     screen = relationship("AppScreen", foreign_keys=[screen_id], overlaps="widgets")
#     application = relationship("App", foreign_keys=[app_id])

#     def __init__(self, app_id, screen_id, event_type, event_response, user_email):
#         self.app_id = app_id
#         self.screen_id = screen_id
#         self.event_type = event_type
#         self.event_response = event_response
#         self.user_email = user_email


# ******************** GenAI Models ********************


@mapper_registry.mapped
class ModelJob(BaseModelMixin):
    __tablename__ = "model_job"
    type = Column(String(100))
    uuid = Column(UUID(as_uuid=True), default=uuid.uuid4)
    # UniqueConstraint("uuid", name="uq_model_job_uuid")
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(100), default="created")
    progress = Column(Integer, nullable=True)
    approval_status = Column(String(100), default="pending")
    approval_status_updated_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    config = Column(Text(), nullable=True)  # holde Job JSON and other Configs.
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

    # def __init__(self, config) -> None:
    #     self.uuid = ""  # Generate an UUID
    #     self.config = config

    # @property
    # def started_at(self):
    #     return self.started_at

    # @started_at.setter
    # def started_at(self, started_at):
    #     self.status = started_at

    # @property
    # def ended_at(self):
    #     return self.ended_at

    # @ended_at.setter
    # def ended_at(self, ended_at):
    #     self.status = ended_at

    # @property
    # def type(self):
    #     return self.type

    # @type.setter
    # def type(self, type):
    #     # TODO: should be used thorugh an ENUM
    #     if status in ("deployment", "fine-tuning", "import", "others"):
    #         self.type = type
    #     else:
    #         raise ValueError("Invalid Type")

    # @property
    # def status(self):
    #     return self.status

    # @status.setter
    # def status(self, status):
    #     if status in ("active", "inactive", "archived", "deleted"):
    #         self.status = status
    #     else:
    #         raise ValueError("Invalid status")


@mapper_registry.mapped
class SupportedModel(BaseModelMixin):
    __tablename__ = "supported_model"
    name = Column(String(1000))
    # UniqueConstraint("name", name="uq_supported_model_name")
    description = Column(String(5000), nullable=True)
    tags = Column(String(5000), nullable=True)
    task_type = Column(String(500), nullable=True)
    location = Column(String(5000), nullable=True)
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

    # def __init__(self, unique_name, description, tags, is_custom) -> None:
    #     super().__init__()
    #     self.name = unique_name
    #     self.description = description
    #     self.tags = tags
    #     self.is_custom = is_custom

    # @property
    # def size(self):
    #     return self.size

    # @size.setter
    # def size(self_size):
    #     self.size = model_size

    # @property
    # def location(self):
    #     return self.location

    # @location.setter
    # def location(self_location):
    #     self.location = model_location

    # @property
    # def job_id(self):
    #     return self.job_id

    # @job_id.setter
    # def job_id(self, job_id):
    #     self.job_id = job_id

    # @property
    # def estimated_cost(self):
    #     return self.location

    # @estimated_cost.setter
    # def estimated_cost(self, estimated_cost):
    #     self.estimated_cost = estimated_cost

    # @property
    # def parent_model_id(self):
    #     return self.location

    # @parent_model_id.setter
    # def parent_model_id(self, parent_model_id):
    #     self.parent_model_id = parent_model_id


@mapper_registry.mapped
class HostedModel(BaseModelMixin):
    __tablename__ = "hosted_model"
    name = Column(String(1000))
    # UniqueConstraint("name", name="uq_hosted_model_name")
    endpoint = Column(String(5000), nullable=True)
    # source = Column(String(1000), nullable=True)
    main_access_key = Column(String(1000))
    aux_access_key = Column(String(1000), nullable=True)
    status = Column(String(100), default="active")
    type = Column(String(100), nullable=True)
    description = Column(String(5000), nullable=True)
    cost = Column(Float, nullable=True)
    # number_of_bits = Column(String(100), nullable=True)  # 4 bit/8 bit
    # quantization = Column(Boolean, default=False)
    # compute_data_type = Column(String(200), nullable=True)
    # quantization_type = Column(String(200), nullable=True)
    # use_double_quantization = Column(Boolean, default=False)
    config = Column(Text(), nullable=True)  # holde Job JSON and other Configs.
    started_at = Column(DateTime(timezone=True), nullable=True)
    ended_at = Column(DateTime(timezone=True), nullable=True)
    original_model_id = Column(Integer, ForeignKey(SupportedModel.id))
    original_model = relationship("SupportedModel", backref="base_model")
    job_id = Column(Integer, ForeignKey("model_job.id"))
    job = relationship("ModelJob", backref="deployed_models")

    __table_args__ = (UniqueConstraint("name", name="uq_hosted_model_name"),)

    def __init__(
        self,
        deployment_name,
        endpoint,
        main_access_key,
        aux_access_key,
        status,
        origin_model_id,
    ) -> None:
        self.deployment_name = deployment_name
        self.endpoint = endpoint
        self.main_access_key = main_access_key
        self.aux_access_key = aux_access_key
        self.status = status
        self.original_model_id = origin_model_id

    # @property
    # def job_id(self):
    #     return self.job_id

    # @job_id.setter
    # def job_id(self, job_id):
    #     self.job_id = job_id

    # @property
    # def status(self):
    #     return self.status

    # @status.setter
    # def status(self, status):
    #     if status in ("active", "inactive", "archived", "deleted"):
    #         self.status = status
    #     else:
    #         raise ValueError("Invalid status")

    # def generate_main_key(self):
    #     """TODO: write logic to generate the main key"""
    #     raise NotImplementedError()

    # def generate_aux_key(self):
    #     """TODO: write logic to generate the main key"""
    #     raise NotImplementedError()

    # class ModelTransaction(BaseModelMixin):
    #     execution_time = Column(Integer)
    #     app_id = Column(Integer, ForeignKey("app.id"))
    #     # TODO: Enable this once db migration is done
    #     # project_id = Column(Integer, ForeignKey("project.id"))
    #     called_by = Column(Integer, ForeignKey("user.id"))
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

    #     # @property
    #     # def app_id(self):
    #     #     return self.app_id

    #     # @app_id.setter
    #     # def app_id(self, app_id):
    #     #     self.status = app_id

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

    # class VirtualMachine(BaseModelMixin):


#     """Can be used to track each VM. or List the types of VM being used."""

#     name = Column(String(100))
#     cost_per_hour = Column(Float)
#     uptime = Column(Float)

#     def __init__(self, name, cost_per_hour) -> None:
#         self.name = name
#         self.cost_per_hour = cost_per_hour


@mapper_registry.mapped
class LLMExperimentSetting(BaseModelMixin):
    __tablename__ = "llm_experiment_setting"
    peft_method = Column(String(255), nullable=True)
    quantization = Column(Boolean, default=False)
    gradient_acc_steps = Column(Integer, nullable=True)
    logging_steps = Column(Integer, nullable=True)
    save_steps = Column(Integer, nullable=True)
    lr_scheduler_type = Column(String(255), nullable=True)
    lora_alpha = Column(Integer, nullable=True)
    lora_rank = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=False)

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMExperiment(BaseModelMixin):
    __tablename__ = "llm_experiment"
    name = Column(String(500))
    problem_type = Column(String(255), nullable=True)
    epochs = Column(Integer, nullable=True)
    test_size = Column(Float, nullable=True)
    batch_size = Column(Integer, nullable=True)
    max_tokens = Column(Integer, nullable=True)
    learning_rate = Column(Float, nullable=False)
    error_metric_type = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    experiment_settings_id = Column(Integer, ForeignKey("llm_experiment_setting.id"))
    experiment_settings = relationship("LLMExperimentSetting", backref="experiments")
    dataset_id = Column(Integer, ForeignKey("llm_data_registry.id"))
    dataset = relationship("LLMDataRegistry", backref="experiments")
    compute_id = Column(Integer, ForeignKey("llm_compute_config.id"))
    compute = relationship("LLMComputeConfig", backref="experiments")
    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="experiments")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMExperimentResult(BaseModelMixin):
    __tablename__ = "llm_experiment_result"
    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_results")
    accuracy = Column(Float, nullable=True)
    run_time = Column(Integer, nullable=True)
    log_path = Column(String(500), nullable=True)
    error_metrics = Column(Text, nullable=True)  # list of string
    train_loss = Column(Text, nullable=True)  # list of string
    deep_dive = Column(Text, nullable=True)  # list of string
    checkpoint_log_path = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMComputeConfig(BaseModelMixin):
    __tablename__ = "llm_compute_config"
    sku = Column(String(255))
    type = Column(String(255), nullable=True)
    compute_type = Column(String(255), nullable=True)
    compute_service_id = Column(Integer, ForeignKey("compute_service.id"))
    compute_service = relationship("ComputeService", backref="compute_services")
    vcpu = Column(Integer, nullable=True)
    ram = Column(Integer, nullable=True)
    iops = Column(Integer, nullable=True)
    storage_size = Column(String(255), nullable=True)
    estimated_cost = Column(Float, nullable=True)
    data_disks = Column(Integer, nullable=True)
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="cloud_providers")
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMCloudProvider(BaseModelMixin):
    __tablename__ = "llm_cloud_provider"
    name = Column(String(255))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ComputeService(BaseModelMixin):
    __tablename__ = "compute_service"
    name = Column(String(255))
    compute_type = Column(String(255))
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    # compute_service = relationship("LLMCloudProvider", backref="compute_services")
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMExperimentCheckpoint(BaseModelMixin):
    __tablename__ = "llm_experiment_checkpoint"
    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_checkpoints")
    name = Column(String(255))
    model_path = Column(String(255), nullable=True)
    checkpoint_path = Column(String(255), nullable=True)
    train_result_path = Column(String(255), nullable=True)
    error_metrics_path = Column(String(255), nullable=True)  # checkpoint json path
    eval_path = Column(String(255), nullable=True)
    eval_status = Column(String(255), nullable=True)
    eval_result = Column(Text, nullable=True)
    error_metrics = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMExperimentRunTracer(BaseModelMixin):
    __tablename__ = "llm_experiment_run_tracer"
    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_run_tracers")
    pod_name = Column(String(255))
    container_name = Column(String(255), nullable=True)
    pod_status = Column(String(255), nullable=True)
    namespace = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMModelRegistry(BaseModelMixin):
    __tablename__ = "llm_model_registry"
    name = Column(String(255))
    source = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)
    problem_type = Column(String(255), nullable=True)
    model_type = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)
    # types = relationship("LLMModelType", secondary=lambda: llm_model_type_mapping, backref="model")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMModelConfig(BaseModelMixin):
    __tablename__ = "llm_model_config"
    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="configs")
    model_path = Column(String(255), nullable=True)
    model_path_type = Column(String(255), nullable=True)
    api_key = Column(String(255), nullable=True)
    model_params = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMModelType(BaseModelMixin):
    __tablename__ = "llm_model_type"

    type = Column(String(255))
    is_active = Column(Boolean, default=False)
    # models = relationship("LLMModelRegistry", secondary=lambda: llm_model_type_mapping, backref="type")


llm_model_type_mapping = Table(
    "llm_model_type_mapping",
    Base.metadata,
    Column("model_id", ForeignKey("llm_model_registry.id"), primary_key=True),
    Column("type_id", ForeignKey("llm_model_type.id"), primary_key=True),
)


@mapper_registry.mapped
class LLMDataRegistry(BaseModelMixin):
    __tablename__ = "llm_data_registry"
    dataset_name = Column(String(255))
    file_name = Column(String(255), nullable=True)
    file_path = Column(String(255), nullable=True)
    file_type = Column(String(255), nullable=True)
    access_token = Column(String(255), nullable=True)
    source_id = Column(Integer, ForeignKey("llm_dataset_source.id"))
    source = relationship("LLMDatasetSource", backref="data_registries")
    dataset_folder = Column(String(255), nullable=True)
    access_token = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMDatasetSource(BaseModelMixin):
    __tablename__ = "llm_dataset_source"
    source_type = Column(String(255))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMDeployedModel(BaseModelMixin):
    __tablename__ = "llm_deployed_model"
    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="llm_deployed_models")
    name = Column(String(500))
    description = Column(Text, nullable=True)
    endpoint = Column(String(500), nullable=True)
    status = Column(String(255), nullable=True)
    approval_status = Column(String(255), default="pending")
    deployment_type_id = Column(Integer, ForeignKey("llm_deployment_type.id"))
    deployment_type = relationship("LLMDeploymentType", backref="deployments")
    is_active = Column(Boolean, default=False)
    progress = Column(Integer, default=0)
    model_params = Column(JSON)


@mapper_registry.mapped
class LLMDeploymentType(BaseModelMixin):
    __tablename__ = "llm_deployment_type"
    name = Column(String(255))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMDeploymentExperimentMapping(BaseModelMixin):
    __tablename__ = "llm_deployment_experiment_mapping"
    deployment_id = Column(Integer, ForeignKey("llm_deployed_model.id"))
    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    checkpoint_id = Column(Integer, ForeignKey("llm_experiment_checkpoint.id"))
    is_active = Column(Boolean, default=False)


project_assignee_identifier = Table(
    "project_assignee_identifier",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("project.id")),
    Column("user_id", Integer, ForeignKey("user.id")),
)


@mapper_registry.mapped
class Project(BaseModelMixin):
    __tablename__ = "project"
    name = Column(String(100))
    industry = Column(Text, nullable=True)
    parent_project_id = Column(Integer, ForeignKey("project.id"), nullable=True)
    # 1 - Not started 2 - In progress 3 - Ready for review 4 - Reviewed 5 - Deployed to production
    project_status = Column(Integer, default=1)
    design_metadata = Column(Text, nullable=True)
    artifact_metadata = Column(Text, nullable=True)
    blueprint = Column(Text, nullable=True)
    assignee = Column(Integer, ForeignKey("user.id"), nullable=True)
    reviewer = Column(Integer, ForeignKey("user.id"), nullable=True)
    assignees = relationship("User", secondary=project_assignee_identifier)

    # for PD framework
    account = Column(String(200), nullable=True)
    problem_area = Column(String(1000), nullable=True)

    parent_project = relationship("Project", foreign_keys=[parent_project_id])
    assignee_user = relationship("User", foreign_keys=[assignee])
    review_user = relationship("User", foreign_keys=[reviewer])
    origin = Column(String(50), nullable=True)

    def __init__(
        self,
        name,
        industry,
        project_status,
        assignees,
        reviewer,
        created_by,
        parent_project_id=None,
        blueprint=None,
        design_metadata=None,
        account=None,
        problem_area=None,
        origin=None,
    ):
        self.name = name
        self.industry = industry
        self.project_status = project_status
        # self.assignee = assignee
        self.reviewer = reviewer
        self.created_by = created_by
        self.parent_project_id = parent_project_id
        self.blueprint = blueprint
        self.design_metadata = design_metadata
        self.account = account
        self.problem_area = problem_area
        self.origin = origin

        if assignees:
            print("This line is commented, update it to use this")
            # for assignee_item in assignees:
            # self.assignees.append(User.query.filter_by(id=assignee_item).first())


class ProjectStatus(Enum):
    NOT_STARTED = 1
    IN_PROGRESS = 2
    READY_FOR_REVIEW = 3
    REVIEWED = 4
    DEPLOYED_TO_PROD = 5

    def get_label(value):
        if value == 1:
            return "NOT STARTED"
        elif value == 2:
            return "IN PROGRESS"
        elif value == 3:
            return "READY FOR REVIEW"
        elif value == 4:
            return "REVIEWED"
        elif value == 5:
            return "DEPLOYED TO PROD"
        else:
            return "NONE"


@mapper_registry.mapped
class ProblemDefinitionVersion(BaseModelMixin):
    __tablename__ = "problem_definition_version"
    version_id = Column(UUID(as_uuid=True), unique=True)
    version_name = Column(String(1000), nullable=False)
    project_id = Column(Integer, ForeignKey("project.id"), nullable=True)
    is_current = Column(Boolean, nullable=False)
    content = Column(Text, nullable=True)

    project = relationship("Project", foreign_keys=[project_id])

    def __init__(self, version_id, version_name, project_id, is_current, content, created_by):
        self.version_id = version_id
        self.version_name = version_name
        self.project_id = project_id
        self.is_current = is_current
        self.content = content
        self.created_by = created_by


@mapper_registry.mapped
class ExecutionEnvironment(BaseModelMixin):
    __tablename__ = "execution_environment"
    name = Column(String(100))
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="execution_environments")
    infra_type_id = Column(Integer, ForeignKey("infra_type.id"))
    infra_type = relationship("InfraType", backref="execution_environments")
    hosting_type = Column(String(255), nullable=True)
    compute_id = Column(Integer, ForeignKey("llm_compute_config.id"))
    compute = relationship("LLMComputeConfig", backref="execution_environments")
    env_type = Column(String(255))
    compute_type = Column(String(255))
    env_category = Column(String(255))
    run_time = Column(String(255))
    run_time_version = Column(String(255))
    endpoint = Column(String(255))
    replicas = Column(Integer)
    packages = Column(Text, nullable=True)
    index_url = Column(Text, nullable=True)
    status = Column(String(255), nullable=True)
    logs = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)

    def __init__(self, name, desc, config):
        self.name = name
        self.desc = desc
        self.config = config


# @mapper_registry.mapped
# class ExecutionEnvironmentProjectMapping(BaseModelMixin):
#     __tablename__ = "execution_environment_project_mapping"
#     project_id = Column(Integer, ForeignKey("project.id"))
#     execution_environment_id = Column(Integer, ForeignKey("execution_environment.id"))
#     config = Column(JSON)

#     project = relationship("Project", backref="execution_env_project_mappings")
#     execution_env = relationship("ExecutionEnvironment", backref="execution_env_project_mappings")


@mapper_registry.mapped
class InfraType(BaseModelMixin):
    __tablename__ = "infra_type"

    name = Column(String(255))
    cloud_provider_id = Column(Integer, ForeignKey("llm_cloud_provider.id"))
    cloud_provider = relationship("LLMCloudProvider", backref="infra_types")


@mapper_registry.mapped
class CodeExecutionLogs(BaseModelMixin):
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


@mapper_registry.mapped
class ExecutionEnvironmentAppMapping(BaseModelMixin):
    __tablename__ = "execution_environment_app_mapping"

    app_id = Column(Integer, ForeignKey("app.id"))
    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentProjectMapping(BaseModelMixin):
    __tablename__ = "execution_environment_project_mapping"

    project_id = Column(Integer, ForeignKey("project.id"))
    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class AppProjectMapping(BaseModelMixin):
    __tablename__ = "app_project_mapping"

    project_id = Column(Integer, ForeignKey("project.id"))
    app_id = Column(Integer, ForeignKey("app.id"))
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class ExecutionEnvironmentDeployment(BaseModelMixin):
    __tablename__ = "execution_environment_deployment"

    env_id = Column(Integer, ForeignKey("execution_environment.id"))
    name = Column(String(255))
    namespace = Column(String(255))
    uuid = Column(UUID(as_uuid=True), nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class CopilotContext(BaseModelMixin):
    __tablename__ = "copilot_context"
    """
    Table for capturing Copilot Context
    """

    name = Column(String(100), nullable=False)
    type = Column(String(100), nullable=False)
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    source_type = Column(String(100), nullable=False)


@mapper_registry.mapped
class CopilotContextDatasource(BaseModelMixin):
    __tablename__ = "copilot_context_datasource"
    context_id = Column(Integer, ForeignKey(CopilotContext.id))
    name = Column(Text)
    config = Column(JSON)
    context = relationship("CopilotContext", backref="context_datasource")

    def __init__(self, context_id, name, config):
        self.context_id = context_id
        self.name = name
        self.config = config


@mapper_registry.mapped
class CopilotContextDatasourceAppToolMapping(BaseModelMixin):
    __tablename__ = "copilot_context_datasource_app_tool_mapping"
    """
    Table for capturing the Copilot App Context Datasource and Copilot App Tool mapping
    """

    context_datasource_id = Column(Integer, ForeignKey(CopilotContextDatasource.id))
    app_tool_id = Column(Integer, ForeignKey(CopilotAppPublishedToolMapping.id))
    config = Column(JSON)
