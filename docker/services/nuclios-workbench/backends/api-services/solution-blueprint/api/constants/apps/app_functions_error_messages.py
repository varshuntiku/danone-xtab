from enum import Enum


class AppFunctionsErrors(Enum):
    CREATE_APP_FUNCTION_ERROR = "Error while adding application function"
    ALREADY_EXISTS_KEY_ERROR = "Key Already exists"
    UPDATE_APP_FUNCTION_ERROR = "Error in update operation, function does not exist in application functions"
    DELETE_APP_FUNCTION_ERROR = "Error in delete operation, function does not exist in application functions"
    KEY_NOT_FOUND_ERROR = " Key does not exist in application functions"
    GET_APP_FUNCTION_ERROR = "Error in fetch operation, function does not exist in application functions"
