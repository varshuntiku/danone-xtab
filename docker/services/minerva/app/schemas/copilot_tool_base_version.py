from typing import Optional

from pydantic import BaseModel


class CopilotToolBaseVersion(BaseModel):
    id: int
    name: str
    desc: Optional[str]
    # config: Optional[dict]
    supported_deployment_agents: list[int]
