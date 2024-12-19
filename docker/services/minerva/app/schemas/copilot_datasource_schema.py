#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import List, Optional, Union

from pydantic import BaseModel, root_validator


class PostgresSQLDatasourceConfig(BaseModel):
    database_type: str
    context_db_connection_uri: str
    context_db_connection_schema: str


class AzureBlobFileStorageConfig(BaseModel):
    file_storage_type: str
    blob_connection_string: str
    blob_container_ids: list
    blob_containers: list[dict]


class AmazonS3FileStorageConfig(BaseModel):
    file_storage_type: str
    aws_access_key_id: str
    aws_secret_access_key: str
    aws_bucket_ids: list


class MicrosoftSharepointFileStorageConfig(BaseModel):
    sharepoint_site_url: str
    sharepoint_client_id: str
    sharepoint_client_secret: str
    sharepoint_folder_path: str


class CopilotDatasourceBase(BaseModel):
    name: str
    type: str
    copilot_app_id: int
    config: Union[
        PostgresSQLDatasourceConfig,
        dict,
        AzureBlobFileStorageConfig,
        AmazonS3FileStorageConfig,
        MicrosoftSharepointFileStorageConfig,
    ]


class CopilotDatasourceCreate(CopilotDatasourceBase):
    created_by: Optional[int] = None


class CopilotDatasourceUpdate(CopilotDatasourceBase):
    name: Optional[str] = None
    type: Optional[str] = None
    copilot_app_id: Optional[int] = None
    config: Union[PostgresSQLDatasourceConfig, dict] = None

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError("one of name, type, copilot_app_id and config must have a value")
        return v


class CopilotDatasourceDBBase(CopilotDatasourceBase):
    id: int
    config: Union[PostgresSQLDatasourceConfig, dict]

    class Config:
        orm_mode = True


class CopilotDatasourceMetadata(CopilotDatasourceBase):
    id: int
    name: str | None
    type: str | None
    config: Union[
        PostgresSQLDatasourceConfig,
        dict,
        None,
        AzureBlobFileStorageConfig,
        AmazonS3FileStorageConfig,
        MicrosoftSharepointFileStorageConfig,
    ]
    copilot_app_id: int | None


class CopilotDatasourceExtended(CopilotDatasourceBase):
    id: int
    name: Optional[str]
    type: Optional[str]
    config: Union[
        PostgresSQLDatasourceConfig,
        dict,
        AzureBlobFileStorageConfig,
        AmazonS3FileStorageConfig,
        MicrosoftSharepointFileStorageConfig,
    ]
    copilot_app_id: Optional[int]
    datasource_documents: Optional[List[dict]]


class CopilotAzureBlobFileStorageInputConfig(BaseModel):
    file_storage_type: str
    blob_connection_string: str
    # blob_containers: list[dict]


class AzureBlobContainers(BaseModel):
    blob_containers: list[dict]


class CopilotAmazonS3FileStorageInputConfig(BaseModel):
    file_storage_type: str
    aws_access_key_id: str
    aws_secret_access_key: str
    # bucket_names: list[dict]


class AmazonS3Buckets(BaseModel):
    bucket_names: list[dict]


class CopilotMicrosoftSharepointFileStorageConfig(BaseModel):
    file_storage_type: str
    sharepoint_site_url: str
    sharepoint_client_id: str
    sharepoint_client_secret: str


class CopilotAzureBlobFileStoragePayload(BaseModel):
    file_storage_type: str
    blob_connection_string: str


class CopilotAmazonS3FileStoragePayload(BaseModel):
    file_storage_type: str
    aws_access_key_id: str
    aws_secret_access_key: str


class CopilotDatasourceValidationConfig(BaseModel):
    config: Union[
        CopilotAzureBlobFileStorageInputConfig,
        CopilotAmazonS3FileStorageInputConfig,
        CopilotMicrosoftSharepointFileStorageConfig,
    ]


class CopilotDatasourceValidationPayload(BaseModel):
    config: Union[
        CopilotAzureBlobFileStoragePayload,
        CopilotAmazonS3FileStoragePayload,
        CopilotMicrosoftSharepointFileStorageConfig,
    ]
