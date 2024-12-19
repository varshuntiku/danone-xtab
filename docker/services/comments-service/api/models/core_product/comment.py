from datetime import datetime

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
    __tablename__ = "comment_server"
    identifier = Column(Text, nullable=False)
    comment_text = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True)
    tagged_users = Column(JSON, nullable=True)
    bookmarked = Column(Boolean, nullable=True, default=None)
    status = Column(String(50), nullable=True, default="unresolved")
    # user = relationship("User", primaryjoin="Comment.created_by == User.id", lazy="joined")
    created_by = Column(String(50), nullable=False)
    updated_by = Column(String(50), nullable=True)
    deleted_by = Column(String(50), nullable=True)
    replies = relationship("Reply", back_populates="comment", order_by="Reply.created_at")

    def __init__(
        self,
        identifier,
        comment_text,
        created_by,
        attachments=None,
        tagged_users=None,
        bookmarked=None,
        status="unresolved",
    ):
        self.identifier = identifier
        self.comment_text = comment_text
        self.created_by = created_by
        self.attachments = attachments
        self.tagged_users = tagged_users
        self.bookmarked = bookmarked
        self.status = status

    @property
    def user_name(self):
        return self.user.full_name if self.user else None


@mapper_registry.mapped
class Reply(BaseModelMixin):
    __tablename__ = "reply_server"
    comment_id = Column(Integer, ForeignKey("comment_server.id"))
    reply_text = Column(Text, nullable=False)
    attachments = Column(JSON, nullable=True)
    tagged_users = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # user = relationship("User", primaryjoin="Reply.created_by == User.id", lazy="joined")
    created_by = Column(String(50), nullable=False)
    updated_by = Column(String(50), nullable=True)
    deleted_by = Column(String(50), nullable=True)
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
    __tablename__ = "filter_server"
    filters = Column(JSON, nullable=True, default={})

    def __init__(self, filters):
        self.filters = filters
