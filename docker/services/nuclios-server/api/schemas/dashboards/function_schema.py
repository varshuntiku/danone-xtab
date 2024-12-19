from pydantic import BaseModel


class FunctionSchema(BaseModel):
    industry_name: str | None
    industry_id: int | None
    function_id: int
    parent_function_id: int | None
    function_name: str
    description: str | None
    logo_name: str
    order: int | None
    level: str | None
    color: str | None
    parent_function_name: str | None

    class config:
        orm_mode = True


class FunctionCreateRequestSchema(BaseModel):
    color: str | None
    description: str | None
    function_name: str
    industry_id: int
    level: str | None
    logo_name: str
    order: int | None
    parent_function_id: int | str | None

    class config:
        orm_mode = True


class FunctionDataSchema(BaseModel):
    id: int
    industry_id: int
    parent_function_id: int | None
    function_name: str
    description: str | None
    logo_name: str
    order: int | None
    level: str | None
    color: str | None

    class config:
        orm_mode = True


class FunctionCreateResponseSchema(BaseModel):
    message: str
    function_data: FunctionDataSchema

    class config:
        orm_mode = True


class FunctionDeleteResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True
