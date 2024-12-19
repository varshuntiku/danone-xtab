from api.daos.connected_systems.dashboard_dao import DashboardDao
from api.dtos.connected_systems.dashboard_dto import DashboardDataDTO


class DashboardService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.dashboard_dao = DashboardDao()

    def get_dashboard_data(self, request):
        dashboard_data = self.dashboard_dao.get_dashboard_data(request)
        transformed_dashboard_data = DashboardDataDTO(dashboard_data)

        return transformed_dashboard_data

    def get_dashboards(self):
        dashboards_data = self.dashboard_dao.get_dashboards()
        transformed_dashboards_data = []
        if dashboards_data:
            for dashboard_data in dashboards_data:
                transformed_dashboards_data.append(DashboardDataDTO(dashboard_data))

        return transformed_dashboards_data

    def delete_dashboard(self, request):
        self.dashboard_dao.delete_dashboard(request)

    def save_dashboard(self, request):
        self.dashboard_dao.save_dashboard(request)
