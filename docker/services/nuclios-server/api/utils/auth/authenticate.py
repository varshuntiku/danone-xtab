import hashlib
import hmac
import json
import logging
import math
import pathlib
import time
from datetime import datetime, timedelta, timezone
from hmac import compare_digest as safe_str_cmp
from typing import Any, Dict, List, Union

from api.configs.settings import get_app_settings
from api.constants.auth.auth_error_messages import AuthErrors
from api.constants.users.user_error_messages import UserErrors
from api.daos.apps.app_dao import AppDao
from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.databases.dependencies import get_db
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from api.models.base_models import User, UserPasswordCode
from fastapi import Request, status
from jose import jwt
from passlib.context import CryptContext

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

settings = get_app_settings()

root = str(pathlib.Path(__file__).resolve().parent.parent.parent.parent)

ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES  # 65 minutes
REFRESH_TOKEN_EXPIRE_MINUTES = settings.REFRESH_TOKEN_EXPIRE_MINUTES  # 14 days
JWT_ALGORITHM = settings.JWT_ALGORITHM
JWT_PRIVATE_KEY_ENCODED = settings.get_private_key
JWT_ENCODE_ISSUER = settings.JWT_ENCODE_ISSUER


def authenticate(user: User, password: str):
    """Compares the hashed password against the stored password in database for user and returns user if password matches
    for authentication

    Args:
        user: User object from db
        password: password entered by user

    Returns:
        user object
    """
    try:
        if user and safe_str_cmp(
            user.password_hash,
            hashlib.pbkdf2_hmac(
                "sha256",
                password.encode("utf-8"),
                "codxauth".encode("utf-8"),
                100000,
                dklen=128,
            ),
        ):
            return user
    except Exception as e:
        logging.exception(e)
        raise AuthenticationException(
            message=AuthErrors.AUTHENTICATION_FAILED_ERROR.value, status_code=status.HTTP_401_UNAUTHORIZED
        )


def identity(username):
    """Returns user info from database by filtering using username in email

    Args:
        username ([String]): [username]

    Returns:
        string: [user details]
    """
    user = User.query.filter_by(email_address=username.lower()).first()
    return user


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(
    subject: Union[str, Dict, Any], expires_delta: timedelta = None, additional_claims: dict = {}
) -> str:
    if expires_delta is not None:
        expires_delta = datetime.now(tz=timezone.utc) + expires_delta
    else:
        expires_delta = datetime.now(tz=timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expires_delta,
        "sub": subject,
        "iss": JWT_ENCODE_ISSUER,
        "type": "access",
        "iat": datetime.now(tz=timezone.utc),
        **additional_claims,
    }

    encoded_jwt = jwt.encode(key=JWT_PRIVATE_KEY_ENCODED, algorithm=JWT_ALGORITHM, claims=to_encode)
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Dict, Any], expires_delta: int = None, additional_claims: dict = {}
) -> str:
    if expires_delta is not None:
        expires_delta = datetime.now(tz=timezone.utc) + expires_delta
    else:
        expires_delta = datetime.now(tz=timezone.utc) + timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expires_delta,
        "sub": subject,
        "iss": JWT_ENCODE_ISSUER,
        "type": "refresh",
        "iat": datetime.now(tz=timezone.utc),
        **additional_claims,
    }
    encoded_jwt = jwt.encode(claims=to_encode, key=JWT_PRIVATE_KEY_ENCODED, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def generate_nac_access_token(user_email: str, payload: Dict) -> str:
    """
    Generates nac access token

    Args:
        user_email: user's email address
        payload: token payload

    Returns:
        nac access token
    """
    try:
        token = create_access_token(
            subject=user_email,
            expires_delta=timedelta(minutes=65),
            additional_claims=payload,
        )
        return token
    except Exception as e:
        logging.exception(e)
        raise AuthenticationException(
            message=AuthErrors.NAC_TOKEN_GENERATION_ERROR.value, status_code=status.HTTP_400_BAD_REQUEST
        )


def generate_totp(shared_key: str, length: int = 6) -> dict:
    """Generates a time based otp using the secret key and timestamp

    Args:
        shared_key (hash): url safe hashed hmac
        length (int, optional): length of otp. Defaults to 6.

    Returns:
        otp_code (int): 6 digits otp code. length can be changed based on length argument
        code_hash (string): hash hexdigest used to generate the otp
    """
    now_in_seconds = math.floor(time.time())
    step_in_seconds = 300  # for 5min 300, to test 60 or 120 can be used
    t = math.floor(now_in_seconds / step_in_seconds)
    hash_key = hmac.new(
        shared_key,
        t.to_bytes(length=8, byteorder="big"),
        hashlib.sha256,
    )
    hash_key_int = int(hash_key.hexdigest(), base=16)
    otp_code = dynamic_truncation(hash_key_int, length)
    return {"otp_code": otp_code, "code_hash": hash_key.hexdigest()}


def dynamic_truncation(key: int, length: int) -> str:
    """Truncate the string to required length

    Args:
        key (int): hashed hmac key encrypted with timestamp in integer format
        length (int): length of truncated string

    Returns:
        string: return truncated code in stringified format
    """
    bitstring = bin(key)
    last_four_bits = bitstring[-4:]
    offset = int(last_four_bits, base=2)
    chosen_32_bits = bitstring[offset * 8 : offset * 8 + 32]
    full_totp = str(int(chosen_32_bits, base=2))
    return full_totp[-length:]


def get_passcode_data(secret_data: UserPasswordCode, key: str) -> bool | int:
    """Calculates and tells whether the otp should be generated based on the number of attemps
    or returns the number of total attempts by the user to send otp based on the key passed

    Args:
        secret_data: user password code object
        key: a string value to decide on whether to return no. of attempts or decision to generate the otp

    Returns:
        Either number of attempts to genrate otp or decision to genrate otp based on key
    """
    try:
        cur_day = datetime.now().date()
        last_update = (
            datetime.fromtimestamp(secret_data.updated_at.timestamp()).date() if secret_data.updated_at else None
        )
        created_on = (
            datetime.fromtimestamp(secret_data.created_at.timestamp()).date() if secret_data.created_at else None
        )
        if key == "is_gen_code":
            if last_update is None and (cur_day > created_on or cur_day == created_on) and secret_data.attempt == 1:
                return True
            elif last_update and ((cur_day > last_update) or (cur_day == last_update and secret_data.attempt < 5)):
                return True
            else:
                return False
        elif key == "code_attempt":
            if secret_data and (
                (last_update is None and cur_day > created_on) or (last_update and cur_day > last_update)
            ):
                return 1
            elif secret_data and (
                (last_update is None and cur_day == created_on) or (last_update and cur_day == last_update)
            ):
                return secret_data.attempt + 1
    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_OTP_ATTEMPTS_CALCULATIONS_ERROR.value},
        )


