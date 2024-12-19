import logging
from abc import ABC, abstractmethod
from typing import IO, Optional


class BaseUploadHandler(ABC):
    @abstractmethod
    async def handle(
        self,
        client,
        resource_name: Optional[str] = None,
        resource_path: Optional[str] = None,
        local_file_path: Optional[str] = None,
        file_stream: Optional[IO] = None,
        data: Optional[bytes] = None,
    ):
        pass


class LocalFileUploadHandler(BaseUploadHandler):
    async def handle(
        self,
        client,
        resource_name: Optional[str] = None,
        resource_path: Optional[str] = None,
        local_file_path: Optional[str] = None,
        file_stream: Optional[IO] = None,
        data: Optional[bytes] = None,
    ):
        if local_file_path:
            try:
                with open(local_file_path, "rb") as source_file:
                    await UploadService.upload(client, source_file, resource_name, resource_path)
                return True
            except Exception as e:
                logging.error(f"Error uploading local file: {e}")
        return False


class StreamUploadHandler(BaseUploadHandler):
    async def handle(
        self,
        client,
        resource_name: Optional[str] = None,
        resource_path: Optional[str] = None,
        local_file_path: Optional[str] = None,
        file_stream: Optional[IO] = None,
        data: Optional[bytes] = None,
    ):
        if file_stream:
            try:
                await UploadService.upload(client, file_stream, resource_name, resource_path)
                return True
            except Exception as e:
                logging.error(f"Error uploading file stream: {e}")
        return False


class DataUploadHandler(BaseUploadHandler):
    async def handle(
        self,
        client,
        resource_name: Optional[str] = None,
        resource_path: Optional[str] = None,
        local_file_path: Optional[str] = None,
        file_stream: Optional[IO] = None,
        data: Optional[bytes] = None,
    ):
        if data:
            try:
                await UploadService.upload(client, data, resource_name, resource_path)
                return True
            except Exception as e:
                logging.error(f"Error uploading raw data: {e}")
        return False


class UploadService:
    @staticmethod
    async def upload(client, source, resource_name: Optional[str], resource_path: Optional[str]):
        """
        Upload the source to the specified resource path using the appropriate client method.
        """
        try:
            if hasattr(client, "upload_fileobj"):  # AWS S3
                if isinstance(source, IO):
                    client.upload_fileobj(source, resource_name, resource_path)
                else:
                    client.put_object(Bucket=resource_name, Key=resource_path, Body=source)
            elif hasattr(client, "upload_blob"):  # Azure Blob
                client.upload_blob(source)
            elif hasattr(client, "upload_file"):  # Azure File Share
                client.upload_file(source)
            else:
                raise ValueError("Unsupported client type or upload method.")
        except Exception as e:
            logging.error(f"Error during upload: {e}")
            raise
