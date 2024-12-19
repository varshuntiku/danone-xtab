from enum import Enum


class IndustryErrors(Enum):
    ERROR_GETTING_INDUSTRIES = "Error fetching industries"
    ERROR_GETTING_INDUSTRY_BY_ID = "Error fetching industry by id"
    CHECK_INDUSTRY_BY_NAME_ERROR = "Error checking if industry exists with name"
    CHECK_INDUSTRY_BY_ID_ERROR = "Error checking if industry exists by id"
    INDUSTRY_CREATE_ERROR = "Error occurred in creating Industry"
    INDUSTRY_UPDATE_ERROR = "Error occurred in updating Industry"
    INDUSTRY_DELETE_ERROR = "Error occurred in deleting Industry"
    INDUSTRY_NAME_ALREADY_EXISTS_ERROR = "Industry with this name already exists"
    INDUSTRY_NOT_FOUND_ERROR = "Industry not found"
    DASHBOARD_BY_INDUSTRY_ID_NOT_FOUND_ERROR = "Dashboard doesn't exist for the given industry id"
    DASHBOARD_BY_INDUSTRY_ID_ERROR = "Error in fetching Dashboard with given industry id"
    GET_APPS_BY_INDUSTRY_ID_ERROR = "Error in fetching Apps or App users with given industry"
