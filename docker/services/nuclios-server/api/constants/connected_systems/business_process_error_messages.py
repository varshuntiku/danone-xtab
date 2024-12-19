from enum import Enum


class BusinessProcessErrors(Enum):
    GET_BUSINESS_PROCESSES_ERROR = "Error fetching connected system business processes"
    CREATE_BUSINESS_PROCESS_ERROR = "Error adding connected system business process"
    BUSINESS_PROCESS_NOT_FOUND_ERROR = "Could not find connected system business process by the given id"
    GET_BUSINESS_PROCESS_ERROR = "Error fetching the connected system business process"
    UPDATE_BUSINESS_PROCESS_ERROR = "Error updating connected system business process"
    DELETE_BUSINESS_PROCESS_ERROR = "Error deleting connected system business process"
    BUSINESS_PROCESS_NOT_EXIST_ERROR = "Connected system business process doesn't exist"
