from api.databases.base_class import mapper_registry
from api.models.base_models import ConnSystemGoal
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class ConnSystemInitiative(BaseModelMixin):
    __tablename__ = "conn_system_initiative"

    name = Column(String(100), nullable=False)
    goal_id = Column(Integer, ForeignKey(ConnSystemGoal.id))
    is_active = Column(Boolean, nullable=False, default=True)
    order_by = Column(Integer, nullable=False, default=0)
    objectives = Column(Text, nullable=True)

    def __init__(self, name, goal_id, order_by, objectives, created_by, is_active=True):
        self.name = name
        self.order_by = order_by
        self.goal_id = goal_id
        self.is_active = is_active
        self.objectives = objectives
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Initiative {self.name}>"
