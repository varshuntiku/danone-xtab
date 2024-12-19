from typing import Optional

from pydantic import BaseModel


class CopilotToolRegistryBase(BaseModel):
    name: str
    desc: Optional[str]
    config: Optional[dict]
    is_test: Optional[bool] = False


class CopilotToolRegistryCreate(CopilotToolRegistryBase):
    created_by: int
    pass


class CopilotToolRegistryUpdate(CopilotToolRegistryBase):
    name: Optional[str]


class CopilotToolRegistryMetaData(CopilotToolRegistryBase):
    id: int


class CopilotToolRegistryCreatePayload(CopilotToolRegistryBase):
    pass
