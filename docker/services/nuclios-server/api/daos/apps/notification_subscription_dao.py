import logging

from api.daos.base_daos import BaseDao
from api.models.core_product.subscription import Subscription
from api.models.core_product.thread_subscription import ThreadSubscripiton
from sqlalchemy.orm import Session


class NotificationSubscriptionDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    async def add_subscription(
        self, user_id: int, app_id: int, screen_id: int, subscription_setting: str, widget_id: int | None = None
    ):
        try:
            subscription = (
                self.db_session.query(Subscription)
                .filter_by(app_id=app_id, screen_id=screen_id, widget_id=widget_id, created_by=user_id)
                .first()
            )
            if not subscription:
                subscription_new = Subscription(
                    app_id=app_id,
                    screen_id=screen_id,
                    widget_id=widget_id,
                    subscription_setting=subscription_setting,
                    created_by=user_id,
                )
                self.db_session.add(subscription_new)
                self.db_session.commit()
                self.db_session.refresh(subscription_new)
                return subscription_new
            else:
                subscription.subscription_setting = subscription_setting
                self.db_session.add(subscription)
                self.db_session.commit()
                self.db_session.refresh(subscription)
                return subscription
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise e

    def get_subscriptions(self, user_id: int, app_id: int, screen_id: int):
        try:
            Subscriptions = (
                self.db_session.query(Subscription)
                .filter_by(app_id=app_id, created_by=user_id, screen_id=screen_id)
                .first()
            )
            if Subscriptions:
                return Subscriptions.subscription_setting
            else:
                return None
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise e

    def get_app_subscription_type(self, user_id: int, app_id: int, app_screens):
        try:
            subscriptions = self.db_session.query(Subscription).filter_by(app_id=app_id, created_by=user_id).all()
            if len(subscriptions) != 0:
                subscription_type = {}
                subscription_type[subscriptions[0].subscription_setting] = 1
                flag = False
                for i in range(1, len(subscriptions)):
                    if subscriptions[i].subscription_setting not in subscription_type.keys():
                        subscription_type[subscriptions[i].subscription_setting] = 1
                    else:
                        subscription_type[subscriptions[i].subscription_setting] += 1
                    if len(subscription_type) > 1:
                        flag = True
                        break
                if flag:
                    return "custom"
                else:
                    for i in subscription_type:
                        if subscription_type[i] != len(app_screens) and i != "@mentions":
                            return "custom"
                        else:
                            return i

        except Exception as e:
            logging.exception(e)
            raise e

    def get_subscriptions_based_on_app_id(self, app_id: int, screen_id: int):
        try:
            subscriptions = self.db_session.query(Subscription).filter_by(app_id=app_id, screen_id=screen_id).all()
            return subscriptions
        except Exception as e:
            logging.exception(e)
            raise e

    def add_thread_subcription(self, user_id: int, comment_id: int, subscription_setting: bool):
        try:
            subscription = (
                self.db_session.query(ThreadSubscripiton).filter_by(comment_id=comment_id, created_by=user_id).first()
            )
            if not subscription:
                subscription = ThreadSubscripiton(
                    comment_id=comment_id,
                    subscription_setting=subscription_setting,
                    created_by=user_id,
                )
                self.db_session.add(subscription)
                self.db_session.commit()
                self.db_session.refresh(subscription)
                return subscription
            else:
                subscription.subscription_setting = subscription_setting
                self.db_session.add(subscription)
                self.db_session.commit()
                self.db_session.refresh(subscription)
                return subscription
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise e

    def get_thread_subscription(self, comment_id: int, user_id: int):
        try:
            subscription = (
                self.db_session.query(ThreadSubscripiton).filter_by(comment_id=comment_id, created_by=user_id).first()
            )
            if subscription:
                return subscription
            else:
                return None
        except Exception as e:
            raise e

    def get_thread_subscription_by_comment_id(self, comment_id: int):
        try:
            subscription = self.db_session.query(ThreadSubscripiton).filter_by(comment_id=comment_id).all()
            return subscription
        except Exception as e:
            raise e

    def get_subscripition_by_user_id(self, app_id: int, screen_id: int, user_id: int):
        try:
            subscription = (
                self.db_session.query(Subscription)
                .filter_by(app_id=app_id, screen_id=screen_id, created_by=user_id)
                .first()
            )
            return subscription
        except Exception as e:
            raise e
