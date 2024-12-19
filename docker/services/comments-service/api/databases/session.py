from api.configs.settings import get_app_settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

settings = get_app_settings()

engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, pool_size=30, max_overflow=40, pool_recycle=300, pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
