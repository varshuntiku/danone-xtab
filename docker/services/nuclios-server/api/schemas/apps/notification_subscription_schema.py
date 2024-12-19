from typing import List, Optional

from pydantic import BaseModel


class SubscriptionSchema(BaseModel):
    app_id: int
    screen_id: Optional[int] = None
    widget_id: Optional[int] = None
    subscription_setting: str

    class Config:
        orm_mode = True


class SubscriptionAddSchema(BaseModel):
    subscriptions: List[SubscriptionSchema]


class GeneralSubscripitonResponseSchema(BaseModel):
    status: str
    subscription_ids: List

    class Config:
        orm_mode = True


class ThreadSubscriptionAddSchema(BaseModel):
    comment_id: int
    subscription_setting: bool

    class Config:
        orm_mode = True


class GeneralThreadSubscripitonResponseSchema(BaseModel):
    status: str
    subscription_id: int

    class Config:
        orm_mode = True
