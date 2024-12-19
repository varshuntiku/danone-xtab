import json

from api.db_models.connected_systems.business_process import ConnSystemBusinessProcess
from api.db_models.connected_systems.driver import ConnSystemDriver
from api.models import db
from flask import g
from sqlalchemy import and_
from sqlalchemy.sql import func


class BusinessProcessDao:
    """
    Getting dashboard data for each dashboard.
    """

    def get_business_process_flow(self, request):
        return ConnSystemBusinessProcess.query.filter_by(
            id=request.view_args.get("conn_system_business_process_id"), is_active=True
        ).first()

    def get_business_process_data(self, request):
        return ConnSystemBusinessProcess.query.filter_by(
            id=request.view_args.get("conn_system_business_process_id")
        ).first()

    def get_business_processes(self, request):
        return (
            ConnSystemBusinessProcess.query.filter(
                and_(
                    ConnSystemDriver.dashboard_id == request.view_args.get("conn_system_dashboard_id"),
                    ConnSystemBusinessProcess.deleted_at.is_(None),
                )
            )
            .join(ConnSystemDriver)
            .order_by(ConnSystemBusinessProcess.driver_id, ConnSystemBusinessProcess.order_by)
            .all()
        )

    def delete_business_process(self, request):
        obj = ConnSystemBusinessProcess.query.filter_by(
            id=request.view_args.get("conn_system_business_process_id")
        ).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_business_process(self, request):
        request_data = json.loads(request.data)

        if request.view_args.get("conn_system_business_process_id"):
            obj = ConnSystemBusinessProcess.query.filter_by(
                id=request.view_args.get("conn_system_business_process_id")
            ).first()

            obj.name = request_data["name"]
            obj.driver_id = request_data["driver_id"]
            obj.order_by = int(request_data["order_by"])
            obj.is_active = request_data["is_active"]
            obj.process_config = (
                json.dumps(request_data["process_config"])
                if "process_config" in request_data and request_data["process_config"]
                else None
            )
            obj.intelligence_config = (
                json.dumps(request_data["intelligence_config"])
                if "intelligence_config" in request_data and request_data["intelligence_config"]
                else None
            )
            obj.foundation_config = (
                json.dumps(request_data["foundation_config"])
                if "foundation_config" in request_data and request_data["foundation_config"]
                else None
            )
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemBusinessProcess(
                name=request_data["name"],
                driver_id=request_data["driver_id"],
                order_by=int(request_data["order_by"]),
                is_active=request_data["is_active"],
                created_by=g.user.id,
                process_config=json.dumps(request_data["process_config"])
                if "process_config" in request_data and request_data["process_config"]
                else None,
                intelligence_config=json.dumps(request_data["intelligence_config"])
                if "intelligence_config" in request_data and request_data["intelligence_config"]
                else None,
                foundation_config=json.dumps(request_data["foundation_config"])
                if "foundation_config" in request_data and request_data["foundation_config"]
                else None,
            )

            db.session.add(obj)

        db.session.commit()
