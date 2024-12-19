from enum import Enum


class NotificationsErrors(Enum):
    UPDATE_NOTIFICATION_READ_STATUS_ERROR = "Error updating notification read status"
    FILTER_NOTIFICATIONS_ERROR = "Error while fetching notifications"
    NOTIFICATIONS_TRIGGER_ERROR = "Unable to trigger notification"
    NOTIFICATIONS_TOKEN_VALIDATION_ERROR = "Unable to validate token"
    NOTIFICATIONS_DELETE_ERROR = "Error while deleting notifications"
    NOTIFICATIONS_GET_ERROR = "Error while fetching notifications for app"
    NOTIFICATIONS_GET_UNREAD_COUNT_ERROR = "Error while fetching notifications unread count for app"
    NOTIFICATIONS_BULK_SAVE_ERROR = "Error while bulk saving notifications"
    NOTIFICATION_NOT_FOUND = "Error finding notification with id to delete or user_id mismatch"
