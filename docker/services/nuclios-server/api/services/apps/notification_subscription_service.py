from api.daos.apps.notification_subscription_dao import NotificationSubscriptionDao
from api.daos.apps.screen_dao import ScreenDao
from api.schemas.apps.notification_subscription_schema import (
    SubscriptionAddSchema,
    ThreadSubscriptionAddSchema,
)
from api.services.base_service import BaseService


class NotificationSubscriptionService(BaseService):
    def __init__(self):
        super().__init__()
        self.notification_subscription_dao = NotificationSubscriptionDao(self.db_session)
        self.screen_dao = ScreenDao(self.db_session)

    async def add_subscription(self, user_id: int, request_data: SubscriptionAddSchema):
        if (
            len(request_data.subscriptions) == 1
            and not request_data.subscriptions[0].screen_id
            and not request_data.subscriptions[0].widget_id
        ):
            screens = self.screen_dao.get_screens_by_app_id(app_id=request_data.subscriptions[0].app_id)
            subscription_list = []
            for screen in screens:
                response = await self.notification_subscription_dao.add_subscription(
                    user_id=user_id,
                    app_id=request_data.subscriptions[0].app_id,
                    screen_id=screen.id,
                    subscription_setting=request_data.subscriptions[0].subscription_setting,
                )
                subscription_list.append(response.id)
            return subscription_list

        else:
            subscription_list = []
            for subscription in request_data.subscriptions:
                response = await self.notification_subscription_dao.add_subscription(
                    user_id=user_id,
                    app_id=subscription.app_id,
                    screen_id=subscription.screen_id,
                    subscription_setting=subscription.subscription_setting,
                )
                subscription_list.append(response.id)
            return subscription_list

    async def add_thread_subscription(self, user_id: int, request_data: ThreadSubscriptionAddSchema):
        subscription = self.notification_subscription_dao.add_thread_subcription(
            user_id=user_id, comment_id=request_data.comment_id, subscription_setting=request_data.subscription_setting
        )
        return subscription.id
