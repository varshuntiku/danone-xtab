from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class NotificationsReadRequestSchema(BaseModel):
    notifications: Optional[List] = None

    class config:
        orm_mode = True


class NotificationFilterResponseSchema(BaseModel):
    id: int
    identifier: str
    title: str | None
    message: str | None
    is_read: bool | None
    triggered_at: datetime | None
    shared_by: str | None
    type: str | None
    link: str | None

    class config:
        orm_mode = True


class CustomNotificationRequestDataSchema(BaseModel):
    socket_data: Optional[Dict] = None
    notification_type: Optional[str] = None
    notification_additional_info: Optional[str] = "{}"

    class config:
        orm_mode = True


class UpdateNotificationRequestDataSchema(BaseModel):
    is_read: bool | None

    class config:
        orm_mode = True


class GetNotificationsResponseSchema(BaseModel):
    count: int
    notifications: List
    type: Optional[str] = None

    class config:
        orm_mode = True


class DeleteMultipleNotificationsSchema(BaseModel):
    notifications: List[int]

    class config:
        orm_mode = True
