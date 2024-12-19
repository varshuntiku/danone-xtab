#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import inspect
import logging
from datetime import datetime, timedelta
from enum import Enum
from functools import wraps
from typing import List

import boto3
from app.utils.config import get_settings
from azure.core.exceptions import HttpResponseError, ResourceNotFoundError
from azure.storage.blob import BlobSasPermissions, BlobServiceClient, generate_blob_sas
from fastapi import HTTPException
from mypy_boto3_s3 import S3Client

settings = get_settings()


class StorageType(Enum):
    AZURE_BLOB = "AZURE_BLOB"
    AWS_S3 = "AWS_S3"


def validate_params_wrapper(required_params: list):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                # Bind the received arguments with the defined parameters and apply any default value
                bound_args = inspect.signature(func).bind(*args, **kwargs)
                bound_args.apply_defaults()

                bound_args_dict = dict(bound_args.arguments)

                missing_params = []
                for param in required_params:
                    if param not in bound_args_dict or bound_args_dict[param] is None:
                        missing_params.append(param)

                if missing_params:
                    raise ValueError(f"Missing value for required parameters: {','.join(missing_params)}")
            except Exception as e:
                raise Exception(f"Error binding parameters: {e}")
            return func(*args, **kwargs)

        return wrapper

    return decorator


class StorageClient:
    @validate_params_wrapper(["container", "file_name"])
    def get_url(self, container: str, file_name: str) -> str:
        raise NotImplementedError

    @validate_params_wrapper(["container", "file_name"])
    def get_plain_url(self, container: str, file_name: str) -> str:
        raise NotImplementedError

    @validate_params_wrapper(["container", "file_name", "data", "overwrite"])
    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        raise NotImplementedError

    @validate_params_wrapper(["container", "file_name"])
    def delete(self, container: str, file_name: str) -> None:
        raise NotImplementedError
    
    @validate_params_wrapper(["url"])
    def download(self, url: str, *args, **kargs) -> None:
        raise NotImplementedError


class AzureBlobStorageClient(StorageClient):
    def __init__(self, blob_service_client: BlobServiceClient):
        self.blob_service_client = blob_service_client

    @validate_params_wrapper(["container", "file_name"])
    def get_url(self, container: str, file_name: str, expiry: datetime = None) -> str:
        try:
            sas = generate_blob_sas(
                account_name=self.blob_service_client.account_name,
                container_name=container,
                blob_name=file_name,
                account_key=self.blob_service_client.credential.account_key,
                permission=BlobSasPermissions(True),
                expiry=expiry or (datetime.utcnow() + timedelta(days=1)),
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
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Container or blob not found")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to make request to azure storage",
            )
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while fetch the blob sas url")

    @validate_params_wrapper(["container", "file_name"])
    def get_plain_url(self, container: str, file_name: str) -> str:
        url = (
            "https://" + self.blob_service_client.account_name + ".blob.core.windows.net/" + container + "/" + file_name
        )
        return url

    @validate_params_wrapper(["container", "file_name", "data", "overwrite"])
    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        try:
            blob_client = self.blob_service_client.get_blob_client(container=container, blob=file_name)
            blob_client.upload_blob(data, overwrite=overwrite)
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Container or blob not found")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to make request to azure storage",
            )
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while uploading blob to azure storage")

    @validate_params_wrapper(["container", "file_name"])
    def delete(self, container: str, file_name: str) -> None:
        try:
            blob_client = self.blob_service_client.get_blob_client(container=container, blob=file_name)
            blob_client.delete_blob()
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Container or blob not found")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to make request to azure storage",
            )
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while deleting blob from azure storage")

    @validate_params_wrapper(["container"])
    def list_blobs(self, container: str) -> List[str]:
        try:
            return self.blob_service_client.get_container_client(container).list_blobs()
        except ResourceNotFoundError:
            raise HTTPException(status_code=404, detail="Container or blob not found")

        except HttpResponseError:
            raise HTTPException(
                status_code=500,
                detail="Unable to make request to azure storage",
            )
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while fetching list of available blobs")
        
    @validate_params_wrapper(["url"])
    def download(
        self, url: str, start_time: int = 0, range: str = "", default_chunk_size: int = None, *args, **kargs
    ):
        blob_name = get_blob_name(StorageType[settings.STORAGE_SERVICE], url)
        container_name = get_container_name(StorageType[settings.STORAGE_SERVICE], url)
        
        blob_client = self.blob_service_client.get_blob_client(container=container_name, blob=blob_name)
        if not blob_client.exists():
            raise HTTPException(status_code=404, detail="Video not found")
        
        blob_properties = blob_client.get_blob_properties()
        video_size = blob_properties.size

        if range:
            start_byte = int(range.split("=")[1].split("-")[0])
        else:
            start_byte = start_time * 1024

        if default_chunk_size is not None:
            end_byte = min(start_byte + default_chunk_size - 1, video_size - 1)
        else:
            end_byte = video_size - 1
        
        content_length = end_byte - start_byte + 1

        stream = blob_client.download_blob(offset=start_byte, length=content_length)
        return stream, start_byte, end_byte, video_size


