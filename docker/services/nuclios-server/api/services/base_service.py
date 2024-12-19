import logging
import time

from api.databases.dependencies import get_db_generator
from api.middlewares.error_middleware import GeneralException
from fastapi import status
from sqlalchemy.orm import Session


class BaseService:
    def __init__(self):
        self.start_time = time.time()
        self.db_session: Session = next(get_db_generator())

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type:
            self.db_session.rollback()
            self.db_session.close()
            logging.error(exc_value)
            if hasattr(exc_type, "exception_type"):
                if exc_type.exception_type == "General Exception":
                    raise GeneralException(message=exc_value.message, status_code=exc_value.status_code)
                else:
                    raise GeneralException(
                        message="Something went wrong",
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                raise GeneralException(
                    message="Something went wrong",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        self.db_session.close()
