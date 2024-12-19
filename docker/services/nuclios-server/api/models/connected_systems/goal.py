from api.databases.base_class import mapper_registry
from api.models.base_models import ConnSystemDashboard
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class ConnSystemGoal(BaseModelMixin):
    __tablename__ = "conn_system_goal"

    name = Column(String(100), nullable=False)
    dashboard_id = Column(Integer, ForeignKey(ConnSystemDashboard.id))
    is_active = Column(Boolean, nullable=False, default=True)
    order_by = Column(Integer, nullable=False, default=0)
    objectives = Column(Text, nullable=True)

    initiatives = relationship(
        "ConnSystemInitiative", backref="goal", lazy="select", order_by="ConnSystemInitiative.order_by"
    )

    def __init__(self, name, dashboard_id, order_by, objectives, created_by, is_active=True):
        self.name = name
        self.dashboard_id = dashboard_id
        self.is_active = is_active
        self.order_by = order_by
        self.objectives = objectives
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Goal {self.name}>"
