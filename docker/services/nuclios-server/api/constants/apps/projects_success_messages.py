from enum import Enum


class ProjectSuccess(Enum):
    PROJECT_VERSION_DELETE_SUCCESS = "Version deleted successfully"
    PROJECT_VERSION_CREATE_SUCCESS = "New version created successfully"
    PROJECT_VERSION_SET_SUCCESS = "Version set as current version"
