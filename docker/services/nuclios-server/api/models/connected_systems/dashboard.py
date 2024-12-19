from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class ConnSystemDashboard(BaseModelMixin):
    __tablename__ = "conn_system_dashboard"

    name = Column(String(100), nullable=False)
    industry = Column(String(100))
    function = Column(String(100))
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    small_logo_blob_name = Column(Text, nullable=True)

    tabs = relationship(
        "ConnSystemDashboardTab",
        backref="dashboard",
        lazy="select",
        order_by="ConnSystemDashboardTab.order_by",
        primaryjoin="and_(ConnSystemDashboardTab.deleted_at.is_(None), ConnSystemDashboardTab.dashboard_id == ConnSystemDashboard.id)",
    )

    def __init__(self, name, industry, function, description, is_active, created_by):
        self.name = name
        self.industry = industry
        self.function = function
        self.description = description
        self.is_active = is_active
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Dashboard {self.name}>"
