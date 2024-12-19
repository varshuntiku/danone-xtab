import logging
import os
import zipfile

from app.utils.config import get_settings
from azure.storage.blob import BlobServiceClient
from fastapi import HTTPException

settings = get_settings()


def download_from_blob(index_File_Name):
    """
    Download Files from blob
    """
    try:
        if not os.path.exists(os.path.join("./indexes", index_File_Name.split(".zip")[0])):
            blob_service = BlobServiceClient.from_connection_string(conn_str=settings.AZURE_STORAGE_CONNECTION_STRING)
            blob_client = blob_service.get_blob_client(container=settings.BLOB_CONTAINER_NAME, blob=index_File_Name)
            with open(file=os.path.join("./indexes", index_File_Name), mode="wb") as sample_blob:
                download_stream = blob_client.download_blob()
                sample_blob.write(download_stream.readall())
            with zipfile.ZipFile(file=os.path.join("./indexes", index_File_Name), mode="r") as zip_ref:
                zip_ref.extractall("./indexes")
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while downloading files from blob")
