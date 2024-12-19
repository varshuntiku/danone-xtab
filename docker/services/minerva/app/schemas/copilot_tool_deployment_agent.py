from typing import Optional

from pydantic import BaseModel


class CopilotToolDeploymentAgent(BaseModel):
    id: int
    name: str
    desc: Optional[str]
    # config: Optional[dict]
    supported_base_versions: list[int]
