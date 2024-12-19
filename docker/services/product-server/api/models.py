#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


import json
import secrets
import uuid
from enum import Enum

# from flask import Flask, g
from flask_sqlalchemy import BaseQuery
from sqlalchemy import UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import validates
from sqlalchemy.sql import and_, func

# from .api.main import db
from .main import db

# from api.connectors.postgres import PostgresDatabase
# from api.helpers import CodexEnvParams


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


class AppContainer(CodexModelMixin, db.Model):
    problem_area = db.Column(db.Text, nullable=True)
    problem = db.Column(db.Text, nullable=True)
    blueprint_link = db.Column(db.Text, nullable=True)
    approach_blob_name = db.Column(db.Text, nullable=True)
    orderby = db.Column(db.Integer, default=0)

    def __init__(
        self,
        order,
        prob_area=None,
        problem=None,
        blueprint_link=None,
        approach_blob_name=None,
    ) -> None:
        self.orderby = order
        self.problem_area = prob_area
        self.problem = problem
        self.blueprint_link = blueprint_link
        self.approach_blob_name = approach_blob_name


class App(CodexModelMixin, db.Model):
    name = db.Column(db.Text)
    theme = db.Column(db.Text)
    contact_email = db.Column(db.Text)
    modules = db.Column(db.Text)
    app_creator_id = db.Column(db.Integer, default=0, nullable=False)
    is_connected_systems_app = db.Column(db.Boolean, default=False)

    config_link = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    logo_blob_name = db.Column(db.Text, nullable=True)
    small_logo_blob_name = db.Column(db.Text, nullable=True)
    restricted_app = db.Column(db.Boolean, default=False)
    environment = db.Column(db.Text, default="prod")

    container_id = db.Column(db.Integer, db.ForeignKey("app_container.id"), index=True, nullable=True)
    variables = db.Column(db.Text, nullable=True)
    function_defns = db.Column(db.Text, nullable=True)
    color = db.Column(db.String(10), nullable=True)
    parent_container = db.relationship("AppContainer")
    container_mapping = None

    # TO BE DELETED In subsequent versions.
    # industry = db.Column(db.Text, nullable=True)
    # function = db.Column(db.Text, nullable=True)
    problem_area = db.Column(db.Text, nullable=True)
    problem = db.Column(db.Text, nullable=True)
    blueprint_link = db.Column(db.Text, nullable=True)
    approach_blob_name = db.Column(db.Text, nullable=True)
    orderby = db.Column(db.Integer, default=0)
    source_app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True, nullable=True)
    parent_application = db.relationship("App")
    theme_id = db.Column(db.Integer, db.ForeignKey("app_theme.id"), nullable=True)

    def __init__(
        self,
        name,
        contact_email,
        modules,
        app_creator_id,
        color=None,
        theme_id=None,
        is_connected_systems_app=False,
    ):
        self.name = name
        self.theme_id = theme_id
        self.contact_email = contact_email
        self.modules = modules
        self.app_creator_id = app_creator_id
        self.color = color
        self.is_connected_systems_app = is_connected_systems_app

    def container_mapping_details(self):
        container_mapping = ContainerMapping.query.filter(ContainerMapping.container_id == self.container_id).all()
        self.container_mapping = container_mapping
        return container_mapping

    def industries(self):
        industries_details = [
            Industry.query.filter_by(id=container_mapping.industry_id, deleted_at=None).first()
            for container_mapping in self.container_mapping_details()
        ]
        filtered_industries_details = list(filter(lambda item: item is not None, industries_details))
        return filtered_industries_details

    def industry_names(self):
        return ",".join(list(map(lambda industry: industry.industry_name, self.industries())))

    def functions(self):
        functions_details = [
            Functions.query.filter_by(id=container_mapping.function_id, deleted_at=None).first()
            for container_mapping in self.container_mapping_details()
        ]
        filtered_functions_details = list(filter(lambda item: item is not None, functions_details))
        return filtered_functions_details

    def function_names(self):
        return ",".join(list(map(lambda function: function.function_name, self.functions())))


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
    hidden = db.Column(db.Boolean, default=False)
    marked = db.Column(db.Boolean, default=False)
    user_guide = db.Column(db.Text, nullable=True, default=None)
    ai_response = db.Column(db.Text)
    ai_response_verified_at = db.Column(db.DateTime(timezone=True), nullable=True)
    ai_response_verified_email = db.Column(db.String(1000), nullable=True)
    ai_response_verified_name = db.Column(db.String(1000), nullable=True)
    graph_width = db.Column(db.String(100), nullable=True)
    graph_height = db.Column(db.String(100), nullable=True)

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
        hidden=False,
        marked=False,
        level=None,
        horizontal=None,
        graph_type=None,
        user_guide=None,
        graph_width=None,
        graph_height=None,
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
        self.hidden = hidden
        self.user_guide = user_guide
        self.marked = marked
        self.graph_width = graph_width
        self.graph_height = graph_height


