from typing import Dict

from api.controllers.base_controller import BaseController
from api.models.base_models import User
from api.schemas import GenericResponseSchema
from api.schemas.apps.ai_response_schema import (
    GenerateAiInsightRequestSchema,
    GetAiResponseRatingsSchema,
    GetAiResponseSchema,
    RateAiInsightRequestSchema,
    SaveAiInsightRequestSchema,
)
from api.services.apps.ai_response_service import AiResponseService


class AiResponseController(BaseController):
    def get_ai_response(self, app_id: int, screen_id: int, user: User) -> GetAiResponseSchema:
        with AiResponseService() as ai_response_service:
            response = ai_response_service.get_ai_response(app_id, screen_id, user)
            return response

    def get_ai_response_ratings(self, app_id: int, screen_id: int) -> GetAiResponseRatingsSchema:
        with AiResponseService() as ai_response_service:
            response = ai_response_service.get_ai_response_ratings(app_id, screen_id)
            return response

    def save_ai_response(
        self,
        app_id: int,
        screen_id: int,
        request_data: SaveAiInsightRequestSchema,
        user: User,
    ) -> GenericResponseSchema:
        with AiResponseService() as ai_response_service:
            response = ai_response_service.save_ai_response(app_id, screen_id, request_data, user)
            return response

    def rate_ai_response(
        self,
        app_id: int,
        screen_id: int,
        request_data: RateAiInsightRequestSchema,
        user: User,
    ) -> GenericResponseSchema:
        with AiResponseService() as ai_response_service:
            response = ai_response_service.rate_ai_response(app_id, screen_id, request_data, user)
            return response

    def generate_ai_insight(
        self,
        request_data: GenerateAiInsightRequestSchema,
        token: str = None,
    ) -> Dict:
        with AiResponseService() as ai_response_service:
            response = ai_response_service.generate_ai_insight(request_data, token)
            return response
