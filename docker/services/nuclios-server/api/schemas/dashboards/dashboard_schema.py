from typing import Dict, List, Optional

from pydantic import BaseModel


class DashboardTemplateSchema(BaseModel):
    id: int
    name: str

    class config:
        orm_mode = True


class DashboardSchema(BaseModel):
    id: int
    name: str
    icon: str
    order: int | None
    root: int | None
    url: str | None
    template: int | Dict | None
    code: str | None

    class config:
        orm_mode = True


class CreateUpdateDashboardSchema(BaseModel):
    name: str
    icon: str
    order: Optional[int] = None
    root: Optional[int] = None
    url: Optional[str] = None
    template: int | Dict | None

    class config:
        orm_mode = True


class CreateDashboardDataSchema(BaseModel):
    dashboard_id: int
    dashboard_name: str
    dashboard_icon: str
    dashboard_order: int | None
    root_industry_id: int | None
    dashboard_url: str | None
    dashboard_template_id: int | None

    class config:
        orm_mode = True


class CreateDashboardResponseSchema(BaseModel):
    status: str
    dashboard_data: CreateDashboardDataSchema

    class config:
        orm_mode = True


class DashboardTemplateResponseSchema(BaseModel):
    id: int
    name: str
    description: str | None

    class config:
        orm_mode = True


class DashboardHierarchyResponseSchema(BaseModel):
    result: List

    class config:
        orm_mode = True


class AppsScreensResponseSchema(BaseModel):
    applications: List
    screens: List

    class config:
        orm_mode = True


class UserAppsHierarchyResponseSchema(BaseModel):
    apps: List
    industries: List
    functions: List

    class config:
        orm_mode = True
