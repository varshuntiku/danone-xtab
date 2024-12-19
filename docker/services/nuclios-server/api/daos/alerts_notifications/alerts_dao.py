import logging
from typing import List

from api.constants.alerts_notifications.alerts_errors import AlertsErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Alerts, AlertsUser, Notifications, User
from api.schemas.alerts_notification.alerts_schema import CreateAlertRequestSchema
from fastapi import status
from sqlalchemy import and_, func
from sqlalchemy.orm import Session


class AlertsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_alerts_by_app_id(self, app_id: int, user_email: str) -> List[Alerts]:
        """
        Get alerts by user email and app id

        Args:
            app_id: int,
            user_email: str

        Returns:
            List of Alerts
        """
        try:
            return (
                self.db_session.query(Alerts)
                .filter(
                    Alerts.deleted_at.is_(None),
                    Alerts.user_email == user_email,
                    Alerts.app_id == app_id,
                )
                .order_by(Alerts.id)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.GET_ALERTS_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_alerts_user_by_alert_id(self, alert_id: int) -> List[AlertsUser]:
        """
        Get alert users by alert id

        Args:
            alert_id: alert id

        Returns:
            List of AlertsUser
        """
        try:
            return (
                self.db_session.query(AlertsUser)
                .filter(
                    and_(
                        AlertsUser.alert_id == alert_id,
                        AlertsUser.deleted_at.is_(None),
                    )
                )
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.GET_ALERTS_USER_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_alerts_by_widget(self, widget_id: int, filter_data: str, user_email: str) -> List[Alerts]:
        """
        Get alerts by widget id

        Args:
            widget_id: int,
            filter_data: str,
            user_email: str

        Returns:
            List of Alerts
        """
        try:
            return (
                self.db_session.query(Alerts)
                .filter(
                    and_(
                        Alerts.deleted_at.is_(None),
                        Alerts.app_screen_widget_id == widget_id,
                        Alerts.filter_data == filter_data,
                        Alerts.user_email == user_email,
                    )
                )
                .order_by(Alerts.id)
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.GET_ALERTS_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def activate_alerts_by_app_id(self, app_id: int) -> None:
        """
        Activate alerts by app id

        Args:
            app_id: int

        Returns:
            None
        """
        try:
            self.db_session.query(Alerts).filter_by(app_id=app_id, deleted_at=None).update({"active": True})
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.ACTIVATE_ALERTS_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_alert_by_alert_id(self, alert_id: int, user_id: int) -> None:
        """
        Delete alerts by alert id

        Args:
            alert_id: int
            user_id: int

        Returns:
            None
        """
        try:
            alert: Alerts = self.db_session.query(Alerts).filter_by(id=alert_id).first()
            alert.deleted_at = func.now()
            alert.deleted_by = user_id
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.DELETE_ALERTS_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_alert_users_by_alert_id(self, alert_id: int, user_id: int) -> None:
        """
        Delete alerts users by alert id

        Args:
            alert_id: int
            user_id: int

        Returns:
            None
        """
        try:
            self.db_session.query(AlertsUser).filter(
                and_(AlertsUser.deleted_at.is_(None), AlertsUser.alert_id == alert_id)
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.DELETE_ALERTS_USER_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_alerts_user(
        self,
        alert_id: int,
        user_id: int,
        user_name: str,
        user_email: str,
        created_by_id: int,
    ) -> AlertsUser:
        """
        Create alerts user

        Args:
            alert_id: int
            user_id: int
            user_name: str
            user_email: str
            created_by_id: int

        Returns:
            AlertsUser
        """
        try:
            new_user = AlertsUser(
                alert_id=alert_id, user_id=user_id, user_name=user_name, user_email=user_email, created_by=created_by_id
            )
            self.db_session.add(new_user)
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.CREATE_ALERTS_USER_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_alert(
        self,
        alert_id: int,
        user_id: int,
        title: str,
        category: str,
        condition: str,
        threshold: int,
        receive_notification: bool,
        active: bool,
    ) -> Alerts:
        """
        Create alerts user

        Args:
            alert_id: int
            user_id: int
            title: str
            category: str
            condition: str
            threshold: int
            receive_notification: bool
            active: bool

        Returns:
            Alerts
        """
        try:
            alert: Alerts = self.db_session.query(Alerts).filter_by(id=alert_id).first()
            alert.title = title
            alert.category = category
            alert.condition = condition
            alert.threshold = threshold
            alert.receive_notification = receive_notification
            alert.active = active
            self.db_session.flush()
            return alert
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": AlertsErrors.CREATE_ALERTS_USER_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_alerts_by_app_and_widget_id(self, app_id: int, widget_id: int, user_email: str) -> List[Alerts]:
        """
        Get alerts by app id and widget id

        Args:
            app_id: int
            widget_id: int
            user_email: str

        Returns:
            List of Alerts
        """
        try:
            alerts_by_widget = (
                self.db_session.query(Alerts)
                .filter(
                    and_(
                        Alerts.app_id == app_id,
                        Alerts.deleted_at.is_(None),
                        Alerts.app_screen_widget_id == widget_id,
                        Alerts.user_email == user_email,
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
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AlertsErrors.GET_ALERTS_ERROR.value},
            )

    def create_bulk_notifications(
        self,
        alerts_email: List,
        alert_id: int,
        app_id: int,
        widget_id: int,
        notification_title: str,
        message: str,
        widget_name: str,
        user_email: str,
    ) -> List[Notifications]:
        """
        Create bulk notifications for user email list

        Args:
            alerts_email: list of email
            alert_id: int
            app_id: int
            widget_id: int
            notification_title: str
            message: str
            widget_name: str
            user_email: str

        Returns:
            List of notifications
        """
        try:
            notifications_list = [
                Notifications(
                    alert_id=alert_id,
                    app_id=app_id,
                    widget_id=widget_id,
                    title=notification_title,
                    message=message,
                    is_read=False,
                    user_email=email,
                    widget_name=widget_name,
                    shared_by=user_email if email != user_email else None,
                    additional_info=None,
                )
                for email in alerts_email
            ]
            for notification in notifications_list:
                self.db_session.add(notification)
            self.db_session.flush()
            return notifications_list
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AlertsErrors.CREATE_NOTIFICATION_ERROR.value},
            )

    def deactivate_alert(self, alert: Alerts) -> None:
        """
        Deactivate alert

        Args:
            alert: Alert to be deactivated

        Returns:
            None
        """
        try:
            alert.active = False
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AlertsErrors.DEACTIVATE_ALERT_ERROR.value},
            )

    def update_alert_receive_notification(self, alert_id: int, receive_notification: bool | None) -> None:
        """
        Update Alert

        Args:
            alert_id: int
            receive_notification: bool

        Returns:
            None
        """
        try:
            alert: Alerts = self.db_session.query(Alerts).filter_by(id=alert_id).first()
            alert.receive_notification = receive_notification
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AlertsErrors.UPDATE_ALERT_RECIEVE_NOTIFICATION_ERROR.value},
            )

    def create_alert(self, request_data: CreateAlertRequestSchema, user: User) -> Alerts:
        """
        Create Alert

        Args:
            request_date: detail to create new alert
            user_id: id of user creating the alert

        Returns:
            Alerts
        """
        try:
            new_alert = Alerts(
                title=request_data.title,
                message=request_data.message,
                created_by=user.id,
                user_email=user.email_address,
                app_id=request_data.app_id,
                app_screen_id=request_data.app_screen_id,
                app_screen_widget_id=request_data.app_screen_widget_id,
                filter_data=request_data.filter_data,
                category=request_data.category,
                condition=request_data.condition,
                threshold=request_data.threshold,
                receive_notification=request_data.receive_notification,
                active=True,
                source_type=request_data.alert_source_type,
                widget_type=request_data.alert_widget_type,
                widget_url=request_data.widget_url,
            )
            self.db_session.add(new_alert)
            self.db_session.flush()
            return new_alert
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": AlertsErrors.CREATE_ALERT_ERROR.value},
            )