def validate_totp(totp: str, otp_hash: str) -> bool:
    """Validates the otp provided

    Args:
        totp (string): otp that needs to be compared
        otp_hash (hash): url safe hashed hmac

    Returns:
        boolean: returns whether the provided otp is valid or not
    """
    try:
        if otp_hash:
            otp_hash_int = int(otp_hash, base=16)
            trucated_otp = dynamic_truncation(otp_hash_int, 6)
            return totp == trucated_otp
    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_INVALID_OTP_ERROR.value},
        )


def validate_timestamp(timestamp: datetime, duration: int = 300, duration_in: str = "seconds") -> bool:
    """Compares the provided timestamp with current timestamp and check the difference between the two.

    Args:
        timestamp (datetime): timestamp that needs to be compared against current timestamp
        duration (int, optional): the number of duration. Defaults to 300.
        duration_in (str, optional): unit of duration can be seconds, microseconds and days. Defaults to 'seconds'.

    Returns:
        boolean: validates and return if the provided timestamp is less than or equal to the duration
    """
    try:
        cur_datetime = datetime.now(tz=timezone.utc)
        diff = cur_datetime - timestamp
        valid_now = False
        if duration_in == "seconds":
            valid_now = diff.seconds <= duration
        elif duration_in == "microseconds":
            valid_now = diff.microseconds <= duration
        elif duration_in == "days":
            valid_now = diff.days <= duration
        return valid_now
    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_INVALID_OTP_DUARTION_ERROR.value},
        )


async def get_app_id(request: Request) -> int:
    """
    Gets the application id

    Args:
        request: api request object

    Returns:
        app id
    """
    try:
        db_session = get_db()
        execution_env_dao = ExecutionEnvDao(db_session)
        body = await request.body()
        request_data = json.loads(body) if body else {}
        request_endpoint_unique_id = request.scope.get("route").unique_id
        app_id = None
        if (
            request_endpoint_unique_id != "DynamicVizExecutionEnvironments.start"
            and request_endpoint_unique_id != "clone_app_nuclios_product_api_app_clone_post"
        ):
            if request.path_params.get("app_id"):
                app_id = request.path_params.get("app_id")
            elif getattr(request_data, "app_id", None):
                app_id = getattr(request_data, "app_id")
        elif request_endpoint_unique_id == "DynamicVizExecutionEnvironments.start":
            exec_env_id = request.path_params.get("execution_environment_id")
            app_data = execution_env_dao.get_app_dynamic_execution_env_by_dynamic_env_id(dynamic_env_id=exec_env_id)
            app_id = app_data.app_id if app_data else None
        return app_id
    except Exception as e:
        logging.exception(e)
        return None
    finally:
        db_session.close()


