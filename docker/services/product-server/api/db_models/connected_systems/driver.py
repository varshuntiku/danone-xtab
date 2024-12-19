from api.db_models.connected_systems.dashboard import ConnSystemDashboard
from api.models import CodexModelMixin, db


class ConnSystemDriver(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    dashboard_id = db.Column(db.Integer, db.ForeignKey(ConnSystemDashboard.id))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    order_by = db.Column(db.Integer, nullable=False, default=0)

    business_processes = db.relationship(
        "ConnSystemBusinessProcess", backref="driver", lazy="select", order_by="ConnSystemBusinessProcess.order_by"
    )
    business_processes = db.relationship(
        "ConnSystemBusinessProcess",
        backref="driver",
        lazy="select",
        order_by="ConnSystemBusinessProcess.order_by",
        primaryjoin="and_(ConnSystemBusinessProcess.deleted_at.is_(None), ConnSystemBusinessProcess.driver_id == ConnSystemDriver.id)",
    )

    def __init__(self, name, dashboard_id, order_by, created_by, is_active=True):
        self.name = name
        self.dashboard_id = dashboard_id
        self.is_active = is_active
        self.order_by = order_by
        self.created_by = created_by

    def __repr__(self):
        return f"<Connected System Driver {self.name}>"
