from api.helpers.generic_helpers import GenericHelper

generic_helper = GenericHelper()


class DashboardDTO:
    def __init__(self, connSystemDashboard):
        self.id = connSystemDashboard.id
        self.name = connSystemDashboard.name
        self.description = connSystemDashboard.description
        self.is_active = connSystemDashboard.is_active
        self.industry = connSystemDashboard.industry
        self.function = connSystemDashboard.function
        self.small_logo_url = (
            generic_helper.get_blob(connSystemDashboard.small_logo_blob_name)
            if connSystemDashboard.small_logo_blob_name
            else False
        )
        self.small_logo_blob_name = connSystemDashboard.small_logo_blob_name
        self.tabs = connSystemDashboard.tabs
        self.created_at = connSystemDashboard.created_at
        self.created_by_user = connSystemDashboard.created_by_user if connSystemDashboard.created_by else "--"
        self.updated_at = connSystemDashboard.updated_at


class CreateDashboardDTO:
    def __init__(self, connSystemDashboard):
        self.id = connSystemDashboard.id
        self.name = connSystemDashboard.name
        self.description = connSystemDashboard.description
        self.is_active = connSystemDashboard.is_active
        self.industry = connSystemDashboard.industry
        self.function = connSystemDashboard.function
