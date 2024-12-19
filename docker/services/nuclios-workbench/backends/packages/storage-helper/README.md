# Storage Helper

A Python package for managing files in Azure Blob Storage, Azure File Share, and AWS S3.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
  - [Using the Storage Class](#using-the-storage-class)
  - [Error Handling](#error-handling)
- [License](#license)

## Installation

By default, installing this package will not include any libraries.

To install Azure Blob Storage support:

```bash
pip install storage-helper[azure_blob]
```

To install Azure File Share support:

```bash
pip install storage-helper[azure_file]
```

To install both Azure Blob Storage and Azure File Share support:

```bash
pip install storage-helper[azure]
```

To install AWS S3 support:

```bash
pip install storage-helper[aws]
```

To install both Azure and AWS S3:

```bash
pip install storage-helper[full]
```

## Usage

### Using the Storage Class

The `Storage` class is the entry point for all storage operations. It allows you to interact with different storage types based on your needs.

#### Azure Blob Storage

```python
from storage_helper.storage import Storage

# Option 1: Initialize with connection string
storage = Storage(
    storage_type="azure_blob",
    conn_str="your_connection_string"
)

# Option 2: Initialize with account name and account key
storage = Storage(
    storage_type="azure_blob",
    account_name="your_account_name",
    account_key="your_account_key"
)

# Option 3: Initialize using DefaultAzureCredential (e.g., for managed identities)
storage = Storage(storage_type="azure_blob")

storage.storage.upload_file_to_specific_path(
        resource_name="my-container",              # Azure Blob container name
        resource_path="remote/blob/path",          # Blob name or path in the container
        local_file_path="path/to/local/file",
        file_stream=None                           # If provided, `local_file_path` should be `None`.
    )
```

#### Azure File Share

```python
from storage_helper import Storage

# Option 1: Using a connection string
storage = Storage(
    storage_type="azure_file",
    conn_str="your_connection_string"
)

# Option 2: Using account name and account key
storage = Storage(
    storage_type="azure_file",
    account_name="your_account_name",
    account_key="your_account_key"
)

# Option 3: Using DefaultAzureCredential
storage = Storage(
    storage_type="azure_file"
)

storage.storage.upload_file_to_specific_path(
        resource_name="my-share",              # Azure file share name
        resource_path="remote/file/path",      # directory path and file name in the share
        local_file_path="path/to/local/file",
        file_stream=None                       # If provided, `local_file_path` should be `None`.
    )
```

#### AWS S3

```python
from storage_helper import Storage

# Initialize the Storage object for AWS S3
storage = Storage(
    storage_type="s3",
    aws_access_key_id="your_access_key_id",
    aws_secret_access_key="your_secret_access_key"
)

storage.storage.upload_file_to_specific_path(
        resource_name="my-bucket",              # AWS S3 bucket name
        resource_path="remote/object-key/path", # object-key in the bucket
        local_file_path="path/to/local/file",
        file_stream=None                        # If provided, `local_file_path` should be `None`.
    )
```

### Error Handling

If you attempt to use a storage class that isn't installed, an `ImportError` will be raised. For example:

```python
# If Azure File Share support is not installed
try:
    storage = Storage("azure_file", account_name='your_account_name', account_key='your_account_key')
except ImportError as e:
    print(e)

This would raise:
ImportError: Azure File Share library (azure-storage-file-share) is not installed.
```

## License
```
This project is licensed under the MIT License.
```
