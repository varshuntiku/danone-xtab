import hashlib
import secrets

from api.constants.users.user_error_messages import UserErrors
from api.daos.users.users_dao import UsersDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User, UserPasswordCode
from api.schemas.users.users_schema import UserUpdatePasswordSchema
from api.utils.auth.authenticate import (
    authenticate,
    generate_nac_access_token,
    generate_totp,
    get_passcode_data,
)
from api.utils.auth.token import decode_token
from fastapi import status


def add_user_access(user: dict) -> dict:
    """
    Decorates the user object with roles and feature access data

    Args:
        user object

    Returns:
        user object with additional data about user's roles and feature access
    """
    nac_roles = []
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
        "super_user": False,
        "app_publish": False,
        "prod_app_publish": False,
    }

    for group_row in user.user_groups:
        if group_row.my_projects:
            feature_access["my_projects"] = True
        if group_row.my_projects_only:
            feature_access["my_projects_only"] = True
        if group_row.case_studies:
            feature_access["case_studies"] = True
        if group_row.all_projects:
            feature_access["all_projects"] = True
        if group_row.widget_factory:
            feature_access["widget_factory"] = True
        if group_row.environments:
            feature_access["environments"] = True
        if group_row.app_publish:
            feature_access["app_publish"] = True
        if group_row.prod_app_publish:
            feature_access["prod_app_publish"] = True
        if group_row.rbac:
            feature_access["rbac"] = True
        if any(feature_access.values()):
            feature_access["admin"] = True
        if group_row.app:
            feature_access["app"] = True
        if group_row.name == "super-user":
            feature_access["super_user"] = True

    for group_row in user.nac_user_roles:
        role_data = {
            "name": group_row.name,
            "id": group_row.id,
            "permissions": [{"name": item.name.upper(), "id": item.id} for item in group_row.role_permissions],
        }
        nac_roles.append(role_data)

    user.feature_access = feature_access

    if feature_access.get("app_publish", False):
        user.nac_roles = nac_roles
        token_payload = {
            "user_email": user.email_address,
            "user_id": user.id,
            "nac_roles": nac_roles,
        }
        nac_access_token = generate_nac_access_token(user.email_address, token_payload)
        user.nac_access_token = nac_access_token

    return user


def run_user_password_validations(user: User, request_data: UserUpdatePasswordSchema) -> bool:
    """
    Validates the user password update by running different password validations

    Args:
        user: user object
        request_data: api request data payload object

    Returns:
        True (boolean): returns True if no exception is raised
    """
    new_password = (
        getattr(request_data, "password")
        if getattr(request_data, "email", None)
        else getattr(request_data, "new_password")
    )
    confirm_password = getattr(request_data, "confirm_password")

    if not getattr(request_data, "email", None):
        current_password_validation = authenticate(user, request_data.password)
        if not current_password_validation:
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": UserErrors.USER_CURRENT_PASSWORD_MISMATCH_ERROR.value},
            )

    if new_password != confirm_password:
        raise GeneralException(
            status.HTTP_500_INTERNAL_SERVER_ERROR, message={"error": UserErrors.USER_NEW_PASSWORDS_MISMATCH_ERROR.value}
        )

    if len(new_password) < 4:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST, message={"error": UserErrors.USER_NEW_PASSWORD_LENGTH_ERROR.value}
        )

    new_password_validation = authenticate(user, new_password)
    if new_password_validation:
        raise GeneralException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            message={"error": UserErrors.USER_GIVEN_NEW_PASSWORD_ALEADY_EXISTS_ERROR.value},
        )

    return True


def get_user_details(password_token: str) -> str:
    """
    Gets the user detail from given encoded token following proper validations

    Args:
        password_token: encoded token containing user details

    Returns:
        User email address got after decoding and validating subject in token
    """
    data = decode_token(password_token)
    user_id = data.get("user_id")
    user_email = data.get("user_email")
    sub = data.get("sub")

    # validating user details
    if sub != "password_reset_token":
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_TOKEN_SUB_MISSING_ERROR.value},
        )

    if user_id and user_email:
        if isinstance(user_id, int | str) and isinstance(user_email, str):
            return user_email
        else:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": UserErrors.USER_ID_EMAIL_TYPE_ERROR.value},
            )
    else:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_ID_EMAIL_MISSING_ERROR.value},
        )


def get_user_code_passcode(users_dao: UsersDao, user: User) -> tuple[dict, UserPasswordCode]:
    """
    Calculates and gets the user otp code and user password code

    Args:
        users_dao: users data access object
        user: user object

    Returns:
        user otp code and user password code
    """
    code_secret = hashlib.pbkdf2_hmac(
        "sha256",
        secrets.token_urlsafe(16).encode("utf-8"),
        "codxauth".encode("utf-8"),
        100000,
        dklen=128,
    )
    user_password = users_dao.get_user_passcode_by_user_id(user.id)

    if not user_password:
        user_code = generate_totp(code_secret, 6)
        code_hash = user_code.get("code_hash", False)
        users_dao.create_user_passcode(
            user_id=user.id,
            user_email=user.email_address,
            secret=code_hash.encode("utf-8"),
            attempt=1,
        )
    else:
        is_gen_code = get_passcode_data(user_password, key="is_gen_code")
        if is_gen_code:
            user_code = generate_totp(code_secret, 6)
        else:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={
                    "error": UserErrors.USER_GENERATE_OTP_MAX_ATTEMPTS_ERROR.value,
                    "attempt": 5,
                },
            )

    return user_code, user_password
