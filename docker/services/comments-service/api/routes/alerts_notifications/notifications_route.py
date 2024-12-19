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
    user_email = request.state.logged_in_email
    return notifications_controller.mark_notification_read(request_data, user_email=user_email)


@router.get(
    "/notifications/filter", status_code=status.HTTP_200_OK, response_model=List[NotificationFilterResponseSchema]
)
@authenticate_user
async def get_filtered_notification(
    request: Request,
    identifier: Optional[str] = None,
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
    return notifications_controller.get_filtered_notification(identifier, selected_filter, logged_in_email)


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
    user_email = request.state.logged_in_email
    return notifications_controller.update_notification_read(notification_id, request_data, user_email=user_email)


@router.get("/notification", status_code=status.HTTP_200_OK, response_model=GetNotificationsResponseSchema)
@authenticate_user
async def get_notifications(
    request: Request,
    identifier: Optional[str] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to return list of notifications for a particular app
    """
    logged_in_email = request.state.logged_in_email
    return notifications_controller.get_notifications(identifier, logged_in_email)


@router.get("/sse/{user_email}", status_code=status.HTTP_200_OK)
async def notifications_using_sse(request: Request, identifier: str, user_email: str):
    """
    API Endpoint to implement sse for the notifications
    """
    return await notifications_controller.send_notifications(request, identifier=identifier, user_email=user_email)


@router.delete("/notification/delete", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def delete_notification(
    request: Request,
    request_data: DeleteMultipleNotificationsSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the notifications from the table
    """
    user_email = request.state.logged_in_email
    return notifications_controller.delete_notification(user_email, request_data)
