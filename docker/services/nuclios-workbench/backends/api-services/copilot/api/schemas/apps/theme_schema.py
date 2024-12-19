from typing import List

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
    modes: List[ThemeModeSchema]

    class config:
        orm_mode = True


class AddThemeResponseSchema(BaseModel):
    id: int


class AddThemeRequestSchema(BaseModel):
    name: str
    modes: List[ThemeModeSchema]