class AppScreenAIResponseRating(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    screen_id = db.Column(db.Integer, db.ForeignKey("app_screen.id"), index=True)
    response_rating = db.Column(db.Integer, default=1)
    response_rating_by_email = db.Column(db.String(1000))
    response_rating_by_name = db.Column(db.String(1000))

    def __init__(
        self,
        app_id,
        screen_id,
        response_rating,
        response_rating_by_email,
        response_rating_by_name,
    ):
        self.app_id = app_id
        self.screen_id = screen_id
        self.response_rating = response_rating
        self.response_rating_by_email = response_rating_by_email
        self.response_rating_by_name = response_rating_by_name


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
    access_token = db.Column(db.String(64), nullable=True)

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
        self.access_token = secrets.token_urlsafe(16)


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


# user_group_identifier = db.Table(
#     "user_group_identifier",
#     db.Column("user_group_id", db.Integer, db.ForeignKey("user_group.id")),
#     db.Column("user_id", db.Integer, db.ForeignKey("user.id")),
# )


# class User(CodexModelMixin, db.Model):
#     first_name = db.Column(db.String(1000), nullable=True)
#     last_name = db.Column(db.String(1000), nullable=True)
#     email_address = db.Column(db.String(1000), nullable=True)
#     last_login = db.Column(db.DateTime(timezone=True))
#     access_key = db.Column(db.String(1000), nullable=True)
#     user_groups = db.relationship("UserGroup", secondary=user_group_identifier)

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


# class UserGroup(CodexModelMixin, db.Model):
#     name = db.Column(db.String(1000), nullable=True)
#     user_group_type = db.Column(db.Integer, default=1)
#     config = db.Column(db.Text)
#     rbac = db.Column(db.Boolean, default=False)
#     users = db.relationship("User", secondary=user_group_identifier, overlaps="user_groups")

#     query_class = QueryWithSoftDelete

#     def __init__(self, name, created_by, user_group_type=1, rbac=False):
#         self.name = name
#         self.rbac = rbac
#         self.user_group_type = user_group_type
#         self.created_by = created_by


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
    parent_industry_id = db.Column(db.Integer, db.ForeignKey("industry.id"), nullable=True)
    logo_name = db.Column(db.String(100), nullable=False)
    horizon = db.Column(db.String(100))
    order = db.Column(db.Integer, default=0)
    description = db.Column(db.Text, nullable=True)
    color = db.Column(db.String(10), nullable=True)
    level = db.Column(db.String(100), nullable=True)

    def __init__(
        self,
        industry_name,
        logo_name,
        horizon,
        order,
        description,
        parent_industry_id=None,
        color=None,
        level=None,
    ):
        self.industry_name = industry_name
        self.logo_name = logo_name
        self.horizon = horizon
        self.order = order
        self.description = description
        self.parent_industry_id = parent_industry_id
        self.color = color
        self.level = level


class Functions(CodexModelMixin, db.Model):
    industry_id = db.Column(db.Integer, db.ForeignKey("industry.id"))
    function_name = db.Column(db.String(100), nullable=False)
    parent_function_id = db.Column(db.Integer, db.ForeignKey("functions.id"), nullable=True)
    description = db.Column(db.Text, nullable=True)
    logo_name = db.Column(db.String(100), nullable=False)
    order = db.Column(db.Integer, default=0)
    industry = db.relationship("Industry", foreign_keys=[industry_id])
    color = db.Column(db.String(10), nullable=True)
    level = db.Column(db.String(100), nullable=True)

    def __init__(
        self,
        industry_id,
        function_name,
        description,
        logo_name,
        order,
        parent_function_id=None,
        color=None,
        level=None,
    ):
        self.industry_id = industry_id
        self.function_name = function_name
        self.description = description
        self.logo_name = logo_name
        self.order = order
        self.parent_function_id = parent_function_id
        self.color = color
        self.level = level


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

    def __init__(self, group_id, objective_name, next_recommended_objective=None):
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
    additional_info = db.Column(db.String, nullable=True)
    # is_platform_alert = False if app_id else True
    # type = db.Column(db.String, nullable=True)

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
        additional_info=None,
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
        self.additional_info = additional_info
        # self.type = type


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


class DynamicVizExecutionEnvironment(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    requirements = db.Column(db.Text, nullable=True)
    py_version = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(100), nullable=True)

    def __init__(self, name, requirements, py_version, created_by):
        self.name = name
        self.requirements = requirements
        self.py_version = py_version
        self.created_by = created_by


class AppDynamicVizExecutionEnvironment(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"), index=True)
    dynamic_env_id = db.Column(db.Integer, db.ForeignKey("dynamic_viz_execution_environment.id"), index=True)

    def __init__(self, dynamic_env_id, app_id, created_by):
        self.dynamic_env_id = dynamic_env_id
        self.app_id = app_id
        self.created_by = created_by


class DynamicVizExecutionEnvironmentDefaults(CodexModelMixin, db.Model):
    requirements = db.Column(db.Text, nullable=True)
    py_version = db.Column(db.String(100), nullable=True)

    def __init__(self, requirements, py_version, created_by):
        self.requirements = requirements
        self.py_version = py_version
        self.created_by = created_by


class Dashboard(CodexModelMixin, db.Model):
    dashboard_name = db.Column(db.String(100), nullable=False)
    dashboard_icon = db.Column(db.String(100), nullable=False)
    dashboard_order = db.Column(db.Integer, default=0)
    root_industry_id = db.Column(db.Integer, db.ForeignKey("industry.id"), nullable=True)
    industry = db.relationship("Industry", foreign_keys=[root_industry_id])
    dashboard_url = db.Column(db.String(2000), nullable=True)
    dashboard_template_id = db.Column(db.Integer, db.ForeignKey("dashboard_templates.id"), nullable=True)
    dashboard_templates = db.relationship("DashboardTemplates", foreign_keys=[dashboard_template_id])
    dashboard_code = db.Column(db.String(100), nullable=True)
    conn_system_dashboard_id = db.Column(db.Integer, db.ForeignKey("conn_system_dashboard.id"), nullable=True)

    def __init__(
        self,
        dashboard_name,
        dashboard_icon,
        dashboard_order,
        root_industry_id,
        dashboard_url,
        dashboard_template_id,
    ):
        self.dashboard_name = dashboard_name
        self.dashboard_icon = dashboard_icon
        self.dashboard_order = dashboard_order
        self.root_industry_id = root_industry_id
        self.dashboard_url = dashboard_url
        self.dashboard_template_id = dashboard_template_id


class ContainerMapping(CodexModelMixin, db.Model):
    industry_id = db.Column(db.Integer, db.ForeignKey("industry.id"), nullable=True)
    function_id = db.Column(db.Integer, db.ForeignKey("functions.id"), nullable=True)
    container_id = db.Column(db.Integer, db.ForeignKey("app_container.id"), nullable=True)

    industry = db.relationship("Industry", foreign_keys=[industry_id])
    functions = db.relationship("Functions", foreign_keys=[function_id])
    container = db.relationship("AppContainer", foreign_keys=[container_id])

    def __init__(self, industry_id, function_id, container_id):
        self.industry_id = industry_id
        self.function_id = function_id
        self.container_id = container_id


class UserToken(CodexModelMixin, db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    user_name = db.Column(db.String(100), nullable=True)
    user_email = db.Column(db.String(100), nullable=False)
    execution_token = db.Column(db.Text, nullable=False)
    access = db.Column(db.Text)

    def __init__(self, user_id, user_name, user_email, execution_token, access):
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.execution_token = execution_token
        self.access = access


class MinervaApps(CodexModelMixin, db.Model):
    """
    Minerva Application Table
    """

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), nullable=False)
    description = db.Column(db.String(1000))
    app_config = db.Column(db.JSON)

    def __init__(self, name, description, app_config):
        self.name = name
        self.description = description
        self.app_config = app_config


class MinervaConversationWindow(CodexModelMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey(MinervaApps.id))
    user_id = db.Column(db.String, nullable=False)
    title = db.Column(db.String(1000))
    pinned = db.Column(db.Boolean)

    def __init__(self, application_id, user_id, user_query=None, title=None, pinned=False):
        self.application_id = application_id
        self.user_id = user_id
        self.user_query = user_query
        self.title = title
        self.pinned = pinned


class MinervaConversation(CodexModelMixin, db.Model):
    """
    Table for capturing Minerva user conversations
    """

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey(MinervaApps.id))
    user_id = db.Column(db.String, nullable=False)
    user_query = db.Column(db.String(1000))
    minerva_response = db.Column(db.JSON)
    feedback = db.Column(db.Integer, nullable=True)
    conversation_window_id = db.Column(db.Integer, db.ForeignKey(MinervaConversationWindow.id))

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


