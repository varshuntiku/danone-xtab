import json

from api.db_models.connected_systems.dashboard import ConnSystemDashboard
from api.models import db
from flask import g
from sqlalchemy.sql import func


class DashboardDao:
    """
    Getting dashboard data for each dashboard.
    """

    def get_dashboard_data(self, request):
        return ConnSystemDashboard.query.filter_by(
            id=request.view_args.get("conn_system_dashboard_id"), deleted_at=None
        ).first()

    def get_dashboards(self):
        return ConnSystemDashboard.query.filter_by(deleted_at=None).all()

    def delete_dashboard(self, request):
        obj = ConnSystemDashboard.query.filter_by(id=request.view_args.get("conn_system_dashboard_id")).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_dashboard(self, request):
        request_data = json.loads(request.data)
        if request.view_args.get("conn_system_dashboard_id"):
            obj = ConnSystemDashboard.query.filter_by(id=request.view_args.get("conn_system_dashboard_id")).first()

            obj.name = request_data["name"]
            obj.industry = request_data["industry"]
            obj.function = request_data["function"]
            obj.description = request_data["description"]
            obj.is_active = request_data["is_active"]
            obj.small_logo_blob_name = request_data["small_logo_blob_name"]
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemDashboard(
                name=request_data["name"],
                industry=request_data["industry"],
                function=request_data["function"],
                description=request_data["description"],
                is_active=request_data["is_active"],
                created_by=g.user.id,
            )

            db.session.add(obj)

        db.session.commit()
