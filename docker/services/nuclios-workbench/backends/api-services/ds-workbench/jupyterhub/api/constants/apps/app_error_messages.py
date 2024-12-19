from enum import Enum


class AppErrors(Enum):
    GET_APP_ERROR = "Error fetching app details"
    CHECK_APP_EXISTS_ERROR = "Error checking if app exists"
    APP_NOT_FOUND_ERROR = "App with given id does not exist"
    APP_CONTAINER_CREATE_ERROR = "Error creating app container"
    CREATE_APP_ERROR = "Error creating app"
    GET_CONTAINER_MAPPINGS_ERROR = "Error getting container mappings"
    CREATE_CONTAINER_MAPPING_ERROR = "Error craeting container mapping"
    GET_PARENT_CONTAINER_APPS_ERROR = "Error getting apps under same parent container"
    APP_OVERVIEW_UPDATE_ERROR = "Error updating app overview"
