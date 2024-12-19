from pydantic import BaseModel


class GenericResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True


class GenericDataResponseSchema(BaseModel):
    data: str

    class config:
        orm_mode = True


class CommentStateResponseSchema(BaseModel):
    state: bool
    status: str

    class config:
        orm_mode = True
