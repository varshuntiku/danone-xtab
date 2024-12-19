from typing import List

from api.configs.settings import get_app_settings
from api.constants.alerts_notifications.alerts_success import AlertsSuccess
from api.daos.alerts_notifications.alerts_dao import AlertsDao
from api.dtos.alerts_notifications.alerts_dto import (
    GetAlertsListByWidgetDTO,
    GetAlertsListDTO,
)
from api.models.base_models import User
from api.schemas.alerts_notification.alerts_schema import (
    CreateAlertRequestSchema,
    UpdateAlertRecieveNotificationRequestSchema,
    UpdateAlertRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService

settings = get_app_settings()


class AlertsService(BaseService):
    def __init__(self):
        super().__init__()
        from api.helpers.alerts_notifications.alerts_helper import AlertsHelper

        self.alerts_dao = AlertsDao(self.db_session)
        self.alerts_helper = AlertsHelper(self.db_session)

    def get_alerts_list(self, app_id: int, user_email: str) -> List[GetAlertsListDTO]:
        alerts_by_user = self.alerts_dao.get_alerts_by_app_id(app_id=app_id, user_email=user_email)

        response = [GetAlertsListDTO(alert=alert, alerts_dao=self.alerts_dao).__dict__ for alert in alerts_by_user]
        return response

    def get_alert_by_widget(self, widget_id: int, filter_data: str, user_email: str):
        alerts_by_widget = self.alerts_dao.get_alerts_by_widget(
            widget_id=widget_id,
            filter_data=filter_data,
            user_email=user_email,
        )
        response = [
            GetAlertsListByWidgetDTO(alert=alert, alerts_dao=self.alerts_dao).__dict__ for alert in alerts_by_widget
        ]
        return response

    def activate_alert(self, app_id: int) -> MessageResponseSchema:
        self.alerts_dao.activate_alerts_by_app_id(app_id=app_id)

        return {"message": AlertsSuccess.UPDATE_SUCCESS.value}

    def delete_alert(self, alert_id: int, user_id: int) -> MessageResponseSchema:
        self.alerts_dao.delete_alert_by_alert_id(alert_id, user_id)
        self.alerts_helper.add_alerts_user(alert_id=alert_id, users=[], user_id=user_id)
        self.db_session.commit()
        return {"message": AlertsSuccess.DELETE_SUCCESS.value}

    async def update_alert(
        self, alert_id: int, user: User, request_data: UpdateAlertRequestSchema
    ) -> MessageResponseSchema:
        alert = self.alerts_dao.update_alert(
            alert_id=alert_id,
            title=request_data.title,
            category=request_data.category,
            condition=request_data.condition,
            threshold=request_data.threshold,
            receive_notification=request_data.receive_notification,
            active=request_data.active,
            user_id=user.id,
        )

        self.alerts_helper.add_alerts_user(alert_id=alert_id, users=request_data.users, user_id=user.id)

        if request_data.widget_value is not None:
            await self.alerts_helper.notification_data(
                app_id=alert.app_id,
                widget_id=alert.app_screen_widget_id,
                widget_value=request_data.widget_value,
                user=user,
            )

        self.db_session.commit()

        return {"message": AlertsSuccess.UPDATE_SUCCESS.value}

    def update_alert_notification(
        self,
        alert_id: int,
        request_data: UpdateAlertRecieveNotificationRequestSchema,
    ) -> MessageResponseSchema:
        self.alerts_dao.update_alert_receive_notification(alert_id, request_data.receive_notification)
        return {"message": AlertsSuccess.UPDATE_SUCCESS.value}

    async def create_alert(
        self,
        user: User,
        request_data: CreateAlertRequestSchema,
    ) -> MessageResponseSchema:
        new_alert = self.alerts_dao.create_alert(request_data=request_data, user=user)

        if bool(len(request_data.users)):
            self.alerts_helper.add_alerts_user(alert_id=new_alert.id, users=request_data.users, user_id=user.id)

        if request_data.widget_value is not None:
            await self.alerts_helper.notification_data(
                app_id=new_alert.app_id,
                widget_id=new_alert.app_screen_widget_id,
                widget_value=request_data.widget_value,
                user=user,
            )
        self.db_session.commit()
        return {"message": AlertsSuccess.CREATE_SUCCESS.value}
