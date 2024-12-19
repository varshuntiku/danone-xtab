class DashboardDTO:
    def __init__(self, dashboard, dashboard_template=None):
        self.id = dashboard.id
        self.name = dashboard.dashboard_name
        self.icon = dashboard.dashboard_icon
        self.order = dashboard.dashboard_order
        self.root = dashboard.root_industry_id
        self.url = dashboard.dashboard_url if dashboard.dashboard_url else None
        self.template = dashboard.dashboard_template_id
        self.code = dashboard.dashboard_code

        if dashboard_template:
            self.template = {
                "id": dashboard_template.id,
                "name": dashboard_template.name,
            }


class CreateDashboardDTO:
    def __init__(self, dashboard):
        self.dashboard_id = dashboard.id
        self.dashboard_name = dashboard.dashboard_name
        self.dashboard_icon = dashboard.dashboard_icon
        self.dashboard_order = dashboard.dashboard_order
        self.root_industry_id = dashboard.root_industry_id
        self.dashboard_url = dashboard.dashboard_url
        self.dashboard_template_id = dashboard.dashboard_template_id


class DashboardTemplateDTO:
    def __init__(self, template):
        self.id = template.id
        self.name = template.name
        self.description = template.description
