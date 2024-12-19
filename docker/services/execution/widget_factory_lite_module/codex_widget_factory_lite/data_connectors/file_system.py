#
# Author: Codx AI/ML Team
# TheMathCompany, Inc. (c) 2022
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
import os
import pickle
from io import BytesIO, StringIO
from pathlib import Path

import boto3
import pandas as pd
from azure.common.credentials import ServicePrincipalCredentials
from azure.storage.blob import BlockBlobService
from azure.storage.common import TokenCredential


class BaseFileSystem:
    """
    The BaseFileSystem class has the interface (Abstract Methods) for
    ingestion file system widget, which reads various types of files
    from different data sources.
    """

    def __init__(self, path):
        self.path = Path(path)
        self.inferred_file_type = self.infer_file_type()

    def infer_file_type(self):
        return self.path.suffix.replace(".", "")

    def read_file(self):
        self.file_read_function_mapper = {
            "csv": self._read_csv_file,
            "pkl": self._read_pickle_file,
            "json": self._read_json_file,
            "xls": self._read_excel_file,
            "xlsx": self._read_excel_file,
            "py": self._read_python_file,
        }

        return self.file_read_function_mapper[self.inferred_file_type]()

    def display_file_names(self):
        self._display_file_names()

    # abstract functions, will be created in the respective Filesystem
    def _display_file_names(self):
        raise NotImplementedError("abstract method")

    def _read_csv_file(self):
        raise NotImplementedError("abstract method")

    def _read_excel_file(self):
        raise NotImplementedError("abstract method")

    def _read_json_file(self):
        raise NotImplementedError("abstract method")

    def _read_pickle_file(self):
        raise NotImplementedError("abstract method")

    def _read_python_file(self):
        raise NotImplementedError("abstract method")


class LocalFileSystem(BaseFileSystem):
    """
    The LocalFileSystem class has implementations for reading
    various types of files from Local storage.
    """

    def __init__(self, path, source_type, **kwargs):
        if source_type == "local":
            super().__init__(path)
            self.sheet_name = kwargs.get("sheet_name")

    def _display_file_names(self):
        print(f"\n >>> List of files in directory - {'/'.join(list(self.path.parts[:-1]))} \n")
        os.chdir("/".join(list(self.path.parts[:-1])))
        for blob_i in os.listdir():
            print(blob_i)

    def _read_csv_file(self):
        return pd.read_csv(self.path, low_memory=False)

    def _read_excel_file(self):
        return pd.read_excel(self.path, sheet_name=self.sheet_name, engine="openpyxl")

    def _read_json_file(self):
        return json.load(open(self.path, "r"))

    def _read_pickle_file(self):
        return pickle.load(open(self.path, "rb"))

    def _read_python_file(self):
        return open(self.path).read()


class AzureFileSystem(BaseFileSystem):
    """
    The AzureFileSystem class has implementations for reading
    various types of files from Azure Blob Storage.
    """

    def __init__(self, path, source_type, connection_method, **kwargs):
        if source_type == "azure_storage_blob":
            super().__init__(path)
            self.connection_method = connection_method
            self.blob_service = self._azure_connection_mapping(**kwargs)
            self.sheet_name = kwargs.get("sheet_name")

            self.container_name = self.path.parts[0]
            self.blob_name = "/".join(list(self.path.parts)[1:])

    def _azure_connection_mapping(self, **kwargs):
        if self.connection_method == "client_secret_credential":
            service_credential = ServicePrincipalCredentials(
                tenant=kwargs.get("tenant_id"),
                client_id=kwargs.get("client_id"),
                secret=kwargs.get("client_secret"),
                resource=kwargs.get("resource"),
            )
            token_credential = TokenCredential(service_credential.token["access_token"])
            blobService = BlockBlobService(
                account_name=kwargs.get("account_url"),
                token_credential=token_credential,
            )
        elif self.connection_method == "connection_uri":
            blobService = BlockBlobService(connection_string=kwargs.get("connection_uri"))
        elif self.connection_method == "shared_access_key":
            blobService = BlockBlobService(
                account_name=kwargs.get("account_url"),
                account_key=kwargs.get("account_key"),
            )
        else:
            raise ValueError(f"Azure connection method provided is invalid. Given - {self.connection_method}.")
        return blobService

    def _display_file_names(self):
        print(f"\n >>> List Of Blobs in directory - {'/'.join(list(self.path.parts[:-1]))} \n")
        blob_objects_list = self.blob_service.list_blobs(
            container_name=self.container_name,
            prefix="/".join(self.blob_name.split("/")[:-1]),
        ).items
        for blob_i in blob_objects_list:
            print(blob_i.name.split("/")[-1])

    def _read_csv_file(self):
        blob_data = self.blob_service.get_blob_to_text(container_name=self.container_name, blob_name=self.blob_name)
        return pd.read_csv(StringIO(blob_data.content))

    def _read_excel_file(self):
        blob_data = self.blob_service.get_blob_to_bytes(container_name=self.container_name, blob_name=self.blob_name)
        return pd.read_excel(BytesIO(blob_data.content), sheet_name=self.sheet_name, engine="openpyxl")

    def _read_json_file(self):
        blob_data = self.blob_service.get_blob_to_text(container_name=self.container_name, blob_name=self.blob_name)
        return json.loads(blob_data.content)

    def _read_pickle_file(self):
        blob_data = self.blob_service.get_blob_to_bytes(container_name=self.container_name, blob_name=self.blob_name)
        return pickle.loads(blob_data.content)

    def _read_python_file(self):
        blob_data = self.blob_service.get_blob_to_text(container_name=self.container_name, blob_name=self.blob_name)
        return blob_data.content


