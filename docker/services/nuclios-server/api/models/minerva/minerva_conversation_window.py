from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_application import MinervaApplication
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func


@mapper_registry.mapped
class MinervaConversationWindow(BaseModelMixin):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_conversation_window"

    id = Column(Integer, primary_key=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id))
    user_id = Column(String, nullable=False)
    title = Column(String(1000))
    pinned = Column(Boolean)
    deleted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
