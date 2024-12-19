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
from api.daos.apps.comments_dao import CommentsDao
from api.daos.users.users_dao import UsersDao
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
from api.utils.auth.token import validate_execution_token
from fastapi import status
from api.utils.alerts_notifications.notifications import (
            trigger_custom_notification,
)

settings = get_app_settings()

last_notification_id_by_users = {}


class NotificationsService(BaseService):
    def __init__(self):
        super().__init__()

        self.notifications_dao = NotificationsDao(self.db_session)
        self.users_dao = UsersDao(self.db_session)
        self.comments_dao = CommentsDao(self.db_session)

    def mark_notification_read(
        self, request_data: NotificationsReadRequestSchema, user_id: int
    ) -> MessageResponseSchema:
        notifications = getattr(request_data, "notifications")
        [
            {self.notifications_dao.update_notification_read_status(notification_id, user_id)}
            for notification_id in notifications
        ]
        self.notifications_dao.perform_commit()
        return {"message": NotificationsSuccess.UPDATE_SUCCESS.value}

    def get_filtered_notification(
        self, app_id: int, selected_filter: str, logged_in_email: str
    ) -> List[NotificationDTO]:
        selected_filter = json.loads(selected_filter)

        filtered_notification = self.notifications_dao.get_filtered_notifications(
            app_id, selected_filter, logged_in_email
        )

        return [
            NotificationDTO(notification, self.comments_dao.get_approval_status_by_id)
            for notification in filtered_notification
        ]

    async def custom_notification(
        self, request_data: CustomNotificationRequestDataSchema, access_token: str
    ) -> MessageResponseSchema | None:
        try:
            user_token = validate_execution_token(access_token, self.users_dao.get_user_token_by_token_and_email)
            if user_token is not None and user_token.user_email:
                socket_data = getattr(request_data, "socket_data", {})
                notification_type = getattr(request_data, "notification_type", "")
                additional_info = json.loads(getattr(request_data, "notification_additional_info", "{}"))
                ordered_users = self.users_dao.get_all_ordered_users()
                try:
                    await trigger_custom_notification(
                        socket_data,
                        notification_type,
                        self.notifications_dao.bulk_save_notification_objects,
                        ordered_users,
                        user_token.user_email,
                        user_token.access,
                        additional_info,
                    )
                    return {"message": NotificationsSuccess.NOTIFICATION_TRIGGER_SUCCESS.value}
                except Exception as e:
                    logging.exception(e)
                    raise GeneralException(
                        message={"message": NotificationsErrors.NOTIFICATIONS_TRIGGER_ERROR.value},
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                raise GeneralException(
                    message={"message": NotificationsErrors.NOTIFICATIONS_TOKEN_VALIDATION_ERROR.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"message": NotificationsErrors.NOTIFICATIONS_TOKEN_VALIDATION_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    def delete_platform_notification(self) -> MessageResponseSchema:
        self.notifications_dao.delete_platform_notification()
        return {"message": NotificationsSuccess.DELETE_NOTIFICATIONS_SUCCESS.value}

    def update_notification_read(
        self, notification_id: int, request_data: UpdateNotificationRequestDataSchema, user_id: int
    ) -> MessageResponseSchema:
        self.notifications_dao.update_notification(notification_id, user_id, getattr(request_data, "is_read"))
        return {"message": NotificationsSuccess.UPDATE_SUCCESS.value}

    def get_notifications(self, app_id: int, logged_in_email: str) -> GetNotificationsResponseSchema:
        unread_count = self.notifications_dao.get_notifications_unread_count(app_id, logged_in_email)
        app_notification = self.notifications_dao.get_notifications(app_id, logged_in_email)
        notifications = [
            NotificationDTO(notification, self.comments_dao.get_approval_status_by_id).__dict__
            for notification in app_notification
        ]
        response = {"count": unread_count, "notifications": notifications}
        if app_id is None:
            response["type"] = "platform_notification"
        return response

    async def send_notifications(self, app_id: int, user_id: int):
        try:
            user = self.users_dao.get_user_by_id(user_id=user_id).email_address
            if user not in last_notification_id_by_users:
                last_notification_id = self.notifications_dao.get_unread_notifications_by_id_order(
                    app_id=app_id, logged_in_email=user
                )
                if len(last_notification_id) != 0:
                    last_notification_id_by_users[user] = last_notification_id[0].id
                else:
                    if self.notifications_dao.notifications_last_id(app_id=app_id) is not None:
                        last_notification_id_by_users[user] = self.notifications_dao.notifications_last_id(
                            app_id=app_id
                        ).id
                    else:
                        last_notification_id_by_users[user] = 0
            while True:
                latest_notifications = self.notifications_dao.notifications_greater_than_id(
                    app_id=app_id, logged_in_email=user, last_notification_id=last_notification_id_by_users[user]
                )
                if len(latest_notifications) != 0:
                    for notification in latest_notifications:
                        notification = notification.serialize()
                        notification["approval_status"] = "pending"
                        yield f"data: {json.dumps(notification)}\n\n"
                    last_notification_id_by_users[user] = latest_notifications[0].id
                await asyncio.sleep(3)
        except Exception as e:
            logging.exception(e)
            raise e
        finally:
            del last_notification_id_by_users[user]

    def delete_notification(self, user_id: int, request_data: DeleteMultipleNotificationsSchema):
        response = self.notifications_dao.delete_notification(user_id, request_data)
        if len(response) == len(request_data.notifications):
            return {"message": NotificationsSuccess.DELETE_NOTIFICATIONS_SUCCESS.value}
