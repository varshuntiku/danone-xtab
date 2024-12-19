from enum import Enum


class ResourceTypes(str, Enum):
    uiac = "uiac"
    action = "action"
    filter = "filter"
    widget_filter = "widget_filter"
    code = "code"
    app_function = "app-function"


class RendererTypes(str, Enum):
    render = "render"
    test = "test"


class defaultExecEnvType(str, Enum):
    default = "default"


class CodeExecutionStatus(str, Enum):
    success = "success"
    error = "error"
    failed = "failed"
    pending = "pending"


class CodeExecutionErrors(str, Enum):
    widget_value_id_not_found = "Provided widget doesn't have UIAC configured"
    screen_action_not_found = "Provided screen doesn't have any action configured"
    screen_filter_not_found = "Provided screen doesn't have any filter configured"
