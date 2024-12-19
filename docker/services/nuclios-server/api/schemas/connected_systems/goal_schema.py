from typing import Dict, List

from pydantic import BaseModel


class GoalInitiativeFrontendSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class GoalFrontendSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None
    initiatives: List[GoalInitiativeFrontendSchema]

    class config:
        orm_mode = True


class GoalSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int
    created_at: str | None
    created_by_user: str | None
    updated_at: str | None

    class config:
        orm_mode = True


class GoalDataSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class CreateUpdateGoalSchema(BaseModel):
    name: str
    is_active: bool
    order_by: int
    objectives: Dict | None

    class config:
        orm_mode = True


class CreateGoalDataSchema(BaseModel):
    id: int
    name: str
    is_active: bool
    order_by: int

    class config:
        orm_mode = True


class CreateGoalResponseSchema(BaseModel):
    status: str
    goal_data: CreateGoalDataSchema

    class config:
        orm_mode = True
