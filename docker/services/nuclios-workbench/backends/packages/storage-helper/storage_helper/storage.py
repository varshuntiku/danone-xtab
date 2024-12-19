from storage_helper.aws.aws_s3_service import AWSS3Service
from storage_helper.azure.azure_blob_service import AzureBlobService
from storage_helper.azure.azure_fileshare_service import AzureFileShareService


class StorageFactory:
    @staticmethod
    def create_storage(storage_type: str, **kwargs):
        if storage_type == "azure_blob":
            return AzureBlobService(**kwargs)
        elif storage_type == "azure_file":
            return AzureFileShareService(**kwargs)
        elif storage_type == "s3":
            return AWSS3Service(**kwargs)
        else:
            raise ValueError(f"Unsupported storage type: {storage_type}")


class Storage:
    def __init__(self, storage_type: str, **kwargs):
        self.storage_type = storage_type.lower()
        self.storage = StorageFactory.create_storage(self.storage_type, **kwargs)
