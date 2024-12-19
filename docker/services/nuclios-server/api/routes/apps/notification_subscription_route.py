from api.controllers.apps.notification_subscription_controller import (
    NotificationSubscriptionController,
)
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.apps.notification_subscription_schema import (
    GeneralSubscripitonResponseSchema,
    GeneralThreadSubscripitonResponseSchema,
    SubscriptionAddSchema,
    ThreadSubscriptionAddSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()
auth_scheme = HTTPBearer(auto_error=False)
notification_subscription_controller = NotificationSubscriptionController()


@router.post(
    "app/screen/subscription", status_code=status.HTTP_200_OK, response_model=GeneralSubscripitonResponseSchema
)
@authenticate_user
async def add_subscription(
    request: Request,
    request_data: SubscriptionAddSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create the subscription for the user
    """
    user_id = request.state.user.id
    return await notification_subscription_controller.add_subscription(user_id=user_id, request_data=request_data)


@router.post(
    "/app/screen/thread/subscripiton",
    status_code=status.HTTP_200_OK,
    response_model=GeneralThreadSubscripitonResponseSchema,
)
@authenticate_user
async def add_thread_subscription(
    request: Request,
    request_data: ThreadSubscriptionAddSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create a subscripiton for thread level
    """
    user_id = request.state.user.id
    return await notification_subscription_controller.add_thread_subscription(
        user_id=user_id, request_data=request_data
    )
