import json

from api.db_models.connected_systems.driver import ConnSystemDriver
from api.models import db
from flask import g
from sqlalchemy.sql import func


class DriverDao:
    """
    Getting drivers data for each dashboard.
    """

    def get_drivers(self, request):
        return (
            ConnSystemDriver.query.filter_by(
                dashboard_id=request.view_args.get("conn_system_dashboard_id"), deleted_at=None
            )
            .order_by(ConnSystemDriver.order_by)
            .all()
        )

    def get_driver_data(self, request):
        return ConnSystemDriver.query.filter_by(id=request.view_args.get("conn_system_driver_id")).first()

    def delete_driver(self, request):
        obj = ConnSystemDriver.query.filter_by(id=request.view_args.get("conn_system_driver_id")).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_driver(self, request):
        request_data = json.loads(request.data)

        if request.view_args.get("conn_system_driver_id"):
            obj = ConnSystemDriver.query.filter_by(id=request.view_args.get("conn_system_driver_id")).first()

            obj.name = request_data["name"]
            obj.order_by = int(request_data["order_by"])
            obj.is_active = request_data["is_active"]
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemDriver(
                name=request_data["name"],
                dashboard_id=request.view_args.get("conn_system_dashboard_id"),
                order_by=int(request_data["order_by"]),
                is_active=request_data["is_active"],
                created_by=g.user.id,
            )

            db.session.add(obj)

        db.session.commit()
