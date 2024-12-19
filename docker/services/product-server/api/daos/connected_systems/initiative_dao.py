import json

from api.db_models.connected_systems.goal import ConnSystemGoal
from api.db_models.connected_systems.initiative import ConnSystemInitiative
from api.models import db
from flask import g
from sqlalchemy import and_
from sqlalchemy.sql import func


class InitiativeDao:
    """
    Getting initiatives data for each dashboard.
    """

    def get_initiatives(self, request):
        return (
            ConnSystemInitiative.query.filter(
                and_(
                    ConnSystemGoal.dashboard_id == request.view_args.get("conn_system_dashboard_id"),
                    ConnSystemInitiative.deleted_at.is_(None),
                )
            )
            .join(ConnSystemGoal)
            .order_by(ConnSystemInitiative.goal_id, ConnSystemInitiative.order_by)
            .all()
        )

    def get_initiative_data(self, request):
        return ConnSystemInitiative.query.filter_by(id=request.view_args.get("conn_system_initiative_id")).first()

    def delete_initiative(self, request):
        obj = ConnSystemInitiative.query.filter_by(id=request.view_args.get("conn_system_initiative_id")).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_initiative(self, request):
        request_data = json.loads(request.data)

        if request.view_args.get("conn_system_initiative_id"):
            obj = ConnSystemInitiative.query.filter_by(id=request.view_args.get("conn_system_initiative_id")).first()

            obj.name = request_data["name"]
            obj.goal_id = int(request_data["goal_id"])
            obj.order_by = int(request_data["order_by"])
            obj.is_active = request_data["is_active"]
            obj.objectives = (
                json.dumps(request_data["objectives"])
                if "objectives" in request_data and request_data["objectives"]
                else None
            )
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemInitiative(
                name=request_data["name"],
                goal_id=request.view_args.get("conn_system_goal_id"),
                order_by=int(request_data["order_by"]),
                is_active=request_data["is_active"],
                created_by=g.user.id,
                objectives=json.dumps(request_data["objectives"])
                if "objectives" in request_data and request_data["objectives"]
                else None,
            )

            db.session.add(obj)

        db.session.commit()
