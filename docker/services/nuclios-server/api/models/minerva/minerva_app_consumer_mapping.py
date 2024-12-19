from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_application import MinervaApplication
from api.models.minerva.minerva_consumer import MinervaConsumer
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer


@mapper_registry.mapped
class MinervaAppConsumerMapping(BaseModelMixin):
    """
    Table for capturing minerva consumer and minerva app mapping
    """

    __tablename__ = "minerva_app_consumer_mapping"

    minerva_app_id = Column(Integer, ForeignKey(MinervaApplication.id))
    consumer_id = Column(Integer, ForeignKey(MinervaConsumer.id))
