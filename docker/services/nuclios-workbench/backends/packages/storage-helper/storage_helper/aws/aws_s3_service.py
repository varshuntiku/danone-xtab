import asyncio
import csv
import io
import json
import logging
import mimetypes
import os
import zipfile
from io import BytesIO
from typing import Dict, List, Optional

import boto3
from botocore.exceptions import BotoCoreError, ClientError
from storage_helper.storage_handlers import (
    DataUploadHandler,
    LocalFileUploadHandler,
    StreamUploadHandler,
)
from storage_helper.storage_helper_class import FileManagerInterface, MetadataInterface


class AWSS3Service(FileManagerInterface, MetadataInterface):
    def __init__(self, aws_access_key_id: Optional[str] = None, aws_secret_access_key: Optional[str] = None):
        if not aws_access_key_id or not aws_secret_access_key:
            aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
            aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        if not aws_access_key_id or not aws_secret_access_key:
            raise ValueError("AWS S3 credentials required: provide AWS access key and secret key.")
        self.s3_client = boto3.client(
            "s3", aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key
        )
        self.upload_handlers = [LocalFileUploadHandler(), StreamUploadHandler(), DataUploadHandler()]
        self.status = "failed"
        self.message = "Failed to perform given action."
        self.data = None
        self.node_counter = 0

    def get_response(self) -> dict:
        return {"data": self.data, "status": self.status, "message": self.message}

    def reset_response(self) -> None:
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform the action."

    def download_file_from_specific_path(self, resource_name: str, resource_path: str, local_file_path: str) -> dict:
        """
        Downloads a file from the specified S3 bucket to a local path.

        This method uses the Boto3 S3 client to download a file identified by the
        provided key from an S3 bucket to the specified local file path.

        Parameters:
            resource_name (str): Bucket Name
            resource_path (str): The key (path) of the file in the S3 bucket to be downloaded.
            local_file_path (str): The local path where the downloaded file will be saved.
        """
        try:
            self.s3_client.download_file(resource_name, resource_path, local_file_path)
            self.status = "success"
            self.message = "Download successful."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error downloading file: {e}")
            return self.get_response()

    async def upload_file_to_specific_path(
        self, resource_name: str, resource_path: str, local_file_path=None, file_stream=None
    ):
        """
        Uploads a file to the specified S3 bucket.

        This method uploads a file to an S3 bucket under the specified key.
        It can upload from a local file path or a file-like stream.

        Parameters:
            resource_name (str): Bucket Name
            resource_path (str): The key (path) under which the file will be stored in the S3 bucket.
            local_file_path (str, optional): The local file path of the file to upload.
                                            If provided, this file will be opened and uploaded.
            file_stream (file-like object, optional): A file-like stream to upload directly.
                                                    If provided, this will be used instead of a local file.
        """
        for handler in self.upload_handlers:
            if await handler.handle(
                self.s3_client,
                resource_name,
                resource_path,
                local_file_path=local_file_path,
                file_stream=file_stream,
            ):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    async def _ensure_directory_structure(self, resource_name: str, resource_path: str):
        """
        Ensure that the specified directory structure exists in the given S3 bucket.

        This method checks if a directory (denoted by a prefix) exists in the specified S3 bucket.
        If the directory does not exist, it creates an empty object to represent the directory in S3.

        Parameters:
            resource_name (str): The name of the S3 bucket where the directory structure should be ensured.
            resource_path (str): The prefix that represents the directory path. This should end with a '/' to indicate it is a directory.
        """
        response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=resource_path, Delimiter="/")

        if "Contents" not in response:
            self.s3_client.put_object(Bucket=resource_name, Key=f"{resource_path}/")

    async def upload_multipart_file_to_specific_path(self, resource_name: str, resource_path: str, file):
        """
        Uploads a multipart file to the specified S3 bucket.

        This method uploads a file object to an S3 bucket under the specified key.
        It is designed for handling large files efficiently by utilizing multipart uploads.

        Parameters:
            resource_name (str): Bucket Name
            resource_path (str): The key (path) under which the file will be stored in the S3 bucket.
            file (file-like object): A file-like object to upload. This should be an
                                    open binary stream (e.g., `open('filename', 'rb')`).
        """
        for handler in self.upload_handlers:
            if await handler.handle(
                self.s3_client,
                resource_name,
                resource_path,
                file_stream=file,
            ):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def upload_file_as_data_to_specific_path(self, resource_name: str, resource_path: str, data: str):
        """
        Uploads a string of data as an object to the specified S3 bucket.

        This method allows you to upload textual data directly to an S3 bucket under
        a specified key. It is useful for storing small text content without the need
        to create a physical file.

        Parameters:
            resource_name (str): Bucket Name
            resource_path (str): The key (path) under which the data will be stored in the S3 bucket.
            data (str): The string data to be uploaded. This data will be stored as the
                        content of the S3 object.
        """
        for handler in self.upload_handlers:
            if handler.handle(
                self.s3_client,
                resource_name,
                resource_path,
                data,
            ):
                self.status = "success"
                self.message = "Upload successful."
                return self.get_response()
        self.status = "failed"
        self.message = "No suitable upload handler found."
        return self.get_response()

    def delete_file_from_specific_directory(self, resource_name, resource_path):
        """
        Deletes a specified file from an S3 bucket.

        This method removes an object from the specified S3 bucket using the provided
        object key. It is useful for managing file storage and ensuring that
        unnecessary or outdated files are removed.

        Parameters:
            resource_name (str): The name of the S3 bucket from which the file will be deleted.
            resource_path (str): The key (path) of the object to be deleted from the S3 bucket.
        """
        try:
            self.s3_client.delete_object(Bucket=resource_name, Key=resource_path)
            self.status = "success"
            self.message = "File deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting file from AWS S3: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_sub_directory_from_specific_directory(self, resource_name, resource_path):
        """
        Deletes a specified subdirectory and its contents from an S3 bucket.

        This method removes all objects that have a specified prefix (subdirectory)
        in the given S3 bucket. It is useful for managing file storage by cleaning
        up entire subdirectories when they are no longer needed.

        Parameters:
            resource_name (str): The name of the S3 bucket from which the subdirectory will be deleted.
            resource_path (str): The prefix (subdirectory path) of the objects to be deleted.
                        All objects with this prefix will be removed.
        """
        try:
            objects_to_delete = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=resource_path)
            if "Contents" in objects_to_delete:
                delete_keys = {"Objects": [{"Key": obj["Key"]} for obj in objects_to_delete["Contents"]]}
                self.s3_client.delete_objects(Bucket=resource_name, Delete=delete_keys)

            self.status = "success"
            self.message = "Subdirectory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting subdirectory from AWS S3: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def delete_directory_from_share(self, resource_name, resource_path):
        """
        Deletes a specified directory and its contents from an S3 bucket.

        This method removes all objects that have a specified prefix (directory path)
        in the given S3 bucket. It is useful for managing file storage by cleaning
        up entire directories when they are no longer needed.

        Parameters:
            resource_name (str): The name of the S3 bucket from which the directory will be deleted.
            resource_path (str): The prefix (directory path) of the objects to be deleted.
                        All objects with this prefix will be removed.
        """
        try:
            objects_to_delete = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=resource_path)
            if "Contents" in objects_to_delete:
                delete_keys = {"Objects": [{"Key": obj["Key"]} for obj in objects_to_delete["Contents"]]}
                self.s3_client.delete_objects(Bucket=resource_name, Delete=delete_keys)

            self.status = "success"
            self.message = "Directory deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting directory from AWS S3: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _copy_file(
        self,
        source_resource_name: str,
        destination_resource_name: str,
        source_path: str,
        destination_path: str,
    ):
        """
        Copies a file from one S3 bucket to another.

        This method facilitates the copying of an object (file) from a
        specified source bucket to a designated destination bucket within AWS S3.
        This is useful for duplicating files across different buckets for backup,
        distribution, or organization purposes.

        Parameters:
            source_resource_name (str): The name of the source S3 bucket where the
                                    file is currently located.
            destination_resource_name (str): The name of the destination S3 bucket
                                            where the file will be copied to.
            source_path (str): The key (path) of the object in the source
                                    bucket to be copied.
            destination_path (str): The key (path) for the copied object
                                        in the destination bucket.
        """
        s3_client = boto3.client("s3")
        copy_source = {"Bucket": source_resource_name, "Key": source_path}
        s3_client.copy(copy_source, destination_resource_name, destination_path)

    async def _copy_files_and_subdirectories(
        self,
        source_resource_name: str,
        destination_resource_name: str,
        source_directory_path: str,
        destination_directory_path: str,
    ):
        """
        Copies all files and subdirectories from a specified prefix in one S3 bucket
        to a new prefix in another S3 bucket.

        This method retrieves all objects under the given source prefix
        in the source bucket and copies them to the destination bucket, preserving
        the original folder structure by replacing the source prefix with the
        destination prefix.

        Parameters:
            source_resource_name (str): The name of the S3 bucket to copy objects from.
            destination_resource_name (str): The name of the S3 bucket to copy objects to.
            source_directory_path (str): The prefix (path) of the objects in the source bucket
                                that should be copied.
            destination_directory_path (str): The prefix (path) in the destination bucket
                                    where the copied objects will be stored.
        """
        try:
            paginator = self.s3_client.get_paginator("list_objects_v2")
            for page in paginator.paginate(Bucket=source_resource_name, Prefix=source_directory_path):
                for obj in page.get("Contents", []):
                    source_object_key = obj["Key"]
                    destination_object_key = source_object_key.replace(
                        source_directory_path, destination_directory_path, 1
                    )

                    copy_source = {"Bucket": source_resource_name, "Key": source_object_key}
                    self.s3_client.copy_object(
                        CopySource=copy_source, Bucket=destination_resource_name, Key=destination_object_key
                    )

            self.status = "success"
            self.message = "All objects copied successfully."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    async def delete_directory_tree_from_share(self, resource_name: str, directory_path: str):
        """
        Deletes a directory and all its contents from an S3 bucket.

        This method retrieves all objects under the specified directory
        prefix in the given S3 bucket and deletes them. It effectively removes the
        directory tree, including all files and subdirectories.

        Parameters:
            resource_name (str): The name of the S3 bucket from which to delete the
                            directory and its contents.
            directory_path (str): The prefix (path) of the directory to be deleted
                                    within the bucket.
        """
        try:
            response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=directory_path)

            if "Contents" in response:
                for obj in response["Contents"]:
                    self.s3_client.delete_object(Bucket=resource_name, Key=obj["Key"])

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
        Creates a virtual directory in the specified S3 bucket.

        This method creates a virtual directory by adding an empty object with the
        specified directory name and a trailing slash. In S3, directories are not
        physical entities but are represented as prefixes in the object keys.
        Creating a directory this way allows for a structured representation of
        files in the bucket.

        Parameters:
            resource_name (str): The name of the S3 bucket where the directory will
                            be created.
            directory_name (str): The name of the directory to be created. The
                                directory name should not include a trailing slash
                                as it will be appended automatically.
        """
        try:
            self.s3_client.put_object(Bucket=resource_name, Key=f"{directory_name}/")
            self.status = "success"
            self.message = "Virtual directory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating virtual directory: {e}")
            return self.get_response()

    def create_sub_directory(self, resource_name, directory_path, sub_directory_name):
        """
        Creates a virtual subdirectory within the specified directory in an S3 bucket.

        This method creates a virtual subdirectory by adding an empty object with the
        specified subdirectory name and a trailing slash within the provided directory path.
        In Amazon S3, subdirectories are not physical entities but are represented as prefixes
        in the object keys. Creating a subdirectory this way helps in organizing files within
        the parent directory.

        Parameters:
            resource_name (str): The name of the S3 bucket where the subdirectory will be created.
            directory_path (str): The path of the parent directory where the subdirectory will
                                be created. This path should end without a trailing slash.
            sub_directory_name (str): The name of the subdirectory to be created. The subdirectory
                                    name should not include a trailing slash as it will be
                                    appended automatically.
        """
        try:
            self.s3_client.put_object(Bucket=resource_name, Key=f"{directory_path}/{sub_directory_name}/")
            self.status = "success"
            self.message = "Virtual subdirectory creation successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error creating virtual subdirectory: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    def create_share(self, resource_name: str, region: str = None):
        """
        Create an S3 bucket.

        This method creates a new S3 bucket with the specified name. If a region
        is provided, the bucket will be created in that specific region.
        Otherwise, the bucket will be created in the default region.

        Parameters:
            resource_name (str): The name of the S3 bucket to be created.
                            Bucket names must be unique across all of AWS.
            region (str, optional): The AWS region where the bucket will be created.
                                    If not specified, the bucket will be created in
                                    the default region.
        """
        try:
            if region is None:
                self.s3_client.create_bucket(Bucket=resource_name)
            else:
                self.s3_client.create_bucket(
                    Bucket=resource_name, CreateBucketConfiguration={"LocationConstraint": region}
                )
            self.status = "success"
            self.message = "Bucket creation successful."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error creating bucket: {e}")
            return self.get_response()

    def delete_share(self, resource_name):
        """
        Delete an S3 bucket and all its contents.

        This method deletes a specified S3 bucket from AWS, including all objects
        within the bucket. It first lists all objects in the bucket and deletes
        them before removing the bucket itself.

        Parameters:
            resource_name (str): The name of the S3 bucket to be deleted. The bucket
                            must be empty for deletion to succeed.
        """
        try:
            objects_to_delete = self.s3_client.list_objects_v2(Bucket=resource_name)
            if "Contents" in objects_to_delete:
                delete_keys = {"Objects": [{"Key": obj["Key"]} for obj in objects_to_delete["Contents"]]}
                self.s3_client.delete_objects(Bucket=resource_name, Delete=delete_keys)

            self.s3_client.delete_bucket(Bucket=resource_name)
            self.status = "success"
            self.message = "Bucket deletion successful."
            return self.get_response()
        except Exception as e:
            logging.error(f"Error deleting bucket from AWS S3: {e}")
            self.status = "failed"
            self.message = str(e)
            return self.get_response()

    async def _delete_files_and_subdirectories(self, resource_name: str, prefix: str):
        """
        Delete all files and subdirectories in a specified S3 bucket under the given prefix.

        This method retrieves all objects in the specified S3 bucket that match the given prefix
        and deletes them. This includes both files and any objects that represent subdirectories.

        Parameters:
            resource_name (str): The name of the S3 bucket from which to delete the files and subdirectories.
            prefix (str): The prefix that represents the path under which the files and subdirectories will be deleted.
        """
        try:
            response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=prefix)

            if "Contents" in response:
                for obj in response["Contents"]:
                    self.s3_client.delete_object(Bucket=resource_name, Key=obj["Key"])

        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

    async def import_directory_or_file(
        self, source_resource_name: str, destination_resource_name: str, source_path: str, destination_path: str
    ):
        """
        Import a directory or file from one S3 bucket to another.

        This method copies a specified file or an entire directory from a source S3 bucket to
        a destination S3 bucket. If the source path points to a directory (ends with '/'),
        the method ensures the directory structure in the destination bucket before copying.

        Parameters:
            source_resource_name (str): The name of the S3 bucket from which to copy the file or directory.
            destination_resource_name (str): The name of the S3 bucket to which the file or directory will be copied.
            source_path (str): The path of the file or directory in the source bucket.
                            If a directory, it should end with '/'.
            destination_path (str): The path in the destination bucket where the file or directory will be copied.
        """
        try:
            s3_client = boto3.client("s3")

            try:
                s3_client.head_object(Bucket=source_resource_name, Key=source_path)

                if source_path.endswith("/"):
                    await self._ensure_directory_structure(destination_resource_name, destination_path)
                    await self._copy_files_and_subdirectories(
                        source_resource_name, destination_resource_name, source_path, destination_path
                    )
                else:
                    await self._copy_file(
                        source_resource_name, destination_resource_name, source_path, destination_path
                    )

            except ClientError as e:
                if e.response["Error"]["Code"] == "404":
                    raise FileNotFoundError("Source file or directory does not exist.")
                else:
                    raise

            self.status = "success"
            self.message = "Copy operation successful."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.message = str(e)

        return self.get_response()

    def get_file_properties(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the properties of a specified file stored in an S3 bucket.

        This method uses the `head_object` operation to obtain metadata and properties
        associated with an object in S3. The properties include details such as the
        file size, last modified date, content type, and other metadata, which can be
        useful for understanding the characteristics of the file without downloading it.

        Parameters:
            resource_name (str): The name of the S3 bucket where the file is stored.
            resource_path (str): The key (path) of the file whose properties are to be retrieved.
        """
        try:
            response = self.s3_client.head_object(Bucket=resource_name, Key=resource_path)
            self.data = response
            self.status = "success"
            self.message = "File properties retrieved successfully."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error retrieving file properties: {e}")
            return self.get_response()

    async def generate_sas_token(self, resource_name: str, resource_path: str, expiration: int = 3600) -> str:
        """
        Generates a presigned URL for accessing an object in an S3 bucket.

        This method allows for the creation of a presigned URL that grants temporary access
        to a specified S3 object. The presigned URL can be used to perform operations such
        as downloading the object without needing AWS credentials. The expiration time for
        the URL can be customized.

        Parameters:
            resource_name (str): The name of the S3 bucket where the object is stored.
            resource_path (str): The key (path) of the S3 object for which the presigned URL is generated.
            expiration (int): The duration (in seconds) for which the presigned URL is valid.
                            Defaults to 3600 seconds (1 hour).

        Returns:
            str: A presigned URL that can be used to access the specified object, or
                None if the operation fails.
        """
        s3_client = boto3.client("s3")

        try:
            response = s3_client.generate_presigned_url(
                "get_object", Params={"Bucket": resource_name, "Key": resource_path}, ExpiresIn=expiration
            )
            return response

        except ClientError as e:
            logging.debug(f"Failed to generate presigned URL for S3: {e}")
            return None

    def get_available_directories_in_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Lists all available directories and files in a specified path within an S3 bucket.

        This method retrieves the contents of a specified path in an S3 bucket and returns
        a list of files and directories under that path. The results can be used to explore
        the structure of the bucket and its contents.

        Parameters:
            resource_name (str): The name of the S3 bucket from which to list directories.
            resource_path (str): The prefix (path) within the bucket to filter the objects listed.
        """
        try:
            response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=resource_path)
            contents = response.get("Contents", [])
            self.data = contents
            self.status = "success"
            self.message = "Files listed successfully."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error listing files: {e}")
            return self.get_response()

    def get_file_data_from_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves and parses the content of a specified file from an S3 bucket.

        This method fetches a file from the S3 bucket using the provided key, reads its content,
        and attempts to decode it as JSON. The file content is expected to be in a format where
        each line is a separate JSON object. The parsed content is stored for further use.

        Parameters:
            resource_name: Bucket Name
            resource_path (str): The key (path) of the file in the S3 bucket to be retrieved.
        """
        try:
            response = self.s3_client.get_object(Bucket=resource_name, Key=resource_path)
            file_content = response["Body"].read().decode("utf-8")
            lines = file_content.splitlines()
            self.data = [json.loads(line) for line in lines]
            self.status = "success"
            self.message = "File data retrieved successfully."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error retrieving file data: {e}")
            return self.get_response()
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            return self.get_response()

    def get_text_file_data_from_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the content of a specified text file from an S3 bucket.

        This method fetches a text file from the S3 bucket using the provided key and reads
        its content. The content is split into lines and stored for further use.

        Parameters:
            resource_name: Bucket Name
            resource_path (str): The key (path) of the text file in the S3 bucket to be retrieved.
        """
        try:
            response = self.s3_client.get_object(Bucket=resource_name, Key=resource_path)
            file_content = response["Body"].read().decode("utf-8")
            lines = file_content.splitlines()
            self.data = lines
            self.status = "success"
            self.message = "Text file data retrieved successfully."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error retrieving text file data: {e}")
            return self.get_response()

    def get_raw_file_data_from_specific_path(self, resource_name: str, resource_path: str) -> dict:
        """
        Retrieves the raw binary content of a specified file from an S3 bucket.

        This method fetches a file from the S3 bucket using the provided key and reads
        its raw binary content, which can be useful for handling non-text files (e.g., images, videos).

        Parameters:
            resource_name: Bucket Name
            resource_path (str): The key (path) of the file in the S3 bucket to be retrieved.
        """
        try:
            response = self.s3_client.get_object(Bucket=resource_name, Key=resource_path)
            file_content = response["Body"].read()
            self.data = file_content
            self.status = "success"
            self.message = "Raw file data retrieved successfully."
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error retrieving raw file data: {e}")
            return self.get_response()

    def get_csv_file_data_from_specific_path(self, resource_name: str, resource_path: str, fields=None, labels={}):
        """
        Retrieves data from a specified CSV file stored in an S3 bucket.

        This method fetches a CSV file using the provided key, reads its content,
        and parses it into a list of dictionaries. It can optionally filter the
        fields to return and apply custom labels to the fields.

        Parameters:
            resource_name (str): Bucket Name
            resource_path (str): The key (path) of the CSV file in the S3 bucket to be retrieved.
            fields (list, optional): A list of fields to include in the returned data.
                                    If None, all fields will be included.
            labels (dict, optional): A dictionary mapping original field names to new labels.
                                    If a field name exists in the labels dictionary,
                                    the new label will be used in the output.
        """
        try:
            response = self.s3_client.get_object(Bucket=resource_name, Key=resource_path)
            file_content = response["Body"].read().decode("utf-8")
            csv_reader = csv.DictReader(io.StringIO(file_content))
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
            self.message = "CSV data retrieved successfully."
            self.data = data
            return self.get_response()
        except (BotoCoreError, ClientError) as e:
            logging.error(f"Error retrieving CSV data: {e}")
            return self.get_response()
        except json.JSONDecodeError:
            logging.error("Error decoding JSON.")
            return self.get_response()

    async def get_directory_tree(
        self, resource_name: str, resource_path: str = "", parent_node_id: int = None
    ) -> List[Dict]:
        """
        retrieves the directory tree structure from a specified S3 bucket.

        This method builds a hierarchical representation of the directory and file structure
        within an S3 bucket, starting from a given prefix. It uses pagination to handle large
        sets of results and organizes the data into a nested format.

        Parameters:
            resource_name (str): The name of the S3 bucket from which to retrieve the directory tree.
            resource_path (str, optional): The prefix (directory path) to start listing from.
                                    Defaults to an empty string, which lists from the root.
            parent_node_id (int, optional): The ID of the parent node in the tree structure.
                                            Useful for maintaining hierarchy in nested structures.

        Returns:
            List[Dict]: A list of dictionaries representing the directory tree. Each dictionary
                        contains the following keys:
                        - "name" (str): The name of the directory or file.
                        - "selected" (bool): Indicates whether the node is selected (initially False).
                        - "nodeId" (int): A unique identifier for the node.
                        - "icon" (str): An icon representing the type of the node (e.g., "folder").
                        - "parentNodeId" (int): The ID of the parent node (or None for root nodes).
                        - "child" (list): A list of child nodes (subdirectories or files),
                                        or None if there are no children.
        """
        try:
            paginator = self.s3_client.get_paginator("list_objects_v2")
            operation_params = {"Bucket": resource_name, "Prefix": resource_path, "Delimiter": "/"}

            tree = []
            for page in paginator.paginate(**operation_params):
                for prefix in page.get("CommonPrefixes", []):
                    self.node_counter += 1
                    node_id = self.node_counter
                    node = {
                        "name": prefix["Prefix"].split("/")[-2],
                        "selected": False,
                        "nodeId": node_id,
                        "icon": "folder",
                        "parentNodeId": parent_node_id,
                        "child": None,
                    }
                    subtree = await self.get_directory_tree(resource_name, prefix["Prefix"], parent_node_id=node_id)
                    node["child"] = subtree["data"]
                    tree.append(node)
                for obj in page.get("Contents", []):
                    self.node_counter += 1
                    node_id = self.node_counter
                    node = {
                        "name": obj["Key"].split("/")[-1],
                        "selected": False,
                        "nodeId": node_id,
                        "icon": await self.get_file_icon(obj["Key"]),
                        "parentNodeId": parent_node_id,
                        "child": None,
                    }
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
        determines the icon type for a given file based on its MIME type.

        This method uses the file name to guess the MIME type and returns a corresponding
        icon representation. If the MIME type is not recognized, a default icon type is returned.

        Parameters:
            file_name (str): The name of the file for which to determine the icon type.
        """
        mime_type, _ = mimetypes.guess_type(file_name)

        if mime_type:
            mime_main_type, mime_subtype = mime_type.split("/")
            return f"{mime_subtype}_file"
        else:
            return "file"

    async def get_directory_last_modified(self, resource_name: str, directory_path: str):
        """
        retrieves the last modified timestamp and total size of all objects
        within a specified directory in an S3 bucket.

        This method lists all objects under the specified prefix (directory path) and calculates
        the total size of these objects while identifying the most recently modified object.

        Parameters:
            resource_name (str): The name of the S3 bucket from which to retrieve object information.
            directory_path (str): The prefix (directory path) within the S3 bucket to filter objects.
        """
        try:
            total_size = 0
            last_modified = None

            response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=directory_path)

            if "Contents" in response:
                for obj in response["Contents"]:
                    total_size += obj["Size"]
                    if not last_modified or obj["LastModified"] > last_modified:
                        last_modified = obj["LastModified"]

            if last_modified:
                last_modified_str = last_modified.isoformat()
                return last_modified_str, total_size

            return None
        except Exception as e:
            logging.debug(f"Failed to retrieve last modified timestamp: {e}")
            return None

    def get_share_directory_path(self, resource_name: str, project_id: int) -> str:
        """
        Retrieves the S3 directory path for a specified project ID within a given S3 bucket.

        This method checks for the existence of a directory corresponding to the provided
        project ID in the specified S3 bucket. If the directory exists, it returns the
        path; otherwise, it raises an exception.

        Parameters:
            resource_name (str): The name of the S3 bucket to search for the directory.
            project_id (int): The project ID used to construct the directory path.

        Returns:
            str: The S3 directory path for the specified project ID in the format "<project_id>/",
                or None if an error occurs during retrieval.
        """
        try:
            prefix = f"{project_id}/"

            response = self.s3_client.list_objects_v2(Bucket=resource_name, Prefix=prefix)

            if "Contents" in response:
                return prefix
            else:
                raise ValueError(f"Directory with project ID {project_id} does not exist in bucket {resource_name}")

        except Exception as e:
            logging.debug(f"Failed to get S3 directory path for project {project_id}: {e}")
            return None

    async def zip_directory_in_fileshare(self, resource_name: str, source_dir: str, temp_zip_path: str):
        """
        Zips the contents of a specified directory in an S3 bucket and uploads the zip file back to the S3 bucket.

        This method retrieves all files and subdirectories under the specified directory in the given S3 bucket,
        compresses them into a zip file, and uploads the resulting zip file to the S3 bucket at the specified key.

        Parameters:
            resource_name (str): The name of the S3 bucket containing the directory to zip.
            source_dir (str): The path of the directory in the S3 bucket to zip.
            temp_zip_path (str): The key under which the resulting zip file will be stored in the S3 bucket.
        """
        s3_client = boto3.client("s3")
        zip_buffer = BytesIO()

        try:
            with zipfile.ZipFile(zip_buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as zip_archive:

                async def add_directory_to_zip(bucket_name, prefix):
                    continuation_token = None
                    while True:
                        if continuation_token:
                            response = s3_client.list_objects_v2(
                                Bucket=bucket_name, Prefix=prefix, ContinuationToken=continuation_token
                            )
                        else:
                            response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

                        if "Contents" in response:
                            tasks = []
                            for obj in response["Contents"]:
                                key = obj["Key"]
                                if key.endswith("/"):
                                    zip_archive.writestr(f"{key}", "")
                                else:
                                    tasks.append(add_file_to_zip(bucket_name, key, zip_archive))
                            await asyncio.gather(*tasks)

                        continuation_token = response.get("NextContinuationToken")
                        if not continuation_token:
                            break

                async def add_file_to_zip(bucket_name, key, zip_archive):
                    try:
                        response = s3_client.get_object(Bucket=bucket_name, Key=key)
                        file_data = response["Body"].read()
                        zip_archive.writestr(key, file_data)
                    except Exception as e:
                        logging.debug(f"Error downloading file {key}: {str(e)}")

                await add_directory_to_zip(resource_name, source_dir)

            zip_buffer.seek(0)

            s3_client.put_object(Bucket=resource_name, Key=temp_zip_path, Body=zip_buffer.getvalue())

            return temp_zip_path

        except Exception as e:
            logging.debug(f"Error zipping the directory: {e}")
            return None
