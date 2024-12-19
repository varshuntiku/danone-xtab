from api.controllers.base_controller import BaseController
from api.schemas.apps.notification_subscription_schema import (
    GeneralSubscripitonResponseSchema,
    GeneralThreadSubscripitonResponseSchema,
    SubscriptionAddSchema,
    ThreadSubscriptionAddSchema,
)
from api.services.apps.notification_subscription_service import (
    NotificationSubscriptionService,
)


class NotificationSubscriptionController(BaseController):
    async def add_subscription(self, user_id: int, request_data: SubscriptionAddSchema):
        with NotificationSubscriptionService() as notification_subscription_service:
            subscription_ids = await notification_subscription_service.add_subscription(
                user_id=user_id, request_data=request_data
            )
            return GeneralSubscripitonResponseSchema(status="Success", subscription_ids=subscription_ids)

    async def add_thread_subscription(self, user_id: int, request_data: ThreadSubscriptionAddSchema):
        with NotificationSubscriptionService() as notification_subscription_service:
            subscription_id = await notification_subscription_service.add_thread_subscription(
                user_id=user_id, request_data=request_data
            )
            return GeneralThreadSubscripitonResponseSchema(status="Success", subscription_id=subscription_id)
