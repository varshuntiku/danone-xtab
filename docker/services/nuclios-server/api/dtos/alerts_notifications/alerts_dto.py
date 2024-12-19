from api.daos.alerts_notifications.alerts_dao import AlertsDao
from api.models.base_models import Alerts, AlertsUser


class GetAlertsListDTO:
    def __init__(self, alert: Alerts, alerts_dao: AlertsDao):
        self.id = alert.id
        self.title = alert.title
        self.category = alert.category
        self.condition = alert.condition
        self.threshold = alert.threshold
        self.app_id = alert.app_id
        self.app_screen_id = alert.app_screen_id
        self.app_screen_widget_id = alert.app_screen_widget_id
        self.receive_notification = alert.receive_notification
        self.alert_source_type = alert.source_type
        self.alert_widget_type = alert.widget_type
        self.users = [
            AlertsUserDTO(user).__dict__ for user in alerts_dao.get_alerts_user_by_alert_id(alert_id=alert.id)
        ]


class GetAlertsListByWidgetDTO:
    def __init__(self, alert: Alerts, alerts_dao: AlertsDao):
        self.id = alert.id
        self.title = alert.title
        self.category = alert.category
        self.condition = alert.condition
        self.threshold = alert.threshold
        self.app_id = alert.app_id
        self.app_screen_id = alert.app_screen_id
        self.app_screen_widget_id = alert.app_screen_widget_id
        self.receive_notification = alert.receive_notification
        self.active = alert.active
        self.users = [
            AlertsUserDTO(user).__dict__ for user in alerts_dao.get_alerts_user_by_alert_id(alert_id=alert.id)
        ]


class AlertsUserDTO:
    def __init__(self, user: AlertsUser):
        self.id = user.user_id
        self.email = user.user_email
        self.name = user.user_name
