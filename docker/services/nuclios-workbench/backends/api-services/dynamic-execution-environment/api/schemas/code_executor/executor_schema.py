from typing import Optional

from api.utils.constants import defaultCodeString
from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    def get(self, key, default=None):
        return getattr(self, key, default)


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
    config: Optional[dict]


class PreviewArtifactsRequestSchema(BaseSchema):
    artifact_type: str
    artifact_name: str


class InputJSONSchema(BaseSchema):
    executor_endpoint: Optional[str] = None
    code_string: Optional[str | bool] = None
    code: Optional[str | bool] = None
    function_name: Optional[str] = None
    action_type: Optional[str] = None
    action_param: Optional[dict | bool | str] = None
    function_value: Optional[str] = None
    app_id: Optional[int] = None
    widget_id: Optional[int] = None
    screen_id: Optional[int] = None
    widget: Optional[WidgetsRequestSchema] = None
    filters: Optional[dict | bool] = None
    formData: Optional[dict] = None
    data: Optional[dict | bool] = None
    selected: Optional[dict] = None
    filter_state: Optional[dict | bool] = None
    current_filter: Optional[str | bool] = None
    data_state_key: Optional[str | dict | bool] = None
    crossfilter_event: Optional[str | dict | bool] = None
    widget_event: Optional[str | dict | bool] = None

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "executor_endpoint": "https://uiac-executor.mathco.com/execute",
                "code_string": defaultCodeString,
                "app_id": 0,
                "widget_id": 0,
            }
        },
    )
