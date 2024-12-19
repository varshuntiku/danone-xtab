from typing import Dict, Optional

from pydantic import BaseModel


class FileUploadResponseSchema(BaseModel):
    path: str
    filename: str

    class config:
        orm_mode = True


class FileDeleteRequestSchema(BaseModel):
    file: str

    class config:
        orm_mode = True


class FileDeleteResponseSchema(BaseModel):
    message: str
    filename: str

    class config:
        orm_mode = True


class MessageResponseSchema(BaseModel):
    message: str
    extra_info: Optional[dict] = None

    class config:
        orm_mode = True


class DataDeleteResponseSchema(BaseModel):
    deleted_rows: int

    class config:
        orm_mode = True


class SuccessResponseSchema(BaseModel):
    success: str


class IsExistsResponseSchema(BaseModel):
    isexists: bool

    class config:
        orm_mode = True


class StatusResponseSchema(BaseModel):
    status: bool

    class config:
        orm_mode = True


class MessageStatusResponseSchema(BaseModel):
    message: str
    status: int

    class config:
        orm_mode = True


class StatusDataResponseSchema(BaseModel):
    status: str
    data: Dict


class DataResponseSchema(BaseModel):
    data: Dict | str | int
