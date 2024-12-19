from typing import List

from api.controllers.base_controller import BaseController
from api.services.ml_model.configuration_service import ConfigurationService


class ConfigurationController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.configuration_service = ConfigurationService()

    def get_table_configurations(self, user, table_name) -> List[dict]:
        table_configuration = self.configuration_service.get_table_configurations(user, table_name)
        return table_configuration
