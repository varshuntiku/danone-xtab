from enum import Enum


class AlertsErrors(Enum):
    GET_ALERTS_ERROR = "Error getting alerts"
    GET_ALERTS_USER_ERROR = "Error getting alerts user"
    ACTIVATE_ALERTS_ERROR = "Error activating alerts"
    DELETE_ALERTS_ERROR = "Error deleting alert"
    DELETE_ALERTS_USER_ERROR = "Error deleting alert users"
    CREATE_ALERTS_USER_ERROR = "Error creating alerts user"
    CREATE_NOTIFICATION_ERROR = "Error creating notification"
    DEACTIVATE_ALERT_ERROR = "Error deactivating alert"
    UPDATE_ALERT_RECIEVE_NOTIFICATION_ERROR = "Error updating alert recieve notification"
    CREATE_ALERT_ERROR = "Error creating alert"
