from typing import Dict, List

from api.models.base_models import AppScreen, AppScreenAIResponseRating


class GetAiResponseDTO:
    def __init__(
        self, app_screen: AppScreen, ai_response: Dict | None | bool, user_ratings: List[AppScreenAIResponseRating]
    ):
        self.ai_response = ai_response
        self.verified_at = (
            app_screen.ai_response_verified_at.strftime("%d %B, %Y %H:%M")
            if app_screen.ai_response_verified_at
            else False
        )
        self.verified_by_email = (
            f"{app_screen.ai_response_verified_email}" if app_screen.ai_response_verified_email else False
        )
        self.verified_by_user = (
            f"{app_screen.ai_response_verified_name}" if app_screen.ai_response_verified_name else False
        )
        self.ratings = [UserRatingDTO(user_rating) for user_rating in user_ratings]


class UserRatingDTO:
    def __init__(self, user_rating: AppScreenAIResponseRating):
        self.rating = user_rating.response_rating
        self.by = user_rating.response_rating_by_name
