from typing import Any, Dict, List, Optional

from pydantic import BaseModel, RootModel


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
    filters: Optional[Dict] = None
    code: Optional[str] = ""

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
    filter_code: str

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


class WidgetsRequestSchema(BaseModel):
    id: int
    widget_index: int
    widget_key: str
    is_label: bool
    config: Dict


class GetMultiWidgetRequestSchema(BaseModel):
    widget: WidgetsRequestSchema
    filters: Dict | bool
    data_state_key: Optional[str] = None
    widget_event: Optional[Any] = None
    prev_screen_data: Optional[Any] = None


class GetMultiWidgetDataResponseSchema(BaseModel):
    widget_value_id: Optional[int] = None
    value: Any = None
    simulated_value: Any = None
    filter_value: Any = None


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
    widget: Dict
    filters: Dict | bool
    data_state_key: Optional[str] = None
    widget_event: Optional[Any] = None


class GetWidgetDataSchema(BaseModel):
    widget_value_id: int | None
    value: Any = None
    simulated_value: Any = None


class GetWidgetResponseSchema(BaseModel):
    data: GetWidgetDataSchema


class GetWidgetUiacResponseSchema(BaseModel):
    code: str
    filter_code: str

    class config:
        orm_mode = True


class UpdateWidgetConnSysIdentifierObjectSchema(BaseModel):
    id: int
    dashboard_id: int
    problem_definition_id: int
    business_process_id: int


class UpdateWidgetConnSystemIdentifierRequestSchema(RootModel[Dict[str, UpdateWidgetConnSysIdentifierObjectSchema]]):
    pass
