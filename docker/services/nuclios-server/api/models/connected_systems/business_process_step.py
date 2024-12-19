from api.databases.base_class import mapper_registry
from api.models.base_models import ConnSystemBusinessProcess
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String


@mapper_registry.mapped
class ConnSystemBusinessProcessStep(BaseModelMixin):
    __tablename__ = "conn_system_business_process_step"

    name = Column(String(100), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    business_process_id = Column(Integer, ForeignKey(ConnSystemBusinessProcess.id))
    order_by = Column(Integer, nullable=False, default=0)

    def __init__(self, name, business_process_id, order_by, created_by, is_active=True):
        self.name = name
        self.is_active = is_active
        self.business_process_id = business_process_id
        self.order_by = order_by
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Business Process Step {self.name}>"
