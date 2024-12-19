from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class Industry(BaseModelMixin):

    """
    Table to maintaine Industry Data.
    """

    __tablename__ = "industry"

    industry_name = Column(String(100), nullable=False)
    parent_industry_id = Column(Integer, ForeignKey("industry.id"), nullable=True)
    logo_name = Column(String(100), nullable=False)
    horizon = Column(String(100))
    order = Column(Integer, default=0)
    description = Column(Text, nullable=True)
    color = Column(String(10), nullable=True)
    level = Column(String(100), nullable=True)
    parent_industry = relationship("Industry", backref="industries", remote_side="Industry.id")

    def __init__(
        self,
        industry_name,
        logo_name,
        horizon,
        order,
        description,
        parent_industry_id=None,
        color=None,
        level=None,
        created_by=None,
    ):
        self.industry_name = industry_name
        self.logo_name = logo_name
        self.horizon = horizon
        self.order = order
        self.description = description
        self.parent_industry_id = parent_industry_id
        self.color = color
        self.level = level
        self.created_by = created_by
