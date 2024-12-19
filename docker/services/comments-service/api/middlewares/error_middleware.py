import logging
from typing import Any

from fastapi import Request, status
from fastapi.responses import JSONResponse
from sentry_sdk import capture_exception
from starlette.requests import Request as starlette_request


class BaseException(Exception):
    exception_type = "Exception"

    def __init__(self, status_code: int, message: Any = None):
        super().__init__(status_code, message)
        self.message = message
        self.status_code = status_code

    def serialize_error(self):
        return f"{self.exception_type} : {self.message}."


class AlreadyExistException(BaseException):
    exception_type = "AlreadyExistException"

    def __init__(
        self,
        status_code: int = status.HTTP_409_CONFLICT,
        message: Any = "Record already exist",
    ):
        super().__init__(status_code, message)


class DoesNotExistException(BaseException):
    exception_type = "DoesNotExistException"

    def __init__(
        self,
        status_code: int = status.HTTP_404_NOT_FOUND,
        message: Any = "Record does not exist.",
    ):
        super().__init__(status_code, message)


class AuthenticationException(BaseException):
    exception_type = "Authentication Exception"

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        message: Any = None,
    ):
        super().__init__(status_code, message)


class GeneralException(BaseException):
    exception_type = "General Exception"

    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        message: Any = None,
    ):
        super().__init__(status_code, message)


async def custom_exception_handler(request: Request, exc: BaseException):
    capture_exception(exc)
    logging.exception(exc)
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.message,
    )


async def catch_exceptions_middleware(request: starlette_request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        capture_exception(e)
        print(e)
        logging.exception(e)
        return JSONResponse(content="Internal server error", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
