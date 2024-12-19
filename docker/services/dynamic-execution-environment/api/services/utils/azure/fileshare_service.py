import asyncio
import csv
import io
import json
import logging
import mimetypes
import os
import pathlib
import zipfile
from datetime import datetime, timedelta, timezone
from io import BytesIO
from typing import Dict, List, Optional

from api.configs.settings import get_app_settings
from api.daos.execution_environment.solutionbp_dao import SolutionBluePrintDao
from api.utils.azure.fileshare_utils import get_account_key_from_connection_string
from azure.core.exceptions import AzureError
from azure.storage.fileshare import (
    FileSasPermissions,
    ShareAccessTier,
    ShareClient,
    ShareDirectoryClient,
    ShareFileClient,
    generate_file_sas,
)

settings = get_app_settings()


def create_local_file_reference_to_upload_file(file, file_location):
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())


def delete_local_file_reference_to_upload_file(file_location):
    # Deleting Temporary File
    os.unlink(file_location)


class AzureFileShareService:
    """
    Service to perform operation related to Azure File Share.
    share_name = Selected Share Name
    directory_path = Directory Path inside Azure Selected Share
    server_file_path = Directory Path including File Name on Azure(File Name should be same on Local and Azure)
    local_file_path = Directory Path including File Name on Local(File Name should be same on Local and Azure)
    directory_name = Directory Name
    sub_directory_name = Sub Directory Name
    file_name = File Name Including File Extention
    access_tier = Access Tier Type(hot/cool)
    quota = Storage Allocation in GB
    """

    def __init__(self):
        self.connection_string = settings.AZURE_FILE_SHARE_CONNECTION_STRING
        self.root = str(pathlib.Path(__file__).resolve().parent.parent.parent.parent)
        self.blueprint_dao = SolutionBluePrintDao()
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."
        self.node_counter = 0

    def get_response(self):
        return {"data": self.data, "status": self.status, "message": self.message}

    def reset_response(self):
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."

    def get_file_properties(self, share_name, server_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            properties = file_client.get_file_properties()
            self.data = properties
            self.status = "success"
            self.message = "Data retrived successfully."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Get Available Directories in Specific Path
    def get_available_directories_in_specific_path(self, share_name, directory_path):
        try:
            file_client = ShareDirectoryClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, directory_path=directory_path
            )
            directory_list = list(file_client.list_directories_and_files())
            self.data = directory_list
            self.status = "success"
            self.message = "Data retrived successfully."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Download File from Specific Path
    def download_file_from_specific_path(self, share_name, server_file_path, local_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            with open(local_file_path, "wb") as file_handle:
                data = file_client.download_file()
                data.readinto(file_handle)
            self.status = "success"
            self.message = "Download successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    def get_file_data_from_specific_path(self, share_name, server_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = [json.loads(line) for line in lines]
            self.status = "success"
            self.message = "Read successful."
            return self.get_response()
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return self.get_response()

    def get_text_file_data_from_specific_path(self, share_name, server_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
            lines = file_contents.decode("utf-8").splitlines()
            self.data = lines
            self.status = "success"
            self.message = "Read successful."
            return self.get_response()
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return self.get_response()

    def get_raw_file_data_from_specific_path(self, share_name, server_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            downloaded_file = file_client.download_file()
            file_contents = downloaded_file.readall()
            self.data = file_contents
            self.status = "success"
            self.message = "Read successful."
            return self.get_response()
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return self.get_response

    def get_csv_file_data_from_specific_path(self, share_name, server_file_path, fields=None, labels={}):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
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
            self.message = "Read successful."
            self.data = data
            return self.get_response()
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return self.get_response()

    # Upload File to Specific Path
    async def upload_file_to_specific_path(self, share_name, server_file_path, local_file_path=None, file_stream=None):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            if local_file_path:
                with open(local_file_path, "rb") as source_file:
                    file_client.upload_file(source_file)
            else:
                await self._ensure_directory_structure(share_name, server_file_path)
                file_client.upload_file(file_stream)
            self.status = "success"
            self.message = "Upload successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    async def upload_multipart_file_to_specific_path(self, share_name, server_file_path, file):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            content = await file.read()

            file_client.upload_file(data=content)
            self.status = "success"
            self.message = "Upload successful."
            return self.get_response()

        except Exception as e:
            logging.debug(e)
            return self.get_response()

    def upload_file_as_data_to_specific_path(self, share_name, server_file_path, data):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            upload_data = bytes(data, "utf-8")
            file_client.upload_file(upload_data)
            self.status = "success"
            self.message = "Upload successful."
            return self.get_response()

        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Create Share
    def create_share(self, share_name, access_tier: str = None, quota: int = None):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
            share.create_share()
            if access_tier is not None:
                share.set_share_properties(access_tier=ShareAccessTier(access_tier))
            if quota is not None:
                share.set_share_properties(quota=quota)
            self.status = "success"
            self.message = "Share creation successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Create Directory
    def create_directory(self, share_name, directory_name):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name)
            my_directory = share.get_directory_client(directory_path=directory_name)

            # [create_directory]
            my_directory.create_directory()
            self.status = "success"
            self.message = "Directory creation successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Create Sub Directory
    def create_sub_directory(self, share_name, directory_path, sub_directory_name):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name)
            my_directory = share.get_directory_client(directory_path=directory_path)

            subdirectory = my_directory.get_subdirectory_client(sub_directory_name)
            subdirectory.create_directory()
            self.status = "success"
            self.message = "Sub directory creation successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    # Delete File from Specific Path
    def delete_file_from_specific_directory(self, share_name, directory_path, file_name):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
            directory = share.get_directory_client(directory_path=directory_path)
            directory.delete_file(file_name)
            self.status = "success"
            self.message = "File deletion successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Delete Sub Directory from Specific Path
    def delete_sub_directory_from_specific_directory(self, share_name, directory_path, sub_directory_name):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
            directory = share.get_directory_client(directory_path=directory_path)
            directory.delete_subdirectory(sub_directory_name)
            self.status = "success"
            self.message = "Sub directory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Delete Directory From Share
    def delete_directory_from_share(self, share_name, directory_path):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
            directory = share.get_directory_client(directory_path=directory_path)
            directory.delete_directory()
            self.status = "success"
            self.message = "Directory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # Delete Share
    def delete_share(self, share_name):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
            share.delete_share()
            self.status = "success"
            self.message = "Share deletion successful."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            return self.get_response()

    # def move_file(self):
    #     source_url = (
    #         "https://{}.file.core.windows.net/{}/{}/{}/{}".format(
    #             "stcodxllm",
    #             settings.AZURE_FILE_SHARE_NAME,
    #             "13",
    #             "data",
    #             "finetuning_training.json",
    #         )
    #     )
    #     share = ShareClient.from_connection_string(
    #         settings.AZURE_FILE_SHARE_CONNECTION_STRING,
    #         share_name=settings.AZURE_FILE_SHARE_NAME,
    #     )
    #     destination_file = share.get_file_client("13/finetuning_training.json")
    #     destination_file.start_copy_from_url(source_url=source_url)

    async def get_directory_tree(
        self, share_name: str, directory_path: str = "", parent_node_id: int = None
    ) -> List[Dict]:
        try:
            file_client = ShareDirectoryClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, directory_path=directory_path
            )
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
                        share_name, f"{directory_path}/{item.name}", parent_node_id=node_id
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
        mime_type, _ = mimetypes.guess_type(file_name)

        if mime_type:
            mime_main_type, mime_subtype = mime_type.split("/")
            return f"{mime_subtype}_file"
        else:
            return "file"

    async def import_directory_or_file(
        self, source_share_name: str, destination_share_name: str, source_path: str, destination_path: str
    ):
        try:
            # Create source and destination share clients
            source_share = ShareClient.from_connection_string(self.connection_string, share_name=source_share_name)
            destination_share = ShareClient.from_connection_string(
                self.connection_string, share_name=destination_share_name
            )

            source_item = source_share.get_directory_client(source_path)

            if source_item.exists():
                if source_item.get_directory_properties():
                    destination_directory = destination_share.get_directory_client(destination_path)
                    await self._ensure_directory_structure(destination_share_name, destination_path)
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

    async def _copy_file(
        self,
        source_share: ShareClient,
        destination_share: ShareClient,
        source_file_path: str,
        destination_file_path: str,
    ):
        await self._ensure_directory_structure(destination_share.share_name, destination_file_path)
        source_file = source_share.get_file_client(source_file_path)
        destination_file = destination_share.get_file_client(destination_file_path)
        destination_file.start_copy_from_url(source_file.url)

    async def _copy_files_and_subdirectories(
        self,
        source_share: ShareClient,
        destination_share: ShareClient,
        source_directory: ShareDirectoryClient,
        destination_directory: ShareDirectoryClient,
    ):
        for item in source_directory.list_directories_and_files():
            source_path = f"{source_directory.directory_path}/{item.name}"
            destination_path = f"{destination_directory.directory_path}/{item.name}"

            if item.is_directory:
                await self._ensure_directory_structure(destination_share.share_name, destination_path)
                new_source_directory = source_directory.get_subdirectory_client(item.name)
                new_destination_directory = destination_directory.get_subdirectory_client(item.name)
                await self._copy_files_and_subdirectories(
                    source_share, destination_share, new_source_directory, new_destination_directory
                )
            else:
                await self._copy_file(source_share, destination_share, source_path, destination_path)

    async def _ensure_directory_structure(self, share_name: str, directory_path: str):
        """
        Ensures that the entire parent directory structure exists up to the specified directory path,
        excluding the file name if it's part of the path.
        """
        share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
        parts = directory_path.strip("/").split("/")
        if "." in parts[-1]:
            parts = parts[:-1]

        current_path = ""

        for part in parts:
            current_path = f"{current_path}/{part}" if current_path else part
            directory_client = share.get_directory_client(current_path)
            if not directory_client.exists():
                directory_client.create_directory()

    async def delete_directory_tree_from_share(self, share_name: str, directory_path: str):
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
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

    async def _delete_files_and_subdirectories(self, directory: ShareDirectoryClient):
        for item in directory.list_directories_and_files():
            if item.is_directory:
                subdirectory = directory.get_subdirectory_client(item.name)
                await self._delete_files_and_subdirectories(subdirectory)
                subdirectory.delete_directory()
            else:
                file_client = directory.get_file_client(item.name)
                file_client.delete_file()

    async def get_directory_last_modified(self, share_name: str, directory_path: str) -> Optional[str]:
        try:
            share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
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
            return None

    async def zip_directory_in_fileshare(self, share_name: str, source_dir: str, temp_zip_path: str):
        temp_zip_client = ShareFileClient.from_connection_string(
            conn_str=self.connection_string, share_name=share_name, file_path=temp_zip_path
        )
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

                source_dir_client = ShareDirectoryClient.from_connection_string(
                    conn_str=self.connection_string, share_name=share_name, directory_path=source_dir
                )
                await add_directory_to_zip(source_dir_client)
            zip_buffer.seek(0)
            temp_zip_client.upload_file(zip_buffer.getvalue())

            return temp_zip_path

        except AzureError as e:
            logging.debug(e)
            return None

    async def generate_sas_token(self, share_name: str, file_path: str):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=file_path
            )

            account_key = get_account_key_from_connection_string(self.connection_string)
            start_time = datetime.now(timezone.utc)
            expiry_time = start_time + timedelta(hours=2)
            if not account_key:
                raise ValueError("Account key could not be found in the connection string.")
            sas_token = generate_file_sas(
                account_name=file_client.account_name,
                share_name=share_name,
                file_path=file_path.split("/"),
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

    def get_share_directory_path(self, share_name: str, project_id: int):
        share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
        directory_client = share.get_directory_client(f"{project_id}")
        directory_path = directory_client.directory_path
        return directory_path
