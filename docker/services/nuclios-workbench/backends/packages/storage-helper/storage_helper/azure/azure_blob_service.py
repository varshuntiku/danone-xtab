import asyncio
import csv
import io
import json
import logging
import mimetypes
import os
import re
import zipfile
from datetime import datetime, timedelta, timezone
from io import BytesIO
from typing import Dict, List, Optional

from azure.core.exceptions import AzureError
from azure.identity import DefaultAzureCredential
from azure.storage.blob import (
    BlobSasPermissions,
    BlobServiceClient,
    ContainerClient,
    generate_blob_sas,
)
from storage_helper.storage_handlers import (
    DataUploadHandler,
    LocalFileUploadHandler,
    StreamUploadHandler,
)
from storage_helper.storage_helper_class import FileManagerInterface, MetadataInterface


class AzureBlobService(FileManagerInterface, MetadataInterface):
    def __init__(
        self,
        account_name: Optional[str] = None,
        account_key: Optional[str] = None,
        connection_string: Optional[str] = None,
        credential: Optional[DefaultAzureCredential] = None,
    ):
        if connection_string:
            self.conn_str = connection_string
            self.blob_service_client = BlobServiceClient.from_connection_string(self.conn_str)
        elif account_name and account_key:
            self.conn_str = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"
            self.blob_service_client = BlobServiceClient.from_connection_string(self.conn_str)
        elif os.getenv("AZURE_STORAGE_ACCOUNT_NAME") and os.getenv("AZURE_STORAGE_ACCOUNT_KEY"):
            account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
            account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
            self.conn_str = (
                f"DefaultEndpointsProtocol=https;AccountName={account_name};"
                f"AccountKey={account_key};EndpointSuffix=core.windows.net"
            )
            self.blob_service_client = BlobServiceClient.from_connection_string(self.conn_str)
        else:
            if not credential:
                credential = DefaultAzureCredential()
            if not account_name:
                raise ValueError("Account name must be provided when using DefaultAzureCredential.")
            self.account_name = account_name
            account_url = f"https://{account_name}.file.core.windows.net"
            self.blob_service_client = BlobServiceClient(
                account_url=account_url, credential=credential, token_intent="storage"
            )
        self.upload_handlers = [LocalFileUploadHandler(), StreamUploadHandler(), DataUploadHandler()]
        self.status = "failed"
        self.message = "Failed to perform given action."
        self.data = None
        self.node_counter = 0

    def get_response(self):
        return {"data": self.data, "status": self.status, "message": self.message}

    def reset_response(self):
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."

    def download_file_from_specific_path(self, resource_name: str, resource_path: str, local_file_path: str) -> dict:
        """
        Downloads a file from a specified Azure Blob Storage path to a local file system.

        This method retrieves a blob from the specified container and writes its contents
        to a local file. It uses the Azure Blob Storage SDK to handle the download operation.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage.
            resource_path (str): The path to the blob within the specified container.
            local_file_path (str): The local file system path where the blob will be saved.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            with open(local_file_path, "wb") as file_handle:
                download_stream = blob_client.download_blob()
                file_handle.write(download_stream.readall())
            self.status = "success"
            self.message = "Download successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error downloading blob: {e}")
            return self.get_response()

    async def upload_file_to_specific_path(self, resource_name, resource_path, local_file_path=None, file_stream=None):
        """
        Uploads a file to a specified path in Azure Blob Storage.

        This method uploads a file from the local file system or a file stream
        to the specified blob within the given container in Azure Blob Storage. It can handle
        both local file uploads and stream uploads. If a local file path is provided,
        it reads the file and uploads it. If a file stream is provided, it uploads directly from the stream.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage.
            resource_path (str): The path in the blob storage where the file will be uploaded.
            local_file_path (str, optional): The local file system path of the file to upload. Defaults to None.
            file_stream (io.IOBase, optional): An input file-like object (stream) to upload. Defaults to None.
        """
        blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
        if file_stream:
            await self._ensure_directory_structure(resource_name, resource_path)
        for handler in self.upload_handlers:
            if await handler.handle(blob_client, local_file_path=local_file_path, file_stream=file_stream):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    async def _ensure_directory_structure(self, resource_name: str, resource_path: str):
        """
        Ensures that the specified directory structure exists in the given Azure Blob Storage container.

        This method checks if any blobs exist under the specified resource path in the
        specified container. If no blobs are found, it creates a directory by uploading a zero-byte blob
        with the specified resource path as its key.

        Parameters:
            resource_name (str): The name of the Azure Blob Storage container where the directory structure
                                should be ensured.
            resource_path (str): The path of the directory to check or create within the container.
        """
        container_client = self.blob_service_client.get_container_client(resource_name)
        blobs = container_client.list_blobs(name_starts_with=resource_path)

        blob_exists = any(blobs)
        if not blob_exists:
            container_client.upload_blob(f"{resource_path}/", overwrite=True)

    async def upload_multipart_file_to_specific_path(self, resource_name, resource_path, file):
        """
        Uploads a multipart file to a specified path in Azure Blob Storage.

        This method uploads a file directly to Azure Blob Storage,
        supporting multipart uploads. It is designed to handle file uploads from
        multipart form submissions or file streams.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage.
            resource_path (str): The path in the blob storage where the file will be uploaded.
            file (io.IOBase): An input file-like object (stream) representing the file to be uploaded.
        """
        blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
        for handler in self.upload_handlers:
            if await handler.handle(blob_client, file_stream=file):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def upload_file_as_data_to_specific_path(self, resource_name, resource_path, data):
        """
        Uploads raw data to a specified path in Azure Blob Storage.

        This method allows uploading of raw data directly to Azure Blob Storage.
        The data can be in various formats such as strings, bytes, or byte streams.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage.
            resource_path (str): The path in the blob storage where the data will be uploaded.
            data (Union[str, bytes, bytearray]): The data to be uploaded. It can be a string, bytes,
                                                or a bytearray representing the content to be stored.
        """
        blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
        for handler in self.upload_handlers:
            if handler.handle(blob_client, data=data):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()

        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def delete_file_from_specific_directory(self, resource_name, resource_path):
        """
        Deletes a specified file from Azure Blob Storage.

        This method allows the deletion of a file (blob) from a specified container in Azure Blob Storage.
        If the specified blob does not exist, it will raise an error.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage from which the file will be deleted.
            resource_path (str): The name of the blob (file) to be deleted.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            container_client.delete_blob(resource_path)
            self.status = "success"
            self.message = "File deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting file from Azure Blob Storage: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_sub_directory_from_specific_directory(self, resource_name, resource_path):
        """
        Deletes a specified subdirectory (and all its contents) from Azure Blob Storage.

        This method removes all blobs (files) within a specified subdirectory identified by a prefix
        in the given container. The prefix acts as the directory path, and all blobs that start with this
        prefix will be deleted.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage where the subdirectory exists.
            resource_path (str): The prefix identifying the subdirectory to be deleted. All blobs that start
                        with this prefix will be removed.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            blobs = container_client.list_blobs(name_starts_with=resource_path)
            for blob in blobs:
                container_client.delete_blob(blob.name)

            self.status = "success"
            self.message = "Subdirectory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting subdirectory from Azure Blob Storage: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_directory_from_share(self, resource_name, resource_path):
        """
        Deletes a specified directory (and all its contents) from an Azure Blob Storage container.

        This method removes all blobs (files) within a specified directory identified by a path
        in the given container. The path acts as the directory structure, and all blobs that start with this
        path will be deleted.

        Args:
            resource_name (str): The name of the container in Azure Blob Storage where the directory exists.
            resource_path (str): The path of the directory to be deleted. All blobs that start with this
                                path will be removed.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            blobs = container_client.list_blobs(name_starts_with=resource_path)
            for blob in blobs:
                container_client.delete_blob(blob.name)

            self.status = "success"
            self.message = "Directory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting directory from Azure Blob Storage: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _copy_file(
        self,
        source_resource_name: ContainerClient,
        destination_resource_name: ContainerClient,
        source_path: str,
        destination_path: str,
    ):
        """
        copies a blob file from one Azure Blob Storage container to another.

        This method initiates the copy operation by ensuring that the destination directory structure
        exists before copying the specified blob from the source container to the destination container.

        Args:
            source_resource_name (ContainerClient): The source container client from which the blob will be copied.
            destination_resource_name (ContainerClient): The destination container client to which the blob will be copied.
            source_path (str): The path of the blob in the source container to be copied.
            destination_path (str): The path where the blob will be copied in the destination container.
        """
        await self._ensure_directory_structure(destination_resource_name.container_name, destination_path)
        source_blob_client = source_resource_name.get_blob_client(source_path)
        destination_blob_client = destination_resource_name.get_blob_client(destination_path)
        destination_blob_client.start_copy_from_url(source_blob_client.url)

    async def _copy_files_and_subdirectories(
        self,
        source_resource_name: str,
        destination_resource_name: str,
        source_directory_path: str,
        destination_directory_path: str,
    ):
        """
        copies all blobs and subdirectories from a source Azure Blob Storage container
        to a destination container, maintaining the directory structure.

        This method lists all blobs within the specified source directory path, then copies each
        blob to the destination directory path by adjusting the blob's name to reflect the new location.

        Args:
            source_resource_name (str): The name of the source container from which blobs will be copied.
            destination_resource_name (str): The name of the destination container to which blobs will be copied.
            source_directory_path (str): The path of the source directory containing blobs to be copied.
            destination_directory_path (str): The path of the destination directory where blobs will be stored.
        """
        try:
            source_container_client = self.blob_service_client.get_container_client(source_resource_name)
            destination_container_client = self.blob_service_client.get_container_client(destination_resource_name)
            blobs = source_container_client.list_blobs(name_starts_with=source_directory_path)

            for blob in blobs:
                source_blob_client = source_container_client.get_blob_client(blob.name)
                dest_blob_name = blob.name.replace(source_directory_path, destination_directory_path, 1)
                dest_blob_client = destination_container_client.get_blob_client(dest_blob_name)

                dest_blob_client.start_copy_from_url(source_blob_client.url)

            self.status = "success"
            self.message = "All blobs copied successfully."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    async def delete_directory_tree_from_share(self, resource_name: str, directory_path: str):
        """
        deletes a directory tree from an Azure Blob Storage container, including all blobs
        that are prefixed with the specified directory path.

        This method retrieves all blobs that start with the given directory path and deletes each blob
        from the specified container. If the specified directory path is empty, all blobs in the container
        will be deleted.

        Args:
            resource_name (str): The name of the Azure Blob Storage container from which the directory tree will be deleted.
            directory_path (str): The path of the directory to delete. This includes all blobs
                                that have this path as a prefix.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            blobs_to_delete = []
            async for blob in container_client.list_blobs(name_starts_with=directory_path):
                blobs_to_delete.append(blob.name)

            for blob_name in blobs_to_delete:
                await container_client.delete_blob(blob_name)

            self.data = None
            self.status = "success"
            self.message = "Directory or blob deletion successful."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    def create_directory(self, resource_name, directory_name):
        """
        Creates a virtual directory in an Azure Blob Storage container.

        This method uploads an empty blob with the name of the specified directory,
        effectively creating a virtual directory in the container. In Azure Blob Storage,
        directories are represented by prefixes in blob names, and an empty blob serves
        as a marker for the directory.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the directory will be created.
            directory_name (str): The name of the virtual directory to create. It must not include a leading slash.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            container_client.upload_blob(name=f"{directory_name}/", data=b"", overwrite=True)

            self.status = "success"
            self.message = "Virtual directory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating virtual directory: {e}")
            return self.get_response()

    def create_sub_directory(self, resource_name, directory_path, sub_directory_name):
        """
        Creates a virtual subdirectory within a specified directory in an Azure Blob Storage container.

        This method uploads an empty blob with the name of the specified subdirectory, effectively
        creating a virtual subdirectory within the given directory path. In Azure Blob Storage,
        directories are represented by prefixes in blob names, and an empty blob serves as a marker
        for the subdirectory.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the subdirectory will be created.
            directory_path (str): The path of the parent directory where the subdirectory will be created.
            sub_directory_name (str): The name of the virtual subdirectory to create. It must not include a leading slash.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            container_client.upload_blob(name=f"{directory_path}/{sub_directory_name}/", data=b"", overwrite=True)

            self.status = "success"
            self.message = "Virtual subdirectory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating virtual subdirectory: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def create_share(self, resource_name, public_access: str = None):
        """
        Creates a new container in Azure Blob Storage.

        This method creates a new container with the specified name in the Azure Blob Storage account.
        If specified, it also sets the public access level for the container.

        Parameters:
            resource_name (str): The name of the container to be created.
            public_access (str, optional): The public access level for the container.
                                        Can be 'Blob', 'Container', or None for no public access.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)
            container_client.create_container()
            if public_access:
                container_client.set_container_access_policy(public_access=public_access)
            self.status = "success"
            self.message = "Container creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating container: {e}")
            return self.get_response()

    def delete_share(self, resource_name):
        """
        Deletes a specified container in Azure Blob Storage.

        This method removes the container identified by the specified resource name from the Azure Blob Storage account.

        Parameters:
            resource_name (str): The name of the container to be deleted.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            container_client.delete_container()
            self.status = "success"
            self.message = "Container deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting container from Azure Blob Storage: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _delete_files_and_subdirectories(self, resource_name: str, directory_path: str):
        """
        Deletes all files and subdirectories within a specified directory in an Azure Blob Storage container.

        This method retrieves all blobs (files and directories) that start with the specified
        directory path and deletes them from the given container. It performs a list operation to find the
        blobs to delete, ensuring that the specified directory and its contents are removed.

        Parameters:
            resource_name (str): The name of the Azure Blob Storage container from which to delete the blobs.
            directory_path (str): The path of the directory in the container whose contents should be deleted.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)
            blobs_to_delete = []
            async for blob in container_client.list_blobs(name_starts_with=directory_path):
                blobs_to_delete.append(blob.name)

            for blob_name in blobs_to_delete:
                await container_client.delete_blob(blob_name)

        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

    async def import_directory_or_file(
        self, source_resource_name: str, destination_resource_name: str, source_path: str, destination_path: str
    ):
        """
        Imports a directory or file from one Azure Blob Storage container to another.

        This method checks if the specified source file or directory exists in the source container.
        If it exists, it copies the file or directory to the destination container, preserving the directory structure.

        Parameters:
            source_resource_name (str): The name of the source container where the file or directory resides.
            destination_resource_name (str): The name of the destination container where the file or directory will be copied.
            source_path (str): The path to the source file or directory in the source container.
            destination_path (str): The path where the file or directory will be copied in the destination container.
        """
        try:
            source_container_client = self.blob_service_client.get_container_client(source_resource_name)
            destination_container_client = self.blob_service_client.get_container_client(destination_resource_name)

            if await source_container_client.get_blob_client(source_path).exists():
                blob_properties = await source_container_client.get_blob_client(source_path).get_blob_properties()

                if blob_properties.is_directory:
                    await self._ensure_directory_structure(destination_resource_name, destination_path)
                    await self._copy_files_and_subdirectories(
                        source_container_client, destination_container_client, source_path, destination_path
                    )
                else:
                    await self._copy_file(
                        source_container_client, destination_container_client, source_path, destination_path
                    )
            else:
                raise FileNotFoundError("Source file or directory does not exist.")

            self.status = "success"
            self.message = "Copy operation successful."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    def get_file_properties(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the properties of a specified blob (file) in an Azure Blob Storage container.

        This method uses the Azure Blob Service Client to fetch the properties of a blob, which
        may include metadata such as content type, size, last modified time, and other attributes.

        Args:
            resource_name (str): The name of the Azure Blob Storage container containing the blob.
            resource_path (str): The path of the blob whose properties are to be retrieved.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            properties = blob_client.get_blob_properties()
            self.data = properties
            self.status = "success"
            self.message = "Data retrieved successfully."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error retrieving blob properties: {e}")
            return self.get_response()

    async def generate_sas_token(self, resource_name: str, resource_path: str) -> str:
        """
        Generates a Shared Access Signature (SAS) token for a specified blob in an Azure Blob Storage container.

        The SAS token allows for secure delegated access to the blob, enabling clients to access it
        without needing to share the account key. The generated token is valid for a specified duration
        and grants read permission to the blob.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the blob resides.
            resource_path (str): The name of the blob for which the SAS token is to be generated.

        Returns:
            str: A URL containing the SAS token for the specified blob. The token is valid for 2 hours
                from the time of generation. If an error occurs during the process, returns None.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)

            start_time = datetime.now(timezone.utc)
            expiry_time = start_time + timedelta(hours=2)
            account_name_match = re.search(r"AccountName=([^;]+)", self.conn_str)
            account_key_match = re.search(r"AccountKey=([^;]+)", self.conn_str)

            if account_name_match and account_key_match:
                account_name = account_name_match.group(1)
                account_key = account_key_match.group(1)
            else:
                raise ValueError("Account name or account key not found in the connection string.")

            sas_token = generate_blob_sas(
                account_name=account_name,
                container_name=resource_name,
                blob_name=resource_path,
                account_key=account_key,
                permission=BlobSasPermissions(read=True),
                expiry=expiry_time,
                start=start_time,
                protocol="https",
            )

            self.status = "success"
            self.message = "SAS token generated successfully."
            return f"{blob_client.url}?{sas_token}"

        except Exception as e:
            logging.debug(f"Failed to generate SAS token for blob: {e}")
            self.message = str(e)
            return None

    def get_available_directories_in_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the available directories and files in a specified path within an Azure Blob Storage container.

        This method lists all blobs that start with the given resource path and categorizes them into
        directories and files. The directories are determined by examining the blob names and extracting
        the relevant path parts.

        Args:
            resource_name (str): The name of the Azure Blob Storage container to search within.
            resource_path (str): The path within the container to search for directories and files.

        Returns:
            dict: A dictionary containing:
                - 'directories': A list of available subdirectory names found in the specified path.
                - 'files': A list of file names found in the specified path.
                The response also includes a status and message indicating the success or failure of the operation.
        """
        try:
            container_client = self.blob_service_client.get_container_client(container=resource_name)
            blob_list = container_client.list_blobs(name_starts_with=resource_path)

            directories = set()
            files = []

            for blob in blob_list:
                path_parts = blob.name[len(resource_path) :].split("/")
                if len(path_parts) > 1:
                    directories.add(path_parts[0])
                else:
                    files.append(blob.name)

            self.data = {"directories": list(directories), "files": files}
            self.status = "success"
            self.message = "Data retrieved successfully."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error listing blobs: {e}")
            return self.get_response()

    def get_file_data_from_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves and parses the contents of a blob stored at a specific path in an Azure Blob Storage container.

        This method downloads the blob data from the specified container and path, decodes the contents,
        and attempts to parse each line as JSON. The parsed data is then stored in the `self.data` attribute.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the blob is located.
            resource_path (str): The path to the blob within the container.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            download_stream = blob_client.download_blob()
            file_contents = download_stream.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = [json.loads(line) for line in lines]
            self.status = "success"
            self.message = "Blob data retrieved successfully."
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error retrieving blob data: {e}")
            return self.get_response()
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            return self.get_response()

    def get_text_file_data_from_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the contents of a text file stored as a blob in an Azure Blob Storage container.

        This method downloads the blob data from the specified container and path, decodes the contents
        as UTF-8, and splits the contents into lines. The lines are stored in the `self.data` attribute.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the blob is located.
            resource_path (str): The path to the blob within the container.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            download_stream = blob_client.download_blob()
            file_contents = download_stream.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = lines
            self.status = "success"
            self.message = "Text blob data retrieved successfully."
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error retrieving text blob data: {e}")
            return self.get_response()
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            return self.get_response()

    def get_raw_file_data_from_specific_path(self, resource_name, resource_path):
        """
        Retrieves the raw contents of a file stored as a blob in Azure Blob Storage.

        This method downloads the blob data from the specified container and path without any processing,
        allowing access to the raw binary data of the file. The raw contents are stored in the `self.data`
        attribute.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the blob is located.
            resource_path (str): The path to the blob within the container.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            downloaded_file = blob_client.download_blob()
            file_contents = downloaded_file.readall()
            self.data = file_contents
            self.status = "success"
            self.message = "Read successful."
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            logging.error("Error decoding JSON.")
            return self.get_response()

    def get_csv_file_data_from_specific_path(self, resource_name, resource_path, fields=None, labels={}):
        """
        Retrieves and processes the contents of a CSV file stored as a blob in Azure Blob Storage.

        This method downloads the CSV blob data from the specified container and path, decodes it,
        and parses it into a list of dictionaries. Each dictionary represents a row in the CSV, with
        keys corresponding to the CSV headers. Optionally, the method allows renaming of fields using
        provided labels.

        Args:
            resource_name (str): The name of the Azure Blob Storage container where the CSV blob is located.
            resource_path (str): The path to the CSV blob within the container.
            fields (list, optional): A list of fields to include in the result. If specified, only these fields
                                    will be returned. Defaults to None, which includes all fields.
            labels (dict, optional): A dictionary mapping original field names to new labels. If specified,
                                    the keys in the result will be replaced with their corresponding labels.
                                    Defaults to an empty dictionary.
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(container=resource_name, blob=resource_path)
            download_stream = blob_client.download_blob()
            file_contents = download_stream.readall()
            csv_data = file_contents.decode("utf-8")
            csv_reader = csv.DictReader(io.StringIO(csv_data))
            data = []
            for row in csv_reader:
                if fields is not None:
                    _row = {}
                    for field in fields:
                        label = labels.get(field, field)
                        _row[label] = row[field]
                    data.append(_row)
                else:
                    data.append(row)
            self.status = "success"
            self.message = "CSV data read successfully."
            self.data = data
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error reading CSV blob contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            logging.error("Error decoding JSON.")
            return self.get_response()

    async def get_directory_tree(
        self, resource_name: str, resource_path: str = "", parent_node_id: int = None
    ) -> List[Dict]:
        """
        Recursively retrieves the directory tree structure from a specified path in Azure Blob Storage.

        This method constructs a hierarchical representation of the directory and file
        structure within a given container. Each node in the tree includes metadata such as the name,
        a unique identifier, an icon, and parent-child relationships.

        Args:
            resource_name (str): The name of the Azure Blob Storage container from which to retrieve the directory tree.
            resource_path (str, optional): The path within the container from which to start retrieving the
                                            directory structure. Defaults to an empty string, which signifies
                                            the root of the container.
            parent_node_id (int, optional): The identifier of the parent node in the tree structure.
                                            This is used to establish parent-child relationships among nodes.
                                            Defaults to None for root nodes.

        Returns:
            List[Dict]: A list of dictionaries representing the directory tree. Each dictionary contains:
                - 'name' (str): The name of the file or directory.
                - 'selected' (bool): A flag indicating whether the node is selected.
                - 'nodeId' (int): A unique identifier for the node.
                - 'icon' (str): The icon associated with the node, typically based on its type (file or directory).
                - 'parentNodeId' (int, optional): The identifier of the parent node, or None for root nodes.
                - 'child' (List[Dict], optional): A list of child nodes if the node represents a directory;
                                                otherwise, None.
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            blobs = container_client.list_blobs(name_starts_with=resource_path)
            tree = []
            async for blob in blobs:
                self.node_counter += 1
                node_id = self.node_counter
                node = {
                    "name": blob.name.split("/")[-1],
                    "selected": False,
                    "nodeId": node_id,
                    "icon": await self.get_file_icon(blob.name),
                    "parentNodeId": parent_node_id,
                    "child": None,
                }
                if blob.name.endswith("/"):
                    subtree = await self.get_directory_tree(resource_name, blob.name, parent_node_id=node_id)
                    node["child"] = subtree["data"]
                tree.append(node)
            self.data = tree
            self.status = "success"
            self.message = "Directory tree retrieval successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            self.status = "failure"
            self.message = str(e)
            return self.get_response()

    async def get_file_icon(self, file_name: str) -> str:
        """
        Determines the appropriate icon representation for a given file based on its MIME type.

        This method uses the `mimetypes` module to guess the MIME type of the
        provided file name. It returns a string representing the icon category corresponding
        to the file type. If the MIME type cannot be determined, a default icon type is returned.

        Args:
            file_name (str): The name of the file for which the icon representation is to be determined.

        Returns:
            str: A string representing the icon type for the file.
                The returned value will be in the format '<subtype>_file' for known MIME types,
                or 'file' for unknown types.

        Example:
            - If the file name is 'document.pdf', the method might return 'pdf_file'.
            - If the file name is 'image.jpg', the method might return 'jpeg_file'.
            - If the file name is 'unknownfile.xyz', the method will return 'file'.
        """
        mime_type, _ = mimetypes.guess_type(file_name)

        if mime_type:
            mime_main_type, mime_subtype = mime_type.split("/")
            return f"{mime_subtype}_file"
        else:
            return "file"

    async def get_directory_last_modified(self, resource_name: str, directory_path: str):
        """
        Retrieves the last modified timestamp and total size of all blobs within a specified directory.

        This method scans through all blobs that begin with the provided directory path
        in the specified container. It calculates the total size of the blobs and determines the most
        recent last modified timestamp among them.

        Args:
            resource_name (str): The name of the container where the directory resides.
            directory_path (str): The path of the directory for which the last modified timestamp and total size are to be calculated.

        Returns:
            tuple or None: A tuple containing:
                - last_modified (str): The ISO formatted last modified timestamp of the most recently modified blob.
                - total_size (int): The total size of all blobs in bytes.

            If no blobs are found, or an error occurs, returns None.

        Example:
            last_modified, total_size = await get_directory_last_modified("my-container", "my/directory/")
            print(f"Last modified: {last_modified}, Total size: {total_size} bytes")
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)
            total_size = 0
            last_modified = None

            async for blob in container_client.list_blobs(name_starts_with=directory_path):
                total_size += blob.size
                if not last_modified or blob.last_modified > last_modified:
                    last_modified = blob.last_modified

            if isinstance(last_modified, datetime):
                last_modified_str = last_modified.isoformat()
                return last_modified_str, total_size

            return None
        except Exception as e:
            logging.debug(f"Failed to retrieve last modified timestamp: {e}")
            return None

    def get_share_directory_path(self, resource_name: str, project_id: int) -> str:
        """
        Retrieves the directory path for a specified project ID within a given container.

        This method checks if a directory corresponding to the provided project ID exists in the
        specified Azure Blob Storage container. If the directory exists, it returns the directory
        path; otherwise, it raises a ValueError.

        Args:
            resource_name (str): The name of the Azure Blob Storage container to search in.
            project_id (int): The ID of the project for which the directory path is being retrieved.

        Returns:
            str: The directory path corresponding to the specified project ID if it exists.

        Example:
            directory_path = get_share_directory_path("my-container", 12345)
            print(f"Directory path: {directory_path}")
        """
        try:
            container_client = self.blob_service_client.get_container_client(resource_name)

            prefix = f"{project_id}/"
            blobs = list(container_client.list_blobs(name_starts_with=prefix))

            if blobs:
                return prefix
            else:
                raise ValueError(f"Directory with project ID {project_id} does not exist in container {resource_name}")

        except Exception as e:
            logging.debug(f"Failed to get blob directory path for project {project_id}: {e}")
            return None

    async def zip_directory_in_fileshare(self, resource_name: str, source_dir: str, temp_zip_path: str):
        """
        Zips a directory from Azure Blob Storage and uploads the zipped file back to the specified container.

        This method retrieves all blobs (files and directories) from the specified source directory
        within an Azure Blob Storage container, compresses them into a ZIP archive, and uploads the resulting
        ZIP file to the same or a different container.

        Parameters:
            resource_name (str): The name of the Azure Blob Storage container where the source directory is located.
            source_dir (str): The path of the directory in the container to be zipped.
            temp_zip_path (str): The path (including the filename) where the zipped file will be uploaded within the container.
        """
        blob_service_client = self.blob_service_client
        zip_buffer = BytesIO()

        try:
            with zipfile.ZipFile(zip_buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zip_archive:

                async def add_directory_to_zip(container_client, current_path=""):
                    tasks = []
                    for blob_item in container_client.walk_blobs(name_starts_with=current_path):
                        if blob_item["name"].endswith("/"):
                            new_path = f"{blob_item['name']}".lstrip("/")
                            zip_archive.writestr(f"{new_path}/", "")
                        else:
                            tasks.append(add_file_to_zip(container_client, blob_item["name"], zip_archive))

                    await asyncio.gather(*tasks)

                async def add_file_to_zip(container_client, blob_name, zip_archive):
                    try:
                        blob_client = container_client.get_blob_client(blob_name)
                        download_stream = blob_client.download_blob()
                        file_data = download_stream.readall()
                        zip_archive.writestr(blob_name, file_data)
                    except Exception as e:
                        logging.debug(f"Error downloading file {blob_name}: {str(e)}")

                container_client = blob_service_client.get_container_client(resource_name)
                await add_directory_to_zip(container_client, source_dir)

            zip_buffer.seek(0)

            zip_blob_client = blob_service_client.get_blob_client(resource_name, temp_zip_path)
            await zip_blob_client.upload_blob(zip_buffer.getvalue(), overwrite=True)

            return temp_zip_path

        except Exception as e:
            logging.debug(f"Error zipping the directory: {e}")
            return None
