from enum import Enum


class DashboardErrors(Enum):
    GET_DASHBOARDS_ERROR = "Error fetching dashboards"
    CREATE_DASHBOARD_ERROR = "Error adding dashboard"
    DASHBOARD_NOT_FOUND_ERROR = "Could not find dashboard by the given id"
    GET_DASHBOARD_ERROR = "Error fetching the dashboard"
    UPDATE_DASHBOARD_ERROR = "Error updating dashboard"
    DELETE_DASHBOARD_ERROR = "Error deleting dashboard"
    GET_DASHBOARD_TEMPLATES_ERROR = "Error fetching dashboard templates"
    DASHBOARD_NOT_EXIST_ERROR = "Dashboard doesn't exist"
    DASHBOARD_HIERARCHY_ERROR = "Error while trying to get the dashboard hierarchy"
