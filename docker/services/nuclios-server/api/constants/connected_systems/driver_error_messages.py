from enum import Enum


class DriverErrors(Enum):
    GET_DRIVERS_ERROR = "Error fetching connected system drivers"
    CREATE_DRIVER_ERROR = "Error adding connected system driver"
    DRIVER_NOT_FOUND_ERROR = "Could not find connected system driver by the given id"
    GET_DRIVER_ERROR = "Error fetching the connected system driver"
    UPDATE_DRIVER_ERROR = "Error updating connected system driver"
    DELETE_DRIVER_ERROR = "Error deleting connected system driver"
    DRIVER_NOT_EXIST_ERROR = "Connected system driver doesn't exist"
