from enum import Enum


class GeneralErrors(Enum):
    ACCESS_ERROR = "You do not have access to this feature"
    NOT_FOUND_ERROR = "Item not found"
    UIAC_VALIDATION_ERROR = (
        "One of the Module Imported can cause security issues and hence the execution operation has been cancelled"
    )
