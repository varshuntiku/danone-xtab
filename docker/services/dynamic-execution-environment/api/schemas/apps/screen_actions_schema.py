from typing import Dict, List

from pydantic import BaseModel


class AppScreenActionSettings(BaseModel):
    action_generator: str
    action_handler: str

    class config:
        orm_mode = True


class AppScreenActionsRequestSchema(BaseModel):
    action_settings: Dict

    class config:
        orm_mode = True


class AppScreenResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True


class AppScreenActionsCodeStringRequestSchema(BaseModel):
    code_string: str

    class config:
        orm_mode = True


class AppScreenActionsResponseSchema(BaseModel):
    status: str
    timetaken: str
    size: str
    output: Dict | bool
    logs: str
    lineno: int | None

    class config:
        orm_mode: True


class AppScreenDynamicActionsRequestSchema(BaseModel):
    filter_state: Dict

    class config:
        orm_mode = True


class AppScreenGetActionsResponseSchema(BaseModel):
    action_generator: str
    action_handler: str

    class config:
        orm_mode = True


class AppScreenActionsOutputResponseSchema(BaseModel):
    actions: List[Dict] | None

    class config:
        orm_mode = True


class AppScreenActionHandlerRequestSchema(BaseModel):
    filter_state: Dict | None
    action_param: Dict | None
    action_type: str | None

    class config:
        orm_mode = True
