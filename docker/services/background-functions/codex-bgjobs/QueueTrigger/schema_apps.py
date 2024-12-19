#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import secrets
from enum import Enum

from flask_sqlalchemy import BaseQuery, SQLAlchemy
from sqlalchemy import UniqueConstraint
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.sql import and_, func

# from .api.main import db
db = SQLAlchemy()  # for Bg jobs


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


class CodexModelMixin(object):
    __bind_key__ = "APP_DB"
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


class Function(CodexModelMixin, db.Model):
    industry = db.Column(db.Text)
    name = db.Column(db.Text)
    logo = db.Column(db.Text)
    orderby = db.Column(db.Integer, default=0)


class App(CodexModelMixin, db.Model):
    name = db.Column(db.Text)
    theme = db.Column(db.Text)
    contact_email = db.Column(db.Text)
    modules = db.Column(db.Text)
    industry = db.Column(db.Text, nullable=True)
    function = db.Column(db.Text, nullable=True)
    problem_area = db.Column(db.Text, nullable=True)
    problem = db.Column(db.Text, nullable=True)
    config_link = db.Column(db.Text, nullable=True)
    blueprint_link = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    approach_blob_name = db.Column(db.Text, nullable=True)
    logo_blob_name = db.Column(db.Text, nullable=True)
    small_logo_blob_name = db.Column(db.Text, nullable=True)
    orderby = db.Column(db.Integer, default=0)
    restricted_app = db.Column(db.Boolean, default=False)

    def __init__(self, name, theme, contact_email, modules):
        self.name = name
        self.theme = theme
        self.contact_email = contact_email
        self.modules = modules


app_user_role_identifier = db.Table(
    "app_user_role_identifier",
    db.Column("app_user_role_id", db.Integer, db.ForeignKey("app_user_role.id")),
    db.Column("app_user_id", db.Integer, db.ForeignKey("app_user.id")),
)


class AppUserRole(CodexModelMixin, db.Model):
    name = db.Column(db.Text)
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    permissions = db.Column(db.Text, nullable=True)

    def __init__(self, name, app_id, permissions):
        self.name = name
        self.app_id = app_id
        self.permissions = permissions


