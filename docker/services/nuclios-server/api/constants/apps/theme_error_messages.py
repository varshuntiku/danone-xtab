from enum import Enum


class ThemeErrors(Enum):
    ERROR_GETTING_THEMES = "Error fetching themes"
    ERROR_GETTING_THEME_BY_NAME = "Error fetching themes by name"
    ERROR_ADDING_THEME = "Error adding theme"
    ERROR_ADDING_THEME_MODE = "Error adding theme mode"
    ERROR_THEME_NAME_EXISTS = "Theme name already exists"
    ERROR_GETTING_THEME_BY_ID = "Error while getting app theme"
    ERROR_THEME_NOT_FOUND = "Theme doesn't exist"
    ERROR_THEME_READONLY = "Immutable themes can't be deleted"
    ERROR_DELETE_THEME = "Error while updating app theme"
    ERROR_UPDATE_THEME = "Error while updating app theme"
    ERROR_GETTING_APPS_BY_THEME_ID = "An error occurred while retrieving the apps."
