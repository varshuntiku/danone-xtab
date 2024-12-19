from pydantic import BaseModel


class ModelTypeCreatePayload(BaseModel):
    type: str


class ModelTypeResponse(ModelTypeCreatePayload):
    id: int
    is_active: bool
