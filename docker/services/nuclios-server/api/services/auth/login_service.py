import logging
from datetime import datetime as dt
from datetime import timedelta

from api.constants.auth.auth_error_messages import AuthErrors
from api.constants.users.user_error_messages import UserErrors
from api.daos.auth.login_dao import LoginDao
from api.daos.users.users_dao import UsersDao
from api.middlewares.error_middleware import AuthenticationException, GeneralException
from api.schemas.auth.login_schema import (
    LoginInputSchema,
    LoginResponseSchema,
    LogoutSchema,
    RefreshResponseSchema,
)
from api.services.base_service import BaseService
from api.utils.auth.authenticate import (
    authenticate,
    create_access_token,
    create_refresh_token,
)
from api.utils.auth.token import _validate_db_user, decode_token
from fastapi import Request, status
from sqlalchemy.sql import func

FAILED_LOGIN_THRESHOLD = 5
ACCOUNT_LOCKOUT_DURATION = 30


class LoginService(BaseService):
    def __init__(self):
        super().__init__()
        self.login_dao = LoginDao(self.db_session)
        self.users_dao = UsersDao(self.db_session)

    def login(self, request_data: LoginInputSchema) -> LoginResponseSchema:
        try:
            username = getattr(request_data, "username", None)
            password = getattr(request_data, "password", None)

            user = self.users_dao.get_user_by_email(username)
            if user:
                restricted_access = user.restricted_access
                if restricted_access:
                    diff = (
                        (dt.now(user.created_at.tzinfo) - (user.created_at))
                        if user.updated_at is None
                        else (dt.now(user.updated_at.tzinfo) - (user.updated_at))
                    )
                    if diff.days > 14:
                        raise GeneralException(
                            message={"error": AuthErrors.ACCOUNT_ACCESS_EXPIRED_ERROR.value},
                            status_code=status.HTTP_401_UNAUTHORIZED,
                        )

                failed_login_count = user.failed_login_count if user.failed_login_count else 0
                if (
                    failed_login_count >= FAILED_LOGIN_THRESHOLD
                    and user.failed_login_at
                    and (dt.now().timestamp() - user.failed_login_at.timestamp()) < ACCOUNT_LOCKOUT_DURATION * 60
                ):
                    raise GeneralException(
                        message={
                            "error": AuthErrors.ACCOUNT_LOCKED_ERROR.value
                            + ": "
                            + str(ACCOUNT_LOCKOUT_DURATION)
                            + " minutes"
                        },
                        status_code=status.HTTP_418_IM_A_TEAPOT,
                    )
                else:
                    pass
            else:
                raise GeneralException(
                    message={"error": UserErrors.USERNAME_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )

            valid = authenticate(user, password)
            if valid:
                self.users_dao.update_user_failed_login_details(user, failed_login_count=0, failed_login_at=None)
                access_token = create_access_token(subject=user.email_address, expires_delta=timedelta(minutes=65))
                refresh_toke = create_refresh_token(subject=user.email_address, expires_delta=timedelta(days=14))
                return {
                    "access_token": access_token,
                    "refresh_token": refresh_toke,
                    "exp": decode_token(access_token)["exp"],
                    "is_restricted_user": user.restricted_user,
                }

            else:
                self.users_dao.update_user_failed_login_details(
                    user,
                    failed_login_count=(failed_login_count % FAILED_LOGIN_THRESHOLD) + 1,
                    failed_login_at=func.now(),
                )
                raise GeneralException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    message={"error": AuthErrors.INCORRECT_PASSWORD_ERROR.value},
                )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": AuthErrors.WRONG_CREDENTIALS_ERROR.value},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

    def refresh(self, request: Request) -> RefreshResponseSchema:
        token = request.headers.get("authorization", None)
        if not token:
            raise AuthenticationException(
                message={"error": AuthErrors.MISSING_REFRESH_TOKEN_ERROR.value},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
        token = token.split(" ")[1]
        token_detail = _validate_db_user(token)
        if token_detail["decoded_token"]["type"] == "refresh" and token_detail["decoded_token"]["sub"]:
            user = self.users_dao.get_user_by_email(token_detail["decoded_token"]["sub"])

            if not user:
                raise GeneralException(
                    message={"error": UserErrors.USER_NOT_FOUND_ERROR.value},
                    status_code=status.HTTP_404_NOT_FOUND,
                )

            access_token = create_access_token(subject=user.email_address, expires_delta=timedelta(minutes=65))
            refresh_token = create_refresh_token(subject=user.email_address, expires_delta=timedelta(days=14))
            return {
                "access_token": access_token,
                "exp": decode_token(access_token)["exp"],
                "refresh_token": refresh_token,
            }
        else:
            raise AuthenticationException(
                message={"error": AuthErrors.INVALID_REFRESH_TOKEN_ERROR.value},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )

    def logout(self, user_email_address: str) -> LogoutSchema:
        try:
            user = self.users_dao.get_user_by_email(user_email_address)
            self.users_dao.update_user_last_logout(user)
            return {"status": "success", "description": "User logged out"}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": UserErrors.USER_LOGOUT_ERROR.value},
            )
