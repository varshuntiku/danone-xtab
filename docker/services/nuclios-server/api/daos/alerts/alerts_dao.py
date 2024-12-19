import logging

from api.daos.base_daos import BaseDao

# from api.middlewares.error_middleware import GeneralException
from api.models.core_product.alert import Alerts, AlertsUser

# from fastapi import status
from sqlalchemy import and_
from sqlalchemy.orm import Session

############################
# TO BE IMPLEMENTED
############################


class AlertsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_alerts_by_widgets(self, app_id, widget_id, widgt_value, state):
        try:
            alerts_by_widget = (
                self.db_session.query(Alerts)
                .filter(
                    and_(
                        Alerts.app_id == app_id,
                        Alerts.deleted_at.is_(None),
                        Alerts.app_screen_widget_id == widget_id,
                        Alerts.user_email == state.logged_in_email,
                        Alerts.receive_notification.is_(True),
                        Alerts.active.is_(True),
                    )
                )
                .order_by(Alerts.id)
                .all()
            )
            return alerts_by_widget
        except Exception as e:
            logging.exception(e)
            # raise GeneralException(
            #     status.HTTP_422_UNPROCESSABLE_ENTITY,
            #     message={"error": AppErrors.CHECK_APP_EXISTS_ERROR.value},
            # )

    def get_alerts_user(self, alert):
        try:
            return (
                self.db_session.query(AlertsUser)
                .filter(and_(AlertsUser.alert_id == alert.id, AlertsUser.deleted_at.is_(None)))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            # raise GeneralException(
            #     status.HTTP_422_UNPROCESSABLE_ENTITY,
            #     message={"error": AppErrors.CHECK_APP_EXISTS_ERROR.value},
            # )
