# Introduction - WIP

The File ingestion module provides an abstraction to retrieve files from a storage account. The module supports data ingestion from the following sources -

- Azure Storage Blob.
- Amazon S3 (Simple Storage Service)

# Sample Code

## Azure Blob Storage

```
# Azure Storage Blob
from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
ingested_data = get_ingested_data(file_path=f'<container_name>/<file_name.csv>',
    datasource_type='azure_storage_blob',
    connection_uri='connection_string_here')
```

## Amazon S3

```
# Amazon S3
from codex_widget_factory_lite.data_connectors.file_system import get_ingested_data
ingested_data = get_ingested_data(file_path=f'bucket_1/data.csv', datasource_type='amazon_s3')
ingested_data = get_ingested_data(file_path=f'bucket_1/folder_1/ind_file.csv', datasource_type='amazon_s3')
```

# Parameters
- `file_path` (string, required) : The path where the required file is located

    - If 'string', specify the path of the file.
    - If 'list', specify the path for each of the multiple files as list.

        * If single file has to be ingested, `file_path = f'container_name/folder1/.../file.csv'`
        * If multiple files have to be stored -

            ```
            file_path = [f'container_name/folder1/.../file.csv',
                         f'container_name/folder1/.../file2.csv',
                         f'container_name/folder2/.../file3.csv']
            ```
    - It supports to ingest .csv, .xlsx, .pkl, .json files.
    - If the blob is inside a folder of container then specify the path in the following way.
        eg : If blob is inside folder of container,
                -f'container_name/folder_1/blob_1.pkl'
             If blob is two levels inside the folder of container,
                -f'container_name/folder_1/folder_2/blob_2.pkl'


- `datasource_type` (string, optional (default='local')) : Supports the following values - `azure_storage_blob`, `amazon_s3`. The storage source where the files to be ingested are stored. Read the below docs, Keyword parameters, to use various additional arguments based on datasource_type.
- `azure_connection_method` (string, optional (default='connection_uri')): In cases where the data source is Azure blob storage, it can take the following `connection_uri`, `shared_access_key`, `client_secret_credentials`. Provide one of the connection method listed above. Read the below docs, Method Specific Additional parameters to use various connection methods.
- `display_filenames` (bool, optional (default=True)): Displays all the file names present in the path location.

- `kwargs` (optional) : The additional arguments required based on datasource_type, data_type.

    - Amazon S3 Additional parameters

        - `aws_access_key` (string) : The access key to use when creating the client.
        - `aws_secret_access_key` (string) :  The secret key to use when creating the client.
        - `aws_session_token` (string, optional) : The session token to use when creating the client.
        - `aws_region` (string, optional) : The name of the region associated with the client. A client is associated with a single region.

    - Azure Connection Method Specific Additional parameters

        - Method 1 : Connect and store using Shared Access Key

            - `account_url` (string) : Name of storage account, the account url to connect.
            - `account_key` (string): Account key (Shared access key) of storage account, to use as credential.

        -  Method 2 : Connect and store using Client Secret Credentials
            - `account_url` (string) : Name of storage account, the account url to connect.
            - `client_id` (string) : Client ID to initialize ClientSecretCredentials.
            - `tenant_id` (string) : Tenant ID to initialize ClientSecretCredentials.
            - `client_secret` (str) : Secret name to initialize ClientSecretCredentials.

        - Method 3 : Establish connection and store using Connection String
        `connection_uri` (string) : The connection uri (connection_string) corresponding to the azure blob storage account.
