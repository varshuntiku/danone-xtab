from contextlib import contextmanager
from typing import Generator

from api.databases.session import SessionLocal


def get_db() -> Generator:
    db = SessionLocal()
    try:
        # print("DB Session is started!!!!!!!!!!!!!!!!!!!!!!!")
        yield db
    except Exception:
        # print("DB Session is rollback!!!!!!!!!!!!!!!!!!!!!!!")
        db.rollback()
    finally:
        # print("DB Session is closed!!!!!!!!!!!!!!!!!!!!!!!")
        db.close()


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
