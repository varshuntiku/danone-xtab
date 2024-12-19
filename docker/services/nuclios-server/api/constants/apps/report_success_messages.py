from enum import Enum


class ReportSuccess(Enum):
    CREATE_SUCCESS = "Created Successfully"
    DELETE_SUCCESS = "Deleted Successfully"
    UPDATE_SUCCESS = "Layout updated successfully"
    ACCESS_GRANTED_SUCCESS = "Access granted"
    SENT_SUCCESS = "Sent Successfully"
    SCHEDULE_SUCCESS = "Successfully Scheduled"
