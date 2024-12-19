from enum import Enum


class AuthErrors(Enum):
    MISSING_AUTH_ERROR = "No authorization token is provided"
    TOKEN_PARSE_ERROR = "Unable to parse authentication token"
    UNKNOWN_TOKEN_ERROR = "Unrecognized token"
    TOKEN_EXPIRED_ERROR = "Token has expired"
    TOKEN_CLAIMS_ERROR = "Incorrect claims, please check the audience and issuer"
    TOKEN_INVALID_ERROR = "Invalid token, authority params are wrong"
    TOKEN_DETAILS_MISMATCH_ERROR = "Could not match authorization token details"
    INCORRECT_TOKEN_ERROR = "Logged out token used by client"
    TOKEN_VALIDATION_ERROR = "Error validating token"
    ACCOUNT_ACCESS_EXPIRED_ERROR = "Your account access has expired"
    ACCOUNT_LOCKED_ERROR = "Account is locked for the mentioned duration"
    INCORRECT_PASSWORD_ERROR = "Login failed. Incorrect password."
    MISSING_REFRESH_TOKEN_ERROR = "No refresh token is provided"
    INVALID_REFRESH_TOKEN_ERROR = "Refresh token provided is not valid"
    AUTHENTICATION_FAILED_ERROR = "Authentication failed"
    ACCESS_DENIED_ERROR = "Access denied for this operation"
    TOKEN_SUBJECT_MISMATCH = "Token subject mismatch"
    INVALID_TOKEN_ERROR = "Invalid token"
