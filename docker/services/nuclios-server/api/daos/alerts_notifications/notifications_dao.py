import logging
from typing import Dict, List

from api.constants.alerts_notifications.notifications_errors import NotificationsErrors
from api.daos.base_daos import BaseDao
from api.daos.users.users_dao import UsersDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Notifications
from api.schemas.alerts_notification.notifications_schema import (
    DeleteMultipleNotificationsSchema,
)
from fastapi import status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class NotificationsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)
        self.users_dao = UsersDao(self.db_session)

    def perform_rollback(self):
        """
        Perform rollback if an error occured
        """
        return super().perform_rollback()

    def perform_commit(self):
        """
        Perform commit after all necessary operation are completed without error
        """
        return super().perform_commit()

    def update_notification_read_status(self, id: int, user_id: int) -> None:
        """
        Updates notification read status to True given notification id

        Args:
            id: notification id
            user_id: id of user updating the read status

        Returns:
            success message
        """
        try:
            self.db_session.query(Notifications).filter(Notifications.id == id).update(
                {Notifications.is_read: True, Notifications.updated_by: user_id, Notifications.updated_at: func.now()}
            )
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.UPDATE_NOTIFICATION_READ_STATUS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_filtered_notifications(self, app_id: int, selected_filter: Dict, logged_in_email: str):
        """
        Gets filtered notifications

        Args:
            app_id: app id
            selected_filter: selected filters
            logged_in_email: email of logged in user
        """
        try:
            notifications_filter = []

            # Filter by is_read
            if "is_read" in selected_filter:
                notifications_filter.append(Notifications.is_read == selected_filter["is_read"])

            # Filter by type
            if "type" in selected_filter:
                if selected_filter["type"] == "All":
                    pass  # Don't add any filter for "all"
                elif selected_filter["type"] == "Others":
                    notifications_filter.append(
                        or_(Notifications.type.is_(None), ~Notifications.type.in_(["Mentions", "Alerts", "Comments"]))
                    )
                elif selected_filter["type"] == "Comments":
                    notifications_filter.append(
                        Notifications.type.in_(
                            ["Comments", "Mentions"]
                        )  # comments will act as a superset of mentions(more will be added)
                    )
                else:
                    notifications_filter.append(Notifications.type == selected_filter["type"])
            # Filter by date range
            if selected_filter.get("start_date") and selected_filter.get("end_date"):
                selected_filter["start_date"] = selected_filter["start_date"] + "T00:00:00.000"
                selected_filter["end_date"] = selected_filter["end_date"] + "T23:59:59.000"
                notifications_filter.append(
                    Notifications.created_at.between(selected_filter["start_date"], selected_filter["end_date"])
                )

            notifications_filter = tuple(notifications_filter)

            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                        *notifications_filter,
                    )
                )
                .order_by(Notifications.created_at.desc())
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.FILTER_NOTIFICATIONS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_platform_notification(self) -> Dict:
        """
        Deletes platform notifications

        Args:
            None

        Returns:
            Success message
        """
        try:
            self.db_session.execute(
                "DELETE FROM public.notifications WHERE app_id is null and widget_id is null and created_at < ( current_date - integer '2')"
            )
            self.db_session.execute(
                "DELETE FROM public.notifications WHERE app_id is not null and widget_id is not null and created_at < ( current_date - integer '180')"
            )
            return {"success": True}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_DELETE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_notification(self, id: int, user_id: int, is_read: bool) -> Dict:
        """
        Updates notification read status

        Args:
            id: notification id
            user_id: id of user updating the read status
            is_read: value to set for is_read

        Returns:
            success message
        """
        try:
            notification = self.db_session.query(Notifications).filter_by(id=id).first()
            notification.is_read = is_read
            notification.updated_by = user_id
            notification.updated_at = func.now()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.UPDATE_NOTIFICATION_READ_STATUS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_notifications(self, app_id: int, logged_in_email: str) -> List[Notifications]:
        """
        Gets list of notifications

        Args:
            app_id: app id
            logged_in_email: email of logged in user

        Returns
            List of Notifications
        """
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                    )
                )
                .order_by(Notifications.created_at.desc())
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_notifications_unread_count(self, app_id: int, logged_in_email: str) -> int:
        """
        Gets the count of unread notifications

        Args:
            app_id: app id
            logged_in_email: email of logged in user

        Returns:
            Notifications unread count
        """
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                        Notifications.is_read.is_(False),
                    )
                )
                .count()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_UNREAD_COUNT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def bulk_save_notification_objects(self, notifications_list: List[Notifications]) -> Dict:
        """
        Bulk saves notifications objects

        Args:
            notifications_list: list of notifications objects

        Returns:
            success message
        """
        try:
            self.db_session.bulk_save_objects(notifications_list, return_defaults=True)
            self.db_session.flush()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_BULK_SAVE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_unread_notifications(self, app_id: int, logged_in_email: str) -> List[Notifications]:
        """
        Gets the count of unread notifications

        Args:
            app_id: app id
            logged_in_email: email of logged in user

        Returns:
            Notifications unread count
        """
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                        Notifications.is_read.is_(False),
                    )
                )
                .order_by(Notifications.created_at.desc())
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_UNREAD_COUNT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_unread_notifications_by_id_order(self, app_id: int, logged_in_email: str) -> List[Notifications]:
        """
        Gets the count of unread notifications

        Args:
            app_id: app id
            logged_in_email: email of logged in user

        Returns:
            Notifications unread count
        """
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                    )
                )
                .order_by(Notifications.id.desc())
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_UNREAD_COUNT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def notifications_greater_than_id(self, app_id: int, logged_in_email: str, last_notification_id: int):
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                        Notifications.user_email == logged_in_email,
                        Notifications.is_read.is_(False),
                        Notifications.id > last_notification_id,
                    )
                )
                .order_by(Notifications.id.desc())
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_UNREAD_COUNT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def notifications_last_id(self, app_id: int):
        try:
            return (
                self.db_session.query(Notifications)
                .filter(
                    and_(
                        Notifications.deleted_at.is_(None),
                        Notifications.app_id == app_id,
                    )
                )
                .order_by(Notifications.id.desc())
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_GET_UNREAD_COUNT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_notification(self, user_id: int, request_data: DeleteMultipleNotificationsSchema):
        try:
            user_email = self.users_dao.get_user_by_id(user_id=user_id).email_address
            notifications_list = (
                self.db_session.query(Notifications).filter(Notifications.id.in_(request_data.notifications)).all()
            )
            response_list = []
            for notification in notifications_list:
                if notification and notification.user_email == user_email:
                    notification.deleted_at = func.now()
                    self.db_session.add(notification)
                    response_list.append(notification)
                else:
                    raise GeneralException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        message={"error": NotificationsErrors.NOTIFICATION_NOT_FOUND.value},
                    )
            self.db_session.commit()
            return response_list
        except GeneralException as ge:
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": NotificationsErrors.NOTIFICATIONS_DELETE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
