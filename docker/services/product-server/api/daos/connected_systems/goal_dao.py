import json

from api.db_models.connected_systems.goal import ConnSystemGoal
from api.models import db
from flask import g
from sqlalchemy.sql import func


class GoalDao:
    """
    Getting goals data for each dashboard.
    """

    def get_goals(self, request):
        return (
            ConnSystemGoal.query.filter_by(
                dashboard_id=request.view_args.get("conn_system_dashboard_id"), deleted_at=None
            )
            .order_by(ConnSystemGoal.order_by)
            .all()
        )

    def get_goal_data(self, request):
        return ConnSystemGoal.query.filter_by(id=request.view_args.get("conn_system_goal_id")).first()

    def delete_goal(self, request):
        obj = ConnSystemGoal.query.filter_by(id=request.view_args.get("conn_system_goal_id")).first()

        obj.deleted_at = func.now()
        obj.deleted_by = g.user.id
        db.session.commit()

    def save_goal(self, request):
        request_data = json.loads(request.data)

        if request.view_args.get("conn_system_goal_id"):
            obj = ConnSystemGoal.query.filter_by(id=request.view_args.get("conn_system_goal_id")).first()

            obj.name = request_data["name"]
            obj.order_by = int(request_data["order_by"])
            obj.is_active = request_data["is_active"]
            obj.objectives = (
                json.dumps(request_data["objectives"])
                if "objectives" in request_data and request_data["objectives"]
                else None
            )
            obj.updated_by = g.user.id

        else:
            obj = ConnSystemGoal(
                name=request_data["name"],
                dashboard_id=request.view_args.get("conn_system_dashboard_id"),
                order_by=int(request_data["order_by"]),
                is_active=request_data["is_active"],
                created_by=g.user.id,
                objectives=json.dumps(request_data["objectives"])
                if "objectives" in request_data and request_data["objectives"]
                else None,
            )

            db.session.add(obj)

        db.session.commit()
