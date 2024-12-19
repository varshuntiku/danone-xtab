from typing import Dict, List, Optional

from pydantic import BaseModel


class ScreenOverviewDetailSchema(BaseModel):
    id: int
    screen_index: int | None
    screen_name: str | None
    screen_description: str | None
    screen_image: str | None
    level: int | None
    graph_type: str | None
    horizontal: bool | None
    rating_url: str | None
    available_packages: List[dict]

    class config:
        orm_mode = True


class ScreenSchema(BaseModel):
    hidden: Optional[bool] = False
    id: Optional[int] = None
    level: int | None
    name: str | None
    screen_index: Optional[int] = 0

    class config:
        orm_mode = True


class CreateScreenRequestSchema(BaseModel):
    screens: List[ScreenSchema]

    class config:
        orm_mode = True


class UpdateScreenOverviewRequestSchema(BaseModel):
    rating_url: str | None
    screen_auto_refresh: bool | None
    screen_description: str | None
    screen_image: str | None

    class config:
        orm_mode = True


class GetSystemWidgetDataSchema(BaseModel):
    system_widgets: list
    app_variables: list
    app_functions: list


class GetSystemWidgetResponseSchema(BaseModel):
    data: GetSystemWidgetDataSchema


class GetLayoutOptionsResponse(BaseModel):
    app_id: int
    layout_options: List[Dict]

    class config:
        orm_mode = True


class LayoutOptions(BaseModel):
    graph_height: str
    graph_type: str
    graph_width: str
    horizontal: bool | None
    no_graphs: str | int
    no_labels: str | int

    class config:
        orm_mode = True


class UpdateLayoutOptionsRequestResponse(BaseModel):
    app_id: int
    layout_options: LayoutOptions

    class config:
        orm_mode = True


class InsertLayoutOptionsRequestResponse(BaseModel):
    app_id: int

    class config:
        orm_mode = True
