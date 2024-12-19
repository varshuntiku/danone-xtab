import logging
from typing import List

from api.constants.error_messages import GeneralErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    Objectives,
    ObjectivesGroup,
    ObjectivesSteps,
    objectives_steps_widget_value,
)
from fastapi import status
from sqlalchemy import asc
from sqlalchemy.orm import Session


class ConnectedSystemDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_objectives_group(self, app_id: int) -> ObjectivesGroup:
        """
        Get Objectives group by app_id

        Args:
            app_id: app's id

        Returns:
            ObjectivesGroup object
        """
        try:
            return self.db_session.query(ObjectivesGroup).filter_by(app_id=app_id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def get_objectives(self, group_id: int) -> Objectives:
        """
        Get Objectives by group_id

        Args:
            app_id: group's id

        Returns:
            Objectives object
        """
        try:
            return self.db_session.query(Objectives).filter_by(group_id=group_id)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def get_objective_steps(self, objective_id: int) -> ObjectivesSteps:
        """
        Get Objective steps by objective_id

        Args:
            objective_id: objective's id

        Returns:
            ObjectivesSteps object
        """
        try:
            return (
                self.db_session.query(ObjectivesSteps)
                .filter_by(objective_id=objective_id, deleted_at=None)
                .order_by(asc(ObjectivesSteps.order))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )

    def get_objective_step_widgets(self, step_id: int) -> List[objectives_steps_widget_value]:
        """
        Get objectives_steps_widget_value object by step_id

        Args:
            step_id: step's id

        Returns:
            objectives_steps_widget_value object
        """
        try:
            return (
                self.db_session.query(objectives_steps_widget_value)
                .filter_by(objectives_steps_id=step_id, deleted_at=None)
                .order_by(asc(objectives_steps_widget_value.order))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value},
            )
