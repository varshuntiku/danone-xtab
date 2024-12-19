from abc import ABC, abstractmethod
from typing import Optional


class FileManagerInterface(ABC):
    @abstractmethod
    def download_file_from_specific_path(self, resource_name: str, resource_path: str, local_file_path: str):
        """
        Download a file from a specific path within a storage resource to a local destination.

        Parameters:
        resource_name: Represents the name of the resource -
                            either the share name (for Azure File Share),
                            container name (for Azure Blob),
                            or bucket name (for S3).
        resource_path: The path to the file within the resource -
                            corresponds to the directory path and file name (for Azure File Share),
                            blob name (for Azure Blob), or object key (for S3).
        local_file_path: The full local path where the downloaded file will be saved.
        """
        pass

    @abstractmethod
    async def upload_file_to_specific_path(
        self, resource_name: str, resource_path: str, local_file_path=None, file_stream=None
    ):
        """
        upload a local file or file stream to a specific path within a storage resource.

        Parameters:
        resource_name: Represents the name of the resource -
                    either the share name (for Azure File Share),
                    container name (for Azure Blob), or
                    bucket name (for S3).
        resource_path: The path within the resource where the file will be uploaded -
                    corresponds to the directory path and file name (for Azure File Share),
                    blob name (for Azure Blob), or object key (for S3).
        local_file_path: The full local path of the file to upload. If provided, this will be used instead of `file_stream`.
        file_stream: A file-like object that can be read to upload data. If provided, `local_file_path` should be `None`.
        """
        pass

    @abstractmethod
    async def _ensure_directory_structure(self, resource_name: str, resource_path: str):
        """
        Ensure that the specified directory structure exists in the given resource.

        This method checks for the existence of the specified directory structure
        within the designated resource (e.g., Azure File Share, Azure Blob Storage, or Amazon S3).
        If the structure does not exist, it creates the necessary directories.

        Parameters:
            resource_name (str): The name of the resource (share/container/bucket)
                                where the directory structure should be ensured.
            resource_path (str): The path to the directory structure that needs to be
                                verified or created in the resource.
        """
        pass

    @abstractmethod
    async def upload_multipart_file_to_specific_path(self, resource_name: str, resource_path: str, file):
        """
        upload a multipart file to a specific path within a storage resource.

        Parameters:
        resource_name: Represents the name of the resource -
                    either the share name (for Azure File Share),
                    container name (for Azure Blob), or
                    bucket name (for S3).
        resource_path: The path within the resource where the file will be uploaded -
                    corresponds to the directory path and file name (for Azure File Share),
                    blob name (for Azure Blob), or object key (for S3).
        file: The multipart file object to be uploaded. This is typically used for uploading files
            received from a client in a web application.
        """
        pass

    @abstractmethod
    def upload_file_as_data_to_specific_path(self, resource_name: str, resource_path: str, data):
        """
        Upload raw data as a file to a specific path within a storage resource.

        Parameters:
        resource_name: Represents the name of the resource -
                    either the share name (for Azure File Share),
                    container name (for Azure Blob), or
                    bucket name (for S3).
        resource_path: The path within the resource where the data will be uploaded -
                    corresponds to the directory path and file name (for Azure File Share),
                    blob name (for Azure Blob), or object key (for S3).
        data: The raw data to be uploaded as a file. This is generally used for uploading
            file content directly from memory instead of a file on disk.
        """
        pass

    @abstractmethod
    def delete_file_from_specific_directory(
        self, resource_name: str, resource_path: str, file_name: Optional[str] = None
    ):
        """
        Delete a file from a specific directory or container based on the storage type.

        Parameters:
        resource_name: Represents the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: Represents the directory path (for Azure File Share) or blob/object key.
        file_name: (Optional) Only used for Azure File Share to specify the file name.
        """
        pass

    @abstractmethod
    def delete_sub_directory_from_specific_directory(
        self, resource_name: str, resource_path: str, sub_directory_name: Optional[str] = None
    ):
        """
        Delete a subdirectory from a specific directory or container based on the storage type.

        Parameters:
        resource_name: Represents the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: Represents the directory path (for Azure File Share) or prefix (for Azure Blob and S3).
        sub_directory_name: (Optional) Only used for Azure File Share to specify the subdirectory name to delete.
        """
        pass

    @abstractmethod
    def delete_directory_from_share(self, resource_name: str, resource_path: str):
        """
        Delete an entire directory from a specified storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource - such as the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path of the directory to delete within the resource -
                    corresponds to the directory path (for Azure File Share), or prefix (for Azure Blob and S3).
        """
        pass

    @abstractmethod
    async def _copy_file(
        self, source_resource_name: str, destination_resource_name: str, source_path: str, destination_path: str
    ):
        """
        copy a file from a source path within one storage resource to a destination path in another (or the same) resource.

        Parameters:
        source_resource_name: Name of the source storage resource - such as the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        destination_resource_name: Name of the destination storage resource where the file will be copied.
        source_path: The file path within the source resource.
        destination_path: The target path in the destination resource.
        """
        pass

    @abstractmethod
    async def _copy_files_and_subdirectories(
        self,
        source_resource_name: str,
        destination_resource_name: str,
        source_directory_path: str,
        destination_directory_path: str,
    ):
        """
        copy files and subdirectories from a source directory within one storage resource
        to a destination directory in another (or the same) resource.

        Parameters:
        source_resource_name: Name of the source storage resource - such as the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        destination_resource_name: Name of the destination storage resource where the files and subdirectories will be copied.
        source_directory_path: Path of the source directory containing the files and subdirectories to copy.
        destination_directory_path: Target path in the destination resource for the copied files and subdirectories.
        """
        pass

    @abstractmethod
    async def delete_directory_tree_from_share(self, resource_name: str, directory_path: str):
        """
        delete an entire directory tree from a storage resource.

        Parameters:
        resource_name: Name of the storage resource - such as the share name (for Azure File Share),
                    container name (for Azure Blob), or bucket name (for S3).
        directory_path: The path of the directory tree to be deleted within the specified resource.
        """
        pass

    @abstractmethod
    def create_directory(self, resource_name: str, directory_name: str):
        """
        Create a new directory within the specified storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        directory_name: The name of the directory to be created within the specified resource.
        """
        pass

    @abstractmethod
    def create_sub_directory(self, resource_name: str, directory_path: str, sub_directory_name: str):
        """
        Create a subdirectory within a specified directory in the storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        directory_path: The path of the existing directory within the resource where the subdirectory will be created.
        sub_directory_name: The name of the subdirectory to be created within the specified directory path.
        """
        pass

    @abstractmethod
    def create_share(
        self,
        resource_name: str,
        access_tier: Optional[str] = None,
        quota: Optional[int] = None,
        public_access: Optional[str] = None,
        region: Optional[str] = None,
    ):
        """
        Create a share, container, or bucket based on the storage type.

        Parameters:
            resource_name: Represents the share name (for Azure File Share),
                        container name (for Azure Blob), or bucket name (for S3).
            access_tier: (Optional) The access tier for Azure File Share (e.g., 'Hot', 'Cool').
            quota: (Optional) The quota for Azure File Share in GB.
            public_access: (Optional) Public access level for Azure Blob (e.g., 'Blob', 'Container').
            region: (Optional) The region for S3 bucket creation.
        """
        pass

    @abstractmethod
    def delete_share(self, resource_name: str):
        """
        Delete a share, container, or bucket based on the storage type.

        This method removes the specified resource from the storage service. The resource type is determined
        by the storage backend (Azure File Share, Azure Blob Storage, or Amazon S3).

        Parameters:
            resource_name (str): The name of the share (for Azure File Share),
                                container (for Azure Blob), or bucket (for S3) to delete.
        """
        pass

    @abstractmethod
    async def _delete_files_and_subdirectories(
        self,
        resource_name: str,
        directory: Optional[str] = None,
        directory_path: Optional[str] = None,
        prefix: Optional[str] = None,
    ):
        """
        Delete files and subdirectories in the specified resource based on the storage type.

        This method acts as a common interface for deleting files and subdirectories
        across different storage types: Azure File Share, Azure Blob Storage, and Amazon S3.

        Parameters:
            resource_name (str): The name of the resource (share/container/bucket).
            directory (str, optional): The directory for Azure File Share.
            directory_path (str, optional): The directory path for Azure Blob Storage.
            prefix (str, optional): The prefix for S3 bucket.
        """
        pass

    @abstractmethod
    async def import_directory_or_file(
        self, source_resource_name: str, destination_resource_name: str, source_path: str, destination_path: str
    ):
        """
        Import a directory or file from one resource to another.

        This method facilitates the transfer of a directory or file
        from a specified source resource (e.g., Azure File Share, Azure Blob Storage,
        or Amazon S3) to a designated destination resource.

        Parameters:
            source_resource_name (str): The name of the source resource
                                        (share/container/bucket) from which to import.
            destination_resource_name (str): The name of the destination resource
                                            (share/container/bucket) to which the
                                            directory or file will be imported.
            source_path (str): The path to the directory or file in the source resource.
            destination_path (str): The path where the directory or file will be imported
                                    in the destination resource.
        """
        pass


