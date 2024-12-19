import json
import logging
from functools import wraps
from typing import Annotated

from api.configs.settings import get_app_settings
from api.constants.auth.auth_error_messages import AuthErrors
from api.constants.error_messages import GeneralErrors
from api.constants.users.user_error_messages import UserErrors
from api.daos.users.app_users_dao import AppUsersDao
from api.daos.users.users_dao import UsersDao
from api.databases.dependencies import get_db
from api.helpers.projects.hub_helper import jp_hub_token_decode
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from api.utils.auth.authenticate import (
    create_access_token,
    get_all_user_permissions,
    get_request_action,
    verify_action_permission,
)
from api.utils.auth.token import decode_token, validate_token
from fastapi import Header, status
from sentry_sdk import configure_scope

settings = get_app_settings()


def authenticate_user(func):
    """Takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to authenticate,
    get the user info from token details if the token is verified.
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        try:
            db_session = get_db()
            users_dao = UsersDao(db_session)
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
                if (
                    "given_name" in validation_response["decoded_token"]
                    and validation_response["decoded_token"]["given_name"]
                ):
                    first_name = validation_response["decoded_token"]["given_name"]
                elif "name" in validation_response["decoded_token"] and validation_response["decoded_token"]["name"]:
                    name_list = validation_response["decoded_token"]["name"].split()
                    if len(name_list) > 0:
                        first_name = name_list[0]
                        last_name = name_list[1]
                if (
                    "family_name" in validation_response["decoded_token"]
                    and validation_response["decoded_token"]["family_name"]
                ):
                    last_name = validation_response["decoded_token"]["family_name"]
                email_address = validation_response["decoded_token"]["upn"].lower()
            elif "appid" in validation_response["decoded_token"]:
                first_name = "System"
                last_name = "Application"
                email_address = "system-app@themathcompany.com"
            else:
                raise AuthenticationException(
                    message={"error": AuthErrors.TOKEN_DETAILS_MISMATCH_ERROR.value},
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )

            found_user = users_dao.get_user_by_email(email_address)

            # If the user is not found they are created
            client_email_domain = settings.CLIENT_EMAIL_DOMAIN
            if not found_user:
                if client_email_domain not in email_address:
                    raise GeneralException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
                    )

                else:
                    found_user = users_dao.add_user(
                        first_name=first_name,
                        last_name=last_name,
                        email_address=email_address,
                        user_groups=[],
                        restricted_user=False,
                        access_key=True,
                        login=True,
                    )
            else:
                email_address = found_user.email_address
                users_dao.update_user_last_login(found_user)
                # check if token was issued after logout - if not, then send 401 response
                if (
                    found_user.last_logout is None
                    or found_user.last_logout.timestamp() < validation_response["decoded_token"]["iat"] + 360
                ):
                    pass
                else:
                    raise GeneralException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        message={"error": AuthErrors.INCORRECT_TOKEN_ERROR.value},
                    )

            request.state.user = found_user
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
        finally:
            db_session.close()

        with configure_scope() as scope:
            scope.user = {"email": email_address}

        return await func(request, *args, **kwargs)

    return wrapper


def app_publish_required(func):
    """
    Returns if the given user has access to RBAC
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        if request.state.platform_user["feature_access"].get("app_publish", False):
            return await func(request, *args, **kwargs)
        else:
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_ERROR.value}, status_code=status.HTTP_403_FORBIDDEN
            )

    return wrapper


def platform_user_info_required(func):
    """
    Returns if the given user has access to RBAC
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        feature_access = {
            "app": False,
            "case_studies": False,
            "my_projects": False,
            "my_projects_only": False,
            "all_projects": False,
            "widget_factory": False,
            "environments": False,
            "rbac": False,
            "admin": False,
        }
        nac_roles = []

        try:
            for group_row in request.state.user.user_groups:
                if group_row.app:
                    feature_access["app"] = True
                if group_row.my_projects:
                    feature_access["my_projects"] = True
                    feature_access["admin"] = True
                if group_row.my_projects_only:
                    feature_access["my_projects_only"] = True
                    feature_access["admin"] = True
                if group_row.case_studies:
                    feature_access["case_studies"] = True
                    feature_access["admin"] = True
                if group_row.all_projects:
                    feature_access["all_projects"] = True
                    feature_access["admin"] = True
                if group_row.widget_factory:
                    feature_access["widget_factory"] = True
                    feature_access["admin"] = True
                if group_row.environments:
                    feature_access["environments"] = True
                    feature_access["admin"] = True
                if group_row.app_publish:
                    feature_access["app_publish"] = True
                    feature_access["admin"] = True
                if group_row.prod_app_publish:
                    feature_access["prod_app_publish"] = True
                    feature_access["admin"] = True
                if group_row.rbac:
                    feature_access["rbac"] = True
                    feature_access["admin"] = True
            for group_row in request.state.user.nac_user_roles:
                role_data = {
                    "name": group_row.name,
                    "id": group_row.id,
                    "permissions": [{"name": item.name.upper(), "id": item.id} for item in group_row.role_permissions],
                }
                nac_roles.append(role_data)

            response = {
                "status": "success",
                "user_id": request.state.user.id,
                "username": request.state.user.email_address,
                "is_restricted_user": request.state.user.restricted_user,
                "first_name": request.state.user.first_name,
                "last_name": request.state.user.last_name,
                "last_login": request.state.user.last_login.strftime("%d %B, %Y %H:%M")
                if request.state.user.last_login
                else None,
                "access_key": request.state.user.access_key,
                "feature_access": feature_access,
            }
            if feature_access.get("app_publish", False):
                response["nac_roles"] = nac_roles
                token_payload = {
                    "user_email": request.state.user.email_address,
                    "user_id": request.state.user.id,
                    "nac_roles": nac_roles,
                }
                nac_access_token = create_access_token(
                    subject=request.state.user.email_address, additional_claims=token_payload
                )
                response["nac_access_token"] = nac_access_token

            request.state.platform_user = response
        except Exception as ex:
            logging.exception(ex)
            raise GeneralException(
                message={"status": "error", "error": "Error fetching user info"},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return await func(request, *args, **kwargs)

    return wrapper


def app_user_info_required(func):
    """
    Adds app user details to the request
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        try:
            db_session = get_db()
            app_users_dao = AppUsersDao(db_session)
            app_id = request.headers.get("Codx-App-Id", None)
            if not app_id:
                app_id = request.headers.get("codx_app_id", None)
            if app_id:
                app_user = app_users_dao.get_app_user_by_email_app_id(request.state.logged_in_email, app_id)
                if app_user:
                    request.state.app_user_info = app_user
                    request.state.user_info["app_user"] = {
                        "responsibilities": (
                            json.loads(app_user.permissions).get("responsibilities", [])
                            if app_user.permissions
                            else None
                        )
                    }
                else:
                    request.state.app_user_info = None
                    request.state.user_info["app_user"] = None
            else:
                request.state.app_user_info = None
                request.state.user_info["app_user"] = None
            return await func(request, *args, **kwargs)
        finally:
            db_session.close()

    return wrapper