class MinervaModels(CodexModelMixin, db.Model):
    """
    Table for capturing Minerva models
    """

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    host = db.Column(db.String, nullable=False)
    type = db.Column(db.String, nullable=False)
    config = db.Column(db.JSON)
    features = db.Column(db.JSON)

    def __init__(self, host, type, config={}, features={}):
        self.host = host
        self.type = type
        self.config = config
        self.features = features


class MinervaPrompts(CodexModelMixin, db.Model):
    """
    Table for capturing Minerva prompts
    """

    id = db.Column(db.Integer, primary_key=True)
    model_id = db.Column(db.Integer, db.ForeignKey(MinervaModels.id))
    tool_type = db.Column(db.String, nullable=False)
    prompt = db.Column(db.JSON)

    def __init__(self, model_id, tool_type, prompt=[]):
        self.model_id = model_id
        self.tool_type = tool_type
        self.prompt = prompt


class DashboardTemplates(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def __init__(self, name, description):
        self.name = name
        self.description = description


class AppTheme(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    readonly = db.Column("readonly", db.Boolean, nullable=True, default=None)
    modes = db.relationship("AppThemeMode")

    def __init__(self, name, readonly=None):
        self.name = name
        self.readonly = readonly


class AppThemeMode(CodexModelMixin, db.Model):
    mode = db.Column(db.String(100), nullable=False)
    bg_variant = db.Column(db.String(100), nullable=False)
    contrast_color = db.Column(db.String(100), nullable=False)
    chart_colors = db.Column(db.Text)
    params = db.Column(db.Text)
    app_theme_id = db.Column(db.Integer, db.ForeignKey("app_theme.id"), index=True)
    theme = db.relationship("AppTheme", foreign_keys=[app_theme_id], overlaps="modes")

    def __init__(self, mode, bg_variant, contrast_color, chart_colors, params, app_theme_id):
        self.mode = mode
        self.bg_variant = bg_variant
        self.contrast_color = contrast_color
        self.chart_colors = chart_colors
        self.app_theme_id = app_theme_id
        self.params = params


class MinervaDocument(CodexModelMixin, db.Model):
    application_id = db.Column(db.Integer, db.ForeignKey(MinervaApps.id))
    name = db.Column(db.Text)
    meta = db.Column(db.JSON)

    def __init__(self, application_id, name, url, meta):
        self.application_id = application_id
        self.name = name
        self.meta = meta


class MinervaJobStatus(CodexModelMixin, db.Model):
    application_id = db.Column(db.Integer, db.ForeignKey(MinervaApps.id))
    run_id = db.Column(db.String(100))
    status = db.Column(db.Text)
    name = db.Column(db.Text)
    type = db.Column(db.Text)

    def __init__(self, application_id, run_id, status, name, type):
        self.application_id = application_id
        self.run_id = run_id
        self.status = status
        self.name = name
        self.type = type


class MinervaConsumer(CodexModelMixin, db.Model):
    """
    Table for capturing Minerva consumers
    """

    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    # To be added: op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"') in alembic
    access_key = db.Column(UUID, server_default=db.text("uuid_generate_v4()"), nullable=False, unique=True)
    allowed_origins = db.Column(db.JSON)
    features = db.Column(db.JSON)
    auth_agents = db.Column(db.JSON)


minerva_app_consumer_mapping = db.Table(
    "minerva_app_consumer_mapping",
    db.Column("minerva_app_id", db.Integer, db.ForeignKey("minerva_apps.id"), nullable=True),
    db.Column("consumer_id", db.Integer, db.ForeignKey("minerva_consumer.id")),
    db.Column("copilot_app_id", db.Integer, db.ForeignKey("copilot_app.id"), nullable=True),
)


class CopilotOrchestrator(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    identifier = db.Column(db.String(100))
    desc = db.Column(db.Text, nullable=True)
    config = db.Column(db.JSON)
    disabled = db.Column(db.Boolean)


class CopilotApp(CodexModelMixin, db.Model):
    """
    Table for capturing Copilot App
    """

    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    config = db.Column(db.JSON)
    orchestrator_id = db.Column(db.Integer, db.ForeignKey(CopilotOrchestrator.id))
    orchestrator_config = db.Column(db.JSON)


class CopilotConversationWindow(CodexModelMixin, db.Model):
    """
    Table for capturing copilot conversations
    """

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey(CopilotApp.id))
    user_id = db.Column(db.String, nullable=False)
    title = db.Column(db.String(1000))
    pinned = db.Column(db.Boolean)


class CopilotConversation(CodexModelMixin, db.Model):
    """
    Table for capturing copilot and user messages
    """

    id = db.Column(db.Integer, primary_key=True)
    application_id = db.Column(db.Integer, db.ForeignKey(CopilotApp.id))
    user_id = db.Column(db.String, nullable=False)
    user_query = db.Column(db.String(1000))
    copilot_response = db.Column(db.JSON)
    feedback = db.Column(db.Integer, nullable=True)
    comment = db.Column(db.JSON)
    conversation_window_id = db.Column(db.Integer, db.ForeignKey(CopilotConversationWindow.id))
    pinned = db.Column(db.Boolean)
    interrupted = db.Column(db.Boolean)


class CopilotTool(CodexModelMixin, db.Model):
    """
    Table for capturing copilot Tool Definition
    """

    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    config = db.Column(db.JSON)


class CopilotToolVersion(CodexModelMixin, db.Model):
    """
    Table for capturing copilot Tool Version
    """

    tool_id = db.Column(db.Integer, db.ForeignKey(CopilotTool.id))
    commit_id = db.Column(db.String(100), unique=True)
    desc = db.Column(db.Text)
    input_params = db.Column(db.JSON)
    config = db.Column(db.JSON)
    verified = db.Column(db.Boolean, default=False)


class CopilotToolRegistry(CodexModelMixin, db.Model):
    """
    Table for capturing copilot Tool Registry
    """

    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    config = db.Column(db.JSON)


class CopilotToolVersionRegistryMapping(CodexModelMixin, db.Model):
    """
    Table for capturing CopilotToolVersion & Registry mapping
    """

    tool_version_id = db.Column(db.Integer, db.ForeignKey(CopilotToolVersion.id))
    registry_id = db.Column(db.Integer, db.ForeignKey(CopilotToolRegistry.id))
    approved = db.Column(db.Boolean)
    deprecated = db.Column(db.Boolean)
    deployment_status = db.Column(db.String(100))
    info = db.Column(db.JSON)
    version = db.Column(db.String(100))


class CopilotDataSource(CodexModelMixin, db.Model):
    """
    Table for capturing Copilot Data Source
    """

    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(100), nullable=False)
    copilot_app_id = db.Column(db.Integer, db.ForeignKey(CopilotApp.id))
    config = db.Column(db.JSON)


class CopilotAppDeployment(CodexModelMixin, db.Model):
    """
    Table for capturing the Copilot App Deployment
    """

    copilot_app_id = db.Column(db.Integer, db.ForeignKey(CopilotApp.id))
    config = db.Column(db.JSON)


class CopilotAppPublishedToolMapping(CodexModelMixin, db.Model):
    """
    Table for capturing the Copilot App and Published Tools mapping
    """

    copilot_app_id = db.Column(db.Integer, db.ForeignKey(CopilotApp.id))
    tool_version_registry_mapping_id = db.Column(db.Integer, db.ForeignKey(CopilotToolVersionRegistryMapping.id))
    name = db.Column(db.String(100), nullable=False)
    desc = db.Column(db.Text)
    status = db.Column(db.String(100))
    config = db.Column(db.JSON)
    preprocess_config = db.Column(db.JSON)
    input_params = db.Column(db.JSON)


class CopilotDatasourceMinervaDocument(CodexModelMixin, db.Model):
    datasource_id = db.Column(db.Integer, db.ForeignKey(CopilotDataSource.id))
    name = db.Column(db.Text)
    meta = db.Column(db.JSON)

    def __init__(self, datasource_id, name, url, meta):
        self.datasource_id = datasource_id
        self.name = name
        self.meta = meta


class CopilotAppDatasourcePublishedToolMapping(CodexModelMixin, db.Model):
    """
    Table for capturing the Copilot App Datasource and Copilot App Published Tools mapping
    """

    datasource_id = db.Column(db.Integer, db.ForeignKey(CopilotDataSource.id))
    app_published_tool_id = db.Column(db.Integer, db.ForeignKey(CopilotAppPublishedToolMapping.id))
    key = db.Column(db.String(100))
    config = db.Column(db.JSON)


copilot_tool_version_orchestrator_mapping = db.Table(
    "copilot_tool_version_orchestrator_mapping",
    db.Column("tool_version_id", db.Integer, db.ForeignKey(CopilotToolVersion.id)),
    db.Column("orchestrator_id", db.Integer, db.ForeignKey(CopilotOrchestrator.id)),
)


# class AIResponseTracker(CodexModelMixin, db.Model):
#     app_id = db.Column(db.Integer, db.ForeignKey('app.id'), index=True)
#     screen_id = db.Column(db.Integer, db.ForeignKey('app_screen.id'), index=True)
#     event_type = db.Column(db.String(100), nullable=False)
#     event_response = db.Column(db.String(), nullable=False)
#     user_email = db.Column(db.String(100), nullable=False)

#     screen = db.relationship("AppScreen", foreign_keys=[screen_id], overlaps="widgets")
#     application = db.relationship("App", foreign_keys=[app_id])

#     def __init__(self, app_id, screen_id, event_type, event_response, user_email):
#         self.app_id = app_id
#         self.screen_id = screen_id
#         self.event_type = event_type
#         self.event_response = event_response
#         self.user_email = user_email


# ******************** GenAI Models ********************


class ModelJob(CodexModelMixin, db.Model):
    type = db.Column(db.String(100))
    uuid = db.Column(UUID(as_uuid=True), default=uuid.uuid4)
    # UniqueConstraint("uuid", name="uq_model_job_uuid")
    started_at = db.Column(db.DateTime(timezone=True), nullable=True)
    ended_at = db.Column(db.DateTime(timezone=True), nullable=True)
    status = db.Column(db.String(100), default="created")
    progress = db.Column(db.Integer, nullable=True)
    approval_status = db.Column(db.String(100), default="pending")
    approval_status_updated_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    config = db.Column(db.Text(), nullable=True)  # holde Job JSON and other Configs.
    result = db.Column(db.Text(), nullable=True)  # holds Job result.

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


class SupportedModel(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000))
    # UniqueConstraint("name", name="uq_supported_model_name")
    description = db.Column(db.String(5000), nullable=True)
    tags = db.Column(db.String(5000), nullable=True)
    task_type = db.Column(db.String(500), nullable=True)
    location = db.Column(db.String(5000), nullable=True)
    size = db.Column(db.String(10), nullable=True)
    estimated_cost = db.Column(db.Float, nullable=True)
    version = db.Column(db.String(2000), nullable=True)
    is_finetunable = db.Column(db.Boolean, default=False)
    is_finetuned = db.Column(db.Boolean, default=False)
    config = db.Column(db.Text(), nullable=True)  # holds Job JSON and other Configs.
    is_submitted = db.Column(db.Boolean, default=False)
    started_at = db.Column(db.DateTime(timezone=True), nullable=True)
    ended_at = db.Column(db.DateTime(timezone=True), nullable=True)
    job_id = db.Column(db.Integer, db.ForeignKey("model_job.id"))
    job = db.relationship("ModelJob", backref="jobs")
    parent_model_id = db.Column(db.Integer, db.ForeignKey("supported_model.id"), nullable=True)
    parent_model = db.relationship("SupportedModel", backref="parent_models", remote_side="SupportedModel.id")

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
    # def size(self, model_size):
    #     self.size = model_size

    # @property
    # def location(self):
    #     return self.location

    # @location.setter
    # def location(self, model_location):
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


