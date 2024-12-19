from typing import List, Optional

from api.serializers.base_serializers import PaginatedSerializer
from pydantic import BaseModel

# class DataRegistrySerializer(BaseModel):
#     file_name: Optional[str] = None
#     file_type: Optional[bool] = None
#     file_location: Optional[int] = None
#     access_token: Optional[int] = None


class DatasetSerializer(BaseModel):
    id: int
    source_type: str
    # source_details: DataRegistrySerializer | None = None
    dataset_name: Optional[str] = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_path: Optional[str] = None
    dataset_folder: Optional[str] = None
    access_token: Optional[str] = None
    created_at: str | None


class PaginatedDatasetSerializer(PaginatedSerializer):
    items: List[DatasetSerializer]
