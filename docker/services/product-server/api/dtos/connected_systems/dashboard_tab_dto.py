class DashboardTabDataDTO:
    def __init__(self, dashboard_tab_data):
        self.id = dashboard_tab_data.id
        self.name = dashboard_tab_data.name
        self.tab_type = dashboard_tab_data.tab_type
        self.is_active = dashboard_tab_data.is_active
        self.order_by = dashboard_tab_data.order_by
        self.kpis = dashboard_tab_data.kpis
        self.insights = dashboard_tab_data.insights
        self.tools = dashboard_tab_data.tools
