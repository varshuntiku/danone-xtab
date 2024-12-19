from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class Dashboard(BaseModelMixin):
    __tablename__ = "dashboard"

    dashboard_name = Column(String(100), nullable=False)
    dashboard_icon = Column(String(100), nullable=False)
    dashboard_order = Column(Integer, default=0)
    root_industry_id = Column(Integer, ForeignKey("industry.id"), nullable=True)
    industry = relationship("Industry", foreign_keys=[root_industry_id])
    dashboard_url = Column(String(2000), nullable=True)
    dashboard_template_id = Column(Integer, ForeignKey("dashboard_templates.id"), nullable=True)
    dashboard_templates = relationship("DashboardTemplates", foreign_keys=[dashboard_template_id])
    dashboard_code = Column(String(100), nullable=True)

    def __init__(
        self,
        dashboard_name,
        dashboard_icon,
        dashboard_order,
        root_industry_id,
        dashboard_url,
        dashboard_template_id,
    ):
        self.dashboard_name = dashboard_name
        self.dashboard_icon = dashboard_icon
        self.dashboard_order = dashboard_order
        self.root_industry_id = root_industry_id
        self.dashboard_url = dashboard_url
        self.dashboard_template_id = dashboard_template_id


@mapper_registry.mapped
class DashboardTemplates(BaseModelMixin):
    __tablename__ = "dashboard_templates"

    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    def __init__(self, name, description):
        self.name = name
        self.description = description