class AppUser(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    first_name = db.Column(db.String(1000), nullable=True)
    last_name = db.Column(db.String(1000), nullable=True)
    user_email = db.Column(db.String(1000))
    is_admin = db.Column(db.Boolean, default=False)
    user_roles = db.relationship(
        "AppUserRole",
        secondary=app_user_role_identifier,
        primaryjoin=lambda: and_(
            AppUserRole.deleted_at.is_(None),
            app_user_role_identifier.c.app_user_id == AppUser.id,
        ),
    )
    permissions = db.Column(db.Text, nullable=True)

    def __init__(
        self,
        app_id,
        user_email,
        first_name=None,
        last_name=None,
        is_admin=False,
        permissions=False,
        user_roles=False,
    ):
        self.app_id = app_id
        self.user_email = user_email
        self.first_name = first_name
        self.last_name = last_name
        self.is_admin = is_admin

        if permissions:
            self.permissions = permissions

        if user_roles:
            for user_role_item in user_roles:
                self.user_roles.append(AppUserRole.query.filter_by(id=user_role_item).first())


class AppScreen(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    screen_index = db.Column(db.Integer)
    screen_name = db.Column(db.String(100))
    screen_description = db.Column(db.Text)
    screen_filters_open = db.Column(db.Boolean, default=False)
    screen_auto_refresh = db.Column(db.Boolean, default=False)
    screen_image = db.Column(db.String(100))
    level = db.Column(db.Integer, nullable=True)
    horizontal = db.Column(db.Boolean, nullable=True)
    graph_type = db.Column(db.String(100), nullable=True)
    last_deleted = db.Column(db.Boolean, default=False)
    rating_url = db.Column(db.String(2000), nullable=True)
    screen_filters_value = db.Column(db.Text, default=False)
    action_settings = db.Column(db.Text, default=False)

    application = db.relationship("App")
    widgets = db.relationship("AppScreenWidget")

    def __init__(
        self,
        app_id,
        screen_index,
        screen_name,
        screen_description,
        screen_filters_open,
        screen_auto_refresh,
        screen_filters_value,
        screen_image,
        action_settings,
        level=None,
        horizontal=None,
        graph_type=None,
    ):
        self.app_id = app_id
        self.screen_index = screen_index
        self.screen_name = screen_name
        self.screen_description = screen_description
        self.screen_filters_open = screen_filters_open
        self.screen_auto_refresh = screen_auto_refresh
        self.screen_image = screen_image
        self.level = level
        self.horizontal = horizontal
        self.graph_type = graph_type
        self.screen_filters_value = screen_filters_value
        self.action_settings = action_settings


class AppScreenWidget(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"), index=True)
    widget_index = db.Column(db.Integer)
    widget_key = db.Column(db.String(100))
    is_label = db.Column(db.Boolean, default=False)
    config = db.Column(db.Text)
    last_deleted = db.Column(db.Boolean, default=False)

    screen = db.relationship("AppScreen", foreign_keys=[screen_id], overlaps="widgets")
    application = db.relationship("App", foreign_keys=[app_id])
    filters = db.relationship("AppScreenWidgetFilterValue")
    values = db.relationship("AppScreenWidgetValue")

    def __init__(self, app_id, screen_id, widget_index, widget_key, is_label, config):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_index = widget_index
        self.widget_key = widget_key
        self.is_label = is_label
        self.config = config


class AppScreenWidgetValue(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"), index=True)
    widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"), index=True)
    widget_value = db.Column(db.Text)
    widget_simulated_value = db.Column(db.Text)
    last_deleted = db.Column(db.Boolean, default=False)

    screen_widget = db.relationship("AppScreenWidget", foreign_keys=[widget_id], overlaps="values")
    screen = db.relationship("AppScreen", foreign_keys=[screen_id])
    application = db.relationship("App", foreign_keys=[app_id])
    filters = db.relationship("AppScreenWidgetFilterValue")

    def __init__(self, app_id, screen_id, widget_id, widget_value, widget_simulated_value):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_id = widget_id
        self.widget_value = widget_value
        self.widget_simulated_value = widget_simulated_value


class AppScreenWidgetFilterValue(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"), index=True)
    widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"), index=True)
    widget_value_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget_value.id"), index=True)
    widget_tag_key = db.Column(db.String(100))
    widget_tag_value = db.Column(db.String(100))
    last_deleted = db.Column(db.Boolean, default=False)

    screen_widget_value = db.relationship("AppScreenWidgetValue", foreign_keys=[widget_value_id], overlaps="filters")
    screen_widget = db.relationship("AppScreenWidget", foreign_keys=[widget_id], overlaps="filters")
    screen = db.relationship("AppScreen", foreign_keys=[screen_id])
    application = db.relationship("App", foreign_keys=[app_id])

    def __init__(
        self,
        app_id,
        screen_id,
        widget_id,
        widget_value_id,
        widget_tag_key,
        widget_tag_value,
    ):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_id = widget_id
        self.widget_value_id = widget_value_id
        self.widget_tag_key = widget_tag_key
        self.widget_tag_value = widget_tag_value


user_group_identifier = db.Table(
    "user_group_identifier",
    db.Column("user_group_id", db.Integer, db.ForeignKey("user_group.id")),
    db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
)


class User(CodexModelMixin, db.Model):
    first_name = db.Column(db.String(1000), nullable=True)
    last_name = db.Column(db.String(1000), nullable=True)
    email_address = db.Column(db.String(1000), nullable=True)
    last_login = db.Column(db.DateTime(timezone=True))
    access_key = db.Column(db.String(1000), nullable=True)
    user_groups = db.relationship("UserGroup", secondary=user_group_identifier)

    query_class = QueryWithSoftDelete

    def __init__(
        self,
        first_name,
        last_name,
        email_address,
        created_by=False,
        login=False,
        access_key=False,
        user_groups=False,
    ):
        self.first_name = first_name
        self.last_name = last_name
        self.email_address = email_address

        if created_by:
            self.created_by = created_by

        if login:
            self.last_login = func.now()

        if access_key:
            self.access_key = secrets.token_urlsafe(16)

        self.user_groups.append(UserGroup.query.filter_by(name="default-user").first())
        if user_groups:
            for user_group_item in user_groups:
                self.user_groups.append(UserGroup.query.filter_by(id=user_group_item).first())


class UserGroup(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000), nullable=True)
    user_group_type = db.Column(db.Integer, default=1)
    config = db.Column(db.Text)
    rbac = db.Column(db.Boolean, default=False)
    users = db.relationship("User", secondary=user_group_identifier, overlaps="user_groups")

    query_class = QueryWithSoftDelete

    def __init__(self, name, created_by, user_group_type=1, rbac=False):
        self.name = name
        self.rbac = rbac
        self.user_group_type = user_group_type
        self.created_by = created_by


class StoryLayout(CodexModelMixin, db.Model):
    layout_style = db.Column(db.JSON, nullable=True)
    layout_props = db.Column(db.JSON, nullable=True)
    thumbnail_blob_name = db.Column(db.Text, nullable=True)
    layout_name = db.Column(db.String(100), nullable=True)

    def __init__(self, layout_style, layout_props, thumbnail_blob_name=None, layout_name=None):
        self.layout_style = layout_style
        self.layout_props = layout_props
        self.thumbnail_blob_name = thumbnail_blob_name
        self.layout_name = layout_name


class StoryAppMapping(CodexModelMixin, db.Model):
    story_id = db.Column(db.Integer, db.ForeignKey("story.id"))
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))

    def __init__(self, story_id, app_id, created_by):
        self.story_id = story_id
        self.app_id = app_id
        self.created_by = created_by


class Story(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    # app_id = db.Column(db.Integer, db.ForeignKey('app.id'))
    system_created = db.Column(db.Boolean, default=False)
    story_file_links = db.Column(db.Text, nullable=True)
    story_json = db.Column(db.Text, nullable=True)
    schedule_info = db.Column(db.Text, nullable=True)
    story_type = db.Column(db.String(100), nullable=True, default="oneshot")
    # apps = db.relationship("app", secondary=StoryAppMapping)

    def __init__(
        self,
        name,
        description,
        created_by,
        system_created=False,
        story_json=None,
        story_type="oneshot",
    ):
        self.name = name
        self.description = description
        self.created_by = created_by
        # self.app_id = app_id
        self.system_created = system_created
        self.story_json = story_json
        self.story_type = story_type


class Scenarios(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    user_email = db.Column(db.String(100), nullable=True)
    app_screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"))
    widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"), index=True)
    scenarios_json = db.Column(db.Text, nullable=True)
    filters_json = db.Column(db.Text, nullable=True)
    # apps = db.relationship("app", secondary=StoryAppMapping)

    def __init__(
        self,
        name,
        description,
        user_email,
        app_id,
        app_screen_id,
        widget_id,
        scenarios_json=None,
        filters_json=None,
    ):
        self.name = name
        self.description = description
        self.user_email = user_email
        self.app_id = app_id
        self.app_screen_id = app_screen_id
        self.widget_id = widget_id
        self.scenarios_json = scenarios_json
        self.filters_json = filters_json


class Industry(CodexModelMixin, db.Model):
    industry_name = db.Column(db.String(100), nullable=False)
    logo_name = db.Column(db.String(100), nullable=False)
    horizon = db.Column(db.String(100))
    order = db.Column(db.Integer, default=0)

    def __init__(self, industry_name, logo_name, horizon, order):
        self.industry_name = industry_name
        self.logo_name = logo_name
        self.horizon = horizon
        self.order = order


class Functions(CodexModelMixin, db.Model):
    industry_id = db.Column(db.Integer, db.ForeignKey("industry.id"))
    function_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    logo_name = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, default=0)
    industry = db.relationship("Industry", foreign_keys=[industry_id])

    def __init__(self, industry_id, function_name, description, logo_name, order):
        self.industry_id = industry_id
        self.function_name = function_name
        self.description = description
        self.logo_name = logo_name
        self.order = order


class ObjectivesGroup(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    group_name = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)

    def __init__(self, app_id, group_name, description):
        self.app_id = app_id
        self.group_name = group_name
        self.description = description


class Objectives(CodexModelMixin, db.Model):
    group_id = db.Column(db.Integer, db.ForeignKey("objectives_group.id"))
    objective_name = db.Column(db.String(100), nullable=False)
    next_recommended_objective = db.Column(db.Integer, nullable=True)

    def __init__(self, group_id, objective_name, next_recommended_objective):
        self.group_id = group_id
        self.objective_name = objective_name
        self.next_recommended_objective = next_recommended_objective


class ObjectivesSteps(CodexModelMixin, db.Model):
    objective_id = db.Column(db.Integer, db.ForeignKey("objectives.id"))
    app_screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"))
    title = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, default=0)
    graph_type = db.Column(db.Text, nullable=True)
    horizontal = db.Column(db.Boolean, nullable=True)

    def __init__(self, Objective_id, title, description, order, graph_type, horizontal):
        self.Objective_id = Objective_id
        self.title = title
        self.description = description
        self.order = order
        self.graph_type = graph_type
        self.horizontal = horizontal


class objectives_steps_widget_value(CodexModelMixin, db.Model):
    objectives_steps_id = db.Column(db.Integer, db.ForeignKey("objectives_steps.id"))
    widget_value = db.Column(db.JSON, nullable=True)
    title = db.Column(db.Text, nullable=True)
    sub_title = db.Column(db.Text, nullable=True)
    order = db.Column(db.Integer, default=0)

    def __init__(self, objectives_steps_id, widget_value, title, description, order):
        self.objectives_steps_id = objectives_steps_id
        self.widget_value = widget_value
        self.title = title
        self.description = description
        self.order = order


class StoryContent(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    story_id = db.Column(db.Integer, db.ForeignKey("story.id"))
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    app_screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"))
    app_screen_widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"))
    app_screen_widget_value_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget_value.id"))
    filter_data = db.Column(db.Text, nullable=True)
    content_json = db.Column(db.Text, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "app_id",
            "app_screen_id",
            "app_screen_widget_id",
            "app_screen_widget_value_id",
            "story_id",
            "filter_data",
        ),
    )
    # orderby = db.Column(db.Integer, nullable=True)
    # layout_id = db.Column(db.Integer, db.ForeignKey('story_layout.id'))

    # order=None, layout=None):
    def __init__(
        self,
        name,
        description,
        created_by,
        story_id,
        app_id,
        app_screen_id,
        app_screen_widget_id,
        app_screen_widget_value_id,
        filter_data,
        content_json,
    ):
        self.name = name
        self.description = description
        self.story_id = story_id
        self.app_id = app_id
        self.app_screen_id = app_screen_id
        self.app_screen_widget_id = app_screen_widget_id
        self.app_screen_widget_value_id = app_screen_widget_value_id
        self.created_by = created_by
        self.filter_data = filter_data
        self.content_json = content_json
        # self.orderby = order
        # self.layout_id = layout


class StoryPages(CodexModelMixin, db.Model):
    story_id = db.Column(db.Integer, db.ForeignKey("story.id"))
    layout_id = db.Column(db.Integer, db.ForeignKey("story_layout.id"))
    page_json = db.Column(db.JSON, nullable=True)
    page_order = db.Column(db.Integer, nullable=True)

    def __init__(self, story_id, layout_id, page_json, page_order):
        self.story_id = story_id
        self.layout_id = layout_id
        self.page_json = page_json
        self.page_order = page_order


class StoryAccess(CodexModelMixin, db.Model):
    story_id = db.Column(db.Integer, db.ForeignKey("story.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    read = db.Column(db.Boolean, default=True)
    write = db.Column(db.Boolean, default=False)
    delete = db.Column(db.Boolean, default=False)

    def __init__(self, story_id, user_id, read, write, delete):
        self.story_id = story_id
        self.user_id = user_id
        self.read = read
        self.write = write
        self.delete = delete


class StoryShare(CodexModelMixin, db.Model):
    story_id = db.Column(db.Integer, db.ForeignKey("story.id"))
    email = db.Column(db.String(100), default=False)
    is_link = db.Column(db.Boolean, default=False)
    is_attachment = db.Column(db.Boolean, default=False)
    shared_by = db.Column(db.String(100), default=False)

    def __init__(self, story_id, email, is_link, is_attachment, shared_by):
        self.story_id = story_id
        self.email = email
        self.is_link = is_link
        self.is_attachment = is_attachment
        self.shared_by = shared_by


class EmailType(Enum):
    share_report = 1


class Alerts(CodexModelMixin, db.Model):
    title = db.Column(db.String(100), nullable=True)
    message = db.Column(db.Text, nullable=True)
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    app_screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"))
    app_screen_widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"))
    filter_data = db.Column(db.Text, nullable=True)
    category = db.Column(db.String, nullable=True)
    condition = db.Column(db.String, nullable=True)
    threshold = db.Column(db.Integer, nullable=True)
    receive_notification = db.Column(db.Boolean, nullable=True)
    active = db.Column(db.Boolean, nullable=True)
    source_type = db.Column(db.String, nullable=True)
    widget_type = db.Column(db.String, nullable=True)
    user_email = db.Column(db.String(100), nullable=True)
    widget_url = db.Column(db.String, nullable=True)

    def __init__(
        self,
        title,
        message,
        created_by,
        user_email,
        app_id,
        app_screen_id,
        app_screen_widget_id,
        filter_data,
        category,
        condition,
        threshold,
        receive_notification,
        active,
        source_type,
        widget_type,
        widget_url,
    ):
        self.title = title
        self.message = message
        self.created_by = created_by
        self.user_email = user_email
        self.app_id = app_id
        self.app_screen_id = app_screen_id
        self.app_screen_widget_id = app_screen_widget_id
        self.filter_data = filter_data
        self.category = category
        self.condition = condition
        self.threshold = threshold
        self.receive_notification = receive_notification
        self.active = active
        self.source_type = source_type
        self.widget_type = widget_type
        self.widget_url = widget_url


class Notifications(CodexModelMixin, db.Model):
    alert_id = db.Column(db.Integer, db.ForeignKey("alerts.id"))
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    widget_id = db.Column(db.Integer, db.ForeignKey("app_screen_widget.id"))
    title = db.Column(db.String(100), nullable=True)
    message = db.Column(db.Text, nullable=True)
    is_read = db.Column(db.Boolean, nullable=True)
    user_email = db.Column(db.String(100), nullable=True)
    widget_name = db.Column(db.String, nullable=True)
    shared_by = db.Column(db.String, nullable=True)

    def __init__(
        self,
        alert_id,
        app_id,
        widget_id,
        title,
        message,
        is_read,
        user_email,
        widget_name,
        shared_by,
    ):
        self.alert_id = alert_id
        self.app_id = app_id
        self.widget_id = widget_id
        self.title = title
        self.message = message
        self.is_read = is_read
        self.user_email = user_email
        self.widget_name = widget_name
        self.shared_by = shared_by


class AlertsUser(CodexModelMixin, db.Model):
    alert_id = db.Column(db.Integer, db.ForeignKey("alerts.id"))
    user_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(100), nullable=True)
    user_email = db.Column(db.String(100), nullable=True)

    def __init__(self, alert_id, user_id, user_name, user_email):
        self.alert_id = alert_id
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
