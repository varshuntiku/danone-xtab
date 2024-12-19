import json

from api.daos.apps.notification_subscription_dao import NotificationSubscriptionDao
from api.models.base_models import Approval, Comment, Filter, Reply


class CommentDTO:
    def __init__(
        self,
        comment: Comment,
        user_id: int,
        notification_subscription_dao: NotificationSubscriptionDao,
        get_approvals: list = [],
    ):
        self.id = comment.id
        self.app_id = comment.app_id
        self.app_screen_id = comment.app_screen_id
        self.widget_id = comment.widget_id
        self.comment_text = comment.comment_text
        self.attachments = json.loads(comment.attachments) if comment.attachments else None
        self.tagged_users = json.loads(comment.tagged_users) if comment.tagged_users else None
        self.created_by = comment.created_by
        self.created_at = comment.created_at
        self.bookmarked = comment.bookmarked
        self.user_name = comment.user_name
        self.email_address = comment.user.email_address if comment.user else None
        self.deleted_at = comment.deleted_at
        self.status = comment.status
        self.replies = [ReplyDTO(reply).__dict__ for reply in comment.replies]
        self.subscription_setting = (
            notification_subscription_dao.get_thread_subscription(
                comment_id=comment.id, user_id=user_id
            ).subscription_setting
            if notification_subscription_dao.get_thread_subscription(comment_id=comment.id, user_id=user_id)
            else None
        )
        self.mode = comment.mode
        self.approvals = [ApprovalDTO(approval).__dict__ for approval in get_approvals]
        self.user_id = user_id
        self.created_by = comment.created_by
        self.scenario_list = comment.scenario_list.split(",") if comment.scenario_list else None


class ReplyDTO:
    def __init__(self, reply: Reply):
        self.reply_id = reply.id
        self.reply_text = reply.reply_text
        self.attachments = json.loads(reply.attachments) if reply.attachments else None
        self.tagged_users = json.loads(reply.tagged_users) if reply.tagged_users else None
        self.created_by = reply.created_by
        self.created_at = reply.created_at
        self.user_name = reply.user_name
        self.email_address = reply.user.email_address if reply.user else None


class FiltersDTO:
    def __init__(self, filter: Filter):
        self.id = filter.id
        self.filters = filter.filters


class ApprovalDTO:
    def __init__(self, approval: Approval):
        self.id = approval.id
        self.user_id = approval.user_id
        self.name = approval.name
        self.status = approval.status
