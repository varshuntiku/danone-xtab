from typing import Dict, List

from pydantic import BaseModel


class DriverBusinessProcessFrontendSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int
    process_config: Dict | None

    class config:
        orm_mode = True


class DriverFrontendSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    end_user_add: bool
    order_by: int
    business_processes: List[DriverBusinessProcessFrontendSchema]

    class config:
        orm_mode = True


class DriverSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    end_user_add: bool
    order_by: int
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class DriverDataSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    end_user_add: bool
    order_by: int

    class config:
        orm_mode = True


class CreateUpdateDriverSchema(BaseModel):
    name: str
    is_active: bool
    end_user_add: bool
    order_by: int

    class config:
        orm_mode = True


class CreateDriverDataSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    end_user_add: bool
    order_by: int

    class config:
        orm_mode = True


class CreateDriverResponseSchema(BaseModel):
    status: str
    driver_data: CreateDriverDataSchema

    class config:
        orm_mode = True
