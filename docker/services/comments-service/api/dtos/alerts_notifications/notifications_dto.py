class NotificationDTO:
    def __init__(self, notification):
        self.id = notification.id
        self.identifier = notification.identifier
        # self.app_id = notification.app_id
        # self.alert_id = notification.alert_id
        # self.widget_id = notification.widget_id
        self.title = notification.title
        self.message = notification.message
        self.is_read = notification.is_read
        self.triggered_at = notification.created_at.timestamp()
        # self.widget_name = notification.widget_name
        self.shared_by = notification.shared_by
        self.type = notification.type
        self.link = notification.link
