import asyncio
import json
import logging
from typing import List

from api.configs.settings import get_app_settings
from api.constants.alerts_notifications.notifications_errors import NotificationsErrors
from api.constants.alerts_notifications.notifications_success import (
    NotificationsSuccess,
)
from api.daos.alerts_notifications.notifications_dao import NotificationsDao
from api.dtos.alerts_notifications.notifications_dto import NotificationDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.alerts_notification.notifications_schema import (
    CustomNotificationRequestDataSchema,
    DeleteMultipleNotificationsSchema,
    GetNotificationsResponseSchema,
    NotificationsReadRequestSchema,
    UpdateNotificationRequestDataSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService

# from api.utils.auth.token import validate_execution_token
from fastapi import status

settings = get_app_settings()

last_notification_id_by_users = {}


class NotificationsService(BaseService):
    def __init__(self):
        super().__init__()
        self.notifications_dao = NotificationsDao(self.db_session)

    def mark_notification_read(
        self, request_data: NotificationsReadRequestSchema, user_email: str
    ) -> MessageResponseSchema:
        notifications = getattr(request_data, "notifications")
        [
            {self.notifications_dao.update_notification_read_status(notification_id, user_email=user_email)}
            for notification_id in notifications
        ]
        self.notifications_dao.perform_commit()
        return {"message": NotificationsSuccess.UPDATE_SUCCESS.value}

    def get_filtered_notification(
        self, identifier: str, selected_filter: str, logged_in_email: str
    ) -> List[NotificationDTO]:
        selected_filter = json.loads(selected_filter)

        filtered_notification = self.notifications_dao.get_filtered_notifications(
            identifier, selected_filter, logged_in_email
        )

        return [NotificationDTO(notification) for notification in filtered_notification]

    def update_notification_read(
        self, notification_id: int, request_data: UpdateNotificationRequestDataSchema, user_email: str
    ) -> MessageResponseSchema:
        self.notifications_dao.update_notification(notification_id, user_email, getattr(request_data, "is_read"))
        return {"message": NotificationsSuccess.UPDATE_SUCCESS.value}

    def get_notifications(self, identifier: str, logged_in_email: str) -> GetNotificationsResponseSchema:
        unread_count = self.notifications_dao.get_notifications_unread_count(identifier, logged_in_email)
        app_notification = self.notifications_dao.get_notifications(identifier, logged_in_email)
        notifications = [NotificationDTO(notification).__dict__ for notification in app_notification]
        response = {"count": unread_count, "notifications": notifications}
        return response

    async def send_notifications(self, request, identifier: str, user_email: str):
        try:
            user = user_email
            if user not in last_notification_id_by_users:
                last_notification_id = self.notifications_dao.get_unread_notifications_by_id_order(
                    identifier=identifier, logged_in_email=user
                )
                if len(last_notification_id) != 0:
                    last_notification_id_by_users[user] = last_notification_id[0].id
                else:
                    if self.notifications_dao.notifications_last_id(identifier=identifier) is not None:
                        last_notification_id_by_users[user] = self.notifications_dao.notifications_last_id(
                            identifier=identifier
                        ).id
                    else:
                        last_notification_id_by_users[user] = 0
            while True:
                latest_notifications = self.notifications_dao.notifications_greater_than_id(
                    identifier=identifier,
                    logged_in_email=user,
                    last_notification_id=last_notification_id_by_users[user],
                )
                if len(latest_notifications) != 0:
                    for notification in latest_notifications:
                        notification = notification.serialize()
                        yield f"data: {json.dumps(notification)}\n\n"
                    last_notification_id_by_users[user] = latest_notifications[0].id
                await asyncio.sleep(3)
        except Exception as e:
            logging.exception(e)
            raise e
        finally:
            del last_notification_id_by_users[user]

    def delete_notification(self, user_email: str, request_data: DeleteMultipleNotificationsSchema):
        response = self.notifications_dao.delete_notification(user_email, request_data)
        if len(response) == len(request_data.notifications):
            return {"message": NotificationsSuccess.DELETE_NOTIFICATIONS_SUCCESS.value}
