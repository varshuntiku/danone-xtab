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
        self, request_data: NotificationsReadRequestSchema, user_id: int
    ) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.mark_notification_read(request_data, user_id)
            return response

    def get_filtered_notification(
        self, app_id: int, selected_filter: str, logged_in_email: str
    ) -> List[NotificationFilterResponseSchema]:
        with NotificationsService() as notifications_service:
            response = notifications_service.get_filtered_notification(app_id, selected_filter, logged_in_email)
            return response

    async def custom_notification(
        self, request_data: CustomNotificationRequestDataSchema, access_token: str
    ) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = await notifications_service.custom_notification(request_data, access_token)
            return response

    def delete_platform_notification(self) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.delete_platform_notification()
            return response

    def update_notification_read(
        self,
        notification_id: int,
        request_data: UpdateNotificationRequestDataSchema,
        user_id: int,
    ) -> MessageResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.update_notification_read(notification_id, request_data, user_id)
            return response

    def get_notifications(self, app_id: int, logged_in_email: str) -> GetNotificationsResponseSchema:
        with NotificationsService() as notifications_service:
            response = notifications_service.get_notifications(app_id, logged_in_email)
            return response

    async def send_notifications(self, app_id: int, user_id: int):
        headers = {"X-Accel-Buffering": "no"}
        with NotificationsService() as notifications_service:
            return StreamingResponse(
                notifications_service.send_notifications(app_id, user_id=user_id),
                media_type="text/event-stream",
                headers=headers,
            )

    def delete_notification(self, user_id: int, request_data: DeleteMultipleNotificationsSchema):
        with NotificationsService() as notification_service:
            response = notification_service.delete_notification(user_id, request_data)
            return response
