from api.controllers.connected_systems.dashboard_controller import DashboardController
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_dashboard", __name__)

dashboard_controller = DashboardController()


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_dashboard_tabs(conn_system_dashboard_id):
    """
    API to get conn system dashboard details.
    Args:
        conn_system_dashboard_id ([type]): [description]

    Returns:
        json: [description]
    """
    return dashboard_controller.get_dashboard_data(request)


@bp.route("/codex-product-api/connected-system/dashboard", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_dashboards():
    """
    API to get list of conn system dashboards.

    Returns:
        json: [description]
    """
    return dashboard_controller.get_dashboards()


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>", methods=["DELETE"])
@login_required
def delete(conn_system_dashboard_id):
    return dashboard_controller.delete_dashboard(request)


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>", methods=["POST"])
@login_required
def save(conn_system_dashboard_id):
    return dashboard_controller.save_dashboard(request)


@bp.route("/codex-product-api/connected-system/dashboard", methods=["POST"])
@login_required
def add():
    return dashboard_controller.save_dashboard(request)
