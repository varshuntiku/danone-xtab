from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_application import MinervaApplication
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, Text


@mapper_registry.mapped
class MinervaDocument(BaseModelMixin):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_document"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"))
    name = Column(Text)
    meta = Column(JSON)
    deleted_at = Column(DateTime, nullable=True)