async def get_request_action(request: Request) -> str:
    """
    Returns the user permission action string based on the requested operation

    Args:
        request: api request object

    Returns:
        action string based on the action user is trying to perform
    """
    try:
        db_session = get_db()
        app_dao = AppDao(db_session)
        app_id = await get_app_id(request)
        app_info = app_dao.get_app_by_id(app_id=app_id)
        request.state.app_info = app_info
        user_id = request.state.platform_user.get("user_id") if getattr(request.state, "platform_user", False) else None
        action = None
        request_endpoint_unique_id = request.scope.get("route").unique_id

        # Update the keys with the value of `request_endpoint_unique_id` for the respective API request wherever necessary
        endpoint_action = {
            "add_app_variables_nuclios_product_api_app_admin_app__app_id__app_variable_value__key__post": "create_variable",
            "create_app_nuclios_product_api_app_admin_app_post": "create_preview_app",
            "add_app_functions_value_nuclios_product_api_app_admin_app__app_id__app_function_value__key__post": "create_variable",
            "DynamicVizExecutionEnvironments.create": "create_execution_environment",
            "replicate_app_nuclios_product_api_app_replicate_post": "promote_app",
            "clone_app_nuclios_product_api_app_clone_post": "cloning_of_application",
            "download_app_nuclios_product_api_app__app_id__export_get": "cloning_of_application",
            "reset_app_nuclios_product_api_app__app_id__reset_post": (
                "reset_my_app" if app_info and app_info.app_creator_id == user_id else "reset_all_app"
            ),
            "DynamicVizExecutionEnvironments.update_app_env_id": (
                "edit_production_app" if app_info and app_info.environment == "prod" else "create_preview_app"
            ),
            "start_dynamic_execution_environments_nuclios_product_api_dynamic_execution_environments__execution_environment_id__start_get": (
                "edit_production_app" if app_info and app_info.environment == "prod" else "create_preview_app"
            ),
            "get_user_tokens_nuclios_product_api_user_token__get": "fetch_User_PATS",
            "generate_user_token_nuclios_product_api_user_token__post": "get_User_PATS",
            "delete_jwt_token_nuclios_product_api_user_token__id__delete": "get_User_PATS",
        }
        if (
            request_endpoint_unique_id
            == "add_app_variables_nuclios_product_api_app_admin_app__app_id__app_variable_value__key__post"
            or request_endpoint_unique_id
            == "add_app_functions_value_nuclios_product_api_app_admin_app__app_id__app_function_value__key__post"
        ):
            action = endpoint_action[request_endpoint_unique_id]
        elif (
            "app-admin" in request.url.path
            and app_info
            and app_info.environment == "prod"
            and request.method == "POST"
            or request.method == "PATCH"
            or request.method == "PUT"
        ):
            action = "edit_production_app"
        elif endpoint_action.get(request_endpoint_unique_id, False):
            action = endpoint_action[request_endpoint_unique_id]
        elif (
            action is None
            and "app-admin" in request.url.path
            and app_info
            and app_info.environment == "preview"
            and request.method == "POST"
            or request.method == "PATCH"
            or request.method == "PUT"
        ):
            return "edit_preview_app"

        return action
    except Exception as e:
        logging.exception(e)
    finally:
        db_session.close()


def get_all_user_permissions(roles: List[Dict]) -> Dict:
    """
    Gets the status of all the permissions the user has

    Args:
        roles: list of roles permissions user has

    Returns
        user permissions dictionary
    """
    try:
        permissions = {
            "create_variable": False,
            "create_preview_app": False,
            "create_execution_environment": False,
            "reset_all_app": False,
            "reset_my_app": False,
            "promote_app": False,
            "edit_production_app": False,
            "cloning_of_application": False,
        }

        permissions_list = permissions.keys()

        for role in roles:
            for action in permissions_list:
                if any(item.get("name").lower() == action for item in role.get("permissions")):
                    permissions[action] = True

        return permissions
    except Exception as e:
        logging.exception(e)


def verify_action_permission(action: str, permissions: Dict, request: Request) -> bool:
    """
    Verifies and tells whether the user has access to the passed action

    Args:
        action: the action to check access for
        permissions: user permissions dictionary

    Returns:
        Boolean value specifying whether the user has access to the passed action
    """
    try:
        action_permission = False
        if action == "create_variable" and request.state.app_info and request.state.app_info.environment == "preview":
            action_permission = (
                True
                if permissions.get("create_variable", False) and permissions.get("create_preview_app", False)
                else False
            )
        elif action == "create_variable" and request.state.app_info and request.state.app_info.environment == "prod":
            action_permission = (
                True
                if permissions.get("create_variable", False) and permissions.get("edit_production_app", False)
                else False
            )
        elif action == "reset_my_app" or action == "reset_all_app":
            action_permission = (
                permissions.get(action, False)
                if request.state.app_info and request.state.app_info.environment == "preview"
                else False
            )
        elif action == "edit_preview_app":
            action_permission = permissions.get("create_preview_app", False)
        elif action in ("fetch_User_PATS", "delete_User_PATS", "get_User_PATS") and (
            permissions.get("create_preview_app") or permissions.get("edit_production_app")
        ):
            action_permission = True
        else:
            action_permission = permissions.get(action, False)

        return action_permission
    except Exception as e:
        logging.exception(e)
