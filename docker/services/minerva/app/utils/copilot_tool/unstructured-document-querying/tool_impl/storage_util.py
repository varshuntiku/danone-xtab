#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#


from datetime import datetime, timedelta
from enum import Enum
from typing import List

from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas


class StorageType(Enum):
    AZURE_BLOB = "AZURE_BLOB"
    AWS_S3 = "AWS_S3"


class StorageClient:
    def get_url(self, container: str, file_name: str) -> str:
        raise NotImplementedError

    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        raise NotImplementedError

    def delete(self, container: str, file_name: str) -> None:
        raise NotImplementedError


class AzureBlobStorageClinet(StorageClient):
    def __init__(self, blob_service_client: BlobServiceClient):
        self.blob_service_client = blob_service_client

    def get_url(self, container: str, file_name: str, expiry: datetime = None) -> str:
        sas = generate_blob_sas(
            account_name=self.blob_service_client.account_name,
            container_name=container,
            blob_name=file_name,
            account_key=self.blob_service_client.credential.account_key,
            permission=BlobSasPermissions(True),
            expiry=expiry or (datetime.utcnow() + timedelta(days=7)),
            start=datetime.utcnow(),
        )
        url = (
            "https://"
            + self.blob_service_client.account_name
            + ".blob.core.windows.net/"
            + container
            + "/"
            + file_name
            + "?"
            + sas
        )
        return url

    def get_private_url(self, container: str, blob_name: str) -> str:
        return f"private:https://{self.blob_service_client.account_name}.blob.core.windows.net/{container}/{blob_name}"

    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        blob_client = self.blob_service_client.get_blob_client(container=container, blob=file_name)
        blob_client.upload_blob(data, overwrite=overwrite)

    def delete(self, container: str, file_name: str) -> None:
        blob_client = self.blob_service_client.get_blob_client(container=container, blob=file_name)
        blob_client.delete_blob()

    def list_blobs(self, container: str) -> List[str]:
        return self.blob_service_client.get_container_client(container).list_blobs()


class AWSS3Clinet(StorageClient):
    def get_url(self, container: str, file_name: str) -> str:
        raise NotImplementedError

    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        raise NotImplementedError

    def delete(self, container: str, file_name: str) -> None:
        raise NotImplementedError


class StorageServiceClient:
    @staticmethod
    def get_storage_client(storage_type: StorageType, conn_str: str = None) -> StorageClient:
        match storage_type:
            case StorageType.AZURE_BLOB:
                return AzureBlobStorageClinet(BlobServiceClient.from_connection_string(conn_str=conn_str))
            case StorageType.AWS_S3:
                return AWSS3Clinet()
