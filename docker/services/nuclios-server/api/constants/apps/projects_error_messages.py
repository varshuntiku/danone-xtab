from enum import Enum


class ProjectsErrors(Enum):
    GET_PROJECTS_LIST_ERROR = "Unable to retrieve projects list"
    GET_CASESTUDY_COUNT_ERROR = "Unable to retrieve casestudy count"
    CREATE_PROJECT_ERROR = "Error creating project"
    ADD_PROBLEM_DEFINITION_ERROR = "Error adding problem definition"
    GET_PROBLEM_DEFINITION_ERROR = "Error getting problem definition"
    GET_PROJECT_ID_ERROR = "Error getting project by project id"
    PROJECT_VERSION_NOT_FOUND_ERROR = "No versions found"
    VERSION_NAME_ALREADY_EXISTS = "Version name already exist"
    CREATE_VERSION_ERROR = "Error while creating new version"
    SET_VERSION_ERROR = "Error while setting version as default"
    UPDATE_PROJECT_ERROR = "Error updating project details"
    DELETE_PROJECT_ERROR = "Error deleting project"
