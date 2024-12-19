import json

from api.db_models.connected_systems.dashboard_tab import ConnSystemDashboardTab
from api.models import db
from flask import g
from sqlalchemy.sql import func


class DashboardTabDao:
    """
    Getting dashboard data for each dashboard.
    """

    def get_dashboard_tab_data(self, request):
        return ConnSystemDashboardTab.query.filter_by(
            id=request.view_args.get("conn_system_dashboard_tab_id"), is_active=True
        ).first()

    def delete_dashboard_tab(self, request):
        obj = ConnSystemDashboardTab.query.filter_by(id=request.view_args.get("conn_system_dashboard_tab_id")).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_dashboard_tab(self, request):
        request_data = json.loads(request.data)
        if request.view_args.get("conn_system_dashboard_tab_id"):
            obj = ConnSystemDashboardTab.query.filter_by(
                id=request.view_args.get("conn_system_dashboard_tab_id")
            ).first()

            obj.name = request_data["name"]
            obj.tab_type = request_data["tab_type"]
            obj.order_by = int(request_data["order_by"])
            obj.is_active = request_data["is_active"]
            obj.kpis = json.dumps(request_data["kpis"]) if "kpis" in request_data and request_data["kpis"] else None
            obj.insights = (
                json.dumps(request_data["insights"])
                if "insights" in request_data and request_data["insights"]
                else None
            )
            obj.tools = json.dumps(request_data["tools"]) if "tools" in request_data and request_data["tools"] else None
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemDashboardTab(
                name=request_data["name"],
                dashboard_id=request.view_args.get("conn_system_dashboard_id"),
                tab_type=request_data["tab_type"],
                order_by=int(request_data["order_by"]),
                is_active=request_data["is_active"],
                created_by=g.user.id,
                kpis=json.dumps(request_data["kpis"]) if "kpis" in request_data and request_data["kpis"] else None,
                insights=json.dumps(request_data["insights"])
                if "insights" in request_data and request_data["insights"]
                else None,
                tools=json.dumps(request_data["tools"]) if "tools" in request_data and request_data["tools"] else None,
            )

            db.session.add(obj)

        db.session.commit()
