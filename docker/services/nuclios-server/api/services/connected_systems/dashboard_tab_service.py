import json
from typing import List

from api.constants.connected_systems.dashboard_tab_error_messages import (
    DashboardTabErrors,
)
from api.constants.connected_systems.dashboard_tab_success_messages import (
    DashboardTabSuccess,
)
from api.daos.connected_systems.dashboard_tab_dao import DashboardTabDao
from api.dtos.connected_systems.dashboard_tab_dto import (
    CreateDashboardTabDTO,
    DashboardTabDTO,
)
from api.middlewares.error_middleware import GeneralException
from api.schemas.connected_systems.dashboard_tab_schema import (
    CreateDashboardTabResponseSchema,
    CreateUpdateDashboardTabSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from fastapi import status


class DashboardTabService(BaseService):
    def __init__(self):
        super().__init__()
        self.dashboard_tab_dao = DashboardTabDao(self.db_session)

    def get_dashboard_tabs(self, conn_system_dashboard_id: int) -> List[DashboardTabDTO]:
        dashboard_tabs = self.dashboard_tab_dao.get_dashboard_tabs(conn_system_dashboard_id)
        return [DashboardTabDTO(dashboard_tab) for dashboard_tab in dashboard_tabs]

    def get_dashboard_tab(self, conn_system_dashboard_tab_id: int) -> DashboardTabDTO:
        dashboard_tab = self.dashboard_tab_dao.get_dashboard_tab(conn_system_dashboard_tab_id)
        return DashboardTabDTO(dashboard_tab)

    def create_dashboard_tab(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDashboardTabSchema
    ) -> CreateDashboardTabResponseSchema:
        dashboard_tab = self.dashboard_tab_dao.create_dashboard_tab(
            conn_system_dashboard_id=conn_system_dashboard_id,
            name=getattr(request_data, "name", None),
            tab_type=getattr(request_data, "tab_type", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            kpis=json.dumps(getattr(request_data, "kpis", None)) if getattr(request_data, "kpis", None) else None,
            insights=json.dumps(getattr(request_data, "insights", None))
            if getattr(request_data, "insights", None)
            else None,
            tools=json.dumps(getattr(request_data, "tools", None)) if getattr(request_data, "tools", None) else None,
            created_by=user_id,
        )
        return {"status": "success", "dashboard_tab_data": CreateDashboardTabDTO(dashboard_tab)}

    def update_dashboard_tab(
        self, user_id: int, conn_system_dashboard_tab_id: int, request_data: CreateUpdateDashboardTabSchema
    ) -> MessageResponseSchema:
        dashboard_tab = self.dashboard_tab_dao.get_dashboard_tab(conn_system_dashboard_tab_id)

        if not dashboard_tab:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardTabErrors.DASHBOARD_TAB_NOT_FOUND_ERROR.value},
            )

        self.dashboard_tab_dao.update_dashboard_tab(
            connSystemDashboardTab=dashboard_tab,
            name=getattr(request_data, "name", None),
            tab_type=getattr(request_data, "tab_type", None),
            order_by=getattr(request_data, "order_by", None),
            is_active=getattr(request_data, "is_active", None),
            kpis=json.dumps(getattr(request_data, "kpis", None)) if getattr(request_data, "kpis", None) else None,
            insights=json.dumps(getattr(request_data, "insights", None))
            if getattr(request_data, "insights", None)
            else None,
            tools=json.dumps(getattr(request_data, "tools", None)) if getattr(request_data, "tools", None) else None,
            updated_by=user_id,
        )
        return {"message": DashboardTabSuccess.DASHBOARD_TAB_UPDATE_SUCCESS.value}

    def delete_dashboard_tab(self, user_id: int, conn_system_dashboard_tab_id: int) -> MessageResponseSchema:
        dashboard_tab = self.dashboard_tab_dao.get_dashboard_tab(conn_system_dashboard_tab_id)

        if not dashboard_tab:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardTabErrors.DASHBOARD_TAB_NOT_FOUND_ERROR.value},
            )

        self.dashboard_tab_dao.delete_dashboard_tab(
            connSystemDashboardTab=dashboard_tab,
            deleted_by=user_id,
        )
        return {"message": DashboardTabSuccess.DASHBOARD_TAB_DELETE_SUCCESS.value}
