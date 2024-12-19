from typing import Dict, List

from pydantic import BaseModel


class RatingSchema(BaseModel):
    rating: int
    by: str

    class config:
        orm_mode = True


class GetAiResponseRatingsSchema(BaseModel):
    ratings: List[RatingSchema]

    class config:
        orm_mode = True


class GetAiResponseSchema(BaseModel):
    ai_response: Dict | None | bool
    verified_at: str | bool
    verified_by_user: str | bool
    verified_by_email: str | bool
    ratings: List[RatingSchema]

    class config:
        orm_mode = True


class SaveAiInsightRequestSchema(BaseModel):
    config: Dict
    response_text: str
    username: str

    class config:
        orm_mode = True


class RateAiInsightRequestSchema(BaseModel):
    rating: int
    username: str

    class config:
        orm_mode = True


class GenerateAiInsightRequestSchema(BaseModel):
    prompt: str
    model_name: str | None = None
    max_tokens: int | float
    temperature: int | float
    frequency_penalty: int | float
    presence_penalty: int | float
    top_p: int | float
    best_of: int | float

    class config:
        orm_mode = True
