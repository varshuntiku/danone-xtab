from enum import Enum


class ScreenErrors(Enum):
    APP_SCREEN_BY_ID_ERROR = "Error getting app screen"
    APP_SCREEN_UPDATE_ERROR = "Error updating app screen"
    APP_SCREEN_NOT_FOUND_ERROR = "App Screen not found"
    GET_SCREEN_BY_ID_ERROR = "Error fetching screen for given id"
    GET_SCREENS_BY_APP_ID_ERROR = "Error fetching screens for given app id"
    UPDATE_SCREEN_ERROR = "Error updating screen"
    DELETE_SCREEN_ERROR = "Error deleting screen"
    CREATE_SCREEN_ERROR = "Error creating screen"
    SAVE_SCREENS_ERROR = "Error saving screens"
    UPDATE_SCREEN_LAYOUT_ERROR = "Error updating screen layout details"
    COUNT_SCREEN_WIDGET_ERROR = "Error getting count of screen widgets by screen id"
    GET_OVERVIEW_ERROR = "Error getting screen overview"
    APP_SCREEN_NOT_FOUND = "App or screen not found"
    SAVE_SCREEN_FILTER_ERROR = "Error saving screen filter uiac code"
