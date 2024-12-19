import secrets

from api.databases.base_class import Base, mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    String,
    Table,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import and_

app_user_role_identifier = Table(
    "app_user_role_identifier",
    Base.metadata,
    Column("app_user_role_id", Integer, ForeignKey("app_user_role.id")),
    Column("app_user_id", Integer, ForeignKey("app_user.id")),
)


@mapper_registry.mapped
class AppUserRole(BaseModelMixin):
    __tablename__ = "app_user_role"

    name = Column(Text)
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    permissions = Column(Text, nullable=True)

    def __init__(self, name, app_id, permissions, created_by):
        self.name = name
        self.app_id = app_id
        self.permissions = permissions
        self.created_by = created_by


@mapper_registry.mapped
class AppContainer(BaseModelMixin):
    __tablename__ = "app_container"

    problem_area = Column(Text, nullable=True)
    problem = Column(Text, nullable=True)
    blueprint_link = Column(Text, nullable=True)
    approach_blob_name = Column(Text, nullable=True)
    orderby = Column(Integer, default=0)

    def __init__(
        self,
        orderby,
        prob_area=None,
        problem=None,
        blueprint_link=None,
        approach_blob_name=None,
    ) -> None:
        self.orderby = orderby
        self.problem_area = prob_area
        self.problem = problem
        self.blueprint_link = blueprint_link
        self.approach_blob_name = approach_blob_name


@mapper_registry.mapped
class App(BaseModelMixin):
    __tablename__ = "app"

    name = Column(Text)
    theme = Column(Text)
    contact_email = Column(Text)
    modules = Column(Text)
    app_creator_id = Column(Integer, default=0, nullable=False)
    is_connected_systems_app = Column(Boolean, default=False)

    config_link = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    logo_blob_name = Column(Text, nullable=True)
    small_logo_blob_name = Column(Text, nullable=True)
    restricted_app = Column(Boolean, default=False)
    environment = Column(Text, default="prod")

    container_id = Column(Integer, ForeignKey("app_container.id"), index=True, nullable=True)
    variables = Column(Text, nullable=True)
    function_defns = Column(Text, nullable=True)
    color = Column(String(10), nullable=True)
    parent_container = relationship("AppContainer")
    container_mapping = None

    problem_area = Column(Text, nullable=True)
    problem = Column(Text, nullable=True)
    blueprint_link = Column(Text, nullable=True)
    approach_blob_name = Column(Text, nullable=True)
    orderby = Column(Integer, default=0)
    source_app_id = Column(Integer, ForeignKey("app.id"), index=True, nullable=True)
    parent_application = relationship("App")
    theme_id = Column(Integer, ForeignKey("app_theme.id"), nullable=True)

    def __init__(
        self,
        name,
        contact_email,
        modules,
        app_creator_id,
        color=None,
        theme_id=None,
        is_connected_systems_app=False,
        created_by=None,
        variables=None,
    ):
        self.name = name
        self.theme_id = theme_id
        self.contact_email = contact_email
        self.modules = modules
        self.app_creator_id = app_creator_id
        self.color = color
        self.is_connected_systems_app = is_connected_systems_app
        self.created_by = created_by
        self.variables = variables


@mapper_registry.mapped
class ContainerMapping(BaseModelMixin):
    __tablename__ = "container_mapping"
    industry_id = Column(Integer, ForeignKey("industry.id"), nullable=True)
    function_id = Column(Integer, ForeignKey("functions.id"), nullable=True)
    container_id = Column(Integer, ForeignKey("app_container.id"), nullable=True)

    industry = relationship("Industry", foreign_keys=[industry_id])
    functions = relationship("Functions", foreign_keys=[function_id])
    container = relationship("AppContainer", foreign_keys=[container_id])

    def __init__(self, industry_id, function_id, container_id):
        self.industry_id = industry_id
        self.function_id = function_id
        self.container_id = container_id


