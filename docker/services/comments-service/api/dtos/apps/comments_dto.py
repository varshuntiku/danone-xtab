import json
from typing import List

from api.models.base_models import Comment, Filter, Reply


class CommentDTO:
    def __init__(self, comment: Comment):
        self.id = comment.id
        self.identifier = comment.identifier
        self.comment_text = comment.comment_text
        self.attachments = json.loads(comment.attachments) if comment.attachments else None
        self.tagged_users = json.loads(comment.tagged_users) if comment.tagged_users else None
        self.created_by = comment.created_by
        self.created_at = comment.created_at
        self.bookmarked = comment.bookmarked
        self.user_name = comment.user_name if hasattr(comment, "user_name") else None
        self.email_address = comment.user.email_address if hasattr(comment, "user") and comment.user else None
        self.deleted_at = comment.deleted_at
        self.status = comment.status
        self.replies = [ReplyDTO(reply).__dict__ for reply in comment.replies]


class ReplyDTO:
    def __init__(self, reply: Reply):
        self.reply_id = reply.id
        self.reply_text = reply.reply_text
        self.attachments = json.loads(reply.attachments) if reply.attachments else None
        self.tagged_users = json.loads(reply.tagged_users) if reply.tagged_users else None
        self.created_by = reply.created_by
        self.created_at = reply.created_at
        self.user_name = reply.user_name if hasattr(reply, "user_name") else None
        self.email_address = reply.user.email_address if hasattr(reply, "user") and reply.user else None


class FiltersDTO:
    def __init__(self, filter: Filter):
        self.id = filter.id
        self.filters = filter.filters
