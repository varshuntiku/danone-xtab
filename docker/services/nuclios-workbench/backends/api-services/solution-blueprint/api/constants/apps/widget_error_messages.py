from enum import Enum


class WidgetErrors(Enum):
    GET_WIDGETS_BY_APP_SCREEN_IDS_ERROR = "Error fetching widgets for given app id and screen id"
    GET_WIDGETS_BY_SCREEN_ID_ERROR = "Error fetching widgets for given screen id"
    GET_WIDGET_BY_ID_ERROR = "Error fetching widget with the given id"
    WIDGET_NOT_FOUND_ERROR = "Could not find widget with the given id"
    ADD_WIDGET_ERROR = "Error while adding new widget"
    UPDATE_WIDGET_ERROR = "Error updating widget"
    SAVE_LAYOUT_ERROR = "Error while saving screen layout"
    SAVE_UIAC_ERROR = "Error while saving widget uiac"
    WIDGET_VALUE_NOT_FOUND_ERROR = "Could not find widget value for the given ids"
    UPDATE_WIDGET_VALUE_ERROR = "Error updating widget value"
    ADD_WIDGET_VALUE_ERROR = "Error while adding new widget value"
    DELETE_WIDGET_ERROR = "Error deleting the provided widget"
    DELETE_WIDGET_VALUE_ERROR = "Error deleting the provided widget value"
    GET_FILTERED_WIDGET_VALUES_ERROR = "Error fetching the widget values satisfying the given condition"
