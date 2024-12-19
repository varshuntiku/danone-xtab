from api.daos.execution_environment.compute_config_dao import ComputeConfigDao
from api.dtos.execution_environment.compute_config_dto import LLMComputeConfigDTO


class ComputeConfigService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.compute_config_dao = ComputeConfigDao()

    def get_compute_configs(self, user, search):
        compute_configs = self.compute_config_dao.get_compute_configs(user, search)
        # Converting into DTO objects
        transformed_compute_configs = [LLMComputeConfigDTO(compute_config) for compute_config in compute_configs]
        return transformed_compute_configs

    def create_compute_config(self, user, request_data):
        if type(request_data) is list:
            compute_configs = self.compute_config_dao.bulk_create_compute_config(user, request_data)
            transformed_compute_configs = [LLMComputeConfigDTO(compute_config) for compute_config in compute_configs]
            return transformed_compute_configs
        compute_config = self.compute_config_dao.create_compute_config(user, request_data)
        transformed_compute_config = LLMComputeConfigDTO(compute_config)
        return transformed_compute_config

    def get_compute_config_by_id(self, user, id):
        compute_config = self.compute_config_dao.get_compute_config_by_id(id)
        transformed_compute_config = LLMComputeConfigDTO(compute_config)
        return transformed_compute_config
