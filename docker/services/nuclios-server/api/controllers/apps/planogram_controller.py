from api.controllers.base_controller import BaseController
from api.schemas import GenericResponseSchema
from api.schemas.apps.planogram_schema import (
    GenaiActionIdentifierRequestSchema,
    GenAIRearrangeRequestSchema,
    GetPlanogramResponseSchema,
    PlanogramResponseSchema,
    SavePlanogramRequestSchema,
)
from api.services.apps.planogram_service import PlanogramService
from fastapi import Response


class PlanogramController(BaseController):
    def get_planogram(self, widget_value_id: int) -> GetPlanogramResponseSchema:
        with PlanogramService() as planogram_service:
            return planogram_service.get_planogram(widget_value_id)

    def save_planogram(self, widget_value_id: int, request_data: SavePlanogramRequestSchema) -> GenericResponseSchema:
        with PlanogramService() as planogram_service:
            return planogram_service.save_planogram(widget_value_id, request_data)

    def genai_action_identifier(self, request_data: GenaiActionIdentifierRequestSchema) -> PlanogramResponseSchema:
        with PlanogramService() as planogram_service:
            return planogram_service.genai_action_identifier(request_data)

    def genai_rearrange(self, request_data: GenAIRearrangeRequestSchema) -> PlanogramResponseSchema:
        with PlanogramService() as planogram_service:
            return planogram_service.genai_rearrange(request_data)

    def get_live_feed(self, response: Response, url: str):
        with PlanogramService() as planogram_service:
            return planogram_service.get_live_feed(response, url)
