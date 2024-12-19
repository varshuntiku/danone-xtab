from enum import Enum


class FunctionErrors(Enum):
    ERROR_GETTING_FUNCTIONS = "Error fetching functions"
    ERROR_GETTING_FUNCTION_BY_ID = "Error fetching function by id"
    FUNCTION_NAME_ALREADY_EXISTS_ERROR = "Function name already exists"
    ERROR_CHECKING_FUNCTION_EXISTS_BY_NAME = "Error checking if function name exists"
    ERROR_CREATING_FUNCTION = "Error while creating new function"
    FUNCTION_NOT_FOUND_ERROR = "Function with this id does not exists"
    ERROR_UPDATING_FUNCTION = "Error while updating function"
    ERROR_DELETING_FUNCTION = "Error while deleting function"