class HostedModel(CodexModelMixin, db.Model):
    name = db.Column(db.String(1000))
    # UniqueConstraint("name", name="uq_hosted_model_name")
    endpoint = db.Column(db.String(5000), nullable=True)
    # source = db.Column(db.String(1000), nullable=True)
    main_access_key = db.Column(db.String(1000))
    aux_access_key = db.Column(db.String(1000), nullable=True)
    status = db.Column(db.String(100), default="active")
    type = db.Column(db.String(100), nullable=True)
    description = db.Column(db.String(5000), nullable=True)
    cost = db.Column(db.Float, nullable=True)
    # number_of_bits = db.Column(db.String(100), nullable=True)  # 4 bit/8 bit
    # quantization = db.Column(db.Boolean, default=False)
    # compute_data_type = db.Column(db.String(200), nullable=True)
    # quantization_type = db.Column(db.String(200), nullable=True)
    # use_double_quantization = db.Column(db.Boolean, default=False)
    config = db.Column(db.Text(), nullable=True)  # holde Job JSON and other Configs.
    started_at = db.Column(db.DateTime(timezone=True), nullable=True)
    ended_at = db.Column(db.DateTime(timezone=True), nullable=True)
    original_model_id = db.Column(db.Integer, db.ForeignKey(SupportedModel.id))
    original_model = db.relationship("SupportedModel", backref="base_model")
    job_id = db.Column(db.Integer, db.ForeignKey("model_job.id"))
    job = db.relationship("ModelJob", backref="deployed_models")

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


