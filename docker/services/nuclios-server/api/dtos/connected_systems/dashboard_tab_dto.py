from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class DashboardTabDTO:
    def __init__(self, connSystemDashboardTab):
        self.id = connSystemDashboardTab.id
        self.name = connSystemDashboardTab.name
        self.tab_type = connSystemDashboardTab.tab_type
        self.order_by = connSystemDashboardTab.order_by
        self.is_active = connSystemDashboardTab.is_active
        self.kpis = connSystemDashboardTab.kpis
        self.insights = connSystemDashboardTab.insights
        self.tools = connSystemDashboardTab.tools
        self.created_at = connSystemDashboardTab.created_at
        self.created_by_user = connSystemDashboardTab.created_by_user if connSystemDashboardTab.created_by else "--"
        self.updated_at = connSystemDashboardTab.updated_at


class CreateDashboardTabDTO:
    def __init__(self, connSystemDashboardTab):
        self.id = connSystemDashboardTab.id
        self.name = connSystemDashboardTab.name
        self.tab_type = connSystemDashboardTab.tab_type
        self.order_by = connSystemDashboardTab.order_by
        self.is_active = connSystemDashboardTab.is_active
