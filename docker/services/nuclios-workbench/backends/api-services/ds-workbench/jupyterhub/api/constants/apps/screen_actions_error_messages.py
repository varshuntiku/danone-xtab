from enum import Enum


class ScreenActionsErrors(Enum):
    APP_SCREEN_ACTION_CODE_EXECUTION_ERROR = "Error executing code"
    APP_SCREEN_ACTION_CODE_MISSING_ATTR_ERROR = "Error executing code: No required attributes"
    APP_SCREEN_PREVIEW_ACTIONS_ERROR = "Issue with getting actions"
    APP_SCREEN_DYNAMIC_ACTIONS_ERROR = "Item not found"
