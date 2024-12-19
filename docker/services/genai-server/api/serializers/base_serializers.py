from typing import List

from pydantic import BaseModel


class BaseResponseSerializer(BaseModel):
    message: str
    status_code: int

    class config:
        orm_mode = True


class PaginatedItemsSerializer(BaseModel):
    pass


class PaginatedSerializer(BaseModel):
    items: List[PaginatedItemsSerializer]  # Replace items with relevant schema
    pages: int | None
    page: int | None
    total: int | None
    size: int | None

    class config:
        orm_mode = True
