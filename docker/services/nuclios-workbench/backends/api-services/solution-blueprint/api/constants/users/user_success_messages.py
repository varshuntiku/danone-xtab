from enum import Enum


class UserSuccessMessages(Enum):
    USER_PASSWORD_UPDATE_SUCCESS_MESSAGE = "User password updated successfully"
    USER_TOKEN_CREATION_SUCCESS_MESSAGE = "Created JWT token successfully"
    USER_TOKENS_FETCH_SUCCESS_MESSAGE = "User tokens fetched successfully"
    USER_PASSCODE_UPDATE_SUCCESS_MESSAGE = "User password code details updated successfully"
    USER_VALID_OTP_SUCCESS_MESSAGE = "OTP validated successfully"
    USER_OTP_GENERATION_SUCCESS_MESSAGE = "Code generated successfully"
