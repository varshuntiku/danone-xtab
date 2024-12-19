import csv
import io
import json
import logging
import os
import pathlib

from api.configs.settings import get_app_settings
from azure.core.exceptions import AzureError
from azure.storage.fileshare import (
    ShareAccessTier,
    ShareClient,
    ShareDirectoryClient,
    ShareFileClient,
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
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."

    def get_response(self):
        return {"data": self.data, "status": self.status, "message": self.message}

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
            self.status = "success"
            self.message = "Read successful."
            self.data = [json.loads(line) for line in lines]
            return self.get_response()
        except AzureError as e:
            print(f"Error reading file contents: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            print("Error decoding JSON.")
            return self.get_response()

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
    def upload_file_to_specific_path(self, share_name, server_file_path, local_file_path):
        try:
            file_client = ShareFileClient.from_connection_string(
                conn_str=self.connection_string, share_name=share_name, file_path=server_file_path
            )
            with open(local_file_path, "rb") as source_file:
                file_client.upload_file(source_file)
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

    async def upload_file_as_data_to_specific_path(self, share_name, server_file_path, data):
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
