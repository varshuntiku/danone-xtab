from typing import Dict, List

from pydantic import BaseModel


class ObjectiveSchema(BaseModel):
    objective_id: int
    objective_name: str
    next_recommended_objective: int

    class config:
        orm_mode = True


class ObjectiveGroupSchema(BaseModel):
    description: str
    group_name: str
    objectives_list: List[ObjectiveSchema]

    class config:
        orm_mode = True


class ObjectStepsWidgetValueSchema(BaseModel):
    title: str
    sub_title: str
    widget_value: Dict

    class config:
        orm_mode = True


class ObjectiveStepSchema(BaseModel):
    title: str
    description: str
    graph_type: str
    horizontal: bool | None
    order: int
    app_screen_id: int | None
    graph_widgets: List[ObjectStepsWidgetValueSchema]

    class config:
        orm_mode = True
