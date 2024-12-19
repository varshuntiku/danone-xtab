from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text


@mapper_registry.mapped
class ConnSystemBusinessProcess(BaseModelMixin):
    __tablename__ = "conn_system_business_process"

    name = Column(String(100), nullable=False)
    driver_id = Column(Integer, ForeignKey("conn_system_driver.id"))
    is_active = Column(Boolean, nullable=False, default=True)
    order_by = Column(Integer, nullable=False, default=0)
    process_config = Column(Text, nullable=True)
    intelligence_config = Column(Text, nullable=True)
    foundation_config = Column(Text, nullable=True)

    # stake_holders = relationship("StakeHolder", backref="problem_definition", lazy="dynamic")
    # problem_overviews = relationship("ProblemOverview", backref="problem_definition", lazy="dynamic")

    def __init__(
        self,
        name,
        driver_id,
        order_by,
        process_config,
        intelligence_config,
        foundation_config,
        created_by,
        is_active=True,
    ):
        self.name = name
        self.driver_id = driver_id
        self.is_active = is_active
        self.order_by = order_by
        self.process_config = process_config
        self.intelligence_config = intelligence_config
        self.foundation_config = foundation_config
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Business Process {self.name}>"
