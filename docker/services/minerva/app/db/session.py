from app.utils.config import get_settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

settings = get_settings()

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    connect_args={"options": "-csearch_path={}".format(settings.SQLALCHEMY_DATABASE_SCHEMA)},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
