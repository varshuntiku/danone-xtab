import json
from time import time

from api.configs.settings import get_app_settings
from api.constants.error_messages import GeneralErrors
from api.daos.apps.app_dao import AppDao
from api.dtos.generic_dto import FileDeleteResponseDTO, FileUploadResponseDTO
from api.helpers.generic_helpers import GenericHelper
from api.middlewares.error_middleware import GeneralException
from api.schemas.generic_schema import (
    FileDeleteRequestSchema,
    FileDeleteResponseSchema,
    FileUploadResponseSchema,
)
from api.services.base_service import BaseService
from cryptography.fernet import Fernet
from fastapi import UploadFile

settings = get_app_settings()


class GenericService(BaseService):
    def __init__(self):
        super().__init__()
        self.app_dao = AppDao(self.db_session)
        self.generic_helper = GenericHelper()

    async def upload_file(self, file: UploadFile, form_data: dict) -> FileUploadResponseSchema:
        file_name = file.filename
        upload_with_content_type = (
            json.loads((form_data["uploadWithContentType"])) if form_data.get("uploadWithContentType") else False
        )
        dynamic_file_path = json.loads((form_data["file_path"])) if form_data.get("file_path") else False
        dynamic_blob_properties = False
        if form_data.get("dynamic_storage", False) and form_data.get("app_id", False):
            app_id = form_data.get("app_id")
            dynamic_storage = json.loads(form_data.get("dynamic_storage"))
            encoded_var_name = dynamic_storage["CONNECTION_STRING"]
            app_info = self.app_dao.get_app_by_id(app_id=app_id)
            fernet = Fernet(settings.CRYPTO_ENCRYPTION_KEY)
            app_variables = (
                json.loads(fernet.decrypt(app_info.variables.encode()).decode())
                if app_info.variables is not None
                else {}
            )
            encoded_credentials = app_variables[encoded_var_name]
            dynamic_blob_properties = {
                **dynamic_storage,
                "CONNECTION_STRING": encoded_credentials,
            }

        if form_data.get("blobIncludeTimeStamp", False):
            t = round(time() * 1000)
            file_name = file_name.split(".")[0] + "_" + str(t) + "." + ".".join(file_name.split(".")[1:])

        url = self.generic_helper.upload_blob(
            await file.read(),
            file_name,
            upload_with_content_type,
            dynamic_file_path,
            dynamic_blob_properties,
        )
        return FileUploadResponseDTO({"path": url, "filename": file.filename})

    def delete_file(self, request_data: FileDeleteRequestSchema) -> FileDeleteResponseSchema:
        try:
            self.generic_helper.delete_blob(request_data.file)
            return FileDeleteResponseDTO({"message": "Deleted the file from Blob", "filename": request_data.file})
        except Exception:
            raise GeneralException(message=GeneralErrors.BLOB_DELETE_ERROR.value)
