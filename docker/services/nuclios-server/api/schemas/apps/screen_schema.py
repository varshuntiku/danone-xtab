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
    graph_height: str | bool | None
    graph_width: str | bool | None
    comment_enabled: Optional[bool] = False
    available_packages: List[dict]

    class config:
        orm_mode = True


class GetScreenListSchema(BaseModel):
    id: int
    screen_index: int | None
    screen_name: str | None
    screen_description: str | None
    screen_image: str | None
    level: int | None
    graph_type: str | None
    horizontal: bool | None
    rating_url: str | None
    graph_width: str | None
    graph_height: str | None


class ScreenSchema(BaseModel):
    hidden: Optional[bool] = False
    id: Optional[int] = None
    level: int | None
    name: str | None
    screen_index: Optional[int] = 0

    class config:
        orm_mode = True


class GetScreensSchema(BaseModel):
    status: str
    data: List[ScreenSchema]

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


class UpdateScreenComment(BaseModel):
    state: bool

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
    graph_height: str | bool
    graph_type: str
    graph_width: str
    horizontal: bool | None
    no_graphs: str | int
    no_labels: str | int
    custom_layout: Optional[bool] = False

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


class SaveUserGuideRequestSchema(BaseModel):
    guide_name: str
    guide_type: str
    guide_url: str

    class config:
        orm_mode = True


class UpdateUserGuideRequestSchema(BaseModel):
    data: List

    class config:
        orm_mode = True


class GetUserGuideResponseSchema(BaseModel):
    data: Optional[List[SaveUserGuideRequestSchema]] = []

    class config:
        orm_mode = True


class UpdateScreenRequestSchema(BaseModel):
    screen_name: str

    class config:
        orm_mode = True


class CreateAppScreenResponseSchema(BaseModel):
    screen_id: int
    message: str
    extra_info: Optional[dict] = None

    class config:
        orm_mode = True


class CreateAppScreenRequestSchema(BaseModel):
    screen_name: str

    class config:
        orm_mode = True
