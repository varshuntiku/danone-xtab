from typing import List

from api.controllers.alerts_notifications.alerts_controller import AlertsController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.alerts_notification.alerts_schema import (
    CreateAlertRequestSchema,
    GetAlertsListByWidgeResponseSchema,
    GetAlertsListResponseSchema,
    UpdateAlertRecieveNotificationRequestSchema,
    UpdateAlertRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

alerts_controller = AlertsController()


@router.get("", status_code=status.HTTP_200_OK, response_model=List[GetAlertsListResponseSchema])
@authenticate_user
async def get_alerts_list(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns a list of all the existing alerts
    """
    user_email = request.state.user.email_address
    return alerts_controller.get_alerts_list(app_id, user_email)


@router.get(
    "/widgets/{widget_id}", status_code=status.HTTP_200_OK, response_model=List[GetAlertsListByWidgeResponseSchema]
)
@authenticate_user
async def get_alert_by_widget(
    request: Request,
    widget_id: int,
    filter_data: str = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Generates a list of alerts and it's info for the givem widget_id
    """
    user_email = request.state.user.email_address
    return alerts_controller.get_alert_by_widget(widget_id=widget_id, filter_data=filter_data, user_email=user_email)


@router.get("/{app_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def activate_alert(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the active state of alert for the given app id
    """
    return alerts_controller.activate_alert(app_id=app_id)


@router.delete(
    "/{alertId}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def delete_alert(
    request: Request,
    alertId: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes the alert for the given alertID
    """
    user_id = request.state.user.id
    return alerts_controller.delete_alert(alertId, user_id)


@router.put(
    "/{alertId}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_alert(
    request: Request,
    alertId: int,
    request_data: UpdateAlertRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the alert data for the given alertID \n
    Example Request Parameters: \n
        {
            "title": "new title",
            "category": "static",
            "condition": "above",
            "threshold": 10,
            "receive_notification": true,
            "active": true,
            "widget_value": {},
            "users": [
                {
                "id": 1482,
                "name": "Arpit Patel",
                "email": "arpit.patel@mathco.com"
                }
            ]
        }
    """
    user = request.state.user
    return await alerts_controller.update_alert(alertId, user, request_data)


@router.put(
    "/{alertId}/notification",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_alert_notification(
    request: Request,
    alertId: int,
    request_data: UpdateAlertRecieveNotificationRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the alert notification for the given alertID \n
    Example Request Parameters: \n
        {
            "receive_notification": true
        }
    """
    return alerts_controller.update_alert_notification(alertId, request_data)


@router.post(
    "",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def create_alert(
    request: Request,
    request_data: CreateAlertRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Creates and adds a new alert \n
    Example Request Parameters: \n
        {
            "title": "new alert",
            "message": null,
            "app_id": 26,
            "app_screen_id": 103,
            "app_screen_widget_id": 484,
            "filter_data": "{}",
            "category": "static",
            "condition": "above",
            "threshold": 10,
            "receive_notification": true,
            "alert_source_type": "",
            "alert_widget_type": "",
            "widget_url": "",
            "users": [
                {
                "id": 1482,
                "name": "Arpit Patel",
                "email": "arpit.patel@mathco.com"
                }
            ],
            "widget_value": {}
        }
    """
    user = request.state.user
    return await alerts_controller.create_alert(user, request_data)
