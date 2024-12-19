from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class Notifications(BaseModelMixin):
    __tablename__ = "notifications_server"
    identifier = Column(Text, nullable=False)
    title = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    is_read = Column(Boolean, nullable=True)
    user_email = Column(String(100), nullable=True)
    # widget_name = Column(String, nullable=True)
    shared_by = Column(String, nullable=True)
    additional_info = Column(String, nullable=True, default=None)
    # is_platform_alert = False if app_id else True
    type = Column(String, nullable=True, default="")
    link = Column(String, nullable=True, default=None)
    created_by = Column(String(50), nullable=False)
    updated_by = Column(String(50), nullable=True)
    deleted_by = Column(String(50), nullable=True)

    def __init__(
        self,
        identifier,
        title,
        message,
        is_read,
        user_email,
        shared_by,
        additional_info,
        created_by,
        type="Alerts",
        link=None,
    ):
        self.identifier = identifier
        self.title = title
        self.message = message
        self.is_read = is_read
        self.user_email = user_email
        self.shared_by = shared_by
        self.additional_info = additional_info
        self.type = type
        self.link = link
        self.created_by = created_by

    def serialize(self):
        return {
            "id": self.id,
            "identifier": self.identifier,
            "title": self.title,
            "message": self.message,
            "is_read": self.is_read,
            "user_email": self.user_email,
            "shared_by": self.shared_by,
            "additional_info": self.additional_info,
            "type": self.type,
            "link": self.link,
            "triggered_at": self.created_at.timestamp(),
        }
