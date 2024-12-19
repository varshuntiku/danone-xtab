from enum import Enum


class ThemeErrors(Enum):
    ERROR_GETTING_THEMES = "Error fetching themes"
    ERROR_GETTING_THEME_BY_NAME = "Error fetching themes by name"
    ERROR_ADDING_THEME = "Error adding theme"
    ERROR_ADDING_THEME_MODE = "Error adding theme mode"
    ERROR_THEME_NAME_EXISTS = "Theme name already exists"
