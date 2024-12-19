from app.db.base_class import Base
from sqlalchemy import Boolean, Column, Integer, String


class LLMDeploymentType(Base):
    __tablename__ = "llm_deployment_type"

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    is_active = Column(Boolean, default=False)
