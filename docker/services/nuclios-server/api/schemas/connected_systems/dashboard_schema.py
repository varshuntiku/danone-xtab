from pydantic import BaseModel


class DashboardSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    industry: str | None
    function: str | None
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class DashboardDataSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    industry: str | None
    function: str | None
    small_logo_blob_name: str | None

    class config:
        orm_mode = True


class CreateUpdateDashboardSchema(BaseModel):
    name: str
    industry: str | None
    function: str | None
    description: str | None
    is_active: bool
    small_logo_blob_name: str | None

    class config:
        orm_mode = True


class CreateDashboardDataSchema(BaseModel):
    id: int
    name: str
    industry: str | None
    function: str | None
    description: str | None
    is_active: bool

    class config:
        orm_mode = True


class CreateDashboardResponseSchema(BaseModel):
    status: str
    dashboard_data: CreateDashboardDataSchema

    class config:
        orm_mode = True
