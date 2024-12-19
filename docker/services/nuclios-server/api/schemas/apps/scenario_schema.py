from typing import Any, Dict

from pydantic import BaseModel


class ListScenarioRequestSchema(BaseModel):
    app_id: int
    filters: Any = None
    screen_id: int
    widget_id: int


class ListScenarioResponseSchema(BaseModel):
    id: int
    name: str
    comment: str
    app_id: int
    scenarios_json: Dict
    createdAt: str
    version: str


class SaveScenarioRequestSchema(BaseModel):
    app_id: int
    filters_json: Dict
    app_screen_id: int
    widget_id: int
    comment: str
    scenarios_json: Dict
    scenarioname: str
    version: str = "V.1"


class CheckScenarioSchema(BaseModel):
    app_id: int
    app_screen_id: int
    widget_id: int
    scenarioname: str
