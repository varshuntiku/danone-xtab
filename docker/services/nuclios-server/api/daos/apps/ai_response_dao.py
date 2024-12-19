import logging
from typing import List

from api.constants.apps.ai_response_errors import AiResponseErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import AppScreenAIResponseRating
from api.schemas.apps.ai_response_schema import RateAiInsightRequestSchema
from fastapi import status
from sqlalchemy import and_, func
from sqlalchemy.orm import Session


class AiResponseDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_ai_response(self, app_id: int, screen_id: int) -> List[AppScreenAIResponseRating]:
        """
        Get ai response for given app id and screen id.

        Args:
            app_id: int,
            screen_id: int

        Returns:
            List of AppScreenAIResponseRating
        """
        try:
            return (
                self.db_session.query(AppScreenAIResponseRating)
                .filter_by(app_id=app_id, screen_id=screen_id, deleted_at=None)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AiResponseErrors.ERROR_GETTING_AI_RESPONSE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_ai_response_by_email(self, app_id: int, screen_id: int, user_email: str) -> AppScreenAIResponseRating:
        """
        Get ai response for given app id, screen id and email.

        Args:
            app_id: int,
            screen_id: int,
            user_email: str

        Returns:
            AppScreenAIResponseRating
        """
        try:
            return (
                self.db_session.query(AppScreenAIResponseRating)
                .filter_by(app_id=app_id, screen_id=screen_id, response_rating_by_email=user_email, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AiResponseErrors.ERROR_GETTING_AI_RESPONSE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete_ai_response_rating(self, app_id: int, screen_id: int, user_id: int) -> None:
        """
        Delete AI response ratings

        Args:
            app_id: int,
            screen_id: int

        Returns:
            None
        """
        try:
            self.db_session.query(AppScreenAIResponseRating).filter(
                and_(
                    AppScreenAIResponseRating.app_id == app_id,
                    AppScreenAIResponseRating.screen_id == screen_id,
                    AppScreenAIResponseRating.deleted_at.is_(None),
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AiResponseErrors.ERROR_DELETING_AI_RESPONSE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_ai_response_rating(self, ai_response_rating: AppScreenAIResponseRating, rating: int) -> None:
        """
        Update AI response ratings

        Args:
            ai_response_rating: existing rating details,
            rating: new rating

        Returns:
            None
        """
        try:
            ai_response_rating.response_rating = rating
            self.db_session.commit()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AiResponseErrors.ERROR_UPDATING_AI_RESPONSE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_ai_response_rating(
        self, app_id: int, screen_id: int, request_data: RateAiInsightRequestSchema, user_email: str
    ) -> None:
        """
        Update AI response ratings

        Args:
            request_data: new details,
            user_email: rating user email

        Returns:
            None
        """
        try:
            new_user_rating = AppScreenAIResponseRating(
                app_id=app_id,
                screen_id=screen_id,
                response_rating=request_data.rating,
                response_rating_by_email=user_email,
                response_rating_by_name=request_data.username,
            )
            self.db_session.add(new_user_rating)
            self.db_session.commit()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AiResponseErrors.ERROR_CREATING_AI_RESPONSE.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
