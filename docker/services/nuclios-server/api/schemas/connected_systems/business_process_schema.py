from typing import Dict

from pydantic import BaseModel


class BusinessProcessSchema(BaseModel):
    id: int
    driver: str
    name: str
    is_active: bool
    order_by: int
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class BusinessProcessDataSchema(BaseModel):
    id: int
    driver_id: int
    name: str
    is_active: bool
    order_by: int
    process_config: Dict | None
    intelligence_config: Dict | None
    foundation_config: Dict | None

    class config:
        orm_mode = True


class CreateBusinessProcessSchema(BaseModel):
    name: str
    is_active: bool
    order_by: int
    process_config: Dict | None
    intelligence_config: Dict | None
    foundation_config: Dict | None

    class config:
        orm_mode = True


class CreateBusinessProcessFromTemplateSchema(BaseModel):
    name: str
    is_active: bool
    order_by: int
    template_id: int

    class config:
        orm_mode = True


class UpdateBusinessProcessSchema(BaseModel):
    name: str
    driver_id: int
    is_active: bool
    order_by: int
    process_config: Dict | None
    intelligence_config: Dict | None
    foundation_config: Dict | None

    class config:
        orm_mode = True


class CreateBusinessProcessDataSchema(BaseModel):
    id: int
    driver_id: int
    name: str
    is_active: bool
    order_by: int

    class config:
        orm_mode = True


class CreateBusinessProcessResponseSchema(BaseModel):
    status: str
    business_process_data: CreateBusinessProcessDataSchema

    class config:
        orm_mode = True
