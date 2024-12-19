from api.db_models.connected_systems.dashboard import ConnSystemDashboard
from api.models import CodexModelMixin, db


class ConnSystemDashboardTab(CodexModelMixin, db.Model):
    name = db.Column(db.String(100), nullable=False)
    dashboard_id = db.Column(db.Integer, db.ForeignKey(ConnSystemDashboard.id))
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    order_by = db.Column(db.Integer, nullable=False, default=0)
    tab_type = db.Column(db.String(100), nullable=False)
    kpis = db.Column(db.Text, nullable=True)
    insights = db.Column(db.Text, nullable=True)
    tools = db.Column(db.Text, nullable=True)

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
