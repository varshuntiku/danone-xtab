from typing import Optional

from pydantic import BaseModel


class CopilotToolBase(BaseModel):
    name: str
    desc: Optional[str]
    config: Optional[dict]


class CopilotToolCreate(CopilotToolBase):
    created_by: int
    pass


class CopilotToolUpdate(CopilotToolBase):
    pass


class CopilotToolMetaData(CopilotToolBase):
    id: int


class CopilotToolCreatePayload(CopilotToolBase):
    pass
