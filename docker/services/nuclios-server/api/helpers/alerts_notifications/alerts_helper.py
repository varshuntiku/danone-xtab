import logging
import time
from pathlib import Path
from typing import Dict, List

from api.configs.settings import AppSettings
from api.daos.alerts.notifications_dao import NotificationsDao
from api.daos.alerts_notifications.alerts_dao import AlertsDao
from api.models.base_models import Alerts, AlertsUser, User
from api.utils.alerts_notifications.notifications import emit_notification
from api.utils.auth.email import send_email_smtp
from sqlalchemy.orm import Session


class AlertsHelper:
    def __init__(self, db_session: Session):
        self.alerts_dao = AlertsDao(db_session)
        self.notifications_dao = NotificationsDao(db_session)
        self.app_settings = AppSettings()

    async def notification_data(self, app_id: int, widget_id: int, widget_value: Dict, user: User):  # To be checked
        try:
            alerts_by_widget = self.alerts_dao.get_alerts_by_app_and_widget_id(app_id, widget_id, user.email_address)
            alerts_user = {}
            for alert in alerts_by_widget:
                alerts_user[alert.id] = self.alerts_dao.get_alerts_user_by_alert_id(alert.id)
            if len(alerts_by_widget) and widget_value.get("alert_config", False):
                await self.widget_notification(
                    widget_id, widget_value, alerts_by_widget, user.email_address, alerts_user
                )
        except Exception as ex:
            logging.exception(ex)
            return False

    async def widget_notification(
        self, widget_id, widget_value, alerts: List[Alerts], user_email: str, alerts_user: List[List[AlertsUser]]
    ):
        try:
            time.sleep(2)
            data = {
                "id": None,
                # 'receive_notification': False,
                "message": "",
                "widget_name": "",
            }
            category = None
            if "alert_config" in widget_value.keys():
                category = widget_value.get("alert_config", False).get("categories", False)

            if alerts is not None and category:
                for alert in alerts:
                    widget_name = alert.source_type.split(" >> ")[-1].title()
                    data["widget_name"] = widget_name
                    users_for_alert: List[AlertsUser] = alerts_user[alert.id]
                    # create a user email list with initially with the alert owner
                    alerts_email = [user_email]
                    for user in users_for_alert:
                        alerts_email.append(user.user_email)
                    time.sleep(2)
                    notifications_list = []
                    if alert.condition == "above" and alert.threshold is not None:
                        if category[alert.category]["value"] > int(alert.threshold):
                            data["id"] = str(alert.app_id) + str(alert.app_screen_widget_id) + str(alert.id)
                            # data['receive_notification'] = alert.receive_notification
                            data["message"] = (
                                "The "
                                + category[alert.category]["name"]
                                + " for "
                                + alert.title
                                + " has reached above "
                                + str(alert.threshold)
                            )
                            time.sleep(2)
                            notification_title = alert.category + " Rise "
                            notifications_list = self.alerts_dao.create_bulk_notifications(
                                alerts_email=alerts_email,
                                alert_id=alert.id,
                                app_id=alert.app_id,
                                widget_id=alert.app_screen_widget_id,
                                notification_title=notification_title,
                                message=data["message"],
                                widget_name=widget_name,
                                user_email=user_email,
                            )

                    if alert.condition == "below" and alert.threshold is not None:
                        if category[alert.category]["value"] < int(alert.threshold):
                            data["id"] = str(alert.app_id) + str(alert.app_screen_widget_id) + str(alert.id)
                            # data['receive_notification'] = alert.receive_notification
                            data["message"] = (
                                "The "
                                + category[alert.category]["name"]
                                + " for "
                                + alert.title
                                + " has reached below "
                                + str(alert.threshold)
                            )
                            # time.sleep(3)
                            notification_title = alert.category + " Drop"
                            notifications_list = self.alerts_dao.create_bulk_notifications(
                                alerts_email=alerts_email,
                                alert_id=alert.id,
                                app_id=alert.app_id,
                                widget_id=alert.app_screen_widget_id,
                                notification_title=notification_title,
                                message=data["message"],
                                widget_name=widget_name,
                                user_email=user_email,
                            )

                    self.alerts_dao.deactivate_alert(alert=alert)
                    for item in notifications_list:
                        data["id"] = item.id
                        data["app_id"] = item.app_id
                        data["alert_id"] = item.alert_id
                        data["widget_id"] = item.widget_id
                        data["title"] = item.title
                        data["is_read"] = item.is_read
                        data["triggered_at"] = time.time()
                        data["widget_name"] = item.widget_name
                        data["shared_by"] = item.shared_by
                        await emit_notification(data=data, user_email=item.user_email)
                    if data.get("id", False):
                        cover_photo_drop = f"{self.app_settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/cover-photo-notification-email-drop.png"
                        cover_photo_rise = f"{self.app_settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/cover-photo-notification-email-rise.png"
                        indication_graph_rise = (
                            f"{self.app_settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/value-rise-graph.png"
                        )
                        indication_graph_drop = (
                            f"{self.app_settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/value-dip-graph.png"
                        )

                        html_path = Path(__file__).parent.parent / "../email-templates/alert-notification.html"
                        html_template = open(html_path)
                        html = html_template.read().format(
                            blob_url=self.app_settings.AZURE_BLOB_ROOT_URL,
                            alert_name=alert.title,
                            alert_category=category[alert.category]["name"],
                            alert_condition=alert.condition,
                            alert_threshold=alert.threshold,
                            cover_photo=(cover_photo_rise if alert.condition == "above" else cover_photo_drop),
                            notification_condition=("drop" if alert.condition == "below" else "rise"),
                            notification_condition_caps=("Drop" if alert.condition == "below" else "Rise"),
                            widget_name=widget_name,
                            cur_data=category[alert.category]["value"],
                            link=alert.widget_url,
                            indication_graph=(
                                indication_graph_rise if alert.condition == "above" else indication_graph_drop
                            ),
                        )
                        html_template.close()
                        plain_text_path = Path(__file__).parent.parent / "../email-templates/alert-notification.txt"
                        plain_text_template = open(plain_text_path)
                        plain_text = plain_text_template.read().format(
                            alert_name=alert.title,
                            alert_category=category[alert.category]["name"],
                            alert_condition=alert.condition,
                            alert_threshold=alert.threshold,
                            widget_name=widget_name,
                            cur_data=category[alert.category]["value"],
                            link=alert.widget_url,
                        )
                        plain_text_template.close()

                        mail_subject = (
                            "Drop " + "in " + widget_name
                            if alert.condition == "below"
                            else "Rise " + "in " + widget_name
                        )

                        # mailData = {
                        #     "personalizations": [
                        #         {
                        #             "to": [{"email": email} for email in alerts_email],
                        #             "subject": mail_subject,
                        #         }
                        #     ],
                        #     "from": {"email": "test@example.com"},
                        #     "content": [
                        #         {"type": "text/plain", "value": plain_text},
                        #         {"type": "text/html", "value": html},
                        #     ],
                        # }
                        send_email_smtp(
                            email_type="alert-notification",
                            to=alerts_email,
                            subject=mail_subject,
                            body={"plain": plain_text, "html": html},
                            from_email_address=self.app_settings.SHARE_EMAIL_SENDER,
                            password=self.app_settings.SHARE_EMAIL_PWD,
                        )
        except Exception as ex:
            logging.exception(ex)
            return False

    def add_alerts_user(self, alert_id: int, users: List, user_id: int):
        self.alerts_dao.delete_alert_users_by_alert_id(alert_id=alert_id, user_id=user_id)

        if bool(len(users)):
            for user in users:
                self.alerts_dao.create_alerts_user(
                    alert_id=alert_id,
                    user_id=user["id"],
                    user_name=user["name"],
                    user_email=user["email"],
                    created_by_id=user_id,
                )

    async def send_comment_notification_email(self, email_data):
        try:
            cover_photo = (
                f"{self.app_settings.AZURE_BLOB_ROOT_URL}comment-notification/comment-notification.png".strip()
            )
            html_path = Path(__file__).parent.parent / "../email-templates/comment-notification.html"
            html_template = open(html_path)
            html = html_template.read().format(
                cover_photo=cover_photo,
                link=email_data["link"],
                message=email_data["message"],
                type=email_data["type"],
                sanitized_html=email_data["sanitized_html"],
            )
            html_template.close()

            mail_subject = email_data["subject"]

            send_email_smtp(
                email_type="comment-notification",
                to=[email_data["email"]],
                subject=mail_subject,
                body={"html": html},
                from_email_address=self.app_settings.SHARE_EMAIL_SENDER,
                password=self.app_settings.SHARE_EMAIL_PWD,
            )
        except Exception as ex:
            logging.exception(ex)
            return
