from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class ConnSystemDriver(BaseModelMixin):
    __tablename__ = "conn_system_driver"

    name = Column(String(100), nullable=False)
    dashboard_id = Column(Integer, ForeignKey("conn_system_dashboard.id"))
    is_active = Column(Boolean, nullable=False, default=True)
    end_user_add = Column(Boolean, default=False)
    order_by = Column(Integer, nullable=False, default=0)
    business_processes = relationship(
        "ConnSystemBusinessProcess",
        backref="driver",
        lazy="select",
        order_by="ConnSystemBusinessProcess.order_by",
        primaryjoin="and_(ConnSystemBusinessProcess.deleted_at.is_(None), ConnSystemBusinessProcess.driver_id == ConnSystemDriver.id)",
    )
    business_process_templates = relationship(
        "ConnSystemBusinessProcessTemplate",
        backref="driver",
        lazy="select",
        order_by="ConnSystemBusinessProcessTemplate.order_by",
        primaryjoin="and_(ConnSystemBusinessProcessTemplate.deleted_at.is_(None), ConnSystemBusinessProcessTemplate.driver_id == ConnSystemDriver.id)",
    )

    def __init__(self, name, dashboard_id, order_by, created_by, is_active=True):
        self.name = name
        self.dashboard_id = dashboard_id
        self.is_active = is_active
        self.order_by = order_by
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Driver {self.name}>"
