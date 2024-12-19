from api.databases.base_class import mapper_registry
from api.models.minerva.minerva_models import MinervaModels
from api.models.mixins import BaseModelMixin
from sqlalchemy import JSON, Column, ForeignKey, Integer, String


@mapper_registry.mapped
class MinervaPrompts(BaseModelMixin):
    """
    Table for capturing Minerva user prompts
    """

    __tablename__ = "minerva_prompts"

    id = Column(Integer, primary_key=True)
    model_id = Column(Integer, ForeignKey(MinervaModels.id))
    tool_type = Column(String, nullable=False)
    prompt = Column(JSON)
