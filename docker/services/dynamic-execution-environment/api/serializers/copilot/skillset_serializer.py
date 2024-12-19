from typing import List, Optional

from api.serializers.base_serializers import PaginatedSerializer
from pydantic import BaseModel


class ExecutionEnvironmentpackageSerializer(BaseModel):
    name: str
    version: Optional[str] = ""


class ExecutionEnvironmentPackagesListSerializer(BaseModel):
    packages: List[ExecutionEnvironmentpackageSerializer]
    message: str = ""

    class config:
        orm_mode = True


class InfraTypeSerializer(BaseModel):
    id: int
    name: str


class SkillsetCreateSerializer(BaseModel):
    status: str = ""
    message: str = ""

    class config:
        orm_mode = True


class AppEnvMapSerializer(BaseModel):
    app_id: int
    env_id: int

    class config:
        orm_mode = True


class PaginatedExecutionEnvironmentSerializer(PaginatedSerializer):
    items: List[SkillsetCreateSerializer]
