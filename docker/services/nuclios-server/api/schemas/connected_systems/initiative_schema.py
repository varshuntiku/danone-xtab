from typing import Dict

from pydantic import BaseModel


class InitiativeSchema(BaseModel):
    id: int
    goal: str
    name: str
    is_active: bool
    order_by: int
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class InitiativeDataSchema(BaseModel):
    id: int
    goal_id: int
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class CreateInitiativeSchema(BaseModel):
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class UpdateInitiativeSchema(BaseModel):
    name: str
    goal_id: int
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class CreateInitiativeDataSchema(BaseModel):
    id: int
    goal_id: int
    name: str
    is_active: bool
    order_by: int

    class config:
        orm_mode = True


class CreateInitiativeResponseSchema(BaseModel):
    status: str
    initiative_data: CreateInitiativeDataSchema

    class config:
        orm_mode = True
