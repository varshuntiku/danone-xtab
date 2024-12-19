from typing import List

from api.constants.alerts_notifications.notifications_errors import NotificationsErrors
from api.constants.apps.scenarios_error_messages import ScenariosErrors
from api.constants.apps.scenarios_success_messages import ScenarioSuccess
from api.daos.apps.scenarios_dao import ScenarioDao
from api.daos.users.users_dao import UsersDao
from api.dtos.apps.scenarios_dto import ListScenarioDTO
from api.dtos.generic_dto import IsExistsDTO, MessageStatusDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.scenario_schema import (
    CheckScenarioSchema,
    ListScenarioRequestSchema,
    SaveScenarioRequestSchema,
)
from api.services.base_service import BaseService
from api.utils.auth.token import validate_execution_token
from fastapi import Request, status


class ScenarioService(BaseService):
    def __init__(self):
        super().__init__()
        self.scenario_dao = ScenarioDao(self.db_session)
        self.users_dao = UsersDao(self.db_session)

    def scenario_list(self, request: Request, request_data: ListScenarioRequestSchema) -> List[ListScenarioDTO]:
        logged_in_email = request.state.logged_in_email
        scenarios = self.scenario_dao.scenario_list(logged_in_email, request_data)
        response = [ListScenarioDTO(row) for row in scenarios]
        return response

    def scenario_save(self, request: Request, request_data: SaveScenarioRequestSchema) -> MessageStatusDTO:
        logged_in_email = request.state.logged_in_email
        scenario = self.scenario_dao.check_scenario_exist(logged_in_email, request_data)
        if scenario is not None:
            raise GeneralException(
                message={"error": ScenariosErrors.SCENARIO_ALREADY_EXIST_ERROR.value},
                status_code=status.HTTP_409_CONFLICT,
            )
        self.scenario_dao.save_scenario(logged_in_email, request_data)
        res = MessageStatusDTO(ScenarioSuccess.SAVE_SCENARIO_SUCCESS.value, 200)
        return res

    def scenario_name_validation(
        self, request: Request, app_id: int, widget_id: int, app_screen_id: int, name: str
    ) -> IsExistsDTO:
        logged_in_email = request.state.logged_in_email
        request_dict = {
            "app_id": app_id,
            "widget_id": widget_id,
            "app_screen_id": app_screen_id,
            "scenarioname": name,
        }
        request_schema = CheckScenarioSchema(**request_dict)
        scenario = self.scenario_dao.check_scenario_exist(logged_in_email, request_schema)
        isexists = "false" if scenario is None else "true"
        return IsExistsDTO(isexists)

    def delete_scenario(self, scenario_id: int) -> MessageStatusDTO:
        self.scenario_dao.delete_scenario(scenario_id)
        res = MessageStatusDTO(ScenarioSuccess.DELETE_SCENARIO_SUCCESS.value, 200)
        return res

    def app_scenario_list(self, app_id: int, access_token: str) -> List[ListScenarioDTO]:
        user_token = validate_execution_token(access_token, self.users_dao.get_user_token_by_token_and_email)
        if user_token is not None and user_token.user_email:
            scenarios = self.scenario_dao.app_scenario_list(app_id)
            response = [ListScenarioDTO(row) for row in scenarios]
            return response
        else:
            raise GeneralException(
                message={"message": NotificationsErrors.NOTIFICATIONS_TOKEN_VALIDATION_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

    def scenario_data(self, app_id: int, name: str, access_token: str) -> List[ListScenarioDTO]:
        user_token = validate_execution_token(access_token, self.users_dao.get_user_token_by_token_and_email)
        if user_token is not None and user_token.user_email:
            scenarios = self.scenario_dao.scenario_data(app_id, name)
            response = [ListScenarioDTO(row) for row in scenarios]
            return response
        else:
            raise GeneralException(
                message={"message": NotificationsErrors.NOTIFICATIONS_TOKEN_VALIDATION_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )
