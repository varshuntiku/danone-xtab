from typing import List

from api.constants.connected_systems.dashboard_error_messages import DashboardErrors
from api.constants.connected_systems.dashboard_success_messages import DashboardSuccess
from api.daos.connected_systems.dashboard_dao import DashboardDao
from api.dtos.connected_systems.dashboard_dto import CreateDashboardDTO, DashboardDTO
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.dashboard_schema import (
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class DashboardService(BaseService):
    def __init__(self):
        super().__init__()
        self.dashboard_dao = DashboardDao(self.db_session)

    def get_dashboards(self, is_active=False) -> List[DashboardDTO]:
        dashboards = self.dashboard_dao.get_dashboards(is_active)
        return [DashboardDTO(dashboard) for dashboard in dashboards]

    def get_dashboard(self, conn_system_dashboard_id: int) -> DashboardDTO:
        dashboard = self.dashboard_dao.get_dashboard(conn_system_dashboard_id)
        return DashboardDTO(dashboard)

    def create_dashboard(
        self, user_id: int, request_data: CreateUpdateDashboardSchema
    ) -> CreateDashboardResponseSchema:
        dashboard = self.dashboard_dao.create_dashboard(
            name=getattr(request_data, "name", None),
            industry=getattr(request_data, "industry", None),
            function=getattr(request_data, "function", None),
            description=getattr(request_data, "description", None),
            is_active=getattr(request_data, "is_active", None),
            small_logo_blob_name=getattr(request_data, "small_logo_blob_name", None),
            created_by=user_id,
        )
        return {"status": "success", "dashboard_data": CreateDashboardDTO(dashboard)}

    def update_dashboard(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDashboardSchema
    ) -> MessageResponseSchema:
        dashboard = self.dashboard_dao.get_dashboard(conn_system_dashboard_id)

        if not dashboard:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardErrors.DASHBOARD_NOT_FOUND_ERROR.value},
            )

        self.dashboard_dao.update_dashboard(
            connSystemDashboard=dashboard,
            name=getattr(request_data, "name", None),
            industry=getattr(request_data, "industry", None),
            function=getattr(request_data, "function", None),
            description=getattr(request_data, "description", None),
            is_active=getattr(request_data, "is_active", None),
            small_logo_blob_name=getattr(request_data, "small_logo_blob_name", None),
            updated_by=user_id,
        )
        return {"message": DashboardSuccess.DASHBOARD_UPDATE_SUCCESS.value}

    def delete_dashboard(self, user_id: int, conn_system_dashboard_id: int) -> MessageResponseSchema:
        dashboard = self.dashboard_dao.get_dashboard(conn_system_dashboard_id)

        if not dashboard:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardErrors.DASHBOARD_NOT_FOUND_ERROR.value},
            )

        self.dashboard_dao.delete_dashboard(
            connSystemDashboard=dashboard,
            deleted_by=user_id,
        )
        return {"message": DashboardSuccess.DASHBOARD_DELETE_SUCCESS.value}
