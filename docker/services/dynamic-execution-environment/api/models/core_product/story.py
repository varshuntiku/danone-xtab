from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)


@mapper_registry.mapped
class Story(BaseModelMixin):
    __tablename__ = "story"

    name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    # app_id = Column(Integer, ForeignKey('app.id'))
    system_created = Column(Boolean, default=False)
    story_file_links = Column(Text, nullable=True)
    story_json = Column(Text, nullable=True)
    schedule_info = Column(Text, nullable=True)
    story_type = Column(String(100), nullable=True, default="oneshot")
    # apps = relationship("app", secondary=StoryAppMapping)

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


@mapper_registry.mapped
class StoryContent(BaseModelMixin):
    __tablename__ = "story_content"

    name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    story_id = Column(Integer, ForeignKey("story.id"))
    app_id = Column(Integer, ForeignKey("app.id"))
    app_screen_id = Column(Integer, ForeignKey("app_screen.id"))
    app_screen_widget_id = Column(Integer, ForeignKey("app_screen_widget.id"))
    app_screen_widget_value_id = Column(Integer, ForeignKey("app_screen_widget_value.id"))
    filter_data = Column(Text, nullable=True)
    content_json = Column(Text, nullable=True)

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


@mapper_registry.mapped
class StoryPages(BaseModelMixin):
    __tablename__ = "story_pages"

    story_id = Column(Integer, ForeignKey("story.id"))
    layout_id = Column(Integer, ForeignKey("story_layout.id"))
    page_json = Column(JSON, nullable=True)
    page_order = Column(Integer, nullable=True)

    def __init__(self, story_id, layout_id, page_json, page_order):
        self.story_id = story_id
        self.layout_id = layout_id
        self.page_json = page_json
        self.page_order = page_order


@mapper_registry.mapped
class StoryAccess(BaseModelMixin):
    __tablename__ = "story_access"

    story_id = Column(Integer, ForeignKey("story.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    read = Column(Boolean, default=True)
    write = Column(Boolean, default=False)
    delete = Column(Boolean, default=False)

    def __init__(self, story_id, user_id, read, write, delete):
        self.story_id = story_id
        self.user_id = user_id
        self.read = read
        self.write = write
        self.delete = delete


@mapper_registry.mapped
class StoryShare(BaseModelMixin):
    __tablename__ = "story_share"

    story_id = Column(Integer, ForeignKey("story.id"))
    email = Column(String(100), default=False)
    is_link = Column(Boolean, default=False)
    is_attachment = Column(Boolean, default=False)
    shared_by = Column(String(100), default=False)

    def __init__(self, story_id, email, is_link, is_attachment, shared_by):
        self.story_id = story_id
        self.email = email
        self.is_link = is_link
        self.is_attachment = is_attachment
        self.shared_by = shared_by


@mapper_registry.mapped
class StoryLayout(BaseModelMixin):
    __tablename__ = "story_layout"

    layout_style = Column(JSON, nullable=True)
    layout_props = Column(JSON, nullable=True)
    thumbnail_blob_name = Column(Text, nullable=True)
    layout_name = Column(String(100), nullable=True)

    def __init__(self, layout_style, layout_props, thumbnail_blob_name=None, layout_name=None):
        self.layout_style = layout_style
        self.layout_props = layout_props
        self.thumbnail_blob_name = thumbnail_blob_name
        self.layout_name = layout_name


@mapper_registry.mapped
class StoryAppMapping(BaseModelMixin):
    __tablename__ = "story_app_mapping"

    story_id = Column(Integer, ForeignKey("story.id"))
    app_id = Column(Integer, ForeignKey("app.id"))

    def __init__(self, story_id, app_id, created_by):
        self.story_id = story_id
        self.app_id = app_id
        self.created_by = created_by