@mapper_registry.mapped
class AppScreen(BaseModelMixin):

    """
    Table to maintaine mapping between app and screen.
    """

    __tablename__ = "app_screen"

    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    screen_index = Column(Integer)
    screen_name = Column(String(100))
    screen_description = Column(Text)
    screen_filters_open = Column(Boolean, default=False)
    screen_auto_refresh = Column(Boolean, default=False)
    screen_image = Column(String(100))
    level = Column(Integer, nullable=True)
    horizontal = Column(Boolean, nullable=True)
    graph_type = Column(String(100), nullable=True)
    last_deleted = Column(Boolean, default=False)
    rating_url = Column(String(2000), nullable=True)
    screen_filters_value = Column(Text, default=False)
    action_settings = Column(Text, default=False)
    hidden = Column(Boolean, default=False)
    marked = Column(Boolean, default=False)
    user_guide = Column(Text, nullable=True, default=None)
    ai_response = Column(Text)
    ai_response_verified_at = Column(DateTime(timezone=True), nullable=True)
    ai_response_verified_email = Column(String(1000), nullable=True)
    ai_response_verified_name = Column(String(1000), nullable=True)
    graph_width = Column(String(100), nullable=True)
    graph_height = Column(String(100), nullable=True)
    comment_enabled = Column(Boolean, nullable=True)

    application = relationship("App")
    widgets = relationship("AppScreenWidget")

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
        created_by=None,
        comment_enabled=None,
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
        self.created_by = created_by
        self.comment_enabled = comment_enabled


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


@mapper_registry.mapped
class CustomLayout(BaseModelMixin):
    __tablename__ = "custom_layout"
    app_id = Column(Integer, nullable=False)
    layout_options = Column(JSON, server_default=value)

    def __init__(self, id, app_id, layout_options=None):
        self.id = id
        self.app_id = app_id
        if layout_options:
            self.layout_options = layout_options


@mapper_registry.mapped
class AppTheme(BaseModelMixin):
    __tablename__ = "app_theme"
    name = Column(String(100), nullable=False)
    readonly = Column(Boolean, nullable=True, default=None)
    modes = relationship("AppThemeMode")

    def __init__(self, name, readonly=None):
        self.name = name
        self.readonly = readonly


@mapper_registry.mapped
class AppThemeMode(BaseModelMixin):
    __tablename__ = "app_theme_mode"
    mode = Column(String(100), nullable=False)
    bg_variant = Column(String(100), nullable=False)
    contrast_color = Column(String(100), nullable=False)
    chart_colors = Column(Text)
    params = Column(Text)
    app_theme_id = Column(Integer, ForeignKey("app_theme.id"), index=True)
    theme = relationship("AppTheme", foreign_keys=[app_theme_id], overlaps="modes")

    def __init__(self, mode, bg_variant, contrast_color, chart_colors, params, app_theme_id):
        self.mode = mode
        self.bg_variant = bg_variant
        self.contrast_color = contrast_color
        self.chart_colors = chart_colors
        self.app_theme_id = app_theme_id
        self.params = params


@mapper_registry.mapped
class AppUser(BaseModelMixin):
    __tablename__ = "app_user"
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    first_name = Column(String(1000), nullable=True)
    last_name = Column(String(1000), nullable=True)
    user_email = Column(String(1000))
    is_admin = Column(Boolean, default=False)
    user_roles = relationship(
        "AppUserRole",
        secondary=app_user_role_identifier,
        primaryjoin=lambda: and_(
            AppUserRole.deleted_at.is_(None),
            app_user_role_identifier.c.app_user_id == AppUser.id,
        ),
    )
    permissions = Column(Text, nullable=True)

    def __init__(
        self,
        app_id,
        user_email,
        first_name=None,
        last_name=None,
        is_admin=False,
        permissions=False,
        user_roles=False,
        created_by=None,
    ):
        self.app_id = app_id
        self.user_email = user_email
        self.first_name = first_name
        self.last_name = last_name
        self.is_admin = is_admin
        self.created_by = created_by

        if permissions:
            self.permissions = permissions

        if user_roles:
            self.user_roles = user_roles


@mapper_registry.mapped
class AppScreenAIResponseRating(BaseModelMixin):
    __tablename__ = "app_screen_ai_response_rating"
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    screen_id = Column(Integer, ForeignKey("app_screen.id"), index=True)
    response_rating = Column(Integer, default=1)
    response_rating_by_email = Column(String(1000))
    response_rating_by_name = Column(String(1000))

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


