import logging
from typing import Dict, List

from api.constants.dashboards.dashboard_error_messages import DashboardErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Dashboard, DashboardTemplates
from fastapi import status
from sqlalchemy import and_, asc
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class DashboardDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_dashboards(self) -> List[Dashboard]:
        """
        Gets list of all dashboards

        Returns:
            List of dashboards
        """
        try:
            return (
                self.db_session.query(Dashboard)
                .filter_by(deleted_at=None)
                .order_by(asc(Dashboard.dashboard_order), asc(Dashboard.dashboard_name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARDS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_dashboard(
        self,
        dashboard_name: str,
        dashboard_icon: str,
        dashboard_order: int,
        root_industry_id: int,
        dashboard_url: str,
        dashboard_template_id: int,
        created_by: int,
    ) -> Dashboard:
        """
        Adds new dashboard to the database

        Args:
            dashboard_name: dashboard name
            dashboard_icon: dashboard icon
            dashboard_order: dashboard order
            root_industry_id: root industry id to fetch dashboard data from
            dashboard_url: dashboard url
            dashboard_template_id: id of the template to be followed for the dashboard
            created_by: id of user creating the dashboard

        Returns:
            Dashboard object
        """
        try:
            dashboard = Dashboard(
                dashboard_name=dashboard_name,
                dashboard_icon=dashboard_icon,
                dashboard_order=dashboard_order,
                root_industry_id=root_industry_id,
                dashboard_url=dashboard_url,
                dashboard_template_id=dashboard_template_id,
                created_by=created_by,
            )
            self.db_session.add(dashboard)
            self.db_session.commit()
            return dashboard
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.CREATE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard_by_id(self, id: int) -> Dashboard:
        """
        Gets dashboard given id

        Args:
            id: dashboard id

        Returns:
            Dashboard object
        """
        try:
            return self.db_session.query(Dashboard).filter_by(id=id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_dashboard(
        self,
        dashboard: Dashboard,
        dashboard_name: str,
        dashboard_icon: str,
        dashboard_order: int,
        root_industry_id: int,
        dashboard_url: str,
        dashboard_template_id: int,
        updated_by: int,
    ) -> Dict:
        """
        Updates the given dashboard

        Args:
            dashboard: Dashboard object to update
            dashboard_name: dashboard name
            dashboard_icon: dashboard icon
            dashboard_order: dashboard order
            root_industry_id: root industry id to fetch dashboard data from
            dashboard_url: dashboard url
            dashboard_template_id: id of the template to be followed for the dashboard
            updated_by: id of user updating the dashboard

        Returns:
            Success message
        """
        try:
            dashboard.dashboard_name = dashboard_name
            dashboard.dashboard_icon = dashboard_icon
            dashboard.dashboard_order = dashboard_order
            dashboard.root_industry_id = root_industry_id
            dashboard.dashboard_url = dashboard_url
            dashboard.dashboard_template_id = dashboard_template_id
            dashboard.updated_at = func.now()
            dashboard.updated_by = updated_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.UPDATE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_dashboard(self, dashboard: Dashboard, deleted_by: int) -> Dict:
        """
        Deletes the given dashboard

        Args:
            dashboard: Dashboard object to update
            deleted_by: id of user deleting the dashboard

        Returns:
            Success message
        """
        try:
            dashboard.deleted_at = func.now()
            dashboard.deleted_by = deleted_by
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.DELETE_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard_templates(self) -> List[DashboardTemplates]:
        """
        Gets list of all dashboard templates

        Returns:
            List of dashboard templates
        """
        try:
            return (
                self.db_session.query(DashboardTemplates)
                .filter_by(deleted_at=None)
                .order_by(asc(DashboardTemplates.name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARD_TEMPLATES_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard_with_template_by_id(self, dashboard_id: int) -> Dashboard:
        """
        Gets dashboard with its template details given dashboard id

        Args:
            dashboard_id: dashboard id

        Returns:
            Dashboard with template details
        """
        try:
            dashboard_with_template = (
                self.db_session.query(Dashboard, DashboardTemplates)
                .filter(
                    and_(
                        Dashboard.dashboard_template_id == DashboardTemplates.id,
                        Dashboard.id == dashboard_id,
                        Dashboard.deleted_at.is_(None),
                    )
                )
                .first()
            )
            return dashboard_with_template
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_dashboard_with_template_by_url(self, dashboard_url: str) -> Dashboard:
        """
        Gets dashboard with its template details given dashboard url

        Args:
            dashboard_url: dashboard url

        Returns:
            Dashboard with template details
        """
        try:
            dashboard_with_template = (
                self.db_session.query(Dashboard, DashboardTemplates)
                .filter(
                    and_(
                        Dashboard.dashboard_template_id == DashboardTemplates.id,
                        Dashboard.dashboard_url == dashboard_url,
                        Dashboard.deleted_at.is_(None),
                    )
                )
                .first()
            )
            return dashboard_with_template
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": DashboardErrors.GET_DASHBOARD_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )
