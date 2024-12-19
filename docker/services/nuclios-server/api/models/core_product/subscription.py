from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, Text


@mapper_registry.mapped
class Subscription(BaseModelMixin):
    __tablename__ = "subscription"
    app_id = Column(Integer, ForeignKey("app.id"))
    screen_id = Column(Integer, ForeignKey("app_screen.id"))
    widget_id = Column(Integer, ForeignKey("app_screen_widget.id"), nullable=True)
    subscription_setting = Column(Text, default="@mentions")
    # user = relationship("User", primaryjoin="subscription.created_by == user.id", lazy="joined")

    def __init__(
        self,
        app_id: int,
        screen_id: int,
        subscription_setting: str,
        created_by: int,
        widget_id: int | None = None,
    ):
        self.app_id = app_id
        self.screen_id = screen_id
        self.widget_id = widget_id
        self.subscription_setting = subscription_setting
        self.created_by = created_by
