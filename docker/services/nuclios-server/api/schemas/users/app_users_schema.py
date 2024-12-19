from typing import Dict, List, Optional

from pydantic import BaseModel


class AppUserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email_address: str
    is_admin: bool
    user_roles: List[Dict]
    responsibilities: List | bool

    class config:
        orm_mode = True


class AppUserRoleSchema(BaseModel):
    id: int
    name: str
    permissions: List[str] | bool

    class config:
        orm_mode = True


class CreateUpdateAppUserRoleRequestSchema(BaseModel):
    name: str
    app_id: int
    permissions: List[str]

    class config:
        orm_mode = True


class CreateUpdateDeleteAppUserRoleResponseSchema(BaseModel):
    id: int
    name: str

    class config:
        orm_mode = True


class CreateUpdateAppUserRequestSchema(BaseModel):
    app_id: int
    email_address: str
    first_name: str
    last_name: str
    user_roles: Optional[List[int]] = None
    responsibilities: Optional[List] = None

    class config:
        orm_mode = True


class DeleteAppUserResponseSchema(BaseModel):
    id: int

    class config:
        orm_mode = True


class UpdateAppUserResponseSchema(BaseModel):
    deleted_responsibilities: List[str] | None

    class config:
        orm_mode = True


class MessageResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True
