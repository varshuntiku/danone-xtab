from api.controllers.connected_systems.initiative_controller import InitiativeController
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_initiative", __name__)

initiative_controller = InitiativeController()


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/initiatives", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_initiatives(conn_system_dashboard_id):
    """
    API to get conn system dashboard initiatives.
    Args:
        conn_system_dashboard_id ([type]): [description]

    Returns:
        json: [description]
    """
    return initiative_controller.get_initiatives(request)


@bp.route("/codex-product-api/connected-system/dashboard/initiative/<int:conn_system_initiative_id>", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_initiative_details(conn_system_initiative_id):
    """
    API to get conn system initiative details.
    Args:
        conn_system_initiative_id ([type]): [description]

    Returns:
        json: [description]
    """
    return initiative_controller.get_initiative_data(request)


@bp.route(
    "/codex-product-api/connected-system/dashboard/initiative/<int:conn_system_initiative_id>", methods=["DELETE"]
)
@login_required
def delete(conn_system_initiative_id):
    return initiative_controller.delete_initiative(request)


@bp.route("/codex-product-api/connected-system/dashboard/initiative/<int:conn_system_initiative_id>", methods=["POST"])
@login_required
def save(conn_system_initiative_id):
    return initiative_controller.save_initiative(request)


@bp.route("/codex-product-api/connected-system/dashboard/goal/<int:conn_system_goal_id>/initiative", methods=["POST"])
@login_required
def add(conn_system_goal_id):
    return initiative_controller.save_initiative(request)
