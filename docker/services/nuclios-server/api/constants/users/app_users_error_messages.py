from enum import Enum


class AppUsersErrors(Enum):
    GET_APP_USER_ROLES_ERROR = "Error fetching app user roles"
    GET_APP_USER_ROLE_ERROR = "Error fetching app user role"
    GET_APP_USERS_ERROR = "Error fetching app users"
    GET_APP_USER_ERROR = "Error fetching app user"
    GET_APP_USERS_ROLE_MAPPING_ERROR = "Error fetching app users with the given role"
    DELETE_APP_USER_ROLE_ERROR = "Error deleting app user role"
    DELETE_APP_USER_ERROR = "Error deleting app user"
    UPDATE_APP_USER_ROLE_ERROR = "Error updating app user role"
    UPDATE_APP_USER_ERROR = "Error updating app user"
    CREATE_APP_USER_ROLE_ERROR = "Error creating app user role"
    CREATE_APP_USER_ERROR = "Error creating app user"
    CONFLICTING_ROLE_NAME_ERROR = "Conflicting role name"
    APP_USER_EXISTS = "App user already exists"
    CONFLICTING_EMAIL_ID_ERROR = "Conflicting email id"
    ROLE_ASSOCIATED_WITH_USERS_ERROR = "Role is associated with users"
    SELF_ACCOUNT_DELETE_ERROR = "Deleting self account is not allowed"
    REQUEST_DATA_ERROR = "Error parsing request data"
    USER_APPS_ERROR = "Error fetching user apps"
