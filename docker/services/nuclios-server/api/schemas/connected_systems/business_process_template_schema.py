from typing import Dict

from pydantic import BaseModel


class BusinessProcessTemplateSchema(BaseModel):
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


class BusinessProcessTemplateDataSchema(BaseModel):
    id: int
    driver_id: int
    name: str
    is_active: bool
    order_by: int
    process_config: Dict | None

    class config:
        orm_mode = True


class CreateBusinessProcessTemplateSchema(BaseModel):
    name: str
    is_active: bool
    order_by: int
    process_config: Dict | None

    class config:
        orm_mode = True


class UpdateBusinessProcessTemplateSchema(BaseModel):
    name: str
    driver_id: int
    is_active: bool
    order_by: int
    process_config: Dict | None

    class config:
        orm_mode = True


class CreateBusinessProcessTemplateDataSchema(BaseModel):
    id: int
    driver_id: int
    name: str
    is_active: bool
    order_by: int

    class config:
        orm_mode = True


class CreateBusinessProcessTemplateResponseSchema(BaseModel):
    status: str
    business_process_template_data: CreateBusinessProcessTemplateDataSchema

    class config:
        orm_mode = True
