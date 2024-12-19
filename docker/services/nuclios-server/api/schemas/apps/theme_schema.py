from typing import List, Optional

from pydantic import BaseModel


class ThemeModeSchema(BaseModel):
    mode: str
    bg_variant: str
    contrast_color: str
    chart_colors: List[str]
    params: dict


class ThemeSchema(BaseModel):
    id: int
    name: str
    readOnly: bool | None
    modes: List[ThemeModeSchema]

    class config:
        orm_mode = True


class AddThemeResponseSchema(BaseModel):
    id: int


class AddThemeRequestSchema(BaseModel):
    name: str
    modes: List[ThemeModeSchema]


class GetThemeByIdResponseSchema(BaseModel):
    id: int
    name: str
    readOnly: bool | None
    modes: List[ThemeModeSchema]

    class config:
        orm_mode = True


class UpdateThemeRequestSchema(BaseModel):
    name: str
    modes: List
    unsaved: Optional[bool] = False
