#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.
import ast
import json
import logging
import os
from datetime import timedelta
from functools import wraps

import jwt
from api.auth import validate_token
from api.constants.functions import ExceptionLogger, json_response
from api.db_models.user_management.users import User
from api.helpers import get_clean_postdata
from api.models import AppUser, db
from api.util.nac_user_role_util import (
    get_all_user_permissions,
    get_request_action,
    verify_action_permission,
)
from api.validation_helpers import validate_uiac_code

# from flask import abort
from flask import current_app as app
from flask import g, request
from flask_jwt_extended import create_access_token, decode_token
from jwt import exceptions
from sentry_sdk import configure_scope
from sqlalchemy.sql import func

logging.basicConfig(level=logging.DEBUG)


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
                        first_name,
                        last_name,
                        email_address,
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
            if email_address:
                g.logged_in_email = email_address

            g.auth_info = validation_response["decoded_token"]
            g.user_info = {"user": {"email": email_address}}
        except Exception as e:
            ExceptionLogger(e)
            return json_response({"status": "error", "description": "Error validating token"}, 401)

        with configure_scope() as scope:
            scope.user = {"email": email_address}

        return f(*args, **kwargs)

    return wrap


def rbac_required(f):
    """Returns if the given user has access to rbaC

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
                json.dumps({"error": "You donot have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def app_publish_required(f):
    """Returns if the given user has access to rbaC

    Args:
        f ([type]): [description]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if g.platform_user["feature_access"].get("app_publish", False):
            return f(*args, **kwargs)
        else:
            return (
                json.dumps({"error": "You donot have access to this feature"}),
                403,
                {"Content-type": "application/json"},
            )

    return wrap


def deployed_access_required(f):
    """[Checks if the given access key has access by validating the authenticity of token]

    Args:
        f ([type]): [access_key]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if not kwargs or not kwargs["access_key"]:
            return (
                json.dumps({"error": "no deployer token provied"}),
                403,
                {"Content-type": "application/json"},
            )
        try:
            # Verify authority of the token
            # - Checked deployed access key
            if kwargs["access_key"] == app.config["BACKEND_PRODUCT_APP_SECRET"]:
                pass
            else:
                return (
                    json.dumps({"error": "invalid token, wrong deployer token"}),
                    403,
                    {"Content-type": "application/json"},
                )

        except exceptions.DecodeError:
            return (
                json.dumps({"error": "invalid authorization token"}),
                403,
                {"Content-type": "application/json"},
            )

        return f(*args, **kwargs)

    return wrap


def app_access_required(f):
    """Checks if the given app ID has access to the app by validating the authenticity of token

    Args:
        f ([type]): [app_id]

    Returns:
        [type]: [description]
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if not kwargs or not kwargs["app_id"]:
            return (
                json.dumps({"error": "no app_id provied"}),
                403,
                {"Content-type": "application/json"},
            )
        try:
            # Verify access requirements for the app_id

            if kwargs["app_id"] == app.config["BACKEND_PRODUCT_APP_SECRET"]:
                pass
            else:
                return (
                    json.dumps({"error": "invalid token, wrong deployer token"}),
                    403,
                    {"Content-type": "application/json"},
                )

        except exceptions.DecodeError:
            return (
                json.dumps({"error": "access denied to this application"}),
                403,
                {"Content-type": "application/json"},
            )

        return f(*args, **kwargs)

    return wrap


def app_user_info_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        app_id = request.headers.get("Codx-App-Id", None)
        if app_id:
            app_user = AppUser.query.filter(
                (func.lower(AppUser.user_email) == func.lower(g.logged_in_email))
                & (AppUser.app_id == app_id)
                & (AppUser.deleted_at.is_(None))
            ).first()
            if app_user:
                g.app_user_info = app_user
                g.user_info["app_user"] = {
                    "responsibilities": json.loads(app_user.permissions).get("responsibilities", [])
                    if app_user.permissions
                    else None
                }
            else:
                g.app_user_info = None
                g.user_info["app_user"] = None
        else:
            g.app_user_info = None
            g.user_info["app_user"] = None

        return f(*args, **kwargs)

    return wrap


