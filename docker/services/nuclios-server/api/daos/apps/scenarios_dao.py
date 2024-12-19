import json
import logging
from typing import Dict, List

from api.constants.apps.scenarios_error_messages import ScenariosErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Scenarios
from api.schemas.apps.scenario_schema import (
    ListScenarioRequestSchema,
    SaveScenarioRequestSchema,
)
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import desc


class ScenarioDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def scenario_list(self, logged_in_email: str, request_data: ListScenarioRequestSchema) -> List:
        """
        List scenarios for a given logged_in_email

        Args:
            logged_in_email: the loggedin email ,
            request_data: the request data to filter,

        Returns:
            List of scenarios
        """
        try:
            filters = str(request_data.filters)
            scenarios = (
                self.db_session.query(Scenarios)
                .filter_by(
                    app_id=request_data.app_id,
                    filters_json=filters,
                )
                .order_by(desc(Scenarios.id))
                .all()
            )
            return scenarios
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.LIST_SCENARIOS_ERROR.value},
            )

    def check_scenario_exist(self, logged_in_email: str, request_data: SaveScenarioRequestSchema) -> Scenarios:
        """
        Check if the scenario exists

        Args:
            logged_in_email: the loggedin email,
            request_data: the request data,

        Returns:
            Scenario object
        """
        try:
            scenario_name = (
                self.db_session.query(Scenarios)
                .filter_by(
                    name=request_data.scenarioname,
                    app_id=request_data.app_id,
                    user_email=logged_in_email,
                    app_screen_id=request_data.app_screen_id,
                    widget_id=request_data.widget_id,
                    version=request_data.version,
                )
                .first()
            )
            return scenario_name
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.SAVE_SCENARIO_ERROR.value},
            )

    def save_scenario(self, logged_in_email: str, request_data: SaveScenarioRequestSchema) -> Dict:
        """
        Save scenario information

        Args:
            logged_in_email: the loggedin email ,
            request_data: the request data to filter

        Returns:
            Success object
        """
        try:
            scenario = Scenarios(
                request_data.scenarioname,
                request_data.comment,
                logged_in_email,
                request_data.app_id,
                request_data.app_screen_id,
                request_data.widget_id,
                json.dumps(request_data.scenarios_json),
                str(request_data.filters_json),
                request_data.version,
            )
            self.db_session.add(scenario)
            self.db_session.flush()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.SAVE_SCENARIO_ERROR.value},
            )

    def delete_scenario(self, scenario_id: int) -> Dict:
        """
        Delete scenario information

        Args:
            scenario_id: the scenario id

        Returns:
            Success object
        """
        try:
            self.db_session.query(Scenarios).filter(Scenarios.id == scenario_id).delete()
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.DELETE_SCENARIO_ERROR.value},
            )

    def app_scenario_list(self, app_id: int) -> List[Scenarios]:
        """
        List scenarios for a given logged_in_email

        Args:
            logged_in_email: the loggedin email ,
            request_data: the request data to filter,

        Returns:
            List of scenarios
        """
        try:
            scenarios = self.db_session.query(Scenarios).filter_by(app_id=app_id).order_by(desc(Scenarios.id)).all()
            return scenarios
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.LIST_SCENARIOS_ERROR.value},
            )

    def scenario_data(self, app_id: int, name: str) -> List[Scenarios]:
        """
        List scenarios for a given logged_in_email

        Args:
            logged_in_email: the loggedin email ,
            request_data: the request data to filter,

        Returns:
            List of scenarios
        """
        try:
            scenarios = (
                self.db_session.query(Scenarios).filter_by(app_id=app_id, name=name).order_by(desc(Scenarios.id)).all()
            )
            return scenarios
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ScenariosErrors.LIST_SCENARIOS_ERROR.value},
            )
