from typing import Optional

from pydantic import BaseModel


class ComputeConfigCreateSchema(BaseModel):
    sku: str
    type: str
    storage_size: int
    vcpu: int
    ram: int
    iops: int
    data_disks: int
    estimated_cost: Optional[float] = 1.0
    cloud_provider_id: int

    class config:
        orm_mode = True
