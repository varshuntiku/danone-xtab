import json
import logging
from functools import wraps
from typing import Annotated

import msal
from api.configs.settings import get_app_settings
from api.constants.auth.auth_error_messages import AuthErrors
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from api.utils.auth.token import validate_token
from fastapi import Header, status
from sentry_sdk import configure_scope

settings = get_app_settings()

AUTHORITY = f"https://login.microsoftonline.com/" + settings.AZURE_OAUTH_TENANCY
# SCOPES = ["https://graph.microsoft.com/User.ReadBasic.All"]
SCOPES = ["https://graph.microsoft.com/.default"]


# MSAL Client
msal_client = msal.ConfidentialClientApplication(
    client_id=settings.AZURE_OAUTH_APPLICATION_ID,
    client_credential=settings.AZURE_OAUTH_CLIENT_SECRET,
    authority=AUTHORITY,
)


def authenticate_user(func):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to authenticate,
    get the user info from token details if the token is verified.
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        try:
            # db_session = get_db()
            # users_dao = UsersDao(db_session)
            authorization = request.headers.get("authorization", None)
            if not authorization:
                raise AuthenticationException(
                    message={"error": AuthErrors.MISSING_AUTH_ERROR.value},
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )
            token = authorization.split(" ")[1]
            validation_response = validate_token(token)
            if (
                type(validation_response) is dict
                and "status" in validation_response
                and validation_response["status"] == "success"
            ):
                pass
            else:
                return validation_response

            # Get the user from the token details
            # db user tokens
            if validation_response["decoded_token"]["upn"]:
                email_address = validation_response["decoded_token"]["upn"].lower()
            else:
                raise AuthenticationException(
                    message={"error": AuthErrors.TOKEN_DETAILS_MISMATCH_ERROR.value},
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )

            request.state.full_name = validation_response["decoded_token"]["name"]
            if email_address:
                request.state.logged_in_email = email_address

            request.state.auth_info = validation_response["decoded_token"]
            request.state.user_info = {"user": {"email": email_address}}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message={"error": AuthErrors.TOKEN_VALIDATION_ERROR.value},
            )
        # finally:
        #     db_session.close()

        with configure_scope() as scope:
            scope.user = {"email": email_address}

        return await func(request, *args, **kwargs)

    return wrapper


# Dependency to get an access token
def get_access_token():
    result = msal_client.acquire_token_for_client(scopes=SCOPES)
    if "access_token" in result:
        return result["access_token"]
    else:
        raise Exception(status_code=500, detail="Could not acquire access token")
