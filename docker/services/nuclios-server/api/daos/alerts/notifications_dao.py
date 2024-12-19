import logging

from api.daos.base_daos import BaseDao
from api.models.core_product.notification import Notifications
from sqlalchemy.orm import Session

############################
# TO BE IMPLEMENTED
############################


class NotificationsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def update_bulk_notifications(self, alerts_email, alert, notification_title, widget_name, user_email, data):
        try:
            notifications_list = [
                Notifications(
                    alert_id=alert.id,
                    app_id=alert.app_id,
                    widget_id=alert.app_screen_widget_id,
                    title=notification_title,
                    message=data["message"],
                    is_read=False,
                    user_email=email,
                    widget_name=widget_name,
                    shared_by=user_email if email != user_email else None,
                    additional_info=None,
                )
                for email in alerts_email
            ]
            self.db_session.bulk_save_objects(notifications_list, return_defaults=True)
            self.db_session.add(alert)
            self.db_session.flush()
            self.db_session.commit()

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            # raise GeneralException(
            #     status.HTTP_422_UNPROCESSABLE_ENTITY,
            #     message={"error": AppErrors.CHECK_APP_EXISTS_ERROR.value},
            # )
