from typing import Dict

from api.controllers.apps.ai_response_controller import AiResponseController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas import GenericResponseSchema
from api.schemas.apps.ai_response_schema import (
    GenerateAiInsightRequestSchema,
    GetAiResponseRatingsSchema,
    GetAiResponseSchema,
    RateAiInsightRequestSchema,
    SaveAiInsightRequestSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)

ai_response_controller = AiResponseController()


@router.get(
    "/app/{app_id}/screens/{screen_id}/ai-response", status_code=status.HTTP_200_OK, response_model=GetAiResponseSchema
)
@authenticate_user
async def get_ai_response(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Gets the verified and stored AI response given an app_id and screen_id
    """
    user = request.state.user
    return ai_response_controller.get_ai_response(app_id, screen_id, user)


@router.get(
    "/app/{app_id}/screens/{screen_id}/get-ai-response-ratings",
    status_code=status.HTTP_200_OK,
    response_model=GetAiResponseRatingsSchema,
)
@authenticate_user
async def get_ai_response_ratings(
    request: Request,
    app_id: int,
    screen_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Gets the AI response ratings given an app_id and screen_id
    """
    return ai_response_controller.get_ai_response_ratings(app_id, screen_id)


@router.post(
    "/app/{app_id}/screens/{screen_id}/save-ai-response",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def save_ai_response(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: SaveAiInsightRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Saves the verified AI response given an app_id and screen_id

    Example Request Parameters: \n
        {
            "response_text": "This is the response text",
            "config": {
                "prompt": "Extract summary, key insights and recommended actions from the charts, insights and metrics provided.",
                "max_tokens": "512",
                "temperature": "0.3",
                "presence_penalty": "1",
                "frequency_penalty": "1",
                "best_of": "1",
                "top_p": "1",
                "persona": "",
                "context": "",
                "instructions": "Answer the question without hallucinations, using deterministic language in a helpful way."
            },
            "username": "User Name"
        }
    """
    user = request.state.user
    return ai_response_controller.save_ai_response(app_id, screen_id, request_data, user)


@router.post(
    "/app/{app_id}/screens/{screen_id}/rate-ai-response",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def rate_ai_response(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: RateAiInsightRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Saves the AI response rating given an app_id and screen_id

    Example Request Parameters: \n
    {
        "rating": 4,
        "username": "User Name"
    }
    """
    user = request.state.user
    return ai_response_controller.rate_ai_response(app_id, screen_id, request_data, user)


@router.post(
    "/app/{app_id}/screens/{screen_id}/generate-ai-insight",
    status_code=status.HTTP_200_OK,
    response_model=Dict,
)
@authenticate_user
async def generate_ai_insight(
    request: Request,
    app_id: int,
    screen_id: int,
    request_data: GenerateAiInsightRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Generates ai overview and insights using openAI for the given app_id and screen_id

    Example Request Parameters: \n

    """
    return ai_response_controller.generate_ai_insight(request_data, token.credentials)
