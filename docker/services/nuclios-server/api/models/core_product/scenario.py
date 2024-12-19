from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class Scenarios(BaseModelMixin):
    __tablename__ = "scenarios"

    name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    app_id = Column(Integer, ForeignKey("app.id"))
    user_email = Column(String(100), nullable=True)
    app_screen_id = Column(Integer, ForeignKey("app_screen.id"))
    widget_id = Column(Integer, ForeignKey("app_screen_widget.id"), index=True)
    scenarios_json = Column(Text, nullable=True)
    filters_json = Column(Text, nullable=True)
    version = Column(String, nullable=False, server_default="V.1")
    # apps = relationship("app", secondary=StoryAppMapping)

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
        version="V.1",
    ):
        self.name = name
        self.description = description
        self.user_email = user_email
        self.app_id = app_id
        self.app_screen_id = app_screen_id
        self.widget_id = widget_id
        self.scenarios_json = scenarios_json
        self.filters_json = filters_json
        self.version = version
