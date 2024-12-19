import json
import os
from datetime import datetime

from api.daos.llm_workbench.data_registry_dao import DataRegistryDao
from api.dtos.llm_workbench.data_registry_dto import DatasetDTO
from api.middlewares.error_middleware import GeneralException
from api.services.utils.azure.fileshare_service import AzureFileShareService
from fastapi import status


class DataRegistryService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.data_registry_dao = DataRegistryDao()
        self.dataset_share_name = "dataset-repository"

    def get_paginated_data_registries(self, user, page, page_size, search):
        # Paginated Query and Total without pagination
        (
            data_registries,
            total_available_data_registries,
        ) = self.data_registry_dao.get_paginated_data_registries(user, page, page_size, search)
        # Converting into DTO objects
        transformed_data_registries = [DatasetDTO(data_registry) for data_registry in data_registries]
        return transformed_data_registries, total_available_data_registries

    def get_data_registries(self, user, search):
        data_registries = self.data_registry_dao.get_data_registries(user, search)
        # Converting into DTO objects
        transformed_data_registries = [DatasetDTO(data_registry) for data_registry in data_registries]
        return transformed_data_registries

    async def upload_to_data_registries(self, user, file):
        file_name, extension = os.path.splitext(file.filename)
        file_data = None
        try:
            contents = await file.read()
            # Parsing to make sure the file is having valid data
            json_data = json.loads(contents.decode("utf-8"))
            file_data = json.dumps(json_data)
        except json.JSONDecodeError:
            raise GeneralException(
                message="Invalid file type. Only file with json content are allowed",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        slug = int(datetime.now().timestamp() * 1000)
        dataset_name = f"{file_name}_{slug}"
        folder = f"user-uploaded/{dataset_name}"
        file_path = f"{folder}/{file_name}{extension}"
        dataset_folder = f"/{self.dataset_share_name}/{folder}"
        dataset_file_path = f"/{self.dataset_share_name}/{file_path}"
        AzureFileShareService().create_directory(self.dataset_share_name, folder)
        response = await AzureFileShareService().upload_file_as_data_to_specific_path(
            self.dataset_share_name, file_path, file_data
        )
        if response["status"] == "success":
            data_source = self.data_registry_dao.get_dataset_source_by_type("nuclios")
            data = {
                "file_name": file_name,
                "dataset_name": dataset_name,
                "file_path": dataset_file_path,
                "dataset_folder": dataset_folder,
                "file_type": "json",
                "is_active": True,
            }
            data_registry = self.data_registry_dao.create_llm_data_registry(user, data_source, data)
            return DatasetDTO(data_registry)
        else:
            raise GeneralException(
                message="Error occurred in adding file to Data Registries.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
