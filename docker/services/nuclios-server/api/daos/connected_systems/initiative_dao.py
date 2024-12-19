import logging
from typing import List

from api.constants.connected_systems.initiative_error_messages import InitiativeErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemGoal, ConnSystemInitiative
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func


class InitiativeDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_initiatives(self, conn_system_dashboard_id: int) -> List[ConnSystemInitiative]:
        """
        Gets list of all initiatives

        Returns:
            List of initiatives
        """
        try:
            return (
                self.db_session.query(ConnSystemInitiative)
                .filter(
                    and_(
                        ConnSystemGoal.dashboard_id == conn_system_dashboard_id,
                        ConnSystemInitiative.deleted_at.is_(None),
                    )
                )
                .join(ConnSystemGoal)
                .order_by(ConnSystemInitiative.goal_id, ConnSystemInitiative.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": InitiativeErrors.GET_INITIATIVES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_initiative(
        self,
        conn_system_goal_id: int,
        name: str,
        order_by: int,
        is_active: bool,
        objectives: str,
        created_by: int,
    ) -> ConnSystemInitiative:
        """
        Adds new Connected system initiative to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            initiative_url: initiative url
            is_active: is_active
            created_by: id of user creating the initiative

        Returns:
            Connected system initiative object
        """
        try:
            connSystemInitiative = ConnSystemInitiative(
                goal_id=conn_system_goal_id,
                name=name,
                order_by=order_by,
                is_active=is_active,
                objectives=objectives,
                created_by=created_by,
            )
            self.db_session.add(connSystemInitiative)
            self.db_session.commit()
            return connSystemInitiative
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": InitiativeErrors.CREATE_INITIATIVE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_initiative(self, conn_system_initiative_id: int) -> ConnSystemInitiative:
        """
        Gets conn system initiative given id

        Args:
            conn_system_initiative_id: conn system initiative id

        Returns:
            Connected System Initiative object
        """
        try:
            return (
                self.db_session.query(ConnSystemInitiative)
                .filter_by(id=conn_system_initiative_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": InitiativeErrors.GET_INITIATIVE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_initiative(
        self,
        connSystemInitiative: ConnSystemInitiative,
        goal_id: str,
        name: str,
        order_by: int,
        is_active: bool,
        objectives: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system initiative

        Args:
            connSystemInitiative: Connected System Initiative object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system initiative

        Returns:
            Success message
        """
        try:
            connSystemInitiative.goal_id = goal_id
            connSystemInitiative.name = name
            connSystemInitiative.order_by = order_by
            connSystemInitiative.is_active = is_active
            connSystemInitiative.objectives = objectives
            connSystemInitiative.updated_at = func.now()
            connSystemInitiative.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": InitiativeErrors.UPDATE_INITIATIVE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_initiative(self, connSystemInitiative: ConnSystemInitiative, deleted_by: int) -> dict:
        """
        Deletes the given connected system initiative

        Args:
            connSystemInitiative: Connected System Initiative object to update
            deleted_by: id of user deleting the initiative

        Returns:
            Success message
        """
        try:
            connSystemInitiative.deleted_at = func.now()
            connSystemInitiative.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": InitiativeErrors.DELETE_INITIATIVE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
