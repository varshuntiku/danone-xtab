from functools import wraps
from typing import Annotated

from api.configs.settings import get_app_settings
from api.databases.dependencies import get_db
from api.middlewares.error_middleware import AuthenticationException
from api.models.base_models import User
from api.utils.auth.token import decode_token, validate_token
from fastapi import Header, status

settings = get_app_settings()
db_session = next(get_db())


def authenticate_user(func):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to authenticate,

    get the user info from token details if the token is verified.
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        token = request.headers.get("authorization", None)
        if not token:
            raise AuthenticationException(
                message="No authorization token is provided",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        token = token.split(" ")[1]
        validation_response = validate_token(token)
        if (
            "sub" in validation_response["decoded_token"]
            and validation_response["decoded_token"]["iss"] == settings.JWT_ENCODE_ISSUER
        ):
            email_address = validation_response["decoded_token"]["sub"]
        elif (
            "identity" in validation_response["decoded_token"]
            and validation_response["decoded_token"]["iss"] == settings.JWT_ENCODE_ISSUER
        ):
            email_address = validation_response["decoded_token"]["identity"]
        # azure tokens
        elif "upn" in validation_response["decoded_token"]:
            email_address = validation_response["decoded_token"]["upn"].lower()
        elif "appid" in validation_response["decoded_token"]:
            email_address = "system-app@themathcompany.com"
        else:
            raise AuthenticationException(
                message="could not match authorization token details",
                status_code=status.HTTP_403_FORBIDDEN,
            )
        # Setting Decoded Token to use neccesary information in route
        validation_response["email_address"] = email_address
        request.state.decoded_token = validation_response
        # Setting User Object to use neccesary information in route
        user = db_session.query(User).filter(User.email_address == email_address).first()
        if user:
            request.state.user = user
        return await func(request, *args, **kwargs)

    return wrapper


def super_user_required(f):
    """Returns if the given user has super user access.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(request, *args, **kwargs):
        user = request.state.user
        user_groups_list = user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.name == "super-user":
                has_access = True

        if has_access:
            return f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrap


def specific_user_required(f):
    """Returns if the given user has super user access.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(request, *args, **kwargs):
        user = request.state.user
        user_list = [
            "sourav.banerjee@mathco.com",
            "shridhar@mathco.com",
            "srivatsa@mathco.com",
            "biswajeet.mishra@mathco.com",
            "chandan.bilvaraj@mathco.com",
            "ranjith@mathco.com",
            "vaishnavi.k@mathco.com",
            "allen.abraham@mathco.com",
            "varshun.tiku@mathco.com",
            "divyananda.aravapalli@mathco.com",
            "anshul.singh@mathco.com",
            "ashwjit.mahadik@mathco.com",
        ]
        has_access = False

        if user.email_address in user_list:
            has_access = True

        if has_access:
            return f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrap


def validate_auth_token(token: Annotated[str, Header()]):
    """Takes a token and verifies its authority and checks for aud, iss, sub
    and allows the token to authenticate itself to perform the operation,

    get the token info from token details if the token is verified.
    """
    try:
        token_data = decode_token(token)
        return token_data
    except Exception as e:
        raise AuthenticationException(
            message="error validating token details, " + str(e),
            status_code=status.HTTP_403_FORBIDDEN,
        )
