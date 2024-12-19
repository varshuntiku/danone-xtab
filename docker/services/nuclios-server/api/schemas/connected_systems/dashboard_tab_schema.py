from typing import Dict

from pydantic import BaseModel


class DashboardTabSchema(BaseModel):
    id: int
    name: str
    tab_type: str
    is_active: bool
    order_by: int
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class DashboardTabDataSchema(BaseModel):
    id: int
    name: str
    tab_type: str
    is_active: bool
    order_by: int
    kpis: Dict | None
    insights: Dict | None
    tools: Dict | None

    class config:
        orm_mode = True


class CreateUpdateDashboardTabSchema(BaseModel):
    name: str
    tab_type: str
    is_active: bool
    order_by: int
    kpis: Dict | None
    insights: Dict | None
    tools: Dict | None

    class config:
        orm_mode = True


class CreateDashboardTabDataSchema(BaseModel):
    id: int
    name: str
    tab_type: str
    is_active: bool
    order_by: int

    class config:
        orm_mode = True


class CreateDashboardTabResponseSchema(BaseModel):
    status: str
    dashboard_tab_data: CreateDashboardTabDataSchema

    class config:
        orm_mode = True
