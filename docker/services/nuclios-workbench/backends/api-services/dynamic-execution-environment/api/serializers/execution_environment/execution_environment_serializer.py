from typing import List, Optional

from api.serializers.base_serializers import PaginatedSerializer
from api.serializers.common_serializer import (
    CloudProviderSerializer,
    ComputeConfigSerializer,
)
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


class ExecutionEnvironmentSerializer(BaseModel):
    id: int
    name: str
    cloud_provider: Optional[CloudProviderSerializer] = None
    infra_type: Optional[InfraTypeSerializer] = None
    compute: Optional[ComputeConfigSerializer] = None
    endpoint: Optional[str] = None
    env_type: Optional[str] = None
    run_time: Optional[str] = None
    run_time_version: Optional[str] = None
    packages: Optional[List[ExecutionEnvironmentpackageSerializer]]
    index_url: Optional[str] = None
    status: Optional[str] = None
    created_by: str | None
    created_at: str | None
    env_category: Optional[str] = None
    compute_type: Optional[str] = None
    approval_status: Optional[str] = None

    class config:
        orm_mode = True


class AppEnvMapSerializer(BaseModel):
    app_id: int
    env_id: int

    class config:
        orm_mode = True


class PaginatedExecutionEnvironmentSerializer(PaginatedSerializer):
    items: List[ExecutionEnvironmentSerializer]
