from typing import Dict, List

from pydantic import BaseModel


class WidgetResponseSchema(BaseModel):
    id: int
    widget_index: int
    widget_key: str
    is_label: bool | None
    config: Dict

    class config:
        orm_mode = True


class SaveWidgetResponseSchema(BaseModel):
    status: str
    widgets: List[WidgetResponseSchema]

    class config:
        orm_mode = True


class SaveWidgetRequestSchema(BaseModel):
    selected_layout: Dict
    widgets: List[Dict]

    class config:
        orm_mode = True


class SaveWidgetConfigRequestSchema(BaseModel):
    config: Dict

    class config:
        orm_mode = True


class GeneralWidgetResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True


class TestWidgetVisualizationRequestSchema(BaseModel):
    filters: Dict
    code: str

    class config:
        orm_mode = True


class TestWidgetVisualizationResponseSchema(BaseModel):
    status: str
    timetaken: str
    size: str
    output: Dict | bool
    logs: str
    lineno: int | None

    class config:
        orm_mode = True


class SaveWidgetUiacRequestSchema(BaseModel):
    code: str

    class config:
        orm_mode = True


class GetArchivedUiacListResponseSchema(BaseModel):
    id: int
    widget_value: dict
    widget_id: int
    widget_title: str
    screen_id: int
    screen_title: str
    is_deleted_screen: bool
    type: str


class WidgetConfigRequestSchema(BaseModel):
    title: str
    sub_title: str
    prefix: str
    metric_factor: str
    code: str


class WidgetsRequestSchema(BaseModel):
    id: int
    widget_index: int
    widget_key: str
    is_label: bool
    config: WidgetConfigRequestSchema


class GetMultiWidgetRequestSchema(BaseModel):
    widget: WidgetsRequestSchema
    filters: Dict


class GetMultiWidgetDataResponseSchema(BaseModel):
    widget_value_id: int
    value: dict
    simulated_value: int | None


class GetMultiWidgetResponseSchema(BaseModel):
    data: GetMultiWidgetDataResponseSchema


class ConfigSchema(BaseModel):
    legend: bool
    prefix: bool
    subtitle: bool
    title: str
    traces: bool
    value_factor: bool


class GetWidgetRequestSchema(BaseModel):
    widget: dict
    filters: dict


class GetWidgetDataSchema(BaseModel):
    widget_value_id: int
    value: dict
    simulated_value: bool


class GetWidgetResponseSchema(BaseModel):
    data: GetWidgetDataSchema