def restricted_user_info_required(func):
    """
    Checks if user is restricted
    """

    @wraps(func)
    async def wrapper(request, *args, **kwargs):
        if request.state.platform_user.get("is_restricted_user", False):
            if not request.state.app_user_info:
                raise GeneralException(
                    message={"status": "error", "error": "You don't have permission to view the page"},
                    status_code=status.HTTP_403_FORBIDDEN,
                )
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


def nac_role_info_required(f):
    """
    Checks if user has access for this operation
    """

    @wraps(f)
    async def wrapper(request, *args, **kwargs):
        nac_access_token = request.headers.get("nac_access_token", None)
        if not nac_access_token:
            raise GeneralException(
                status_code=status.HTTP_403_FORBIDDEN,
                message={"error": AuthErrors.MISSING_NAC_TOKEN_ERROR.value},
            )
        try:
            nac_token = decode_token(nac_access_token)
            user_email = (
                request.state.platform_user.get("username")
                if getattr(request.state, "platform_user", None)
                else request.state.logged_in_email
            )
            if nac_token and nac_token["sub"] == user_email:
                action_request = await get_request_action(request)
                nac_user_role = nac_token["nac_roles"]
                all_permissions = get_all_user_permissions(nac_user_role)
                permission_exists = verify_action_permission(action_request, all_permissions, request)

                if not permission_exists:
                    raise GeneralException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        message={"error": AuthErrors.ACCESS_DENIED_ERROR.value},
                    )

            else:
                raise GeneralException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    message={"error": AuthErrors.INVALID_NAC_TOKEN_ERROR.value},
                )

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_403_FORBIDDEN,
                message={"error": AuthErrors.ACCESS_DENIED_ERROR.value},
            )

        return await f(request, *args, **kwargs)

    return wrapper


def rbac_required(f):
    """
    Returns if the given user has access to rbaC
    """

    @wraps(f)
    async def wrapper(request, *args, **kwargs):
        user_groups_list = request.state.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.rbac:
                has_access = True

        if has_access:
            return await f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrapper


def projects_access_info_required(f):
    """This function checks if the given user group list have access to any_projects feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    async def wrap(request, *args, **kwargs):
        user_groups_list = request.state.user.user_groups
        my_projects_only = False
        my_projects = False
        all_projects = False
        rbac = False

        for user_group in user_groups_list:
            if user_group.my_projects_only:
                my_projects_only = True
                break
        for user_group in user_groups_list:
            if user_group.my_projects:
                my_projects = True
                break
        for user_group in user_groups_list:
            if user_group.all_projects:
                all_projects = True
                break

        for user_group in user_groups_list:
            if user_group.rbac:
                rbac = True

        request.state.projects_access = {
            "my_projects_only": my_projects_only,
            "my_projects": my_projects,
            "all_projects": all_projects,
            "rbac": rbac,
        }

        return await f(request, *args, **kwargs)

    return wrap


def app_required(f):
    """This function checks if the given user group list have access to app feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    async def wrap(request, *args, **kwargs):
        user_groups_list = request.state.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.app:
                has_access = True

        if has_access:
            return await f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrap


def all_projects_required(f):
    """This function checks if the given user group list have access to all_projects feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    async def wrap(request, *args, **kwargs):
        user_groups_list = request.state.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.all_projects:
                has_access = True

        if has_access:
            return await f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrap


def any_projects_required(f):
    """This function checks if the given user group list have access to any_projects feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    async def wrap(request, *args, **kwargs):
        user_groups_list = request.state.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.all_projects or user_group.my_projects_only or user_group.my_projects:
                has_access = True

        if has_access:
            return await f(request, *args, **kwargs)
        else:
            raise AuthenticationException(
                message="You do not have access to this feature.",
                status_code=status.HTTP_403_FORBIDDEN,
            )

    return wrap


def jp_hub_access_required(f):
    @wraps(f)
    async def wrap(request, *args, **kwargs):
        try:
            authorization = request.headers.get("authorization", None)
            token = authorization.split(" ")[1]
            response = jp_hub_token_decode(token)
            if response["status"] == "success":
                pass
            else:
                raise AuthenticationException(
                    message="Error validating token at projects token validation",
                    status_code=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            logging.error(f"Error while decoding token: {e}")
            raise AuthenticationException(
                message="Error validating token at projects token validation",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        return await f(request, *args, **kwargs)

    return wrap