# class ModelTransaction(CodexModelMixin, db.Model):
#     execution_time = db.Column(db.Integer)
#     app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
#     # TODO: Enable this once db migration is done
#     # project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
#     called_by = db.Column(db.Integer, db.ForeignKey("user.id"))
#     input = db.Column(db.Text)
#     output = db.Column(db.Text)
#     other_info = db.Column(db.Text)
#     vm_id = db.Column(db.Integer, db.ForeignKey("virtual_machine.id"))

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


# class VirtualMachine(CodexModelMixin, db.Model):
#     """Can be used to track each VM. or List the types of VM being used."""

#     name = db.Column(db.String(100))
#     cost_per_hour = db.Column(db.Float)
#     uptime = db.Column(db.Float)

#     def __init__(self, name, cost_per_hour) -> None:
#         self.name = name
#         self.cost_per_hour = cost_per_hour


class LLMExperimentSetting(CodexModelMixin, db.Model):
    peft_method = db.Column(db.String(255), nullable=True)
    quantization = db.Column(db.Boolean, default=False)
    gradient_acc_steps = db.Column(db.Integer, nullable=True)
    logging_steps = db.Column(db.Integer, nullable=True)
    save_steps = db.Column(db.Integer, nullable=True)
    lr_scheduler_type = db.Column(db.String(255), nullable=True)
    lora_alpha = db.Column(db.Integer, nullable=True)
    lora_rank = db.Column(db.Integer, nullable=True)
    is_active = db.Column(db.Boolean, default=False)

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


