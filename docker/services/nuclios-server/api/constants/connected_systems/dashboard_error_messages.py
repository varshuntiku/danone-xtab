from enum import Enum


class DashboardErrors(Enum):
    GET_DASHBOARDS_ERROR = "Error fetching connected systems"
    CREATE_DASHBOARD_ERROR = "Error adding connected system"
    DASHBOARD_NOT_FOUND_ERROR = "Could not find connected system by the given id"
    GET_DASHBOARD_ERROR = "Error fetching the connected system"
    UPDATE_DASHBOARD_ERROR = "Error updating connected system"
    DELETE_DASHBOARD_ERROR = "Error deleting connected system"
    DASHBOARD_NOT_EXIST_ERROR = "Connected system doesn't exist"
