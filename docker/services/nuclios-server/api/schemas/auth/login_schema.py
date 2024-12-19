from pydantic import BaseModel


class LoginInputSchema(BaseModel):
    username: str
    password: str

    class config:
        orm_mode = True


class LoginResponseSchema(BaseModel):
    access_token: str
    refresh_token: str
    exp: int
    is_restricted_user: bool

    class config:
        orm_mode = True


class RefreshResponseSchema(BaseModel):
    access_token: str
    refresh_token: str
    exp: int

    class config:
        orm_mode = True


class LogoutSchema(BaseModel):
    description: str
    status: str

    class config:
        orm_mode = True
