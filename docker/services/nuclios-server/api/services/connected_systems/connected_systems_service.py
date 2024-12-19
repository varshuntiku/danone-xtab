from typing import List

from api.daos.connected_systems.connected_systems_dao import ConnectedSystemDao
from api.dtos.connected_systems.connected_systems_dto import (
    ObjectivesGroupDTO,
    ObjectiveStepsDTO,
)
from api.helpers.generic_helpers import GenericHelper
from api.services.base_service import BaseService


class ConnectedSystemService(BaseService):
    def __init__(self):
        super().__init__()
        self.connected_systems_dao = ConnectedSystemDao(self.db_session)
        self.generic_helpers = GenericHelper()

    def get_objectives(self, app_id: int) -> List[ObjectivesGroupDTO]:
        objective_groups = self.connected_systems_dao.get_objectives_group(app_id)
        response = [
            ObjectivesGroupDTO(objective_group, self.connected_systems_dao) for objective_group in objective_groups
        ]
        return response

    def get_objective_steps(self, objective_id: int) -> List[ObjectiveStepsDTO]:
        objective_steps = self.connected_systems_dao.get_objective_steps(objective_id)
        response = [ObjectiveStepsDTO(objective_step, self.connected_systems_dao) for objective_step in objective_steps]
        return response
