from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class Functions(BaseModelMixin):
    __tablename__ = "functions"
    industry_id = Column(Integer, ForeignKey("industry.id"))
    function_name = Column(String(100), nullable=False)
    parent_function_id = Column(Integer, ForeignKey("functions.id"), nullable=True)
    description = Column(Text, nullable=True)
    logo_name = Column(String(100), nullable=False)
    order = Column(Integer, default=0)
    industry = relationship("Industry", foreign_keys=[industry_id])
    color = Column(String(10), nullable=True)
    level = Column(String(100), nullable=True)

    def __init__(
        self,
        industry_id,
        function_name,
        description,
        logo_name,
        order,
        parent_function_id=None,
        color=None,
        level=None,
        created_by=None,
    ):
        self.industry_id = industry_id
        self.function_name = function_name
        self.description = description
        self.logo_name = logo_name
        self.order = order
        self.parent_function_id = parent_function_id
        self.color = color
        self.level = level
        self.created_by = created_by
