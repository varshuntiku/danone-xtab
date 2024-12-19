from pydantic import BaseModel


class TableauSignInRequestSchema(BaseModel):
    pat_token_name: str
    pat_token_secret: str
    content_url: str | None
