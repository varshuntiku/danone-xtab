from typing import Dict, List

from pydantic import BaseModel


class GetPlanogramDataSchema(BaseModel):
    planogram: Dict
    skus: List


class GetPlanogramResponseSchema(BaseModel):
    data: Dict
    status: str


class SavePlanogramRequestSchema(BaseModel):
    approve: bool
    planogram: Dict
    publish: bool
    skus: List
    user_name: str
    widget_value_id: int


class GenaiActionIdentifierRequestSchema(BaseModel):
    action_command: str
    planogram: Dict
    skus: List
    user_name: str
    widget_value_id: int


class GenAIRearrangeRequestSchema(BaseModel):
    analytics_file: List
    planogram: Dict
    rearrangement_rules: str
    sku_affinities: str
    skus: List
    user_name: str
    widget_value_id: int


class PlanogramResponseSchema(BaseModel):
    planogram: Dict
