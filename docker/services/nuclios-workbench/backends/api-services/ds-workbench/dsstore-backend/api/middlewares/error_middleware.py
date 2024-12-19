import sys
from typing import Any, List

from api.databases.session import force_restart_engine
from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from starlette.requests import Request as starlette_request
from starlette.responses import Response


class BaseException(Exception):
    exception_type = "Exception"

    def __init__(self, status_code: int, message: Any = None):
        super().__init__(status_code, message)
        self.message = message
        self.status_code = status_code

    def serialize_error(self):
        if isinstance(self.message, dict):
            return {
                "exception_type": self.exception_type,
                **self.message,
            }
        return {
            "error": self.message,
            "exception_type": self.exception_type,
            "status_code": self.status_code,
        }
        # return f"{self.exception_type} : {self.message}"


class AlreadyExistException(BaseException):
    exception_type = "AlreadyExistException"

    def __init__(self, status_code: int = status.HTTP_409_CONFLICT, message: Any = "Record already exist"):
        super().__init__(status_code, message)


class DoesNotExistException(BaseException):
    exception_type = "DoesNotExistException"

    def __init__(self, status_code: int = status.HTTP_404_NOT_FOUND, message: Any = "Record does not exist."):
        super().__init__(status_code, message)


class AuthenticationException(BaseException):
    exception_type = "Authentication Exception"

    def __init__(self, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, message: Any = None):
        super().__init__(status_code, message)


class GeneralException(BaseException):
    exception_type = "General Exception"

    def __init__(self, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR, message: Any = None):
        exc_type, exc_value, exc_tb = sys.exc_info()
        try:
            if exc_tb is not None:
                filename = exc_tb.tb_frame.f_code.co_filename
                # lineno = exc_tb.tb_lineno
                if (
                    str(filename).endswith("_dao.py")
                    or isinstance(exc_value, OperationalError)
                    or isinstance(exc_value, SQLAlchemyError)
                ):
                    force_restart_engine(close_sessions=True)
        except Exception:
            pass
        super().__init__(status_code, message)


class MultipleException(BaseException):
    exception_type = "Multiple Exception"

    def __init__(self, status_code: int, message: Any = None, errors: List[dict] = None):
        self.errors = errors
        super().__init__(status_code, message)

    def serialize_error(self):
        if isinstance(self.message, dict):
            return {"exception_type": self.exception_type, **self.message, **self.errors}
        return {"message": self.message, "errors": self.errors}


class DBConnectionException(BaseException):
    exception_type = "DEE under maintanance"

    def __init__(self, status_code: int = status.HTTP_503_SERVICE_UNAVAILABLE, message: Any = exception_type):
        super().__init__(status_code, message)


async def db_exception_handler(request: Request, exc: BaseException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.serialize_error(),
    )


def extract_error_message(exc: Exception):
    if hasattr(exc, "message"):
        msg = exc.message
        if isinstance(msg, dict):
            return msg.get("error", str(exc))
        return msg
    return "exception occurred"


async def custom_exception_handler(request: Request, exc: BaseException):
    if isinstance(exc, OperationalError) or isinstance(exc, SQLAlchemyError):
        force_restart_engine(close_sessions=True)
    return JSONResponse(
        status_code=exc.status_code if hasattr(exc, "status_code") else status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": extract_error_message(exc),
            "exception_type": exc.exception_type if hasattr(exc, "exception_type") else "Exception",
            "status_code": exc.status_code if hasattr(exc, "status_code") else status.HTTP_500_INTERNAL_SERVER_ERROR,
        },
    )


async def custom_multiple_exception_handler(request: Request, exc: BaseException):
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.serialize_error(),
        # errors=exc.errors,
    )


async def catch_exceptions_middleware(request: starlette_request, call_next):
    try:
        return await call_next(request)
    except Exception:
        # you probably want some kind of logging here
        return Response("Internal server error", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
