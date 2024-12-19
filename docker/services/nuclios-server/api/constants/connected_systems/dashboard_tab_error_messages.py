from enum import Enum


class DashboardTabErrors(Enum):
    GET_DASHBOARD_TABS_ERROR = "Error fetching connected system tabs"
    CREATE_DASHBOARD_TAB_ERROR = "Error adding connected system tab"
    DASHBOARD_TAB_NOT_FOUND_ERROR = "Could not find connected system tab by the given id"
    GET_DASHBOARD_TAB_ERROR = "Error fetching the connected system tab"
    UPDATE_DASHBOARD_TAB_ERROR = "Error updating connected system tab"
    DELETE_DASHBOARD_TAB_ERROR = "Error deleting connected system tab"
    DASHBOARD_TAB_NOT_EXIST_ERROR = "Connected system tab doesn't exist"
