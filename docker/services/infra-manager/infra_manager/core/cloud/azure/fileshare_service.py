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
from azure.storage.fileshare import (
    FileSasPermissions,
    ShareClient,
    ShareDirectoryClient,
    ShareFileClient,
    ShareServiceClient,
    generate_file_sas,
)
from dotenv import load_dotenv

load_dotenv()
logging.getLogger("azure").setLevel(logging.ERROR)


class FileShareService:
    def __init__(self, connection_string, share_name, file_path):
        """
        Initializes the FileChangeDetector with Azure File Share connection details and state tracking variables.

        Parameters:
            connection_string (str): Azure Storage connection string.
            share_name (str): The name of the file share where the file resides.

            file_path (str): The path to the file within the file share.
        """
        if file_path:
            self.file_client = ShareFileClient.from_connection_string(
                connection_string, share_name=share_name, file_path=file_path
            )
        self.last_change_time = None
        self.last_log_length = None
        self.watching = False
        self.connection_string = connection_string
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."
        self.node_counter = 0
        if share_name:
            self.share_name = share_name

        print("Current File Path::", file_path)

    def get_response(self):
        return {"data": self.data, "status": self.status, "message": self.message}

    def reset_response(self):
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."

    def get_file_properties(self, share_name, server_file_path):
        """
        Fetches the properties of the file, focusing on the last modified time and content length.

        Returns:
            tuple: A pair (last_modified, content_length), where `last_modified` is the last modification
            datetime of the file, and `content_length` is the size of the file in bytes. Returns (None, None) if
            an error occurs.
        """
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

    def read_jsonl_contents(self):
        """
        Reads and returns the contents of the JSONL file, converting each line to a Python dictionary.

        Returns:
            list: A list of dictionaries, each representing a line in the JSONL file. Returns an empty list if
            an error occurs or the file is empty.
        """
        try:
            downloaded_file = self.file_client.download_file()
            file_contents = downloaded_file.readall()
            lines = file_contents.decode("utf-8").splitlines()
            return [json.loads(line) for line in lines]
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return []
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return []

    def check_file_changes(self):
        """
        Checks if the watched file has been modified since the last check by comparing the last modification
        time and the length of the file content. Updates the state if a change is detected.

        Returns:
            tuple: A pair (file_changed, last_content), where `file_changed` is a boolean indicating if the
            file has been updated, and `last_content` is the last line of the file as a dictionary if the file
            has changed, otherwise None.
        """
        current_write_time, _ = self.get_file_properties()
        if current_write_time is None:
            return False, None

        # init class states for first run
        if self.last_change_time is None or self.last_log_length is None:
            self.last_change_time = current_write_time
            content_list = self.read_jsonl_contents()
            self.last_log_length = len(content_list)
            return False, None

        if current_write_time > self.last_change_time:
            content_list = self.read_jsonl_contents()
            current_log_length = len(content_list)
            if current_log_length > self.last_log_length:
                diff_log_length = current_log_length - self.last_log_length

                updated_logs = content_list[-diff_log_length:]

                # update instance state with the current information
                self.last_change_time, self.last_log_length = (
                    current_write_time,
                    current_log_length,
                )
                return True, updated_logs

        return False, None

    async def watch_file_changes(self, watch_frequency=10):
        """
        Continuously monitors the file for changes at intervals set for watch_frequency.
        This method will keep running
        until `cancel_watching` is called to update the `watching` flag to False.
        """
        self.watching = True
        # print("Starting to watch file changes...")
        while self.watching:
            file_changed, last_content = self.check_file_changes()
            if file_changed:
                # print("File changed. Last line:", last_content)
                yield last_content
            else:
                yield []
            await asyncio.sleep(watch_frequency)
        print("Stopped watching file changes.")

    def cancel_watching(self):
        """
        Cancels the file monitoring process by setting the `watching` flag to False.
        """
        self.watching = False

    def copy_directory(self, source_dir: str, target_dir: str):
        """
        This utility function Copies all files and directories recursively
        from the source directory to the target directory within
        the same file share.

        Parameters:
            source_dir (str): source directory path within the file share.
            target_dir (str): target directory path within the file share.
        """

        if not all([source_dir, target_dir]):
            raise ValueError("Source and target directory paths must be provided.")

        service_client = ShareServiceClient.from_connection_string(self.connection_string)
        try:
            total_copied = 0
            # retrive the directory clients
            source_directory_client = service_client.get_share_client(self.share_name).get_directory_client(source_dir)
            target_directory_client = service_client.get_share_client(self.share_name).get_directory_client(target_dir)
            print("created directory client")

            # add the target directory if it does not exist
            if not target_directory_client.exists():
                target_directory_client.create_directory()

            items = source_directory_client.list_directories_and_files()

            for item in items:
                source_item_path = os.path.join(source_dir, item["name"])
                target_item_path = os.path.join(target_dir, item["name"])

                # check if the entity is a directory or folder
                if item["is_directory"]:
                    result = self.copy_directory(source_item_path, target_item_path)
                    total_copied += result["total"]
                else:
                    source_file_client = source_directory_client.get_file_client(item["name"])
                    target_file_client = target_directory_client.get_file_client(item["name"])
                    source_file_url = source_file_client.url
                    target_file_client.start_copy_from_url(source_file_url)
                    print(f"Copying file {item['name']} to {target_item_path}")
                    total_copied += 1

            return {"status": "Success", "total": total_copied}
        except Exception as e:
            print(f"An error occurred during copy operation: {e}")
            raise

    def copy_files(self, source_folder: str, target_folder: str, file_names: str | list):
        """
        Copies specified file(s) from one folder to another within the same file share.

        Parameters:
            source_folder (str): The source folder path within the file share.
            target_folder (str): The target folder path within the file share.
            file_names (str | list): A single file name or a list of file names to be copied.

        Raises:
            ValueError: If the required parameters are not provided or the file_names is not a string or list.
            Exception: General exception for handling errors during the file copying process.
        """
        if not all([source_folder, target_folder, file_names]):
            raise ValueError("source_folder, target_folder and file_names must be valid values.")

        service_client = ShareServiceClient.from_connection_string(self.connection_string)
        try:
            # retrive the directory clients
            source_directory_client = service_client.get_share_client(self.share_name).get_directory_client(
                source_folder
            )
            target_directory_client = service_client.get_share_client(self.share_name).get_directory_client(
                target_folder
            )
            print("created directory client")

            if type(file_names) is str:
                file_names = [file_names]

            items = source_directory_client.list_directories_and_files()

            total_copied = []

            for item in items:
                if item["name"] in file_names and item.is_directory is False:
                    source_file_client = source_directory_client.get_file_client(item["name"])
                    # print(dir(source_file_client))
                    target_file_client = target_directory_client.get_file_client(item["name"])
                    source_file_url = source_file_client.url
                    target_file_client.start_copy_from_url(source_file_url)
                    total_copied.append(item["name"])

            return {"status": "Success", "total": total_copied}

        except Exception as e:
            print(f"An error occurred during copy operation: {e}")
            raise

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

    def create_file(
        self, file_name: str, folder_path: str, extension: str = None, size: int = 0, content: str | bytes = None
    ):
        """
        Creates a new file in the given path with the specified content

        Parameters:
            folder_path (str): The path of the folder within the file share where the file will be created.
            file_name (str): The name of the file to be created.
            content (bytes | str, optional): Content to write to the file upon creation. Defaults to None.
        """
        share_client = ShareClient.from_connection_string(self.connection_string, share_name=self.share_name)
        try:
            # Get a file client
            my_allocated_file = share_client.get_file_client(f"{folder_path}/{file_name}.{extension}")

            # [START create_file]
            # Create and allocate bytes for the file (no content added yet)
            my_allocated_file.create_file(size=size)
            # [END create_file]

            if content:
                share_file_client = ShareFileClient.from_connection_string(
                    conn_str=self.connection_string,
                    share_name=self.share_name,
                    file_path=f"{folder_path}/{file_name}.{extension}",
                )
                upload_data = bytes(content, "utf-8")
                share_file_client.upload_file(upload_data)

            return {"status": "Success"}
        except Exception as e:
            print(f"An error occurred during copy operation: {e}")
            raise

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
        def get_account_key_from_connection_string(connection_string: str) -> str:
            pattern = r"AccountKey=([^;]+)"
            match = re.search(pattern, connection_string)
            return match.group(1) if match else None

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

    def get_share_directory_path(self, share_name: str, bp):
        share = ShareClient.from_connection_string(self.connection_string, share_name=share_name)
        directory_client = share.get_directory_client(f"{bp}")
        directory_path = directory_client.directory_path
        return directory_path


if __name__ == "__main__":
    # test file change
    file_path = "train001/trainer_log.jsonl"

    try:
        detector = FileShareService(
            os.environ.get("STORAGE_CONN_STRING"),
            os.environ.get("FILESHARE_NAME"),
            file_path,
        )

        detector.watch_file_changes()
    except KeyboardInterrupt:
        detector.cancel_watching()
        print("Stopping watching file changes.")
