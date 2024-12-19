from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.alerts_notification.notifications_schema import (
    CustomNotificationRequestDataSchema,
    DeleteMultipleNotificationsSchema,
    GetNotificationsResponseSchema,
    NotificationFilterResponseSchema,
    NotificationsReadRequestSchema,
    UpdateNotificationRequestDataSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.alerts_notifications.notifications_service import NotificationsService
from fastapi.responses import StreamingResponse


class NotificationsController(BaseController):
    def mark_notification_read(
        self, request_data: NotificationsReadRequestSchema, user_email: str
    ) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.mark_notification_read(request_data, user_email=user_email)
            return response

    def get_filtered_notification(
        self, identifier: str, selected_filter: str, logged_in_email: str
    ) -> List[NotificationFilterResponseSchema]:
        with NotificationsService() as notifications_service:
            response = notifications_service.get_filtered_notification(identifier, selected_filter, logged_in_email)
            return response

    def update_notification_read(
        self, notification_id: int, request_data: UpdateNotificationRequestDataSchema, user_email: str
    ) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.update_notification_read(
                notification_id, request_data, user_email=user_email
            )
            return response

    def get_notifications(self, identifier: str, logged_in_email: str) -> GetNotificationsResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.get_notifications(identifier, logged_in_email)
            return response

    async def send_notifications(self, request, identifier: str, user_email: str):
        with NotificationsService() as notifications_service:
            return StreamingResponse(
                notifications_service.send_notifications(request, identifier=identifier, user_email=user_email),
                media_type="text/event-stream",
            )

    def delete_notification(self, user_email: str, request_data: DeleteMultipleNotificationsSchema):
        with NotificationsService() as notification_service:
            response = notification_service.delete_notification(user_email, request_data)
            return response
