from typing import Any, Dict, List

from pydantic import BaseModel


class ScreenFiltersResponseSchema(BaseModel):
    code: str | bool

    class config:
        orm_mode = True


class SaveScreenFiltersRequestSchema(BaseModel):
    code_string: str
    screen_filters_open: bool

    class config:
        orm_mode = True


class TestScreenFiltersRequestSchema(BaseModel):
    code_string: str
    screen_filters_open: bool

    class config:
        orm_mode = True


class PreviewScreenFiltersRequestSchema(BaseModel):
    code_string: str | bool

    class config:
        orm_mode = True


class TestScreenFiltersResponseSchema(BaseModel):
    status: str
    timetaken: str
    size: str
    output: Any
    logs: str
    lineno: str | int | None

    class config:
        orm_mode = True


class GetArchivedFilterUIACListResponseSchema(BaseModel):
    id: int
    filter_value: dict
    screen_title: str
    is_deleted_screen: bool
    type: str


class FiltersResponseSchema(BaseModel):
    values: List
    topics: Dict

    class config:
        orm_mode = True
