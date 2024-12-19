#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

# from http import client
# import random
# import string
# import uuid
import hashlib
import secrets

# from datetime import datetime
from enum import Enum

# from api.connectors.postgres import PostgresDatabase
# from api.helpers import CodexEnvParams
from api.main import db

# from flask import Flask, g
from flask_sqlalchemy import BaseQuery

# from sqlalchemy import Sequence
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import func


class QueryWithSoftDelete(BaseQuery):
    def __new__(cls, *args, **kwargs):
        obj = super(QueryWithSoftDelete, cls).__new__(cls)
        if len(args) > 0:
            super(QueryWithSoftDelete, obj).__init__(*args, **kwargs)
            return obj.filter_by(deleted_at=None)
        return obj

    def __init__(self, *args, **kwargs):
        pass


class UserGroupType(Enum):
    SYSTEM = 1
    USER_CREATED = 2

    def get_label(value):
        if value == 1:
            return "SYSTEM"
        elif value == 2:
            return "USER CREATED"
        else:
            return "NONE"


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


class CodexModelMixin(object):
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), nullable=True, onupdate=func.now())
    deleted_at = db.Column(db.DateTime(timezone=True), nullable=True)

    query_class = QueryWithSoftDelete

    @declared_attr
    def created_by(self):
        return db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    @declared_attr
    def updated_by(self):
        return db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    @declared_attr
    def deleted_by(self):
        return db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    @declared_attr
    def created_by_user(self):
        return db.relationship("User", foreign_keys=[self.created_by])

    @declared_attr
    def updated_by_user(self):
        return db.relationship("User", foreign_keys=[self.updated_by])

    @declared_attr
    def deleted_by_user(self):
        return db.relationship("User", foreign_keys=[self.deleted_by])


