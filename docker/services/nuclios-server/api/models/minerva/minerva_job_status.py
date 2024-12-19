from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_application import MinervaApplication
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func


@mapper_registry.mapped
class MinervaJobStatus(BaseModelMixin):
    """
    Table for capturing Minerva job status
    """

    __tablename__ = "minerva_job_status"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    run_id = Column(String(100))
    status = Column(Text)
    deleted_at = Column(DateTime, nullable=True)
    name = Column(Text)
    type = Column(Text)
    created_at = Column(DateTime, nullable=True, default=func.now())
