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
from azure.storage.fileshare import (
    FileSasPermissions,
    ShareAccessTier,
    ShareClient,
    ShareDirectoryClient,
    ShareServiceClient,
    generate_file_sas,
)
from storage_helper.storage_handlers import (
    DataUploadHandler,
    LocalFileUploadHandler,
    StreamUploadHandler,
)
from storage_helper.storage_helper_class import FileManagerInterface, MetadataInterface


class AzureFileShareService(FileManagerInterface, MetadataInterface):
    def __init__(
        self,
        account_name: Optional[str] = None,
        account_key: Optional[str] = None,
        connection_string: Optional[str] = None,
        credential: Optional[DefaultAzureCredential] = None,
    ):
        if connection_string:
            self.conn_str = connection_string
            self.client = ShareServiceClient.from_connection_string(self.conn_str)
        elif account_name and account_key:
            self.conn_str = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"
            self.client = ShareServiceClient.from_connection_string(self.conn_str)
        elif os.getenv("AZURE_STORAGE_ACCOUNT_NAME") and os.getenv("AZURE_STORAGE_ACCOUNT_KEY"):
            account_name = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")
            account_key = os.getenv("AZURE_STORAGE_ACCOUNT_KEY")
            self.conn_str = (
                f"DefaultEndpointsProtocol=https;AccountName={account_name};"
                f"AccountKey={account_key};EndpointSuffix=core.windows.net"
            )
            self.client = ShareServiceClient.from_connection_string(self.conn_str)
        else:
            if not credential:
                credential = DefaultAzureCredential()
            if not account_name:
                raise ValueError("Account name must be provided when using DefaultAzureCredential.")
            self.account_name = account_name
            account_url = f"https://{account_name}.file.core.windows.net"
            self.client = ShareServiceClient(account_url=account_url, credential=credential, token_intent="storage")
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

    def download_file_from_specific_path(self, resource_name: str, resource_path: str, local_file_path: str):
        """
        Download a file from a specific path in an Azure File Share.

        Parameters:
        resource_name (str): The name of the Azure File Share from which to download the file.
        resource_path (str): The path to the file within the Azure File Share.
        local_file_path (str): The local file path where the downloaded file will be saved.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            with open(local_file_path, "wb") as file_handle:
                data = file_client.download_file()
                data.readinto(file_handle)
            self.status = "success"
            self.message = "Download successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error downloading file: {e}")
            return self.get_response()

    async def upload_file_to_specific_path(self, resource_name, resource_path, local_file_path=None, file_stream=None):
        """
        Upload a file to a specific path in an Azure File Share.

        This method allows uploading a file either from a local file path or from a file stream.
        It creates the necessary directory structure in the Azure File Share if it doesn't exist.

        Parameters:
        resource_name (str): The name of the Azure File Share to which the file will be uploaded.
        resource_path (str): The path within the Azure File Share where the file will be uploaded.
        local_file_path (Optional[str]): The local file path of the file to upload. If provided, this file will be uploaded.
        file_stream (Optional[IO]): An alternative to `local_file_path`; a file-like stream to upload. This is used if `local_file_path` is not provided.
        """
        file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
        if file_stream:
            await self._ensure_directory_structure(resource_name, resource_path)
        for handler in self.upload_handlers:
            if await handler.handle(file_client, local_file_path=local_file_path, file_stream=file_stream):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    async def _ensure_directory_structure(self, resource_name: str, resource_path: str):
        """
        Ensures that the specified directory structure exists in the Azure File Share.

        This method checks if the directory structure defined by `resource_path`
        exists within the specified Azure File Share (`resource_name`). If any part of the
        directory structure does not exist, it creates the necessary directories.

        Parameters:
            resource_name (str): The name of the Azure File Share where the directory structure should exist.
            resource_path (str): The full path of the directory structure to ensure. This can include subdirectories.
        """
        share = self.client.get_share_client(resource_name)
        parts = resource_path.strip("/").split("/")
        if "." in parts[-1]:
            parts = parts[:-1]

        current_path = ""

        for part in parts:
            current_path = f"{current_path}/{part}" if current_path else part
            directory_client = share.get_directory_client(current_path)
            if not directory_client.exists():
                directory_client.create_directory()

    async def upload_multipart_file_to_specific_path(self, resource_name, resource_path, file):
        """
        Upload a multipart file to a specific path in an Azure File Share.

        This method handles the upload of a multipart file by reading its content
        and uploading it directly to the specified path in the Azure File Share.

        Parameters:
        resource_name (str): The name of the Azure File Share where the file will be uploaded.
        resource_path (str): The path within the Azure File Share where the file will be stored.
        file (IO): A file-like object representing the multipart file to upload. This should be
                a file object that supports the read method.
        """
        file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
        content = await file.read()
        for handler in self.upload_handlers:
            if await handler.handle(file_client, data=content):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def upload_file_as_data_to_specific_path(self, resource_name, resource_path, data):
        """
        Upload data as a file to a specific path in an Azure File Share.

        This method converts the provided string data into bytes and uploads it
        to the specified path in the Azure File Share.

        Parameters:
        resource_name (str): The name of the Azure File Share where the data will be uploaded.
        resource_path (str): The path within the Azure File Share where the data will be stored.
        data (str): The string data to upload. This data will be converted to bytes for upload.
        """
        file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
        upload_data = bytes(data, "utf-8")
        for handler in self.upload_handlers:
            if handler.handle(file_client, data=upload_data):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def delete_file_from_specific_directory(self, resource_name, resource_path, file_name):
        """
        Delete a file from a specific directory in an Azure File Share.

        This method connects to the specified Azure File Share and deletes the
        designated file from the specified directory path.

        Parameters:
        resource_name (str): The name of the Azure File Share from which to delete the file.
        resource_path (str): The path of the directory within the Azure File Share where the file is located.
        file_name (str): The name of the file to delete from the specified directory.
        """
        try:
            share = self.client.get_share_client(resource_name)
            directory = share.get_directory_client(directory_path=resource_path)

            directory.delete_file(file_name)
            self.status = "success"
            self.message = "File deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting file from Azure File Share: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_sub_directory_from_specific_directory(self, resource_name, resource_path, sub_directory_name):
        """
        Delete a subdirectory from a specific directory in an Azure File Share.

        This method connects to the specified Azure File Share and deletes the
        designated subdirectory from the specified directory path.

        Parameters:
        resource_name (str): The name of the Azure File Share from which to delete the subdirectory.
        resource_path (str): The path of the directory within the Azure File Share where the subdirectory is located.
        sub_directory_name (str): The name of the subdirectory to delete from the specified directory.
        """
        try:
            share = self.client.get_share_client(resource_name)
            directory = share.get_directory_client(directory_path=resource_path)

            directory.delete_subdirectory(sub_directory_name)
            self.status = "success"
            self.message = "Subdirectory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting subdirectory from Azure File Share: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_directory_from_share(self, resource_name, resource_path):
        """
        Delete a directory from an Azure File Share.

        This method connects to the specified Azure File Share and deletes the
        designated directory from the given resource path.

        Parameters:
        resource_name (str): The name of the Azure File Share from which to delete the directory.
        resource_path (str): The path of the directory within the Azure File Share that is to be deleted.
        """
        try:
            share = self.client.get_share_client(resource_name)
            directory = share.get_directory_client(directory_path=resource_path)

            directory.delete_directory()
            self.status = "success"
            self.message = "Directory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting directory from Azure File Share: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _copy_file(
        self,
        source_resource_name: ShareClient,
        destination_resource_name: ShareClient,
        source_path: str,
        destination_path: str,
    ):
        """
        copy a file from one Azure File Share to another.

        This method ensures that the directory structure exists in the destination
        share before copying the file from the source path to the destination path.

        Parameters:
        source_resource_name (ShareClient): The ShareClient for the source Azure File Share.
        destination_resource_name (ShareClient): The ShareClient for the destination Azure File Share.
        source_path (str): The path of the file in the source Azure File Share.
        destination_path (str): The path where the file should be copied in the destination Azure File Share.
        """
        await self._ensure_directory_structure(destination_resource_name.share_name, destination_path)
        source_file = source_resource_name.get_file_client(source_path)
        destination_file = destination_resource_name.get_file_client(destination_path)
        destination_file.start_copy_from_url(source_file.url)

    async def _copy_files_and_subdirectories(
        self,
        source_resource_name: ShareClient,
        destination_resource_name: ShareClient,
        source_directory_path: ShareDirectoryClient,
        destination_directory_path: ShareDirectoryClient,
    ):
        """
        copy all files and subdirectories from one Azure File Share directory to another.

        This method traverses the source directory, copying each file and directory
        recursively to the specified destination directory within the Azure File Share.

        Parameters:
        source_resource_name (ShareClient): The ShareClient for the source Azure File Share.
        destination_resource_name (ShareClient): The ShareClient for the destination Azure File Share.
        source_directory_path (ShareDirectoryClient): The directory client for the source directory to copy from.
        destination_directory_path (ShareDirectoryClient): The directory client for the destination directory to copy to.
        """
        for item in source_directory_path.list_directories_and_files():
            source_path = f"{source_directory_path.directory_path}/{item.name}"
            destination_path = f"{destination_directory_path.directory_path}/{item.name}"

            if item.is_directory:
                await self._ensure_directory_structure(destination_resource_name.share_name, destination_path)
                new_source_directory = source_directory_path.get_subdirectory_client(item.name)
                new_destination_directory = destination_directory_path.get_subdirectory_client(item.name)
                await self._copy_files_and_subdirectories(
                    source_resource_name, destination_resource_name, new_source_directory, new_destination_directory
                )
            else:
                await self._copy_file(source_resource_name, destination_resource_name, source_path, destination_path)

    async def delete_directory_tree_from_share(self, resource_name: str, directory_path: str):
        """
        delete a directory tree from an Azure File Share.

        This method attempts to delete a specified directory and all its contents (files and subdirectories)
        from an Azure File Share. If the specified path is a file, it will delete the file instead.

        Parameters:
        resource_name (str): The name of the Azure File Share from which the directory or file will be deleted.
        directory_path (str): The path of the directory or file to delete within the Azure File Share.
        """
        try:
            share = self.client.get_share_client(resource_name)
            directory_or_file = share.get_directory_client(directory_path=directory_path)

            try:
                for _ in directory_or_file.list_directories_and_files():
                    await self._delete_files_and_subdirectories(directory_or_file)
                    break
                directory_or_file.delete_directory()
            except Exception:
                file_client = share.get_file_client(directory_path)
                file_client.delete_file()

            self.data = None
            self.status = "success"
            self.message = "Directory or file deletion successful."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    def create_directory(self, resource_name, directory_name):
        """
        Create a new directory in an Azure File Share.

        This method creates a specified directory within the given Azure File Share.
        If the directory already exists, the operation will succeed without errors.

        Parameters:
        resource_name (str): The name of the Azure File Share where the directory will be created.
        directory_name (str): The name of the directory to create within the specified Azure File Share.
        """
        try:
            share = self.client.get_share_client(resource_name)
            my_directory = share.get_directory_client(directory_path=directory_name)

            my_directory.create_directory()
            self.status = "success"
            self.message = "Directory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating directory: {e}")
            return self.get_response()

    def create_sub_directory(self, resource_name, directory_path, sub_directory_name):
        """
        Create a new subdirectory within a specified directory in an Azure File Share.

        This method creates a subdirectory inside a given directory within the specified Azure File Share.
        If the subdirectory already exists, the operation will succeed without errors.

        Parameters:
        resource_name (str): The name of the Azure File Share where the subdirectory will be created.
        directory_path (str): The path of the parent directory in which the subdirectory will be created.
        sub_directory_name (str): The name of the subdirectory to create.
        """
        try:
            share = self.client.get_share_client(resource_name)
            my_directory = share.get_directory_client(directory_path=directory_path)

            subdirectory = my_directory.get_subdirectory_client(sub_directory_name)
            subdirectory.create_directory()
            self.status = "success"
            self.message = "Subdirectory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating subdirectory: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def create_share(self, resource_name, access_tier: str = None, quota: int = None):
        """
        Creates a new Azure File Share with optional access tier and quota settings.

        This method initializes an Azure File Share using the provided name and can set optional
        properties such as the access tier and quota. The access tier determines the storage
        performance level, while the quota limits the total size of the share.

        Parameters:
            resource_name (str): The name of the Azure File Share to be created.
            access_tier (str, optional): The access tier for the share, such as 'TransactionOptimized',
                'Hot', or 'Cool'. If not specified, the default access tier is applied.
            quota (int, optional): The maximum size of the share in GiB. If not specified, the share
                will have no size limit.
        """
        try:
            share = self.client.get_share_client(resource_name)
            share.create_share()
            if access_tier is not None:
                share.set_share_properties(access_tier=ShareAccessTier(access_tier))
            if quota is not None:
                share.set_share_properties(quota=quota)
            self.status = "success"
            self.message = "Share creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating share: {e}")
            return self.get_response()

    def delete_share(self, resource_name):
        """
        Deletes an existing Azure File Share.

        This method removes the specified Azure File Share from the storage account.
        The deletion is permanent, and once a share is deleted, it cannot be recovered.

        Parameters:
            resource_name (str): The name of the Azure File Share to be deleted.
        """
        try:
            share = self.client.get_share_client(resource_name)
            share.delete_share()
            self.status = "success"
            self.message = "Share deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting share from Azure File Share: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _delete_files_and_subdirectories(self, directory: ShareDirectoryClient):
        """
        Recursively deletes all files and subdirectories within the specified Azure File Share directory.

        This method traverses through the given `ShareDirectoryClient` directory,
        deleting all files and subdirectories it encounters. It will delete subdirectories
        only after all their contents have been removed.

        Parameters:
            directory (ShareDirectoryClient): The directory client representing the Azure File Share
            directory from which to delete files and subdirectories.
        """
        for item in directory.list_directories_and_files():
            if item.is_directory:
                subdirectory = directory.get_subdirectory_client(item.name)
                await self._delete_files_and_subdirectories(subdirectory)
                subdirectory.delete_directory()
            else:
                file_client = directory.get_file_client(item.name)
                file_client.delete_file()

    async def import_directory_or_file(
        self, source_resource_name: str, destination_resource_name: str, source_path: str, destination_path: str
    ):
        """
        Imports a directory or file from one Azure File Share to another.

        This method copies either a directory or a single file from the specified
        source Azure File Share to the designated destination Azure File Share. It handles both
        directory structures and single file transfers.

        Parameters:
            source_resource_name (str): The name of the source Azure File Share.
            destination_resource_name (str): The name of the destination Azure File Share.
            source_path (str): The path to the source directory or file within the source share.
            destination_path (str): The destination path where the directory or file will be copied in the destination share.
        """
        try:
            source_share = self.client.get_share_client(source_resource_name)
            destination_share = self.client.get_share_client(destination_resource_name)

            source_item = source_share.get_directory_client(source_path)

            if source_item.exists():
                if source_item.get_directory_properties():
                    destination_directory = destination_share.get_directory_client(destination_path)
                    await self._ensure_directory_structure(destination_resource_name, destination_path)
                    await self._copy_files_and_subdirectories(
                        source_share, destination_share, source_item, destination_directory
                    )
                else:
                    await self._copy_file(source_share, destination_share, source_path, destination_path)
            else:
                await self._copy_file(source_share, destination_share, source_path, destination_path)

            self.status = "success"
            self.message = "Copy operation successful."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    def get_file_properties(self, resource_name: str, resource_path: str):
        """
        Retrieve the properties of a specified file in an Azure File Share.

        This method fetches the properties of a file stored in the specified Azure File Share,
        including metadata such as size, last modified time, and other file attributes.

        Parameters:
        resource_name (str): The name of the Azure File Share where the file is located.
        resource_path (str): The path of the file whose properties are to be retrieved.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            properties = file_client.get_file_properties()
            self.data = properties
            self.status = "success"
            self.message = "Data retrieved successfully."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error retrieving file properties: {e}")
            return self.get_response()

    async def generate_sas_token(self, resource_name: str, resource_path: str):
        """
        Generate a Shared Access Signature (SAS) token for a specified file in an Azure File Share.

        This method creates a SAS token that grants read access to a specific file in the Azure File Share.
        The token can be used to securely access the file without exposing the storage account key.

        Parameters:
        resource_name (str): The name of the Azure File Share where the file is located.
        resource_path (str): The path of the file for which the SAS token is being generated.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)

            start_time = datetime.now(timezone.utc)
            expiry_time = start_time + timedelta(hours=2)
            account_name_match = re.search(r"AccountName=([^;]+)", self.conn_str)
            account_key_match = re.search(r"AccountKey=([^;]+)", self.conn_str)

            if account_name_match and account_key_match:
                account_name = account_name_match.group(1)
                account_key = account_key_match.group(1)
            else:
                raise ValueError("Account name or account key not found in the connection string.")
            sas_token = generate_file_sas(
                account_name=account_name,
                share_name=resource_name,
                file_path=resource_path.split("/"),
                account_key=account_key,
                permission=FileSasPermissions(read=True),
                expiry=expiry_time,
                start=start_time,
                protocol="https",
            )
            return f"{file_client.url}?{sas_token}"
        except Exception as e:
            logging.debug(e)
            return None

    def get_available_directories_in_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve a list of available directories and files in a specific path within an Azure File Share.

        This method lists all directories and files located at the specified path in the given Azure File Share.
        It returns a collection of directory and file names, enabling users to explore the structure of the file share.

        Parameters:
        resource_name (str): The name of the Azure File Share from which to retrieve directories.
        resource_path (str): The path within the Azure File Share to list directories and files from.
        """
        try:
            directory_client = self.client.get_share_client(resource_name).get_directory_client(resource_path)
            directory_list = list(directory_client.list_directories_and_files())
            self.data = directory_list
            self.status = "success"
            self.message = "Data retrieved successfully."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error listing directories: {e}")
            return self.get_response()

    def get_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve and decode JSON data from a file located at a specific path within an Azure File Share.

        This method downloads a file from the specified Azure File Share path, reads its contents,
        and attempts to parse the contents as JSON. Each line of the file is treated as a separate JSON object.

        Parameters:
        resource_name (str): The name of the Azure File Share containing the file.
        resource_path (str): The path to the file within the Azure File Share.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = [json.loads(line) for line in lines]
            self.status = "success"
            self.message = "File data retrieved successfully."
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error retrieving file data: {e}")
            return self.get_response()
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            return self.get_response()

    def get_text_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve the contents of a text file located at a specific path within an Azure File Share.

        This method downloads a text file from the specified Azure File Share path, reads its contents,
        and splits the contents into lines, returning a list of lines.

        Parameters:
        resource_name (str): The name of the Azure File Share containing the text file.
        resource_path (str): The path to the text file within the Azure File Share.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = lines
            self.status = "success"
            self.message = "Text file data retrieved successfully."
            return self.get_response()
        except AzureError as e:
            logging.error(f"Error retrieving text file data: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            logging.error("Error decoding JSON.")
            return self.get_response()

    def get_raw_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve the raw contents of a file located at a specific path within an Azure File Share.

        This method downloads a file from the specified Azure File Share path and returns its raw byte contents.
        It is intended for cases where the file data is needed in its original binary format, without any
        decoding or processing.

        Parameters:
        resource_name (str): The name of the Azure File Share containing the file.
        resource_path (str): The path to the file within the Azure File Share.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            downloaded_file = file_client.download_file()
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
        Retrieve and parse the contents of a CSV file located at a specific path within an Azure File Share.

        This method downloads a CSV file, decodes its contents, and returns the data as a list of dictionaries.
        Each dictionary represents a row in the CSV, where keys are the column headers. If specified,
        it can also rename the keys based on the provided labels.

        Parameters:
        resource_name (str): The name of the Azure File Share containing the CSV file.
        resource_path (str): The path to the CSV file within the Azure File Share.
        fields (list, optional): A list of field names to include in the output. If provided, only these fields will be returned.
        labels (dict, optional): A dictionary mapping original field names to new labels. If provided, the keys in the output will be replaced with these labels.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_file_client(resource_path)
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
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
            logging.error(f"Error reading CSV file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            logging.error("Error decoding JSON.")
            return self.get_response()

    async def get_directory_tree(
        self, resource_name: str, resource_path: str = "", parent_node_id: int = None
    ) -> List[Dict]:
        """
        Recursively retrieves the directory tree structure from an Azure File Share.

        This method fetches the list of directories and files within a specified directory in an Azure File Share.
        It builds a nested structure representing the directory hierarchy, where each node includes information
        such as the name, selection state, icon type, and parent-child relationships.

        Parameters:
        resource_name (str): The name of the Azure File Share to access.
        resource_path (str, optional): The path to the specific directory within the Azure File Share. Defaults to the root directory.
        parent_node_id (int, optional): The ID of the parent node for hierarchical representation. Defaults to None for the root level.

        Returns:
        List[Dict]: A list of dictionaries representing the directory tree structure. Each dictionary contains:
            - "name": The name of the file or directory.
            - "selected": A boolean indicating whether the item is selected.
            - "nodeId": A unique identifier for the node.
            - "icon": An icon type indicating whether the item is a folder or file.
            - "parentNodeId": The ID of the parent node, or None for root items.
            - "child": A list of child nodes (subdirectories/files), if applicable.
        """
        try:
            file_client = self.client.get_share_client(resource_name).get_directory_client(resource_path)
            items = list(file_client.list_directories_and_files())
            tree = []
            for item in items:
                self.node_counter += 1
                node_id = self.node_counter
                node = {
                    "name": item.name,
                    "selected": False,
                    "nodeId": node_id,
                    "icon": "folder" if item.is_directory else await self.get_file_icon(item.name),
                    "parentNodeId": parent_node_id,
                    "child": None,
                }
                if item.is_directory:
                    subtree = await self.get_directory_tree(
                        resource_name, f"{resource_path}/{item.name}", parent_node_id=node_id
                    )
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
        Retrieves the appropriate icon type for a given file based on its MIME type.

        This method uses the `mimetypes` library to determine the MIME type of the specified file name
        and returns an icon representation based on the file type. If the MIME type cannot be determined,
        a generic file icon is returned.

        Parameters:
        file_name (str): The name of the file for which the icon is to be retrieved.

        Returns:
        str: A string representing the icon type for the file. The format is typically "{subtype}_file".
            If the MIME type cannot be determined, it returns "file" as a default icon.

        Example:
        - If the file name is "document.pdf", the method might return "pdf_file".
        - If the file name is "image.png", the method might return "png_file".
        - For unknown file types, it returns "file".
        """
        mime_type, _ = mimetypes.guess_type(file_name)

        if mime_type:
            mime_main_type, mime_subtype = mime_type.split("/")
            return f"{mime_subtype}_file"
        else:
            return "file"

    async def get_directory_last_modified(self, resource_name: str, directory_path: str) -> Optional[str]:
        """
        Retrieves the last modified timestamp and total size of a specified directory in an Azure file share.

        This method connects to an Azure file share and retrieves the properties of a specified directory,
        including the last modified timestamp. It also recursively scans all files and subdirectories
        within the specified directory to calculate the total size of the contents.

        Parameters:
        resource_name (str): The name of the Azure file share resource.
        directory_path (str): The path of the directory for which to retrieve the last modified timestamp
                            and total size.

        Returns:
        Optional[str]: A tuple containing:
            - last_modified (str): The last modified timestamp of the directory in ISO 8601 format.
            - total_size (int): The total size of all files within the directory in bytes.

        If an error occurs during the retrieval, the method returns None.

        Example:
        - Calling this method with a directory path might return:
        ("2024-10-30T12:34:56Z", 2048) for a directory that was last modified on that date
        and contains 2048 bytes of files.
        """
        try:
            share = self.client.get_share_client(resource_name)
            directory = share.get_directory_client(directory_path=directory_path)
            metadata = directory.get_directory_properties()
            last_modified = metadata["last_modified"]
            total_size = 0
            directories_to_scan = [directory]
            while directories_to_scan:
                current_directory = directories_to_scan.pop()
                for item in current_directory.list_directories_and_files():
                    if item.is_directory:
                        subdirectory_client = current_directory.get_subdirectory_client(item.name)
                        directories_to_scan.append(subdirectory_client)
                    else:
                        total_size += item.size
            if isinstance(last_modified, datetime):
                last_modified_str = last_modified.isoformat()
            else:
                last_modified_str = str(last_modified)

            return last_modified_str, total_size
        except Exception as e:
            logging.debug(f"Failed to retrieve last modified timestamp: {e}")
            return None, 0

    def get_share_directory_path(self, resource_name: str, project_id: int):
        """
        Retrieves the path of a specific directory within an Azure file share based on the project ID.

        This method constructs the directory path in the specified Azure file share using the project ID,
        and returns the path of the directory client.

        Parameters:
        resource_name (str): The name of the Azure file share resource.
        project_id (int): The ID of the project for which to retrieve the directory path.

        Returns:
        str: The directory path of the specified project in the Azure file share.

        Example:
        - Calling this method with resource_name as "myShare" and project_id as 123 might return:
        "123" as the path to the project directory.
        """
        share = self.client.get_share_client(resource_name)
        directory_client = share.get_directory_client(f"{project_id}")
        directory_path = directory_client.directory_path
        return directory_path

    async def zip_directory_in_fileshare(self, resource_name: str, source_dir: str, temp_zip_path: str):
        """
        Creates a ZIP archive of a specified directory within an Azure File Share and uploads it to the same share.

        This method traverses through the specified directory in the Azure File Share,
        compressing all files and subdirectories into a single ZIP file. The resulting ZIP file is then
        uploaded to the Azure File Share at the specified path.

        Parameters:
            resource_name (str): The name of the Azure File Share where the source directory is located.
            source_dir (str): The path to the source directory within the Azure File Share that is to be zipped.
            temp_zip_path (str): The path where the resulting ZIP file will be uploaded within the Azure File Share.
        """
        temp_zip_client = self.client.get_share_client(resource_name).get_file_client(temp_zip_path)
        zip_buffer = BytesIO()

        try:
            with zipfile.ZipFile(zip_buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zip_archive:

                async def add_directory_to_zip(directory_client, current_path=""):
                    tasks = []
                    for item in directory_client.list_directories_and_files():
                        if item["is_directory"]:
                            subdir_client = directory_client.get_subdirectory_client(item["name"])
                            new_path = f"{current_path}/{item['name']}".lstrip("/")
                            zip_archive.writestr(f"{new_path}/", "")
                            tasks.append(add_directory_to_zip(subdir_client, new_path))
                        else:
                            tasks.append(add_file_to_zip(directory_client, item["name"], current_path, zip_archive))

                    await asyncio.gather(*tasks)

                async def add_file_to_zip(directory_client, file_name, current_path, zip_archive):
                    try:
                        file_client = directory_client.get_file_client(file_name)
                        download_stream = file_client.download_file()
                        file_data = download_stream.readall()
                        zip_path = f"{current_path}/{file_name}".lstrip("/")
                        zip_archive.writestr(zip_path, file_data)
                    except AzureError as e:
                        print(f"Error downloading file {file_name}: {str(e)}")

                source_dir_client = self.client.get_share_client(resource_name).get_directory_client(source_dir)
                await add_directory_to_zip(source_dir_client)
            zip_buffer.seek(0)
            temp_zip_client.upload_file(zip_buffer.getvalue())

            return temp_zip_path

        except AzureError as e:
            logging.debug(e)
            return None