class MetadataInterface(ABC):
    @abstractmethod
    def get_file_properties(self, resource_name: str, resource_path: str):
        """
        Retrieve the properties of a file within a specified storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the file within the resource -
                    corresponds to the directory path and file name (for Azure File Share),
                    blob name (for Azure Blob), or object key (for S3).

        Returns:
        A dictionary or response object containing file properties, such as size, last modified date,
        metadata, and other relevant details, as provided by the storage service.
        """
        pass

    @abstractmethod
    async def generate_sas_token(self, resource_name: str, resource_path: str):
        """
        Generate a SAS token for accessing a specific file or object in the storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the file or object within the resource -
                    file path (for Azure File Share), blob name (for Azure Blob), or object name (for S3).

        Returns:
        A string representing the SAS token granting access to the specified resource path.
        """
        pass

    @abstractmethod
    def get_available_directories_in_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve a list of available directories within a specified path in the storage resource.

        Parameters:
        resource_name: Represents the name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path within the resource where directories are being queried -
                    directory path (for Azure File Share), prefix (for Azure Blob and S3).

        Returns:
        A list of directories available within the specified resource path.
        """
        pass

    @abstractmethod
    def get_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve data from a specific file located in the storage resource.

        Parameters:
        resource_name: The name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the file within the resource -
                    directory path and file name (for Azure File Share), blob name (for Azure Blob), or object key (for S3).

        Returns:
        The content or data of the specified file within the storage resource.
        """
        pass

    @abstractmethod
    def get_text_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve text data from a specific file located in the storage resource.

        Parameters:
        resource_name: The name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the text file within the resource -
                    directory path and file name (for Azure File Share), blob name (for Azure Blob), or object key (for S3).

        Returns:
        The text content of the specified file within the storage resource.
        """
        pass

    @abstractmethod
    def get_raw_file_data_from_specific_path(self, resource_name: str, resource_path: str):
        """
        Retrieve raw binary data from a specific file located in the storage resource.

        Parameters:
        resource_name: The name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the file within the resource -
                    directory path and file name (for Azure File Share), blob name (for Azure Blob), or object key (for S3).

        Returns:
        The raw binary content of the specified file within the storage resource.
        """
        pass

    @abstractmethod
    def get_csv_file_data_from_specific_path(self, resource_name: str, resource_path: str, fields=None, labels={}):
        """
        Retrieve CSV data from a specific file in the storage resource, with optional field selection and custom labels.

        Parameters:
        resource_name: The name of the storage resource -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path to the CSV file within the resource -
                    directory path and file name (for Azure File Share), blob name (for Azure Blob), or object key (for S3).
        fields: (Optional) A list of specific fields (columns) to retrieve from the CSV file. If not provided, all fields are retrieved.
        labels: (Optional) A dictionary to map existing field names to custom labels, where the key is the original field name and the value is the desired label.

        Returns:
        Processed CSV data based on the specified fields and labels.
        """
        pass

    @abstractmethod
    async def get_directory_tree(self, resource_name: str, resource_path: str, parent_node_id: int):
        """
        Retrieve the directory tree structure from a specified path within the storage resource.

        Parameters:
        resource_name: Represents the storage resource name -
                    share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: The path within the resource where the directory tree should start.
        parent_node_id: The ID representing the parent node in the directory structure, allowing hierarchical organization.

        Returns:
        An result containing the directory tree structure, including folders and files under the specified path.
        """
        pass

    @abstractmethod
    async def get_file_icon(self, file_name: str):
        """
        Retrieve the icon representation for a specified file type based on its file name.

        Parameters:
        file_name: The name of the file, including its extension, which determines the icon type to return.

        Returns:
        An result containing the icon data or a reference to the icon that represents the file type.
        """
        pass

    @abstractmethod
    async def get_directory_last_modified(self, resource_name: str, directory_path: str):
        """
        Retrieve the last modified timestamp of a specified directory or container based on the storage type.

        Parameters:
        resource_name: Represents the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        resource_path: Represents the directory path (for Azure File Share) or prefix (for Azure Blob and S3).
        """
        pass

    @abstractmethod
    async def get_share_directory_path(self, resource_name: str, project_id: int):
        """
        Retrieve the directory path for a given resource and project ID.

        Parameters:
        resource_name: Represents the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
        project_id: The project ID for which to retrieve the directory path.
        """
        pass

    @abstractmethod
    async def zip_directory_in_fileshare(self, resource_name: str, source_dir: str, temp_zip_path: str):
        """
        Zip a directory in the specified file share.

        This method creates a ZIP archive of the specified directory within the
        designated file share and saves it to a temporary path.

        Parameters:
            resource_name (str): Represents the share name (for Azure File Share), container name (for Azure Blob), or bucket name (for S3).
            source_dir (str): The path to the directory that needs to be zipped.
            temp_zip_path (str): The path where the resulting ZIP file will be saved.
        """
        pass
