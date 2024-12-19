from typing import Dict

from pydantic import BaseModel


class SAMLLoginResponseSchema(BaseModel):
    url: str

    class config:
        orm_mode = True


class SAMLGetTokenResponseSchema(BaseModel):
    access_token: str
    refresh_token: str
    user_id: str
    exp: int
    is_restricted_user: bool

    class config:
        orm_mode = True


class GetLoginConfigResponseSchema(BaseModel):
    config_name: str
    config_data: Dict
    is_enabled: bool

    class config:
        orm_mode = True
