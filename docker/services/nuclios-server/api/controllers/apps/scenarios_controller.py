from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.apps.scenario_schema import (
    ListScenarioRequestSchema,
    ListScenarioResponseSchema,
    SaveScenarioRequestSchema,
)
from api.schemas.generic_schema import (
    IsExistsResponseSchema,
    MessageStatusResponseSchema,
)
from api.services.apps.scenarios_service import ScenarioService
from fastapi import Request


class ScenarioController(BaseController):
    def scenario_list(
        self, request: Request, request_data: ListScenarioRequestSchema
    ) -> List[ListScenarioResponseSchema]:
        with ScenarioService() as scenario_service:
            data = scenario_service.scenario_list(request, request_data)
            return self.get_serialized_list(ListScenarioResponseSchema, data)

    def scenario_save(self, request: Request, request_data: SaveScenarioRequestSchema) -> MessageStatusResponseSchema:
        with ScenarioService() as scenario_service:
            response = scenario_service.scenario_save(request, request_data)
            return self.get_serialized_data(MessageStatusResponseSchema, response)

    def scenario_name_validation(
        self, request: Request, app_id: int, widget_id: int, app_screen_id: int, name: str
    ) -> IsExistsResponseSchema:
        with ScenarioService() as scenario_service:
            response = scenario_service.scenario_name_validation(request, app_id, widget_id, app_screen_id, name)
            return self.get_serialized_data(IsExistsResponseSchema, response)

    def delete_scenario(self, scenario_id: int) -> MessageStatusResponseSchema:
        with ScenarioService() as scenario_service:
            response = scenario_service.delete_scenario(scenario_id)
            return self.get_serialized_data(MessageStatusResponseSchema, response)

    def app_scenario_list(self, app_id: int, access_token: str) -> ListScenarioResponseSchema:
        with ScenarioService() as scenario_service:
            data = scenario_service.app_scenario_list(app_id, access_token)
            return self.get_serialized_list(ListScenarioResponseSchema, data)

    def scenario_data(self, app_id: int, name: str, access_token: str) -> List:
        with ScenarioService() as scenario_service:
            data = scenario_service.scenario_data(app_id, name, access_token)
            return [row.__dict__ for row in data][0]