class AWSFileSystem(BaseFileSystem):
    """
    The AWSFileSystem class has implementations for reading various
    types of files from Amazon S3 Storage (Simple Storage Service).
    """

    def __init__(self, path, source_type, **kwargs):
        if source_type == "amazon_s3":
            super().__init__(path)
            # self.connection_method = connection_method
            # self.blob_service = self._azure_connection_mapping(**kwargs)
            self.aws_access_key = kwargs.get("aws_access_key")
            self.aws_secret_access_key = kwargs.get("aws_secret_access_key")
            self.region_name = kwargs.get("aws_region", "us-east-1")
            self.aws_session_token = kwargs.get("aws_session_token")
            self.sheet_name = kwargs.get("sheet_name")

            self.bucket_name = self.path.parts[0]
            self.blob_name = "/".join(list(self.path.parts)[1:])

            self._make_s3_client()
            self._make_blob_object()
            self._get_blob_data()

    def _make_s3_client(self):
        self.s3_client = boto3.client(
            service_name="s3",
            region_name=self.region_name,
            aws_access_key_id=self.aws_access_key,
            aws_secret_access_key=self.aws_secret_access_key,
            aws_session_token=self.aws_session_token,
        )

    def _make_blob_object(self):
        self.blob_object = self.s3_client.get_object(Bucket=self.bucket_name, Key=self.blob_name)

    def _get_blob_data(self):
        self.blob_data = self.blob_object["Body"]

    def _display_file_names(self):
        print(f"\n >>> List Of Blobs in directory - {'/'.join(list(self.path.parts[:-1]))} \n")
        blob_objects_list = self.s3_client.list_objects_v2(
            Bucket=self.bucket_name, Prefix="/".join(self.blob_name.split("/")[:-1])
        )["Contents"]
        for blob_i in blob_objects_list:
            print(blob_i["Key"].split("/")[-1])

    def _read_csv_file(self):
        content = self.blob_data.read()
        return pd.read_csv(StringIO(content.decode()))

    def _read_excel_file(self):
        content = self.blob_data.read()
        return pd.read_excel(BytesIO(content), sheet_name=self.sheet_name, engine="openpyxl")

    def _read_json_file(self):
        content = self.blob_data.read()
        return json.loads(content.decode())

    def _read_pickle_file(self):
        content = self.blob_data.read()
        return pickle.loads(content)

    def _read_python_file(self):
        content = self.blob_data.read()
        return content.decode()


class GCPFileSystem(BaseFileSystem):
    pass


