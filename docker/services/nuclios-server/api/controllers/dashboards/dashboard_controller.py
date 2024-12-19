from typing import List

from api.controllers.base_controller import BaseController
from api.schemas.dashboards.dashboard_schema import (
    AppsScreensResponseSchema,
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
    DashboardHierarchyResponseSchema,
    DashboardSchema,
    DashboardTemplateResponseSchema,
    UserAppsHierarchyResponseSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.dashboards.dashboard_service import DashboardService


class DashboardController(BaseController):
    def get_dashboards(self) -> List[DashboardSchema]:
        with DashboardService() as dashboard_service:
            dashboards = dashboard_service.get_dashboards()
            return dashboards

    def create_dashboard(
        self, user_id: int, request_data: CreateUpdateDashboardSchema
    ) -> CreateDashboardResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.create_dashboard(user_id, request_data)
            return response

    def update_dashboard(
        self, user_id: int, dashboard_id: int, request_data: CreateUpdateDashboardSchema
    ) -> MessageResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.update_dashboard(user_id, dashboard_id, request_data)
            return response

    def delete_dashboard(self, user_id: int, dashboard_id: int) -> MessageResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.delete_dashboard(user_id, dashboard_id)
            return response

    def get_dashboard_templates(self) -> List[DashboardTemplateResponseSchema]:
        with DashboardService() as dashboard_service:
            dashboards = dashboard_service.get_dashboard_templates()
            return dashboards

    def get_dashboard_details(self, dashboard_id: int, dashboard_url: str) -> DashboardSchema | MessageResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.get_dashboard_details(dashboard_id, dashboard_url)
            return response

    def get_dashboard_hierarchy(self, dashboard_id: int) -> DashboardHierarchyResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.get_dashboard_hierarchy(dashboard_id)
            return response

    def get_user_apps_hierarchy(self, logged_in_email: str) -> UserAppsHierarchyResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.get_user_apps_hierarchy(logged_in_email)
            return response

    def get_apps_and_screens(self, function_id: int) -> AppsScreensResponseSchema:
        with DashboardService() as dashboard_service:
            response = dashboard_service.get_apps_and_screens(function_id)
            return response
