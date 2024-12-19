from typing import List

from api.controllers.base_controller import BaseController
from api.models.base_models import User
from api.schemas.alerts_notification.alerts_schema import (
    CreateAlertRequestSchema,
    GetAlertsListResponseSchema,
    UpdateAlertRecieveNotificationRequestSchema,
    UpdateAlertRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.alerts_notifications.alerts_service import AlertsService


class AlertsController(BaseController):
    def get_alerts_list(self, app_id: int, user_email: str) -> List[GetAlertsListResponseSchema]:
        with AlertsService() as alerts_service:
            response = alerts_service.get_alerts_list(app_id, user_email)
            return response

    def get_alert_by_widget(
        self, widget_id: int, filter_data: str, user_email: str
    ) -> List[GetAlertsListResponseSchema]:
        with AlertsService() as alerts_service:
            response = alerts_service.get_alert_by_widget(
                widget_id=widget_id, filter_data=filter_data, user_email=user_email
            )
            return response

    def activate_alert(self, app_id: int) -> MessageResponseSchema:
        with AlertsService() as alerts_service:
            response = alerts_service.activate_alert(app_id=app_id)
            return response

    def delete_alert(self, alert_id: int, user_id: int) -> MessageResponseSchema:
        with AlertsService() as alerts_service:
            response = alerts_service.delete_alert(alert_id, user_id)
            return response

    async def update_alert(
        self, alert_id: int, user: User, request_data: UpdateAlertRequestSchema
    ) -> MessageResponseSchema:
        with AlertsService() as alerts_service:
            response = await alerts_service.update_alert(alert_id, user, request_data)
            return response

    def update_alert_notification(
        self,
        alert_id: int,
        request_data: UpdateAlertRecieveNotificationRequestSchema,
    ) -> MessageResponseSchema:
        with AlertsService() as alerts_service:
            response = alerts_service.update_alert_notification(alert_id, request_data)
            return response

    async def create_alert(
        self,
        user: User,
        request_data: CreateAlertRequestSchema,
    ) -> MessageResponseSchema:
        with AlertsService() as alerts_service:
            response = await alerts_service.create_alert(user, request_data)
            return response
