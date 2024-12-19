from pydantic import BaseModel


class GetAppFunctionsListResponseSchema(BaseModel):
    key: str
    desc: str


class AddAppFunctionRequestSchema(BaseModel):
    value: str
    test: str
    desc: str


class AddAppFunctionResponseSchema(BaseModel):
    status: str


class UpdateAppFunctionResponseSchema(BaseModel):
    message: str


class GetAppFunctionResponseSchema(BaseModel):
    key: str
    value: str
    test: str
    desc: str


class TestAppFunctionRequestSchema(BaseModel):
    value: str
    test: str


class TestAppFunctionResponseSchema(BaseModel):
    status: str
    timetaken: str
    size: str
    output: str
    logs: str
    lineno: int | None
