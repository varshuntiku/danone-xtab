from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


@mapper_registry.mapped
class Comment(BaseModelMixin):
    __tablename__ = "comment"
    app_id = Column(Integer, ForeignKey("app.id"))
    app_screen_id = Column(Integer, ForeignKey("app_screen.id"))
    widget_id = Column(Integer, nullable=True)
    comment_text = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True)
    tagged_users = Column(JSON, nullable=True)
    bookmarked = Column(Boolean, nullable=True, default=None)
    status = Column(String(50), nullable=True, default="unresolved")
    mode = Column(String(50), nullable=True, default="conversation")
    scenario_list = Column(String(500), nullable=True, default=None)
    user = relationship("User", primaryjoin="Comment.created_by == User.id", lazy="joined")
    replies = relationship("Reply", back_populates="comment", order_by="Reply.created_at")
    approval = relationship("Approval", back_populates="comment", uselist=False)

    def __init__(
        self,
        app_id,
        app_screen_id,
        widget_id,
        comment_text,
        created_by,
        attachments=None,
        tagged_users=None,
        bookmarked=None,
        mode="conversation",
        status="unresolved",
        scenario_list=None,
    ):
        self.app_id = app_id
        self.app_screen_id = app_screen_id
        self.widget_id = widget_id
        self.comment_text = comment_text
        self.created_by = created_by
        self.attachments = attachments
        self.tagged_users = tagged_users
        self.bookmarked = bookmarked
        self.status = status
        self.mode = mode
        self.scenario_list = scenario_list

    @property
    def user_name(self):
        return self.user.full_name if self.user else None


@mapper_registry.mapped
class Reply(BaseModelMixin):
    __tablename__ = "reply"
    comment_id = Column(Integer, ForeignKey("comment.id"))
    reply_text = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True)
    tagged_users = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", primaryjoin="Reply.created_by == User.id", lazy="joined")
    comment = relationship("Comment", back_populates="replies")

    @property
    def user_name(self):
        return self.user.full_name if self.user else None

    def __init__(self, comment_id, reply_text, created_by, attachments=None, tagged_users=None):
        self.comment_id = comment_id
        self.reply_text = reply_text
        self.created_by = created_by
        self.attachments = attachments
        self.tagged_users = tagged_users


@mapper_registry.mapped
class Filter(BaseModelMixin):
    __tablename__ = "filter"
    filters = Column(JSON, nullable=True, default={})

    def __init__(self, filters):
        self.filters = filters


@mapper_registry.mapped
class Approval(BaseModelMixin):
    __tablename__ = "approval"
    user_id = Column(Integer, ForeignKey("user.id"))
    name = Column(String(255), nullable=False)
    status = Column(String(255), nullable=False, default="pending")
    comment_id = Column(Integer, ForeignKey("comment.id"), nullable=False)
    comment = relationship("Comment", back_populates="approval")

    def __init__(self, comment_id, user_id, name, status="pending") -> None:
        self.comment_id = comment_id
        self.user_id = user_id
        self.name = name
        self.status = status
