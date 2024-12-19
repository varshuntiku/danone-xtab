from typing import Optional

from pydantic import BaseModel


class ComputeConfigSerializer(BaseModel):
    id: int
    name: str
    type: Optional[str]
    storage_size: Optional[int]
    vcpu: Optional[int]
    ram: Optional[int]
    iops: Optional[int]
    data_disks: Optional[int]
    estimated_cost: Optional[float]
    cloud_provider: Optional[str] = None
