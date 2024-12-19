from app.db.base_class import Base
from app.models.copilot_app import CopilotApp
from app.models.minerva_application import MinervaApplication
from app.models.minerva_consumer import MinervaConsumer
from sqlalchemy import Column, ForeignKey, Integer, PrimaryKeyConstraint


class MinervaAppConsumerMapping(Base):
    """
    Table for capturing minerva consumer and minerva app mapping
    """

    __tablename__ = "minerva_app_consumer_mapping"
    __table_args__ = (PrimaryKeyConstraint("consumer_id", "copilot_app_id"),)

    minerva_app_id = Column(Integer, ForeignKey(MinervaApplication.id, ondelete="CASCADE"), nullable=True)
    consumer_id = Column(Integer, ForeignKey(MinervaConsumer.id, ondelete="CASCADE"))
    copilot_app_id = Column(Integer, ForeignKey(CopilotApp.id, ondelete="CASCADE"), nullable=True)
