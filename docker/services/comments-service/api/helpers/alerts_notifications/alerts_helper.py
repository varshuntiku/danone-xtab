import logging
import time
from pathlib import Path
from typing import Dict, List

from api.configs.settings import AppSettings

# from api.daos.alerts_notifications.alerts_dao import AlertsDao
# from api.models.base_models import Alerts, AlertsUser, User
from api.utils.auth.email import send_email_smtp
from sqlalchemy.orm import Session


class AlertsHelper:
    def __init__(self, db_session: Session):
        # self.alerts_dao = AlertsDao(db_session)
        self.app_settings = AppSettings()

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
                author=email_data["author"],
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
