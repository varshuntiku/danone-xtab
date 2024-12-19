from api.daos.connected_systems.dashboard_tab_dao import DashboardTabDao
from api.dtos.connected_systems.dashboard_tab_dto import DashboardTabDataDTO


class DashboardTabService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.dashboard_tab_dao = DashboardTabDao()

    def get_dashboard_tab_data(self, request):
        dashboard_tab_data = self.dashboard_tab_dao.get_dashboard_tab_data(request)
        transformed_dashboard_tab_data = DashboardTabDataDTO(dashboard_tab_data)

        return transformed_dashboard_tab_data

    def delete_dashboard_tab(self, request):
        self.dashboard_tab_dao.delete_dashboard_tab(request)

    def save_dashboard_tab(self, request):
        self.dashboard_tab_dao.save_dashboard_tab(request)
