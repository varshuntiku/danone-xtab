from api.databases.base_class import mapper_registry
from api.models.base_models import ConnSystemDashboard
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class ConnSystemDashboardTab(BaseModelMixin):
    __tablename__ = "conn_system_dashboard_tab"

    name = Column(String(100), nullable=False)
    dashboard_id = Column(Integer, ForeignKey(ConnSystemDashboard.id))
    is_active = Column(Boolean, nullable=False, default=True)
    order_by = Column(Integer, nullable=False, default=0)
    tab_type = Column(String(100), nullable=False)
    kpis = Column(Text, nullable=True)
    insights = Column(Text, nullable=True)
    tools = Column(Text, nullable=True)

    def __init__(
        self, name, dashboard_id, tab_type, order_by, created_by, is_active=True, kpis=None, insights=None, tools=None
    ):
        self.name = name
        self.dashboard_id = dashboard_id
        self.tab_type = tab_type
        self.order_by = order_by
        self.is_active = is_active
        self.kpis = kpis
        self.insights = insights
        self.tools = tools
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Dashboard Tab {self.name}>"
