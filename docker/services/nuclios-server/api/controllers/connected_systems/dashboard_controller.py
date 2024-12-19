from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.connected_systems.dashboard_schema import (
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
    DashboardDataSchema,
    DashboardSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.serializers.connected_systems.dashboard_serializer import (
    DashboardDataSerializer,
    DashboardListSerializer,
)
from api.services.connected_systems.dashboard_service import DashboardService


class DashboardController(BaseController):
    def get_dashboards(self, active=False) -> List[DashboardSchema]:
        with DashboardService() as dashboard_service:
            dashboards = dashboard_service.get_dashboards(active)
            response = []
            for dashboard in dashboards:
                serializer = DashboardListSerializer(dashboard)
                response.append(serializer.serialized_data)
            return response

    def get_dashboard(self, conn_system_dashboard_id: int) -> DashboardDataSchema:
        with DashboardService() as dashboard_service:
            dashboard = dashboard_service.get_dashboard(conn_system_dashboard_id)
            serializer = DashboardDataSerializer(dashboard)
            return serializer.serialized_data

    def create_dashboard(
        self, user_id: int, request_data: CreateUpdateDashboardSchema
    ) -> CreateDashboardResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.create_dashboard(user_id, request_data)
            return response

    def update_dashboard(
        self, user_id: int, conn_system_dashboard_id: int, request_data: CreateUpdateDashboardSchema
    ) -> MessageResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.update_dashboard(user_id, conn_system_dashboard_id, request_data)
            return response

    def delete_dashboard(self, user_id: int, conn_system_dashboard_id: int) -> MessageResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.delete_dashboard(user_id, conn_system_dashboard_id)
            return response
