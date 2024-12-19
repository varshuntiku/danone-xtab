import json
import logging
from typing import Dict

from api.constants.apps.screen_error_messages import ScreenErrors
from api.daos.apps.ai_response_dao import AiResponseDao
from api.daos.apps.screen_dao import ScreenDao
from api.dtos import GenericResponseDTO
from api.dtos.apps.ai_response_dto import GetAiResponseDTO, UserRatingDTO
from api.helpers.apps.ai_response_helper import AiResponseHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User
from api.schemas.apps.ai_response_schema import (
    GenerateAiInsightRequestSchema,
    GetAiResponseRatingsSchema,
    RateAiInsightRequestSchema,
)
from api.services.base_service import BaseService
from fastapi import status


class AiResponseService(BaseService):
    def __init__(self):
        super().__init__()
        self.screen_dao = ScreenDao(self.db_session)
        self.ai_response_dao = AiResponseDao(self.db_session)
        self.ai_response_helper = AiResponseHelper()

    def get_ai_response(self, app_id: int, screen_id: int, user: User) -> GetAiResponseDTO:
        app_screen = self.screen_dao.get_app_screen(app_id=app_id, screen_id=screen_id)

        if not app_screen:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        avg_user_rating = 0
        total_users = 0

        user_ratings = self.ai_response_dao.get_ai_response(app_id=app_id, screen_id=screen_id)

        for user_rating in user_ratings:
            if user_rating.response_rating_by_email == user.email_address:
                # current_user_rating = user_rating.response_rating
                pass

            avg_user_rating += user_rating.response_rating
            total_users += 1

        if total_users == 0:
            avg_user_rating = False
        else:
            avg_user_rating = avg_user_rating / total_users

        ai_response = app_screen.ai_response

        if ai_response:
            try:
                ai_response = json.loads(ai_response)
            except Exception as e:
                logging.exception(e)
                ai_response = {"response": ai_response, "config": False}
        return GetAiResponseDTO(app_screen=app_screen, ai_response=ai_response, user_ratings=user_ratings)

    def get_ai_response_ratings(self, app_id: int, screen_id: int) -> GetAiResponseRatingsSchema:
        user_ratings = self.ai_response_dao.get_ai_response(app_id=app_id, screen_id=screen_id)

        return {"ratings": [UserRatingDTO(user_rating) for user_rating in user_ratings]}

    def save_ai_response(self, app_id: int, screen_id: int, request_data, user: User) -> GenericResponseDTO:
        app_screen = self.screen_dao.get_app_screen(app_id=app_id, screen_id=screen_id)

        if not app_screen:
            raise GeneralException(
                message={"error": ScreenErrors.APP_SCREEN_NOT_FOUND.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        self.screen_dao.update_screen_ai_response(
            app_screen=app_screen, request_data=request_data, user_email=user.email_address
        )

        self.ai_response_dao.delete_ai_response_rating(app_id=app_id, screen_id=screen_id, user_id=user.id)
        self.db_session.commit()
        return GenericResponseDTO("success")

    def rate_ai_response(
        self, app_id: int, screen_id: int, request_data: RateAiInsightRequestSchema, user: User
    ) -> GenericResponseDTO:
        current_user_rating = self.ai_response_dao.get_ai_response_by_email(
            app_id=app_id, screen_id=screen_id, user_email=user.email_address
        )

        if current_user_rating:
            self.ai_response_dao.update_ai_response_rating(
                ai_response_rating=current_user_rating, rating=request_data.rating
            )
        else:
            self.ai_response_dao.create_ai_response_rating(
                app_id=app_id, screen_id=screen_id, request_data=request_data, user_email=user.email_address
            )

        return GenericResponseDTO("success")

    def fetch_llm_endpoint(self, model_name, token):
        return self.ai_response_helper.fetch_model_endpoint(model_name, token)

    def generate_ai_insight(self, request_data: GenerateAiInsightRequestSchema, token: str) -> Dict:
        openai_payload = {
            "prompt": request_data.prompt,
            "max_tokens": request_data.max_tokens,
            "temperature": request_data.temperature,
            "frequency_penalty": request_data.frequency_penalty,
            "presence_penalty": request_data.presence_penalty,
            "top_p": request_data.top_p,
            "best_of": request_data.best_of,
            "stop": None,
        }

        model_endpoint = ""
        message = ""
        if request_data.model_name and request_data.model_name != "Azure OpenAI":
            model_endpoint, deployed_model_name, message = self.fetch_llm_endpoint(request_data.model_name, token)
            openai_payload["model"] = deployed_model_name

        try:
            openai_response = self.ai_response_helper.get_openai_insights(
                payload=openai_payload, model_endpoint=model_endpoint
            )
        except Exception as e:
            logging.exception(e)
            if model_endpoint:
                model_endpoint = None
                openai_response = self.ai_response_helper.get_openai_insights(payload=openai_payload)
                message = "Defaulting to Azure Openai. Model is not responding."
            else:
                raise e

        if model_endpoint:
            try:
                if hasattr(openai_response, "model_dump"):
                    return {
                        **openai_response.model_dump(),
                        "message": message,
                    }
                return {
                    **openai_response,
                    "message": message,
                }
            except Exception:
                return {
                    **openai_response,
                    "message": message,
                }

        return {
            **openai_response.model_dump(),
            "message": message,
        }
