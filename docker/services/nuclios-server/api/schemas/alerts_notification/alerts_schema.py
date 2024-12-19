from typing import Dict, List

from pydantic import BaseModel


class AlertsUserSchema(BaseModel):
    id: int
    email: str
    name: str

    class config:
        orm_mode = True


class GetAlertsListResponseSchema(BaseModel):
    id: int
    title: str
    category: str
    condition: str
    threshold: int | None
    app_id: int
    app_screen_id: int
    app_screen_widget_id: int
    receive_notification: bool
    alert_source_type: str | None
    alert_widget_type: str | None
    users: List[AlertsUserSchema]

    class config:
        orm_mode = True


class GetAlertsListByWidgeResponseSchema(BaseModel):
    id: int
    title: str
    category: str
    condition: str
    threshold: int | None
    app_id: int
    app_screen_id: int
    app_screen_widget_id: int
    receive_notification: bool
    active: bool
    users: List[AlertsUserSchema]

    class config:
        orm_mode = True


class UpdateAlertRequestSchema(BaseModel):
    title: str | None
    category: str | None
    condition: str | None
    threshold: int | None
    receive_notification: bool | None
    active: bool
    widget_value: Dict | bool | None
    users: List | None

    class config:
        orm_mode = True


class UpdateAlertRecieveNotificationRequestSchema(BaseModel):
    receive_notification: bool | None

    class config:
        orm_mode = True


class CreateAlertRequestSchema(BaseModel):
    title: str | None
    message: str | None
    app_id: int | str | None
    app_screen_id: int | str | None
    app_screen_widget_id: int | str | None
    filter_data: str | None
    category: str | None
    condition: str | None
    threshold: int | None
    receive_notification: bool | None
    alert_source_type: str | bool | None
    alert_widget_type: str | bool | None
    widget_url: str | None
    users: List | None
    widget_value: Dict | bool | None

    class config:
        orm_mode = True
