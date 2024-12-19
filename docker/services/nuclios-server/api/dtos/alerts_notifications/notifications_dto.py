from api.daos.apps.comments_dao import CommentsDao


class NotificationDTO:
    def __init__(self, notification, get_approval_id_status: CommentsDao.get_approval_status_by_id):
        self.id = notification.id
        self.app_id = notification.app_id
        self.alert_id = notification.alert_id
        self.widget_id = notification.widget_id
        self.title = notification.title
        self.message = notification.message
        self.is_read = notification.is_read
        self.triggered_at = notification.created_at.timestamp()
        self.widget_name = notification.widget_name
        self.shared_by = notification.shared_by
        self.type = notification.type
        self.link = notification.link
        self.approval_id = notification.approval_id
        if notification.type == "Task":
            self.approval_status = get_approval_id_status(approval_id=notification.approval_id)
        else:
            self.approval_status = None
