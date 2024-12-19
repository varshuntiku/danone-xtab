from api.controllers.base_controller import BaseController
from api.schemas.generic_schema import (
    FileDeleteRequestSchema,
    FileDeleteResponseSchema,
    FileUploadResponseSchema,
)
from api.services.generic_service import GenericService
from fastapi import UploadFile


class GenericController(BaseController):
    async def upload_file(self, file: UploadFile, form_data: dict) -> FileUploadResponseSchema:
        with GenericService() as generic_service:
            response = await generic_service.upload_file(file, form_data)
            response = self.get_serialized_data(FileUploadResponseSchema, response)
            return response

    def delete_file(self, request_data: FileDeleteRequestSchema) -> FileDeleteResponseSchema:
        with GenericService() as generic_service:
            response = generic_service.delete_file(request_data)
            response = self.get_serialized_data(FileDeleteResponseSchema, response)
            return response
