from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.connected_systems_schema import (
    ObjectiveGroupSchema,
    ObjectiveStepSchema,
)
from api.services.connected_systems.connected_systems_service import (
    ConnectedSystemService,
)


class ConnectedSystemController(BaseController):
    def get_objectives(self, app_id: int) -> List[ObjectiveGroupSchema]:
        with ConnectedSystemService() as connected_systems_service:
            response = connected_systems_service.get_objectives(app_id)
            return self.get_serialized_list(ObjectiveGroupSchema, response)

    def get_objective_steps(self, objective_id: int) -> List[ObjectiveStepSchema]:
        with ConnectedSystemService() as connected_systems_service:
            response = connected_systems_service.get_objective_steps(objective_id)
            return self.get_serialized_list(ObjectiveStepSchema, response)