class LLMExperiment(CodexModelMixin, db.Model):
    name = db.Column(db.String(500))
    problem_type = db.Column(db.String(255), nullable=True)
    epochs = db.Column(db.Integer, nullable=True)
    test_size = db.Column(db.Float, nullable=True)
    batch_size = db.Column(db.Integer, nullable=True)
    max_tokens = db.Column(db.Integer, nullable=True)
    learning_rate = db.Column(db.Float, nullable=False)
    error_metric_type = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(255), nullable=True)
    experiment_settings_id = db.Column(db.Integer, db.ForeignKey("llm_experiment_setting.id"))
    experiment_settings = db.relationship("LLMExperimentSetting", backref="experiments")
    dataset_id = db.Column(db.Integer, db.ForeignKey("llm_data_registry.id"))
    dataset = db.relationship("LLMDataRegistry", backref="experiments")
    compute_id = db.Column(db.Integer, db.ForeignKey("llm_compute_config.id"))
    compute = db.relationship("LLMComputeConfig", backref="experiments")
    model_id = db.Column(db.Integer, db.ForeignKey("llm_model_registry.id"))
    model = db.relationship("LLMModelRegistry", backref="experiments")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


class LLMExperimentResult(CodexModelMixin, db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey("llm_experiment.id"))
    experiment = db.relationship("LLMExperiment", backref="experiment_results")
    accuracy = db.Column(db.Float, nullable=True)
    run_time = db.Column(db.Integer, nullable=True)
    log_path = db.Column(db.String(500), nullable=True)
    error_metrics = db.Column(db.Text, nullable=True)  # list of string
    train_loss = db.Column(db.Text, nullable=True)  # list of string
    deep_dive = db.Column(db.Text, nullable=True)  # list of string
    checkpoint_log_path = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class LLMComputeConfig(CodexModelMixin, db.Model):
    sku = db.Column(db.String(255))
    type = db.Column(db.String(255), nullable=True)
    vcpu = db.Column(db.Integer, nullable=True)
    ram = db.Column(db.Integer, nullable=True)
    iops = db.Column(db.Integer, nullable=True)
    storage_size = db.Column(db.String(255), nullable=True)
    estimated_cost = db.Column(db.Float, nullable=True)
    data_disks = db.Column(db.Integer, nullable=True)
    cloud_provider_id = db.Column(db.Integer, db.ForeignKey("llm_cloud_provider.id"))
    cloud_provider = db.relationship("LLMCloudProvider", backref="cloud_providers")
    is_active = db.Column(db.Boolean, default=False)


class LLMCloudProvider(CodexModelMixin, db.Model):
    name = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False)


class LLMExperimentCheckpoint(CodexModelMixin, db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey("llm_experiment.id"))
    experiment = db.relationship("LLMExperiment", backref="experiment_checkpoints")
    name = db.Column(db.String(255))
    model_path = db.Column(db.String(255), nullable=True)
    checkpoint_path = db.Column(db.String(255), nullable=True)
    train_result_path = db.Column(db.String(255), nullable=True)
    error_metrics_path = db.Column(db.String(255), nullable=True)  # checkpoint json path
    eval_path = db.Column(db.String(255), nullable=True)
    eval_status = db.Column(db.String(255), nullable=True)
    eval_result = db.Column(db.Text, nullable=True)
    error_metrics = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class LLMExperimentRunTracer(CodexModelMixin, db.Model):
    experiment_id = db.Column(db.Integer, db.ForeignKey("llm_experiment.id"))
    experiment = db.relationship("LLMExperiment", backref="experiment_run_tracers")
    pod_name = db.Column(db.String(255))
    container_name = db.Column(db.String(255), nullable=True)
    pod_status = db.Column(db.String(255), nullable=True)
    namespace = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class LLMModelRegistry(CodexModelMixin, db.Model):
    name = db.Column(db.String(255))
    source = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    problem_type = db.Column(db.String(255), nullable=True)
    model_type = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=False)
    # types = db.relationship("LLMModelType", secondary=lambda: llm_model_type_mapping, backref="model")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


