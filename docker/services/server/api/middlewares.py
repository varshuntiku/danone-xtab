#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import json
from functools import wraps

from api.auth import validate_token
from api.constants.functions import ExceptionLogger, json_response
from api.models import User, db
from flask import current_app as app
from flask import g, request
from sentry_sdk import configure_scope
from sqlalchemy.sql import func


def login_required(f):
    """It takes a token and verifies its authority and checks for aud, iss, nbf and allows the user to login ,
    get the user info from token details if the token is verified.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            authorization = request.headers.get("authorization", None)
            if not authorization:
                return json_response(
                    {
                        "status": "error",
                        "description": "No authorization token provided",
                    },
                    401,
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
            first_name = ""
            last_name = ""
            # Get the user from the token details
            # db user tokens
            if (
                "sub" in validation_response["decoded_token"]
                and validation_response["decoded_token"]["iss"] == app.config["JWT_ENCODE_ISSUER"]
            ):
                email_address = validation_response["decoded_token"]["sub"]
            elif (
                "identity" in validation_response["decoded_token"]
                and validation_response["decoded_token"]["iss"] == app.config["JWT_ENCODE_ISSUER"]
            ):
                email_address = validation_response["decoded_token"]["identity"]
            # azure tokens
            elif "upn" in validation_response["decoded_token"]:
                first_name = validation_response["decoded_token"]["given_name"]
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
                return json_response(
                    {
                        "status": "error",
                        "description": "could not match authorization token details",
                    },
                    401,
                )

            found_user = User.query.filter(func.lower(User.email_address) == func.lower(email_address)).first()

            # If the user is not found they are created
            if not found_user:
                if "@mathco.com" not in email_address:
                    return json_response({"status": "error", "description": "could not find user"}, 401)

                else:
                    found_user = User(
                        first_name=first_name,
                        last_name=last_name,
                        email_address=email_address,
                        user_groups=[],
                        restricted_user=False,
                        access_key=True,
                        login=True,
                    )
                    db.session.add(found_user)
                    db.session.commit()
            else:
                email_address = found_user.email_address
                found_user.last_login = func.now()
                db.session.commit()
                # check if token was issued after logout - if not, then send 401 response
                if (
                    found_user.last_logout is None
                    or found_user.last_logout.timestamp() < validation_response["decoded_token"]["iat"] + 360
                ):
                    pass
                else:
                    return json_response(
                        {
                            "status": "error",
                            "description": "Logged out token used by client",
                        },
                        401,
                    )

            # Setting the session global for the user attribute
            g.user = found_user
        except Exception as e:
            ExceptionLogger(e)
            return json_response({"status": "error", "description": "Error validating token"}, 401)

        with configure_scope() as scope:
            scope.user = {"email": email_address}

        return f(*args, **kwargs)

    return wrap


def app_required(f):
    """This function checks if the given user group list have access to app feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.app:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def my_projects_required(f):
    """This function checks if the given user group list have access to my_projects feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.my_projects:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
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
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.all_projects:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
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
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.all_projects or user_group.my_projects_only or user_group.my_projects:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def projects_access_info_required(f):
    """This function checks if the given user group list have access to any_projects feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
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

        g.projects_access = {
            "my_projects_only": my_projects_only,
            "my_projects": my_projects,
            "all_projects": all_projects,
            "rbac": rbac,
        }

        return f(*args, **kwargs)

    return wrap


def rbac_required(f):
    """This function checks if the given user group list have access to rbac feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.rbac:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def casestudies_required(f):
    """This function checks if the given user group list have access to casestudies feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.case_studies or user_group.my_projects or user_group.all_projects:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def widget_factory_required(f):
    """This function checks if the given user group list have access to widget factory feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.widget_factory:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def environments_required(f):
    """This function checks if the given user group list have access to environments feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.environments:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def app_publish_required(f):
    """This function checks if the given user group list have access to app publish feature or not.

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        user_groups_list = g.user.user_groups
        has_access = False

        for user_group in user_groups_list:
            if user_group.app_publish:
                has_access = True

        if has_access:
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You do not have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap
