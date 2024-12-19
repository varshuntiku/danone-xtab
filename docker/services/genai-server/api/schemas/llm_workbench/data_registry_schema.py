from typing import Optional

from pydantic import BaseModel

# class DataRegistrySchema(BaseModel):
#     file_name: Optional[str] = None
#     file_type: Optional[bool] = None
#     file_location: Optional[int] = None
#     access_token: Optional[int] = None


class DatasetSchema(BaseModel):
    source_type: str
    # source_details: DataRegistrySchema | None = None
    file_name: Optional[str] = None
    file_type: Optional[str] = None
    file_location: Optional[str] = None
    access_token: Optional[str] = None


class DataRegistrySchema(BaseModel):
    file_name: str
    file_type: str
    access_token: Optional[str] = None
    source_id: Optional[int] = None
    is_active: bool = False
    dataset_name: str
    file_path: str
    dataset_folder: str

    class config:
        orm_mode = True
