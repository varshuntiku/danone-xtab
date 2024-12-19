from app.db.base_class import Base
from app.models.copilot_app import CopilotApp
from app.models.nuclios_user import NucliOSUser
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, func


class CopilotAppDeployment(Base):
    """
    Table for capturing Copilot application deployment metadata
    """

    __tablename__ = "copilot_app_deployment"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    created_by = Column(Integer, ForeignKey(NucliOSUser.id))
    deleted_at = Column(DateTime, nullable=True)
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id))
    config = Column(JSON)
