from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class Notifications(BaseModelMixin):
    __tablename__ = "notifications"

    alert_id = Column(Integer, ForeignKey("alerts.id"))
    app_id = Column(Integer, ForeignKey("app.id"))
    widget_id = Column(Integer, ForeignKey("app_screen_widget.id"))
    title = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    is_read = Column(Boolean, nullable=True)
    user_email = Column(String(100), nullable=True)
    widget_name = Column(String, nullable=True)
    shared_by = Column(String, nullable=True)
    additional_info = Column(String, nullable=True)
    # is_platform_alert = False if app_id else True
    # type = Column(String, nullable=True)

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
