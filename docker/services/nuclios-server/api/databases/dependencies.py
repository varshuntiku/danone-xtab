from contextlib import contextmanager
from typing import Generator

from api.databases.session import SessionLocal


def get_db_generator() -> Generator:
    db_session = SessionLocal()
    yield db_session


def get_db() -> Generator:
    db_session = SessionLocal()
    return db_session


@contextmanager
def session_manager():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        # if we fail somehow rollback the connection
        # Log Details
        db.rollback()
        raise
    finally:
        db.close()
