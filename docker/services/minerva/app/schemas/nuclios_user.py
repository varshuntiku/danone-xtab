from typing import Optional

from pydantic import BaseModel


class UserBaseModel(BaseModel):
    email_address: str
    first_name: Optional[str]
    last_name: Optional[str]


class UserCreate(UserBaseModel):
    pass


class UserMetaData(UserBaseModel):
    id: int
