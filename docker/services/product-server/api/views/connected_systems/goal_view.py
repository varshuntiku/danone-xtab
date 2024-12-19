# from api.db_models.connected_systems.dashboard import ConnSystemDashboard
# from api.db_models.connected_systems.goal import ConnSystemDashboardTab
# from api.db_models.connected_systems.goal import ConnSystemGoal
# from api.db_models.connected_systems.initiative import ConnSystemInitiative
# from api.db_models.connected_systems.driver import ConnSystemDriver
# from api.db_models.connected_systems.business_process import ConnSystemBusinessProcess
# from api.db_models.connected_systems.business_process_step import ConnSystemBusinessProcessStep

from api.controllers.connected_systems.goal_controller import GoalController
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_goal", __name__)

goal_controller = GoalController()


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/goals", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_goals(conn_system_dashboard_id):
    """
    API to get conn system dashboard goals.
    Args:
        conn_system_dashboard_id ([type]): [description]

    Returns:
        json: [description]
    """
    return goal_controller.get_goals(request)


@bp.route("/codex-product-api/connected-system/dashboard/goal/<int:conn_system_goal_id>", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_goal_details(conn_system_goal_id):
    """
    API to get conn system goal details.
    Args:
        conn_system_goal_id ([type]): [description]

    Returns:
        json: [description]
    """
    return goal_controller.get_goal_data(request)


@bp.route("/codex-product-api/connected-system/dashboard/goal/<int:conn_system_goal_id>", methods=["DELETE"])
@login_required
def delete(conn_system_goal_id):
    return goal_controller.delete_goal(request)


@bp.route("/codex-product-api/connected-system/dashboard/goal/<int:conn_system_goal_id>", methods=["POST"])
@login_required
def save(conn_system_goal_id):
    return goal_controller.save_goal(request)


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/goal", methods=["POST"])
@login_required
def add(conn_system_dashboard_id):
    return goal_controller.save_goal(request)
