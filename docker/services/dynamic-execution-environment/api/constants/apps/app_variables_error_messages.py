from enum import Enum


class AppVariablesErrors(Enum):
    CREATE_APP_VARIABLE_ERROR = "Error in creating app variable"
    UPDATE_APP_VARIABLE_ERROR = "Error in update operation, variable does not exist in application variables"
    DELETE_APP_VARIABLE_ERROR = "Error in delete operation, variable does not exist in application variables"
    GET_APP_VARIABLE_VALUE_ERROR = "Error in fetch operation, variable does not exist in application variables"