def platform_user_info_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        headers = {"content-type": "application/json"}
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
            for group_row in g.user.user_groups:
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
            for group_row in g.user.nac_user_roles:
                role_data = {
                    "name": group_row.name,
                    "id": group_row.id,
                    "permissions": [{"name": item.name.upper(), "id": item.id} for item in group_row.role_permissions],
                }
                nac_roles.append(role_data)

            response = {
                "status": "success",
                "user_id": g.user.id,
                "username": g.user.email_address,
                "is_restricted_user": g.user.restricted_user,
                "first_name": g.user.first_name,
                "last_name": g.user.last_name,
                "last_login": g.user.last_login.strftime("%d %B, %Y %H:%M"),
                "access_key": g.user.access_key,
                "feature_access": feature_access,
            }
            if feature_access.get("app_publish", False):
                response["nac_roles"] = nac_roles
                token_payload = {
                    "user_email": g.user.email_address,
                    "user_id": g.user.id,
                    "nac_roles": nac_roles,
                }
                nac_access_token = generate_nac_access_token(token_payload)
                response["nac_access_token"] = nac_access_token

            g.platform_user = response
            # return (json_util.dumps(response), 200, headers)
        except Exception as ex:
            ExceptionLogger(ex)
            return (
                json.dumps({"status": "error", "error": "Error fetching user info"}),
                500,
                headers,
            )

        return f(*args, **kwargs)

    return wrap


def generate_nac_access_token(payload):
    try:
        identity = g.user.email_address
        token = create_access_token(
            identity=identity,
            additional_claims=payload,
            fresh=False,
            expires_delta=timedelta(minutes=65),
        )
        return token
    except Exception as ex:
        ExceptionLogger(ex)
        return json_response({"error": "Error in generating nac_token"}, 400)


def validate_uiac(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            request_data = get_clean_postdata(request)
            if request_data.get("code_string", None):
                code = ast.parse(request_data.get("code_string", None))

            if request_data.get("code", None):
                code = ast.parse(request_data.get("code", None))

            validate_uiac_code(code)

        except Exception as ex:
            return json_response(
                {
                    "status": "failed",
                    "message": "One of the Module Imported can cause security issues and hence the execution operation has been canceled.",
                    "errors": ex.error,
                    "warnings": ex.warning,
                }
            )
        return f(*args, **kwargs)

    return wrap


def nac_role_info_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        nac_access_token = request.headers.get("nac_access_token", None)
        if not nac_access_token:
            return (
                json.dumps({"error": "no nac_access_token provied"}),
                403,
                {"Content-type": "application/json"},
            )
        try:
            nac_token = decode_token(encoded_token=nac_access_token, allow_expired=True)
            user_email = g.platform_user.get("username") if g.get("platform_user", False) else g.logged_in_email
            if nac_token and nac_token["sub"] == user_email:
                action_request = get_request_action(request)
                nac_user_role = nac_token["nac_roles"]
                all_permissions = get_all_user_permissions(nac_user_role)
                permission_exists = verify_action_permission(action_request, all_permissions)

                if not permission_exists:
                    return (
                        json.dumps({"error": "access denied for this operation"}),
                        403,
                        {"Content-type": "application/json"},
                    )

            else:
                return (
                    json.dumps({"error": "invalid token, wrong nac_access token"}),
                    403,
                    {"Content-type": "application/json"},
                )

        except exceptions.DecodeError:
            return (
                json.dumps({"error": "access denied for this operation"}),
                403,
                {"Content-type": "application/json"},
            )

        return f(*args, **kwargs)

    return wrap


def restricted_user_info_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if g.platform_user.get("is_restricted_user", False):
            if not g.app_user_info:
                return (
                    json.dumps({"error": "You don't have permission to view the page"}),
                    403,
                    {"Content-type": "application/json"},
                )

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


def project_internal_service_access_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        try:
            authorization = request.headers.get("authorization", None)
            token = authorization.split(" ")[1]
            key_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "decode_key.pub"))
            public_key = open(key_file_path, "r").read()
            jwt.decode(token, public_key, algorithms=["RS256"])
        except Exception as e:
            ExceptionLogger(e)
            return json_response(
                {
                    "status": "error",
                    "description": "Error validating token at: project_internal_service_access_required",
                },
                401,
            )
        return f(*args, **kwargs)

    return wrap
