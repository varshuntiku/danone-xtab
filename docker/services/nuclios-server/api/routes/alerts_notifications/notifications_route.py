from typing import List, Optional

from api.controllers.alerts_notifications.notifications_controller import (
    NotificationsController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.alerts_notification.notifications_schema import (
    CustomNotificationRequestDataSchema,
    DeleteMultipleNotificationsSchema,
    GetNotificationsResponseSchema,
    NotificationFilterResponseSchema,
    NotificationsReadRequestSchema,
    UpdateNotificationRequestDataSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)

notifications_controller = NotificationsController()


@router.put("/notifications/read", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def mark_notification_read(
    request: Request,
    request_data: NotificationsReadRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the read status for list of notification Ids \n
    Example Request Parameters: \n
        {
            "notifications": [103,199]
        }
    """
    user_id = request.state.user.id
    return notifications_controller.mark_notification_read(request_data, user_id)


@router.get(
    "/notifications/filter", status_code=status.HTTP_200_OK, response_model=List[NotificationFilterResponseSchema]
)
@authenticate_user
async def get_filtered_notification(
    request: Request,
    app_id: Optional[int] = None,
    selected_filter: Optional[str] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the filtered notification according to the selected filter options \n
    Example Query String Parameters: \n
        app_id: 1221
        selected_filter:\n
            {
            "is_read":true,
            "type":"Alerts"
            }
    """
    logged_in_email = request.state.logged_in_email
    return notifications_controller.get_filtered_notification(app_id, selected_filter, logged_in_email)


@router.post("/custom-notification", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
async def custom_notification(
    request: Request,
    request_data: CustomNotificationRequestDataSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to generate custom notification on platform level \n
    Example Request Parameters: \n
        {
            "socket_data": {
                "message": "test message",
                        "title": "test tile",
                "email": [
                    "garima.kamboj@mathco.com"
                ],
                "mail_template": {
                    "subject": "test subject",
                    "plain_text": "sample mail body for the custom notification",
                    "html": "<p>Test html format</p>"
                },
                "app_id": 1007
            },
            "notification_type": "push"
        }
    Authorization Token:
        Generate the token for custom notification from generate PAT module in platform utils
    """
    access_token = token.credentials
    response = await notifications_controller.custom_notification(request_data, access_token)
    return response


@router.get("/platform-notification/delete", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
async def delete_platform_notification(request: Request):
    """
    API to hard delete the platform notifications that are older than 3 months and
    app notifications that are older than 6 months
    """
    return notifications_controller.delete_platform_notification()


@router.put(
    "/notification/{notification_id}/read", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema
)
@authenticate_user
async def update_notification_read(
    request: Request,
    notification_id: int,
    request_data: UpdateNotificationRequestDataSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the notification read status for notification \n
    Example Request Parameters: \n
        {
            "is_read": true
        }
    """
    user_id = request.state.user.id
    return notifications_controller.update_notification_read(notification_id, request_data, user_id)


@router.get("/notification", status_code=status.HTTP_200_OK, response_model=GetNotificationsResponseSchema)
@authenticate_user
async def get_notifications(
    request: Request,
    app_id: Optional[int] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to return list of notifications for a particular app
    """
    logged_in_email = request.state.logged_in_email
    return notifications_controller.get_notifications(app_id, logged_in_email)


@router.get("/sse/{app_id}/{user_id}", status_code=status.HTTP_200_OK)
async def notifications_using_sse(request: Request, app_id: int, user_id: int):
    """
    API Endpoint to implement sse for the notifications
    """
    return await notifications_controller.send_notifications(app_id=app_id, user_id=user_id)


@router.delete("/notification/delete", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_notification(
    request: Request,
    request_data: DeleteMultipleNotificationsSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the notification from the table
    """
    user_id = request.state.user.id
    return notifications_controller.delete_notification(user_id, request_data)