project_assignee_identifier = db.Table(
    "project_assignee_identifier",
    db.Column("project_id", db.Integer, db.ForeignKey("project.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)


class Project(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    industry = db.Column(db.Text, nullable=True)
    parent_project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=True)
    # 1 - Not started 2 - In progress 3 - Ready for review 4 - Reviewed 5 - Deployed to production
    project_status = db.Column(db.Integer, default=1)
    design_metadata = db.Column(db.Text, nullable=True)
    artifact_metadata = db.Column(db.Text, nullable=True)
    blueprint = db.Column(db.Text, nullable=True)
    assignee = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    reviewer = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    assignees = db.relationship("User", secondary=project_assignee_identifier)

    # for PD framework
    account = db.Column(db.String(200), nullable=True)
    problem_area = db.Column(db.String(1000), nullable=True)

    parent_project = db.relationship("Project", foreign_keys=[parent_project_id])
    assignee_user = db.relationship("User", foreign_keys=[assignee])
    review_user = db.relationship("User", foreign_keys=[reviewer])
    origin = db.Column(db.String(50), nullable=True)

    query_class = QueryWithSoftDelete

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
            for assignee_item in assignees:
                self.assignees.append(User.query.filter_by(id=assignee_item).first())


class ProjectComment(CodexModelMixin, db.Model):
    comment_text = db.Column(db.String(100000))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=True)
    widget_id = db.Column(db.String(100))

    project = db.relationship("Project", foreign_keys=[project_id])

    def __init__(self, comment_text, project_id, created_by, widget_id=None):
        self.comment_text = comment_text
        self.project_id = project_id
        self.created_by = created_by
        self.widget_id = widget_id


class ProjectCode(CodexModelMixin, db.Model):
    code_text = db.Column(db.Text)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    widget_id = db.Column(db.String(100))

    project = db.relationship("Project", foreign_keys=[project_id])

    def __init__(self, code_text, project_id, created_by, widget_id):
        self.code_text = code_text
        self.project_id = project_id
        self.created_by = created_by
        self.widget_id = widget_id


class ProjectAttachment(CodexModelMixin, db.Model):
    blob_name = db.Column(db.Text)
    file_name = db.Column(db.Text)
    file_header = db.Column(db.Text)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    widget_id = db.Column(db.String(100))

    project = db.relationship("Project", foreign_keys=[project_id])

    def __init__(self, blob_name, file_name, file_header, project_id, created_by, widget_id):
        self.blob_name = blob_name
        self.file_name = file_name
        self.file_header = file_header
        self.project_id = project_id
        self.created_by = created_by
        self.widget_id = widget_id


class ProjectNotebook(CodexModelMixin, db.Model):
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    blueprint = db.Column(db.Text, nullable=True)
    access_token = db.Column(db.String(64))
    name = db.Column(db.String(256), nullable=True)
    exec_env_id = db.Column(db.Integer, db.ForeignKey("execution_environment.id"))
    exec_logs = db.Column(db.Text, nullable=True)

    project = db.relationship("Project", foreign_keys=[project_id])
    execution_environment = db.relationship("ExecutionEnvironment", foreign_keys=[exec_env_id])

    def __init__(self, project_id, blueprint, created_by, name=None, exec_env_id=None):
        self.project_id = project_id
        self.blueprint = blueprint
        self.access_token = secrets.token_urlsafe(16)
        self.created_by = created_by

        if name is not None:
            self.name = name

        if exec_env_id is not None:
            self.exec_env_id = exec_env_id


class ProjectNotebookConfig(CodexModelMixin, db.Model):
    project_nb_id = db.Column(db.Integer, db.ForeignKey("project_notebook.id"))
    config_params = db.Column(db.Text, nullable=True)
    results = db.Column(db.Text, nullable=True)
    technique = db.Column(db.Text, nullable=True)
    dep_var = db.Column(db.Text, nullable=True)
    exogs = db.Column(db.Text, nullable=True)
    accuracy = db.Column(db.Float, nullable=True)
    params = db.Column(db.Text, nullable=True)
    name = db.Column(db.String(256), nullable=True)
    blueprint = db.Column(db.Text, nullable=True)
    exec_logs = db.Column(db.Text, nullable=True)
    execution_type = db.Column(db.Text, default="Manual")
    config_code = db.Column(db.Text, nullable=True)
    config_df = db.Column(db.Text, nullable=True)

    project_notebook = db.relationship("ProjectNotebook", foreign_keys=[project_nb_id])
    tags = db.relationship("ProjectNotebookConfigTag")

    def __init__(
        self,
        project_nb_id,
        config_params=None,
        results=None,
        technique=None,
        dep_var=None,
        exogs=None,
        accuracy=None,
        params=None,
        name=None,
        blueprint=None,
        exec_logs=None,
    ):
        self.project_nb_id = project_nb_id
        self.config_params = config_params
        self.results = results
        self.technique = technique
        self.dep_var = dep_var
        self.exogs = exogs
        self.accuracy = accuracy
        self.params = params
        self.blueprint = blueprint
        self.exec_logs = exec_logs
        self.name = name


class ProjectNotebookTriggered(CodexModelMixin, db.Model):
    project_nb_config_id = db.Column(db.Integer, db.ForeignKey("project_notebook_config.id"))
    trigger_status = db.Column(db.Text, default="Created")
    trigger_run_url = db.Column(db.Text, nullable=True)

    project_notebook_config = db.relationship("ProjectNotebookConfig", foreign_keys=[project_nb_config_id])

    def __init__(self, project_nb_config_id):
        self.project_nb_config_id = project_nb_config_id


class ProjectNotebookConfigTag(CodexModelMixin, db.Model):
    project_nb_config_id = db.Column(db.Integer, db.ForeignKey("project_notebook_config.id"))
    tag_name = db.Column(db.Text)
    tag_value = db.Column(db.Text)

    project_notebook_config = db.relationship(
        "ProjectNotebookConfig", foreign_keys=[project_nb_config_id], overlaps="tags"
    )

    def __init__(self, project_nb_config_id, tag_name, tag_value):
        self.project_nb_config_id = project_nb_config_id
        self.tag_name = tag_name
        self.tag_value = tag_value


class WidgetGroup(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    code = db.Column(db.String(100))
    light_color = db.Column(db.String(100))
    dark_color = db.Column(db.String(100))
    in_port = db.Column(db.Boolean, default=False)
    out_port = db.Column(db.Boolean, default=False)

    def __init__(
        self,
        name,
        code,
        light_color,
        dark_color,
        created_by,
        in_port=False,
        out_port=False,
    ):
        self.name = name
        self.code = code
        self.light_color = light_color
        self.dark_color = dark_color
        self.in_port = in_port
        self.out_port = out_port
        self.created_by = created_by


class Widget(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    group_id = db.Column(db.Integer, db.ForeignKey("widget_group.id"))
    contributor_code = db.Column(db.Text)
    test_code_params = db.Column(db.Text)
    prod_code_params = db.Column(db.Text)
    attachments_data = db.Column(db.Text)

    widget_group = db.relationship("WidgetGroup")

    def __init__(
        self,
        name,
        group_id,
        created_by,
        contributor_code=None,
        test_code_params=None,
        prod_code_params=None,
        attachments_data=None,
    ):
        self.name = name
        self.group_id = group_id
        self.contributor_code = contributor_code
        self.test_code_params = test_code_params
        self.prod_code_params = prod_code_params
        self.attachments_data = attachments_data
        self.created_by = created_by


class WidgetAttachment(CodexModelMixin, db.Model):
    blob_name = db.Column(db.Text)
    file_name = db.Column(db.Text)
    file_header = db.Column(db.Text)
    widget_id = db.Column(db.Integer, db.ForeignKey("widget.id"))

    widget = db.relationship("Widget", foreign_keys=[widget_id])

    def __init__(self, blob_name, file_name, file_header, widget_id, created_by):
        self.blob_name = blob_name
        self.file_name = file_name
        self.file_header = file_header
        self.widget_id = widget_id
        self.created_by = created_by


class Environment(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    db_config = db.Column(db.Text)
    pipeline_config = db.Column(db.Text)
    frontend_config = db.Column(db.Text)
    api_config = db.Column(db.Text)

    def __init__(
        self,
        name,
        created_by,
        db_config=None,
        pipeline_config=None,
        frontend_config=None,
        api_config=None,
    ):
        self.name = name
        self.db_config = db_config
        self.pipeline_config = pipeline_config
        self.frontend_config = frontend_config
        self.api_config = api_config
        self.created_by = created_by


class ExecutionEnvironment(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    language = db.Column(db.String(100), default="Python 3")
    requirements = db.Column(db.Text, nullable=True)
    widget_factory_version = db.Column(db.String(100), nullable=True)
    env_type = db.Column(db.String(100), default="Azure Databricks")
    py_version = db.Column(db.String(100), nullable=True)
    cluster_id = db.Column(db.String(100), nullable=True)
    config = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(100), nullable=True)

    def __init__(
        self,
        name,
        created_by,
        env_type,
        py_version="3.7.12",
        requirements=None,
        config=None,
        widget_factory_version=None,
    ):
        self.name = name
        self.requirements = requirements
        self.config = config
        self.widget_factory_version = widget_factory_version
        self.created_by = created_by
        self.env_type = env_type
        self.py_version = py_version


class AppConfig(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    notebook_id = db.Column(db.Integer, db.ForeignKey("project_notebook.id"))
    environment_id = db.Column(db.Integer, db.ForeignKey("environment.id"))
    contact_email = db.Column(db.Text)
    config = db.Column(db.Text)
    last_deployed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    last_deployed_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    deployed_app_id = db.Column(db.Integer)
    # QUEUED|IN-PROGRESS|SUCCESS|FAILURE
    deploy_status = db.Column(db.Text, nullable=True)
    deploy_logs = db.Column(db.Text, default="{}")

    environment = db.relationship("Environment")
    notebook = db.relationship("ProjectNotebook")
    last_deployed_by_user = db.relationship("User", foreign_keys=[last_deployed_by])

    def __init__(self, name, notebook_id, environment_id, contact_email, config, created_by):
        self.name = name
        self.notebook_id = notebook_id
        self.environment_id = environment_id
        self.contact_email = contact_email
        self.config = config
        self.created_by = created_by


user_group_identifier = db.Table(
    "user_group_identifier",
    db.Column("user_group_id", db.Integer, db.ForeignKey("user_group.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)

nac_user_role_identifier = db.Table(
    "nac_user_role_identifier",
    db.Column("nac_role_id", db.Integer, db.ForeignKey("nac_roles.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)


class HexByteString(db.TypeDecorator):
    """Convert Python bytestring to string with hexadecimal digits and back for storage."""

    impl = db.String

    def process_bind_param(self, value, dialect):
        if not isinstance(value, bytes):
            raise TypeError("HexByteString columns support only bytes values.")
        return value.hex()

    def process_result_value(self, value, dialect):
        return bytes.fromhex(value) if value else None


class User(CodexModelMixin, db.Model):
    first_name = db.Column(db.String(1000), nullable=True)
    last_name = db.Column(db.String(1000), nullable=True)
    email_address = db.Column(db.String(1000), nullable=True)
    password_hash = db.Column(HexByteString, nullable=True)
    last_login = db.Column(db.DateTime(timezone=True))
    last_logout = db.Column(db.DateTime(timezone=True))
    access_key = db.Column(db.String(1000), nullable=True)
    user_groups = db.relationship("UserGroup", secondary=user_group_identifier)
    nac_user_roles = db.relationship("NacRoles", secondary=nac_user_role_identifier)
    restricted_user = db.Column(db.Boolean, default=False)
    failed_login_count = db.Column(db.Integer, default=0)
    failed_login_at = db.Column(db.DateTime(timezone=True), nullable=True)

    query_class = QueryWithSoftDelete

    def __init__(
        self,
        first_name,
        last_name,
        email_address,
        created_by=False,
        updated_by=False,
        login=False,
        access_key=False,
        user_groups=False,
        nac_user_roles=False,
        password=False,
        restricted_user=False,
        auto_generation=False,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = email_address

        if created_by:
            self.created_by = created_by
        if updated_by:
            self.updated_by = updated_by

        if login:
            self.last_login = func.now()

        if access_key:
            self.access_key = secrets.token_urlsafe(16)

        self.user_groups.append(UserGroup.query.filter_by(name="default-user").first())
        if auto_generation:
            self.user_groups.append(UserGroup.query.filter(func.lower(UserGroup.name) == "coach").first())
        if user_groups:
            for user_group_item in user_groups:
                self.user_groups.append(UserGroup.query.filter_by(id=user_group_item).first())
        if nac_user_roles:
            for user_group_item in nac_user_roles:
                self.nac_user_roles.append(NacRoles.query.filter_by(id=user_group_item).first())
        if password:
            # create hashed password = hash(salt + password)
            self.password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                password.encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )
        else:
            self.password_hash = hashlib.pbkdf2_hmac(
                "sha256",
                secrets.token_urlsafe(16).encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            )

        self.restricted_user = restricted_user


class UserGroup(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=True)
    user_group_type = db.Column(db.Integer, default=1)
    app = db.Column(db.Boolean, default=True)
    case_studies = db.Column(db.Boolean, default=False)
    my_projects_only = db.Column(db.Boolean, default=False)
    my_projects = db.Column(db.Boolean, default=False)
    all_projects = db.Column(db.Boolean, default=False)
    rbac = db.Column(db.Boolean, default=False)
    widget_factory = db.Column(db.Boolean, default=False)
    environments = db.Column(db.Boolean, default=False)
    app_publish = db.Column(db.Boolean, default=False)
    prod_app_publish = db.Column(db.Boolean, default=False)
    users = db.relationship("User", secondary=user_group_identifier, overlaps="user_groups")

    query_class = QueryWithSoftDelete

    def __init__(
        self,
        name,
        created_by,
        user_group_type=1,
        app=True,
        case_studies=False,
        my_projects_only=False,
        my_projects=False,
        all_projects=False,
        widget_factory=False,
        environments=False,
        app_publish=False,
        prod_app_publish=False,
        rbac=False,
    ):
        self.name = name
        self.app = app
        self.case_studies = case_studies
        self.my_projects = my_projects
        self.my_projects_only = my_projects_only
        self.all_projects = all_projects
        self.widget_factory = widget_factory
        self.environments = environments
        self.app_publish = app_publish
        self.rbac = rbac
        self.user_group_type = user_group_type
        self.created_by = created_by
        self.prod_app_publish = prod_app_publish


class JobStatus(CodexModelMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(UUID(as_uuid=True), unique=True)
    job_status = db.Column(db.Text)  # QUEUED|IN-PROGRESS|SUCCESS|FAILURE
    job_type = db.Column(db.String(100))
    parameters = db.Column(db.Text)
    logs = db.Column(db.Text)

    def __init__(self, job_id, job_status, job_type, parameters, logs, created_by):
        self.job_id = job_id
        self.job_status = job_status
        self.job_type = job_type
        self.parameters = parameters
        self.logs = logs
        self.created_by = created_by


class UserPasswordCode(CodexModelMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user_email = db.Column(db.String(100), nullable=False)
    secret = db.Column(HexByteString, nullable=True)
    attempt = db.Column(db.Integer, default=0)
    verify_attempt = db.Column(db.Integer, default=0)

    def __init__(self, user_id, user_email, secret, attempt):
        self.user_id = user_id
        self.user_email = user_email
        self.secret = secret
        self.attempt = attempt


nac_role_permissions_identifier = db.Table(
    "nac_role_permissions_identifier",
    db.Column("nac_role_id", db.Integer, db.ForeignKey("nac_roles.id")),
    db.Column("nac_role_permissions_id", db.Integer, db.ForeignKey("nac_role_permissions.id")),
)


class NacRoles(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=False)
    user_role_type = db.Column(db.Integer, default=1)
    role_permissions = db.relationship("NacRolePermissions", secondary=nac_role_permissions_identifier)
    users = db.relationship("User", secondary=nac_user_role_identifier, overlaps="nac_user_roles")

    query_class = QueryWithSoftDelete

    def __init__(self, name, role_permissions=False, created_by=False, user_role_type=1):
        self.name = name
        if role_permissions:
            for permission in role_permissions:
                self.role_permissions.append(NacRolePermissions.query.filter_by(id=permission).first())
        self.user_role_type = user_role_type
        if created_by:
            self.created_by = created_by


class NacRolePermissions(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=False, unique=True)
    permission_type = db.Column(db.Integer, default=1)
    roles = db.relationship(
        "NacRoles",
        secondary=nac_role_permissions_identifier,
        overlaps="role_permissions",
    )
    query_class = QueryWithSoftDelete

    def __init__(self, name, created_by, permission_type=1):
        self.name = name
        self.permission_type = permission_type
        self.created_by = created_by


class ProblemDefinitionVersion(CodexModelMixin, db.Model):
    version_id = db.Column(UUID(as_uuid=True), unique=True)
    version_name = db.Column(db.String(1000), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=True)
    is_current = db.Column(db.Boolean, nullable=False)
    content = db.Column(db.Text, nullable=True)

    project = db.relationship("Project", foreign_keys=[project_id])

    def __init__(self, version_id, version_name, project_id, is_current, content, created_by):
        self.version_id = version_id
        self.version_name = version_name
        self.project_id = project_id
        self.is_current = is_current
        self.content = content
        self.created_by = created_by
