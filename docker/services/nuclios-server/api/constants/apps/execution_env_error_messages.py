from enum import Enum


class ExecutionEnvErrors(Enum):
    GET_APP_DYNAMIC_EXEC_ENV_ERROR = "Error fetching app dynamic execution environment"
    GET_DYNAMIC_EXEC_ENV_ERROR = "Error fetching dynamic execution environment details"
    GET_DYNAMIC_EXEC_ENV_LIST_ERROR = "Unable to retrieve dynamic execution environments"
    UPDATE_APP_DYNAMIC_EXEC_ENV_ERROR = "Error updating app dynamic execution environment"
    CREATE_APP_DYNAMIC_EXEC_ENV_ERROR = "Error creating execution environment"
    START_APP_DYNAMIC_EXEC_ENV_ERROR = "Error initializing dynamic visualization environment"
    GET_DEFAULT_PYLIST_ERROR = "Unable to retrieve default requirements for dynamic execution environments"
    UPDATE_DYNAMIC_EXEC_ENV_DETAIL_ERROR = "Error updating dynamic execution environment"
