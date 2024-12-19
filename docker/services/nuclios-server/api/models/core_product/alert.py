from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class Alerts(BaseModelMixin):
    __tablename__ = "alerts"

    title = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    app_id = Column(Integer, ForeignKey("app.id"))
    app_screen_id = Column(Integer, ForeignKey("app_screen.id"))
    app_screen_widget_id = Column(Integer, ForeignKey("app_screen_widget.id"))
    filter_data = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    threshold = Column(Integer, nullable=True)
    receive_notification = Column(Boolean, nullable=True)
    active = Column(Boolean, nullable=True)
    source_type = Column(String, nullable=True)
    widget_type = Column(String, nullable=True)
    user_email = Column(String(100), nullable=True)
    widget_url = Column(String, nullable=True)

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


@mapper_registry.mapped
class AlertsUser(BaseModelMixin):
    __tablename__ = "alerts_user"

    alert_id = Column(Integer, ForeignKey("alerts.id"))
    user_id = Column(Integer, nullable=False)
    user_name = Column(String(100), nullable=True)
    user_email = Column(String(100), nullable=True)

    def __init__(self, alert_id, user_id, user_name, user_email, created_by=None):
        self.alert_id = alert_id
        self.user_id = user_id
        self.user_name = user_name
        self.user_email = user_email
        self.created_by = created_by