class AWSS3Client(StorageClient):
    def __init__(self, s3_service_client: S3Client):
        self.s3_service_client = s3_service_client
        self.presigned_url_expiry_time = 86400  # value in seconds. expiry time for 24hrs

    @validate_params_wrapper(["container", "file_name"])
    def get_url(self, container: str, file_name: str, expiry: int = None) -> str:
        try:
            url = self.s3_service_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": container, "Key": file_name},
                ExpiresIn=expiry or self.presigned_url_expiry_time,
            )
            return url
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while fetch presigned url for s3 object")

    @validate_params_wrapper(["container", "file_name"])
    def get_plain_url(self, container: str, file_name: str) -> str:
        url = "https://" + container + ".s3.amazonaws.com/" + file_name
        return url

    @validate_params_wrapper(["container", "file_name", "data", "overwrite"])
    def upload(self, container: str, file_name: str, data: bytes, overwrite: bool) -> None:
        try:
            self.s3_service_client.put_object(Bucket=container, Key=file_name, Body=data)
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while uploading object to s3 bucket")

    @validate_params_wrapper(["container", "file_name"])
    def delete(self, container: str, file_name: str) -> None:
        try:
            self.s3_service_client.delete_object(Bucket=container, Key=file_name)
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while deleting object from s3 bucket")

    @validate_params_wrapper(["container"])
    def list_bucket_objects(self, container: str) -> dict:
        try:
            return self.s3_service_client.list_objects_v2(Bucket=container)
        except Exception as e:
            logging.warning(e)
            raise HTTPException(status_code=500, detail="Error occurred while fetching list of objects from s3 bucket")


class StorageServiceClient:
    @staticmethod
    def get_storage_client(
        storage_type: StorageType, conn_str: str = None, access_key: str = None, secret_key: str = None
    ) -> StorageClient:
        match storage_type:
            case StorageType.AZURE_BLOB:
                return AzureBlobStorageClient(
                    BlobServiceClient.from_connection_string(
                        conn_str=conn_str or settings.AZURE_STORAGE_CONNECTION_STRING
                    )
                )
            case StorageType.AWS_S3:
                return AWSS3Client(
                    boto3.client(
                        "s3",
                        aws_access_key_id=access_key or settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=secret_key or settings.AWS_SECRET_ACCESS_KEY,
                    )
                )

def get_container_name(
        storage_type: StorageType, blob_url: str, conn_str: str = None, access_key: str = None, secret_key: str = None
) -> StorageClient:
    # NOTE: general s3 object url format - "https://{bucket_name}.s3.amazonaws.com/{key-name or file-name}"
    match storage_type:
        case StorageType.AZURE_BLOB:
            return blob_url.split("/")[3]
        case StorageType.AWS_S3:
            return blob_url.split("/")[2].split(".s3.")[0]
        
def get_blob_name(
        storage_type: StorageType, blob_url: str, conn_str: str = None, access_key: str = None, secret_key: str = None
) -> StorageClient:
    match storage_type:
        case StorageType.AZURE_BLOB:
            return "/".join(blob_url.split("/")[4:])
        case StorageType.AWS_S3:
            return "/".join(blob_url.split("/")[3:])