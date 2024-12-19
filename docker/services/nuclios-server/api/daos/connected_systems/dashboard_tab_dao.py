import logging
from typing import List

from api.constants.connected_systems.dashboard_tab_error_messages import (
    DashboardTabErrors,
)
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ConnSystemDashboardTab
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class DashboardTabDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_dashboard_tabs(self, conn_system_dashboard_tab_id: int) -> List[ConnSystemDashboardTab]:
        """
        Gets list of all dashboard tabs

        Returns:
            List of dashboard tabs
        """
        try:
            return (
                self.db_session.query(ConnSystemDashboardTab)
                .filter_by(dashboard_id=conn_system_dashboard_tab_id, deleted_at=None)
                .order_by(ConnSystemDashboardTab.order_by)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardTabErrors.GET_DASHBOARD_TABS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_dashboard_tab(
        self,
        conn_system_dashboard_id: int,
        name: str,
        tab_type: str,
        order_by: int,
        is_active: bool,
        kpis: str,
        insights: str,
        tools: str,
        created_by: int,
    ) -> ConnSystemDashboardTab:
        """
        Adds new Connected system dashboard tab to the database

        Args:
            name: name
            industry: industry
            function: function
            description: description
            dashboard_tab_url: dashboard_tab url
            is_active: is_active
            created_by: id of user creating the dashboard_tab

        Returns:
            Connected system dashboard tab object
        """
        try:
            connSystemDashboardTab = ConnSystemDashboardTab(
                dashboard_id=conn_system_dashboard_id,
                name=name,
                tab_type=tab_type,
                order_by=order_by,
                is_active=is_active,
                kpis=kpis,
                insights=insights,
                tools=tools,
                created_by=created_by,
            )
            self.db_session.add(connSystemDashboardTab)
            self.db_session.commit()
            return connSystemDashboardTab
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardTabErrors.CREATE_DASHBOARD_TAB_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard_tab(self, conn_system_dashboard_tab_id: int) -> ConnSystemDashboardTab:
        """
        Gets conn system dashboard tab given id

        Args:
            conn_system_dashboard_tab_id: conn system dashboard_tab id

        Returns:
            Connected System Dashboard Tab object
        """
        try:
            return (
                self.db_session.query(ConnSystemDashboardTab)
                .filter_by(id=conn_system_dashboard_tab_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardTabErrors.GET_DASHBOARD_TAB_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_dashboard_tab(
        self,
        connSystemDashboardTab: ConnSystemDashboardTab,
        name: str,
        tab_type: str,
        order_by: int,
        is_active: bool,
        kpis: str,
        insights: str,
        tools: str,
        updated_by: int,
    ) -> dict:
        """
        Updates the given connected system dashboard tab

        Args:
            connSystemDashboardTab: Connected System Dashboard Tab object to update
            name: name
            industry: industry
            function: function
            description: description
            small_logo_blob_name: small_logo_blob_name
            is_active: is_active
            updated_by: id of user updating the conn system dashboard tab

        Returns:
            Success message
        """
        try:
            connSystemDashboardTab.name = name
            connSystemDashboardTab.tab_type = tab_type
            connSystemDashboardTab.order_by = order_by
            connSystemDashboardTab.is_active = is_active
            connSystemDashboardTab.kpis = kpis
            connSystemDashboardTab.insights = insights
            connSystemDashboardTab.tools = tools
            connSystemDashboardTab.updated_at = func.now()
            connSystemDashboardTab.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardTabErrors.UPDATE_DASHBOARD_TAB_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_dashboard_tab(self, connSystemDashboardTab: ConnSystemDashboardTab, deleted_by: int) -> dict:
        """
        Deletes the given connected system dashboard tab

        Args:
            connSystemDashboardTab: Connected System Dashboard Tab object to update
            deleted_by: id of user deleting the dashboard tab

        Returns:
            Success message
        """
        try:
            connSystemDashboardTab.deleted_at = func.now()
            connSystemDashboardTab.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardTabErrors.DELETE_DASHBOARD_TAB_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
