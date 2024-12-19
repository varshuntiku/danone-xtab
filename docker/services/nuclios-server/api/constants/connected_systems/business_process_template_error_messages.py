from enum import Enum


class BusinessProcessTemplateErrors(Enum):
    GET_BUSINESS_PROCESS_TEMPLATES_ERROR = "Error fetching connected system business process templates"
    CREATE_BUSINESS_PROCESS_TEMPLATE_ERROR = "Error adding connected system business process template"
    BUSINESS_PROCESS_TEMPLATE_NOT_FOUND_ERROR = (
        "Could not find connected system business process template by the given id"
    )
    GET_BUSINESS_PROCESS_TEMPLATE_ERROR = "Error fetching the connected system business process template"
    UPDATE_BUSINESS_PROCESS_TEMPLATE_ERROR = "Error updating connected system business process template"
    DELETE_BUSINESS_PROCESS_TEMPLATE_ERROR = "Error deleting connected system business process template"
    BUSINESS_PROCESS_TEMPLATE_NOT_EXIST_ERROR = "Connected system business process template doesn't exist"
