from api.helpers import get_blob


class DashboardDataDTO:
    def __init__(self, dashboard_data):
        self.id = dashboard_data.id
        self.name = dashboard_data.name
        self.description = dashboard_data.description
        self.is_active = dashboard_data.is_active
        self.industry = dashboard_data.industry
        self.function = dashboard_data.function
        self.small_logo_url = (
            get_blob(dashboard_data.small_logo_blob_name) if dashboard_data.small_logo_blob_name else False
        )
        self.small_logo_blob_name = dashboard_data.small_logo_blob_name
        self.tabs = dashboard_data.tabs
        self.created_at = dashboard_data.created_at
        self.created_by = dashboard_data.created_by
        self.updated_at = dashboard_data.updated_at
