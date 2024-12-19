from api.models import CodexModelMixin, db


class ConnSystemDashboard(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    industry = db.Column(db.String(100))
    function = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    small_logo_blob_name = db.Column(db.Text, nullable=True)

    tabs = db.relationship(
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
