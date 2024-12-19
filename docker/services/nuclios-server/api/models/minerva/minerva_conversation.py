from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_application import MinervaApplication
from api.models.minerva.minerva_conversation_window import MinervaConversationWindow
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String, func


@mapper_registry.mapped
class MinervaConversation(BaseModelMixin):
    """
    Table for capturing Minerva user conversations
    """

    __tablename__ = "minerva_conversation"

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=True, default=func.now())
    deleted_at = Column(DateTime, nullable=True)
    application_id = Column(Integer, ForeignKey(MinervaApplication.id))
    user_id = Column(String, nullable=False)
    user_query = Column(String(1000))
    minerva_response = Column(JSON)
    feedback = Column(String(1000), nullable=True)
    conversation_window_id = Column(Integer, ForeignKey(MinervaConversationWindow.id), nullable=True)