class LLMModelConfig(CodexModelMixin, db.Model):
    model_id = db.Column(db.Integer, db.ForeignKey("llm_model_registry.id"))
    model = db.relationship("LLMModelRegistry", backref="configs")
    model_path = db.Column(db.String(255), nullable=True)
    model_path_type = db.Column(db.String(255), nullable=True)
    api_key = db.Column(db.String(255), nullable=True)
    model_params = db.Column(db.JSON, nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class LLMModelType(CodexModelMixin, db.Model):
    __tablename__ = "llm_model_type"

    type = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False)
    # models = db.relationship("LLMModelRegistry", secondary=lambda: llm_model_type_mapping, backref="type")


llm_model_type_mapping = db.Table(
    "llm_model_type_mapping",
    db.Column("model_id", db.ForeignKey("llm_model_registry.id"), primary_key=True),
    db.Column("type_id", db.ForeignKey("llm_model_type.id"), primary_key=True),
)


class LLMDataRegistry(CodexModelMixin, db.Model):
    dataset_name = db.Column(db.String(255))
    file_name = db.Column(db.String(255), nullable=True)
    file_path = db.Column(db.String(255), nullable=True)
    file_type = db.Column(db.String(255), nullable=True)
    access_token = db.Column(db.String(255), nullable=True)
    source_id = db.Column(db.Integer, db.ForeignKey("llm_dataset_source.id"))
    source = db.relationship("LLMDatasetSource", backref="data_registries")
    dataset_folder = db.Column(db.String(255), nullable=True)
    access_token = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class LLMDatasetSource(CodexModelMixin, db.Model):
    source_type = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False)


class LLMDeployedModel(CodexModelMixin, db.Model):
    model_id = db.Column(db.Integer, db.ForeignKey("llm_model_registry.id"))
    model = db.relationship("LLMModelRegistry", backref="llm_deployed_models")
    name = db.Column(db.String(500))
    description = db.Column(db.Text, nullable=True)
    endpoint = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(255), nullable=True)
    approval_status = db.Column(db.String(255), default="pending")
    deployment_type_id = db.Column(db.Integer, db.ForeignKey("llm_deployment_type.id"))
    deployment_type = db.relationship("LLMDeploymentType", backref="deployments")
    is_active = db.Column(db.Boolean, default=False)
    progress = db.Column(db.Integer, default=0)
    model_params = db.Column(db.JSON)


class LLMDeploymentType(CodexModelMixin, db.Model):
    name = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=False)


value = """[{ "no_labels": 0, "no_graphs": 1 },
            { "no_labels": 0, "no_graphs": 2, "graph_type": "1-1", "vertical": true },
            { "no_labels": 0, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "2-1" },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-2" },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-1-1", "vertical": true },
            { "no_labels": 0, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 4 },
            { "no_labels": 0, "no_graphs": 4, "graph_type": "3-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-4", "horizontal": true },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-3-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "2-2-1", "horizontal": false },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "2-2-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 5, "graph_type": "1-1-1-1-1", "vertical": true },
            { "no_labels": 0, "no_graphs": 6 },
            { "no_labels": 0, "no_graphs": 6, "graph_type": "2-2-2", "horizontal": true },
            { "no_labels": 0, "no_graphs": 7, "graph_type": "4-2-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 7, "graph_type": "3-3-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 7, "graph_type": "1-2-2-2", "horizontal": true },
            { "no_labels": 0, "no_graphs": 8, "graph_type": "4-2-2", "horizontal": true },
            { "no_labels": 0, "no_graphs": 9, "graph_type": "4-3-2", "horizontal": true },
            { "no_labels": 0, "no_graphs": 9, "graph_type": "4-3-1-1", "horizontal": true },
            { "no_labels": 0, "no_graphs": 15, "graph_type": "5-5-5", "horizontal": true },
            { "no_labels": 0, "no_graphs": 20, "graph_type": "5-5-5-5", "horizontal": true },
            { "no_labels": 1, "no_graphs": 4 },
            { "no_labels": 2, "no_graphs": 1 },
            { "no_labels": 2, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 2, "no_graphs": 2 },
            { "no_labels": 2, "no_graphs": 6 },
            { "no_labels": 3, "no_graphs": 1 },
            { "no_labels": 3, "no_graphs": 2 },
            { "no_labels": 3, "no_graphs": 3 },
            { "no_labels": 3, "no_graphs": 3, "graph_type": "2-1" },
            { "no_labels": 3, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },
            { "no_labels": 3, "no_graphs": 3, "graph_type": "1-2" },
            { "no_labels": 3, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 3, "no_graphs": 4 },
            { "no_labels": 3, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },
            { "no_labels": 3, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },
            { "no_labels": 3, "no_graphs": 6 },
            { "no_labels": 4, "no_graphs": 1 },
            { "no_labels": 4, "no_graphs": 2 },
            { "no_labels": 4, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },
            { "no_labels": 4, "no_graphs": 3 },
            { "no_labels": 4, "no_graphs": 3, "graph_type": "2-1" },
            { "no_labels": 4, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },
            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-2" },
            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 4, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },
            { "no_labels": 4, "no_graphs": 4 },
            { "no_labels": 4, "no_graphs": 4, "graph_type": "1-3", "horizontal": true },
            { "no_labels": 4, "no_graphs": 5, "graph_type": "3-2", "horizontal": true },
            { "no_labels": 4, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": false },
            { "no_labels": 4, "no_graphs": 6 },
            { "no_labels": 4, "no_graphs": 6, "graph_type": "4-1-1", "horizontal": true },
            { "no_labels": 4, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },
            { "no_labels": 5, "no_graphs": 1 },
            { "no_labels": 5, "no_graphs": 2 },
            { "no_labels": 5, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },
            { "no_labels": 5, "no_graphs": 4 },
            { "no_labels": 5, "no_graphs": 3, "graph_type": "2-1" },
            { "no_labels": 5, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },
            { "no_labels": 5, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 5, "no_graphs": 5, "graph_type": "3-2", "horizontal": true },
            { "no_labels": 5, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },
            { "no_labels": 6, "no_graphs": 1 },
            { "no_labels": 6, "no_graphs": 2 },
            { "no_labels": 6, "no_graphs": 2, "graph_type": "1-1", "horizontal": true },
            { "no_labels": 6, "no_graphs": 3, "graph_type": "1-2", "horizontal": true },
            { "no_labels": 6, "no_graphs": 3, "graph_type": "2-1" },
            { "no_labels": 6, "no_graphs": 3, "graph_type": "2-1", "horizontal": true },
            { "no_labels": 6, "no_graphs": 4 },
            { "no_labels": 5, "no_graphs": 6 },
            { "no_labels": 6, "no_graphs": 5, "graph_type": "2-3", "horizontal": true },
            { "no_labels": 6, "no_graphs": 7, "graph_type": "3-2-2", "horizontal": true },
            { "no_labels": 6, "no_graphs": 9, "graph_type": "3-3-3", "horizontal": true },
            { "no_labels": 6, "no_graphs": 3, "graph_type": "1-1-1", "horizontal": true },
            { "no_labels": 6, "no_graphs": 5, "graph_type": "1-2-2", "horizontal": true },
            { "no_labels": 6, "no_graphs": 6, "graph_type": "2-2-2", "horizontal": true },
            { "no_labels": 6, "no_graphs": 8, "graph_type": "4-4", "horizontal": true },
            { "no_labels": 5, "no_graphs": 15, "graph_type": "5-5-5", "horizontal": true }]"""