def get_ingested_data(
    file_path,
    datasource_type="local",
    azure_connection_method="connection_uri",
    display_filenames=True,
    **kwargs,
):
    """
    Ingest a dataset file(s) from the file-system.
    The module supports data ingestion from the sources,
        - Local storage.
        - Azure Storage Blob.
        - Amazon S3 (Simple Storage Service)

    If multiple files are required to be ingested, provide the list
    of file paths for the file path argument.

    Currently supported formats
    ---------------------------
    Comma Seperated Values - csv
    Excel - xls, xlsx
    Pickle - pkl
    JSON - json
    Python - py

    Parameters
    ----------
    General Parameters
    ------------------
    file_path : string, required
        The path where the required file is located.
        - If 'string', specify the path of the file.
        - If 'list', specify the path for each of the multiple files as list.

        It supports to ingest .csv, .xlsx, .pkl, .json files.

        -If the blob is inside a folder of container then specify the path
        in the following way.
        eg : If blob is inside folder of container,
                -f'container_name/folder_1/blob_1.pkl'
             If blob is two levels inside the folder of container,
                -f'container_name/folder_1/folder_2/blob_2.pkl'

        -If single file has to be ingested,
            file_path = f'C:/My_Drive/.../File_1.json'
            file_path = f'container_name/folder1/.../file.csv'
        -If multiple files have to be stored,
            file_path = [f'C:/My_Drive/.../File_1.csv',
                         f'C:/My_Drive/.../File_2.pkl',
                         f'C:/My_Drive/folder1/.../File_3.pkl']
            file_path = [f'container_name/folder1/.../file.csv',
                         f'container_name/folder1/.../file2.csv',
                         f'container_name/folder2/.../file3.csv']
    datasource_type : string, optional (default='local')
        {'local', 'azure_storage_blob', 'amazon_s3'}
        The storage source where the files to be ingested are stored.
        Read the below docs, Keyword parameters, to use various
        additional arguments based on datasource_type.
    azure_connection_method : string, optional (default=None)
        {'connection_uri', 'shared_access_key', 'client_secret_credentials'}
        The argument is required when the datasource_type is 'azure_storage_blob'
        Provide one of the connection method listed above.
        Read the below docs, Method Specific Additional parameters
        to use various connection methods.
    display_filenames : bool, optional (default=True)
        Displays all the file names present in the path location.
    kwargs : optional
        The additional arguments required based on datasource_type, data_type.

        Provide sheet_name as key-word arg, if specific sheet is required
        when ingesting excel file.

        Read the below detailed document, of parameters required for respective
        azure connection method.

    Keyword Parameters
    _________________________________________________________________________
    Amazon S3 Additional parameters

    aws_access_key: string
        The access key to use when creating the client.
    aws_secret_access_key: string
        The secret key to use when creating the client.
    aws_session_token: string, optional
        The session token to use when creating the client.
    aws_region: string, optional
        The name of the region associated with the client.
        A client is associated with a single region.
    __________________________________________________________________________
    Azure Connection Method Specific Additional parameters

    Method 1 : Connect and store using Shared Access Key
    ----------------------------------------------------
    account_url: string,
        Name of storage account, the account url to connect.
    account_key: string,
        Account key (Shared access key) of storage account, to use as credential.

    Method 2 : Connect and store using Client Secret Credentials
    ------------------------------------------------------------
    account_url: string,
        Name of storage account, the account url to connect.
    client_id : string,
        Client ID to initialize ClientSecretCredentials.
    tenant_id : string,
        Tenant ID to initialize ClientSecretCredentials.
    client_secret : str,
        Secret name to initialize ClientSecretCredentials.

    Method 3 : Establish connection and store using Connection String
    -----------------------------------------------------------------
    connection_uri : string,
        The connection uri (connection_string) corresponding to the azure blob
        storage account.

    Usage
    -----
    -Local
    >>> from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
    >>> ingested_data = get_ingested_data(file_path=f'data.csv', datasource_type='local')
    >>> ingested_data = get_ingested_data(file_path=f'C:/My_space/ind_file.csv', datasource_type='local')
    >>>

    -Azure Storage Blob
    >>> from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
    >>> ingested_data = get_ingested_data(file_path=f'container_1/data.csv', datasource_type='azure_storage_blob')
    >>> ingested_data = get_ingested_data(file_path=f'container_1/folder_1/ind_file.csv', datasource_type='azure_storage_blob')
    >>>

    -Amazon S3
    >>> from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
    >>> ingested_data = get_ingested_data(file_path=f'bucket_1/data.csv', datasource_type='amazon_s3')
    >>> ingested_data = get_ingested_data(file_path=f'bucket_1/folder_1/ind_file.csv', datasource_type='amazon_s3')
    >>>

    Returns
    -------
    A pandas dataframe or Dictionary (dict) or Python code string or Type of pkl content.
    """

    if isinstance(file_path, str):
        datasource_type_mapping = {
            "local": LocalFileSystem(path=file_path, source_type=datasource_type, **kwargs),
            "azure_storage_blob": AzureFileSystem(
                path=file_path,
                source_type=datasource_type,
                connection_method=azure_connection_method,
                **kwargs,
            ),
            "amazon_s3": AWSFileSystem(path=file_path, source_type=datasource_type, **kwargs),
        }
        file_source_obj = datasource_type_mapping[datasource_type]
        if display_filenames:
            file_source_obj.display_file_names()
        return file_source_obj.read_file()
    else:
        ingested_data_dict = {}
        previous_path_set = []
        for path_i in file_path:
            file_name = Path(path_i).parts[-1].split(".")[0]
            if display_filenames:
                is_display_names = (
                    False
                    if [path_j for path_j in previous_path_set if not set(Path(path_i).parts[:-1]) - path_j]
                    else True
                )
            previous_path_set.append(set(Path(path_i).parts[:-1]))
            ingested_data_dict[file_name] = get_ingested_data(
                file_path=path_i,
                datasource_type=datasource_type,
                azure_connection_method=azure_connection_method,
                display_filenames=is_display_names,
                **kwargs,
            )

        return ingested_data_dict


setattr(
    get_ingested_data,
    "DEFAULT_CODE",
    """

# Azure Storage Blob
from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
ingested_data = get_ingested_data(file_path=f'container_1/data.csv', datasource_type='azure_storage_blob')
ingested_data = get_ingested_data(file_path=f'container_1/folder_1/ind_file.csv', datasource_type='azure_storage_blob')

# Amazon S3
from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
ingested_data = get_ingested_data(file_path=f'bucket_1/data.csv', datasource_type='amazon_s3')
ingested_data = get_ingested_data(file_path=f'bucket_1/folder_1/ind_file.csv', datasource_type='amazon_s3')

""",
)
