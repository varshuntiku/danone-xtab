from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.dashboard_tab_schema import (
    CreateDashboardTabResponseSchema,
    CreateUpdateDashboardTabSchema,
    DashboardTabDataSchema,
    DashboardTabSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.dashboard_tab_serializer import (
    DashboardTabDataSerializer,
    DashboardTabListSerializer,
)
from api.services.connected_systems.dashboard_tab_service import DashboardTabService


class DashboardTabController(BaseController):
    def get_dashboard_tabs(self, conn_system_dashboard_id: int) -> List[DashboardTabSchema]:
        with DashboardTabService() as dashboard_tab_service:
            dashboard_tabs = dashboard_tab_service.get_dashboard_tabs(conn_system_dashboard_id)
            response = []
            for dashboard_tab in dashboard_tabs:
                serializer = DashboardTabListSerializer(dashboard_tab)
                response.append(serializer.serialized_data)
            return response

    def get_dashboard_tab(self, conn_system_dashboard_tab_id: int) -> DashboardTabDataSchema:
        with DashboardTabService() as dashboard_tab_service:
            dashboard_tab = dashboard_tab_service.get_dashboard_tab(conn_system_dashboard_tab_id)
            serializer = DashboardTabDataSerializer(dashboard_tab)
            return serializer.serialized_data

    def create_dashboard_tab(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDashboardTabSchema
    ) -> CreateDashboardTabResponseSchema:
        with DashboardTabService() as dashboard_tab_service:
            response = dashboard_tab_service.create_dashboard_tab(user_id, conn_system_dashboard_id, request_data)
            return response

    def update_dashboard_tab(
        self, user_id: int, conn_system_dashboard_tab_id: int, request_data: CreateUpdateDashboardTabSchema
    ) -> MessageResponseSchema:
        with DashboardTabService() as dashboard_tab_service:
            response = dashboard_tab_service.update_dashboard_tab(user_id, conn_system_dashboard_tab_id, request_data)
            return response

    def delete_dashboard_tab(self, user_id: int, conn_system_dashboard_tab_id: int) -> MessageResponseSchema:
        with DashboardTabService() as dashboard_tab_service:
            response = dashboard_tab_service.delete_dashboard_tab(user_id, conn_system_dashboard_tab_id)
            return response
