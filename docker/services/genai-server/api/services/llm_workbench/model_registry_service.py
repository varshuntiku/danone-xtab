from api.daos.llm_workbench.model_registry_dao import ModelRegistryDao
from api.dtos.llm_workbench.model_registry_dto import ModelRegistryDTO
from api.middlewares.error_middleware import AlreadyExistException
from fastapi import status


class ModelRegistryService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.model_registry_dao = ModelRegistryDao()

    def get_paginated_model_registries(self, user, page, page_size, search):
        # Paginated Query and Total without pagination
        (
            model_registries,
            total_available_model_registries,
        ) = self.model_registry_dao.get_paginated_model_registries(user, page, page_size, search)
        # Converting into DTO objects
        transformed_model_registries = [ModelRegistryDTO(model_registry) for model_registry in model_registries]
        return transformed_model_registries, total_available_model_registries

    def get_model_registries(self, user, search):
        model_registries = self.model_registry_dao.get_model_registries(user, search)
        # Converting into DTO objects
        transformed_model_registries = [ModelRegistryDTO(model_registry) for model_registry in model_registries]
        return transformed_model_registries

    def create_model_registry(self, user, request_data):
        model = self.model_registry_dao.get_model_registry_by_name(request_data["name"])
        if model:
            raise AlreadyExistException(
                message="The ModelRegistry with name already exist.",
                status_code=status.HTTP_409_CONFLICT,
            )
        config_data = {}
        config_data["model_path_type"] = request_data.pop("model_path_type")
        config_data["api_key"] = request_data.pop("api_key")
        config_data["model_params"] = request_data.pop("model_params")
        config_data["is_active"] = request_data.pop("is_active_config")
        config_data["model_path"] = request_data.pop("model_path")
        # update llm_model_registry table
        created_model_registry = self.model_registry_dao.create_model_registry(user, request_data)
        config_data["model_id"] = created_model_registry.id
        # update llm_model_config table
        self.model_registry_dao.create_model_config(user, config_data)
        return ModelRegistryDTO(created_model_registry)
