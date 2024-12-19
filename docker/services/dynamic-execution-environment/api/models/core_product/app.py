import secrets

from api.databases.base_class import Base, mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
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

    def __init__(self, name, app_id, permissions):
        self.name = name
        self.app_id = app_id
        self.permissions = permissions


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
    ):
        self.name = name
        self.theme_id = theme_id
        self.contact_email = contact_email
        self.modules = modules
        self.app_creator_id = app_creator_id
        self.color = color
        self.is_connected_systems_app = is_connected_systems_app
        self.created_by = created_by


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
        created_by=None,
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
        self.created_by = created_by


@mapper_registry.mapped
class AppTheme(BaseModelMixin):
    __tablename__ = "app_theme"
    name = Column(String(100), nullable=False)
    modes = relationship("AppThemeMode")

    def __init__(self, name):
        self.name = name


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

    def __init__(self, app_id, screen_id, widget_id, widget_value, widget_simulated_value):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_id = widget_id
        self.widget_value = widget_value
        self.widget_simulated_value = widget_simulated_value
        self.access_token = secrets.token_urlsafe(16)


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


@mapper_registry.mapped
class AppProjectMapping(BaseModelMixin):
    __tablename__ = "app_project_mapping"

    project_id = Column(Integer, ForeignKey("project.id"))
    app_id = Column(Integer, ForeignKey("app.id"))
    is_active = Column(Boolean, default=False)
