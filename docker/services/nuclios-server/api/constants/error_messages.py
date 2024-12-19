from enum import Enum


class GeneralErrors(Enum):
    ACCESS_ERROR = "You do not have access to this feature"
    NOT_FOUND_ERROR = "Item not found"
    UIAC_VALIDATION_ERROR = (
        "One of the Module Imported can cause security issues and hence the execution operation has been cancelled"
    )
    BLOB_UPLOAD_ERROR = "Error uploading file from blob storage"
    BLOB_DELETE_ERROR = "Error deleting file from blob storage"
    BLOB_GET_ERROR = "Error getting bolb from storage"
    CONNECT_GEN_AI_MODEL_ERROR = "Error: Could not connect to the GenAI Model"
    CODE_NOT_EXISTS_ERROR = "Code does not exist"
    ACCESS_DENIED_ERROR = "You do not have access to view this data"
    OPERATION_FAILED_ERROR = "Error in operation"
    FILE_REMOVE_EMPTY_VALUE_ERROR = "Please remove empty values from file"
    FILE_REMOVE_DUPLICATE_EMAIL_ERROR = "Please remove duplicates in email"
    UNDEFINED_TYPE_ERROR = "Type not defined"
    SAVE_EMPTY_VALUE_ERROR = "Empty values cannot be saved"
    CODE_EXECUTION_ERROR = "Error executing code"
