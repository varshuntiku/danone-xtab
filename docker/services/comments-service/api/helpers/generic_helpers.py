import logging
import mimetypes
from datetime import datetime, timedelta

from api.configs.settings import get_app_settings
from api.constants.error_messages import GeneralErrors
from api.middlewares.error_middleware import GeneralException
from azure.storage.blob import BlobPermissions, BlockBlobService
from azure.storage.blob.models import ContentSettings
from fastapi import status

settings = get_app_settings()


class GenericHelper:
    def upload_blob(
        self,
        file: bytes,
        filename: str,
        upload_with_content_type: dict | bool = False,
        file_path: str = False,
        dynamic_blob_properties: dict = False,
        time_delta: timedelta = timedelta(hours=1),
    ):
        """Uploads the given file to the blob storage

        Args:
            file: file to be uploaded
            filename: name of the file

        Returns:
            blob url
        """
        try:
            connection_string = (
                dynamic_blob_properties["CONNECTION_STRING"]
                if dynamic_blob_properties
                else settings.DATA_AZURE_CONNECTION_STRING
            )
            container_name = (
                dynamic_blob_properties["CONTAINER"] if dynamic_blob_properties else settings.DATA_FOLDER_PATH
            )
            blob_service = BlockBlobService(connection_string=connection_string)
            artifacts_container = f"{container_name}"

            if upload_with_content_type:
                file_content_type = mimetypes.guess_type(url=filename)
                if file_content_type[0] is not None:
                    content_header = ContentSettings(content_type=file_content_type[0])

                    final_file_path = filename
                    if file_path:
                        final_file_path = file_path + filename

                    blob_service.create_blob_from_bytes(
                        artifacts_container, final_file_path, file, content_settings=content_header
                    )

                    if dynamic_blob_properties:
                        return f"{final_file_path}"
                    else:
                        return self.get_blob(final_file_path, time_delta)
                else:
                    raise Exception("Invalid file type, unable to extract the mimetype of file")
            else:
                final_file_path = filename
                if file_path:
                    final_file_path = file_path + filename
                blob_service.create_blob_from_bytes(artifacts_container, final_file_path, file)
                if dynamic_blob_properties:
                    return f"{final_file_path}"
                else:
                    return self.get_blob(final_file_path, time_delta)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GeneralErrors.BLOB_UPLOAD_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_blob(self, blob_name: str, time_delta: timedelta = timedelta(hours=1)):
        try:
            """Generates a SAS token to read files from the blob that has
                an expiry of 1 hour from when it is generated.

            Args:
                blob_name: str
                time_delta: expiry time

            Returns:
                string: url
            """
            block_blob_service = BlockBlobService(connection_string=settings.DATA_AZURE_CONNECTION_STRING)
            artifacts_container = settings.DATA_FOLDER_PATH
            blob_container_url = f"{settings.AZURE_BLOB_ROOT_URL}{artifacts_container}"

            blob_sas_token = block_blob_service.generate_blob_shared_access_signature(
                artifacts_container,
                blob_name,
                permission=BlobPermissions.READ,
                expiry=datetime.utcnow() + time_delta,
            )

            return f"{blob_container_url}/{blob_name}?{blob_sas_token}"
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GeneralErrors.BLOB_GET_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_blob_list(self, prefix: str = ""):
        """
        Get list of items from blob storage

        Args:
            prefix to be added to the blob storage path
        """
        block_blob_service = BlockBlobService(connection_string=settings.DATA_AZURE_CONNECTION_STRING)
        artifacts_container = settings.DATA_FOLDER_PATH
        blobs = block_blob_service.list_blobs(artifacts_container, prefix=prefix)
        blob_list = []
        for blob in blobs:
            url = block_blob_service.make_blob_url(artifacts_container, blob.name)
            blob_list.append({"url": url})
        return blob_list

    def delete_blob(self, filename: str):
        """Deletes the given file to the blob storage.

        Args:
            filename: name of file to be deleted
        """
        blob_service = BlockBlobService(connection_string=settings.DATA_AZURE_CONNECTION_STRING)
        artifacts_container = settings.DATA_FOLDER_PATH
        return blob_service.delete_blob(artifacts_container, filename)