@mapper_registry.mapped
class AppScreenWidget(BaseModelMixin):
    __tablename__ = "app_screen_widget"
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    screen_id = Column(Integer, ForeignKey("app_screen.id"), index=True)
    widget_index = Column(Integer)
    widget_key = Column(String(100))
    is_label = Column(Boolean, default=False)
    config = Column(Text)
    last_deleted = Column(Boolean, default=False)

    screen = relationship("AppScreen", foreign_keys=[screen_id], overlaps="widgets")
    application = relationship("App", foreign_keys=[app_id])
    filters = relationship("AppScreenWidgetFilterValue")
    values = relationship("AppScreenWidgetValue")

    def __init__(self, app_id, screen_id, widget_index, widget_key, is_label, config, created_by=None):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_index = widget_index
        self.widget_key = widget_key
        self.is_label = is_label
        self.config = config
        self.created_by = created_by


@mapper_registry.mapped
class AppScreenWidgetValue(BaseModelMixin):
    __tablename__ = "app_screen_widget_value"
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    screen_id = Column(Integer, ForeignKey("app_screen.id"), index=True)
    widget_id = Column(Integer, ForeignKey("app_screen_widget.id"), index=True)
    widget_value = Column(Text)
    widget_filter_value = Column(Text)
    widget_simulated_value = Column(Text)
    last_deleted = Column(Boolean, default=False)
    access_token = Column(String(64), nullable=True)

    screen_widget = relationship("AppScreenWidget", foreign_keys=[widget_id], overlaps="values")
    screen = relationship("AppScreen", foreign_keys=[screen_id])
    application = relationship("App", foreign_keys=[app_id])
    filters = relationship("AppScreenWidgetFilterValue")

    def __init__(
        self,
        app_id,
        screen_id,
        widget_id,
        widget_value,
        widget_simulated_value,
        created_by,
        widget_filter_value_code=None,
    ):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_id = widget_id
        self.widget_value = widget_value
        self.widget_simulated_value = widget_simulated_value
        self.widget_filter_value = widget_filter_value_code
        self.access_token = secrets.token_urlsafe(16)
        self.created_by = created_by


@mapper_registry.mapped
class AppScreenWidgetFilterValue(BaseModelMixin):
    __tablename__ = "app_screen_widget_filter_value"
    app_id = Column(Integer, ForeignKey("app.id"), index=True)
    screen_id = Column(Integer, ForeignKey("app_screen.id"), index=True)
    widget_id = Column(Integer, ForeignKey("app_screen_widget.id"), index=True)
    widget_value_id = Column(Integer, ForeignKey("app_screen_widget_value.id"), index=True)
    widget_tag_key = Column(String(100))
    widget_tag_value = Column(String(100))
    last_deleted = Column(Boolean, default=False)

    screen_widget_value = relationship("AppScreenWidgetValue", foreign_keys=[widget_value_id], overlaps="filters")
    screen_widget = relationship("AppScreenWidget", foreign_keys=[widget_id], overlaps="filters")
    screen = relationship("AppScreen", foreign_keys=[screen_id])
    application = relationship("App", foreign_keys=[app_id])

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


@mapper_registry.mapped
class ProgressBar(BaseModelMixin):
    __tablename__ = "progress_bar"
    app_id = Column(Integer, ForeignKey("app.id"))
    screen_id = Column(Integer, ForeignKey("app_screen.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    stage = Column(Integer, nullable=False)
    total_stages = Column(Integer, nullable=False)
    message = Column(String(1000), nullable=False)
    status = Column(String(1000), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    stage_descriptions = Column(JSON, default=None, nullable=True)
    title = Column(String(1000), nullable=True)
    stage_percentage = Column(Integer, default=0)
    type = Column(String(100), default="create", nullable=True)
    __table_args__ = (Index("ix_progress_bar_app_id_screen_id_user_id", "app_id", "screen_id", "user_id", unique=True),)

    def __init__(
        self,
        app_id,
        screen_id,
        user_id,
        # stage,
        # total_stages,
        message,
        # status,
        completed,
        # stage_descriptions,
        # title,
        stage_percentage,
        type,
    ):
        self.app_id = app_id
        self.screen_id = screen_id
        self.user_id = user_id
        self.stage = 0
        self.total_stages = 0
        self.message = message
        self.status = ""
        self.completed = completed
        self.stage_descriptions = "{}"
        self.title = ""
        self.stage_percentage = stage_percentage
        self.type = type
