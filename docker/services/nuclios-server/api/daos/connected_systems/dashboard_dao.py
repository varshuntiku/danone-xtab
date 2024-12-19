import logging
from typing import List

from api.constants.connected_systems.dashboard_error_messages import DashboardErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemDashboard
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class DashboardDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_dashboards(self, is_active=False) -> List[ConnSystemDashboard]:
        """
        Gets list of all dashboards

        Returns:
            List of dashboards
        """
        try:
            query = self.db_session.query(ConnSystemDashboard)

            if is_active:
                query = query.filter_by(is_active=True, deleted_at=None)
            else:
                query = query.filter_by(deleted_at=None)
            return query.all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_dashboard(
        self,
        name: str,
        industry: str,
        function: str,
        description: str,
        is_active: bool,
        small_logo_blob_name: str,
        created_by: int,
    ) -> ConnSystemDashboard:
        """
        Adds new Connected system dashboard to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            dashboard_url: dashboard url
            is_active: is_active
            created_by: id of user creating the dashboard

        Returns:
            Connected system dashboard object
        """
        try:
            connSystemDashboard = ConnSystemDashboard(
                name=name,
                industry=industry,
                function=function,
                description=description,
                is_active=is_active,
                created_by=created_by,
            )
            connSystemDashboard.small_logo_blob_name = small_logo_blob_name
            self.db_session.add(connSystemDashboard)
            self.db_session.commit()
            return connSystemDashboard
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.CREATE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard(self, conn_system_dashboard_id: int) -> ConnSystemDashboard:
        """
        Gets conn system dashboard given id

        Args:
            conn_system_dashboard_id: conn system dashboard id

        Returns:
            Connected System Dashboard object
        """
        try:
            return (
                self.db_session.query(ConnSystemDashboard)
                .filter_by(id=conn_system_dashboard_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_dashboard(
        self,
        connSystemDashboard: ConnSystemDashboard,
        name: str,
        industry: str,
        function: str,
        description: str,
        is_active: bool,
        small_logo_blob_name: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system dashboard

        Args:
            connSystemDashboard: Connected System Dashboard object to update
            name: name
            industry: industry
            function: function
            description: description
            dashboard_url: dashboard url
            is_active: is_active
            updated_by: id of user updating the conn system dashboard

        Returns:
            Success message
        """
        try:
            connSystemDashboard.name = name
            connSystemDashboard.industry = industry
            connSystemDashboard.function = function
            connSystemDashboard.description = description
            connSystemDashboard.is_active = is_active
            connSystemDashboard.small_logo_blob_name = small_logo_blob_name
            connSystemDashboard.updated_at = func.now()
            connSystemDashboard.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.UPDATE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_dashboard(self, connSystemDashboard: ConnSystemDashboard, deleted_by: int) -> dict:
        """
        Deletes the given connected system dashboard

        Args:
            connSystemDashboard: Connected System Dashboard object to update
            deleted_by: id of user deleting the dashboard

        Returns:
            Success message
        """
        try:
            connSystemDashboard.deleted_at = func.now()
            connSystemDashboard.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.DELETE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
