from typing import List

from pydantic import BaseModel


class AddAppVariableRequestSchema(BaseModel):
    value: str


class GetAppVariableKeyResponseSchema(BaseModel):
    keys: List[str]


class AddAppVariableResponseSchema(BaseModel):
    status: str


class UpdateAppVariableResponseSchema(BaseModel):
    message: str


class GetAppVariableValueResponseSchema(BaseModel):
    key: str
    value: str
