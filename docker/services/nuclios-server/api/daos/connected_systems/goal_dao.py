import logging
from typing import List

from api.constants.connected_systems.goal_error_messages import GoalErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemGoal
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class GoalDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_goals(self, conn_system_dashboard_id: int) -> List[ConnSystemGoal]:
        """
        Gets list of all goals

        Returns:
            List of goals
        """
        try:
            return (
                self.db_session.query(ConnSystemGoal)
                .filter_by(dashboard_id=conn_system_dashboard_id, deleted_at=None)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GoalErrors.GET_GOALS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_goal(
        self,
        conn_system_dashboard_id: int,
        name: str,
        order_by: int,
        is_active: bool,
        objectives: str,
        created_by: int,
    ) -> ConnSystemGoal:
        """
        Adds new Connected system goal to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            goal_url: goal url
            is_active: is_active
            created_by: id of user creating the goal

        Returns:
            Connected system goal object
        """
        try:
            connSystemGoal = ConnSystemGoal(
                dashboard_id=conn_system_dashboard_id,
                name=name,
                order_by=order_by,
                is_active=is_active,
                objectives=objectives,
                created_by=created_by,
            )
            self.db_session.add(connSystemGoal)
            self.db_session.commit()
            return connSystemGoal
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": GoalErrors.CREATE_GOAL_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_goal(self, conn_system_goal_id: int) -> ConnSystemGoal:
        """
        Gets conn system goal given id

        Args:
            conn_system_goal_id: conn system goal id

        Returns:
            Connected System Goal object
        """
        try:
            return self.db_session.query(ConnSystemGoal).filter_by(id=conn_system_goal_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GoalErrors.GET_GOAL_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_goal(
        self,
        connSystemGoal: ConnSystemGoal,
        name: str,
        order_by: int,
        is_active: bool,
        objectives: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system goal

        Args:
            connSystemGoal: Connected System Goal object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system goal

        Returns:
            Success message
        """
        try:
            connSystemGoal.name = name
            connSystemGoal.order_by = order_by
            connSystemGoal.is_active = is_active
            connSystemGoal.objectives = objectives
            connSystemGoal.updated_at = func.now()
            connSystemGoal.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": GoalErrors.UPDATE_GOAL_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_goal(self, connSystemGoal: ConnSystemGoal, deleted_by: int) -> dict:
        """
        Deletes the given connected system goal

        Args:
            connSystemGoal: Connected System Goal object to update
            deleted_by: id of user deleting the goal

        Returns:
            Success message
        """
        try:
            connSystemGoal.deleted_at = func.now()
            connSystemGoal.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": GoalErrors.DELETE_GOAL_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