class LLMDeploymentExperimentMapping(CodexModelMixin, db.Model):
    deployment_id = db.Column(db.Integer, db.ForeignKey("llm_deployed_model.id"))
    experiment_id = db.Column(db.Integer, db.ForeignKey("llm_experiment.id"))
    checkpoint_id = db.Column(db.Integer, db.ForeignKey("llm_experiment_checkpoint.id"))
    is_active = db.Column(db.Boolean, default=False)


class CustomLayout(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, nullable=False)
    layout_options = db.Column(db.JSON, server_default=value)

    def __init__(self, app_id, layout_options):
        self.app_id = app_id
        self.layout_options = layout_options


class InfraType(CodexModelMixin, db.Model):
    name = db.Column(db.String(255))
    cloud_provider_id = db.Column(db.Integer, db.ForeignKey("llm_cloud_provider.id"))
    cloud_provider = db.relationship("LLMCloudProvider", backref="infra_types")


class ExecutionEnvironment(CodexModelMixin, db.Model):
    name = db.Column(db.String(100))
    cloud_provider_id = db.Column(db.Integer, db.ForeignKey("llm_cloud_provider.id"))
    cloud_provider = db.relationship("LLMCloudProvider", backref="execution_environments")
    infra_type_id = db.Column(db.Integer, db.ForeignKey("infra_type.id"))
    infra_type = db.relationship("InfraType", backref="execution_environments")
    hosting_type = db.Column(db.String(255), nullable=True)
    compute_id = db.Column(db.Integer, db.ForeignKey("llm_compute_config.id"))
    compute = db.relationship("LLMComputeConfig", backref="execution_environments")
    env_type = db.Column(db.String(255))
    run_time = db.Column(db.String(255))
    run_time_version = db.Column(db.String(255))
    endpoint = db.Column(db.String(255))
    replicas = db.Column(db.Integer)
    packages = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(255), nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class ExecutionEnvironmentAppMapping(CodexModelMixin, db.Model):
    app_id = db.Column(db.Integer, db.ForeignKey("app.id"))
    env_id = db.Column(db.Integer, db.ForeignKey("execution_environment.id"))
    is_active = db.Column(db.Boolean, default=False)


class ExecutionEnvironmentDeployment(CodexModelMixin, db.Model):
    __tablename__ = "execution_environment_deployment"

    env_id = db.Column(db.Integer, db.ForeignKey("execution_environment.id"))
    name = db.Column(db.String(255))
    namespace = db.Column(db.String(255))
    uuid = db.Column(UUID(as_uuid=True), nullable=True)
    is_active = db.Column(db.Boolean, default=False)


class CodeExecutionLogs(CodexModelMixin, db.Model):
    __tablename__ = "code_execution_logs"

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    exec_env_id = db.Column(db.Integer, db.ForeignKey("execution_environment.id"))
    execution_time = db.Column(db.Float, nullable=True)
    execution_context = db.Column(db.Text, nullable=True)
    errors = db.Column(db.Text, nullable=True)
    logs = db.Column(db.Text, nullable=True)
    execution_type = db.Column(db.String(255), nullable=True)
    invoked_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    execution_start_time = db.Column(db.DateTime(timezone=True), nullable=True)
    execution_end_time = db.Column(db.DateTime(timezone=True), nullable=True)
    execution_status = db.Column(db.String(255), nullable=True)
