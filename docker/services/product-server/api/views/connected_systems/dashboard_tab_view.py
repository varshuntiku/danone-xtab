from api.controllers.connected_systems.dashboard_tab_controller import (
    DashboardTabController,
)
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_dashboard_tab", __name__)

dashboard_tab_controller = DashboardTabController()


@bp.route("/codex-product-api/connected-system/dashboard/tab/<int:conn_system_dashboard_tab_id>", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_dashboard_tab_details(conn_system_dashboard_tab_id):
    """
    API to get conn system dashboard tab details.
    Args:
        conn_system_dashboard_tab_id ([type]): [description]

    Returns:
        json: [description]
    """
    return dashboard_tab_controller.get_dashboard_tab_data(request)


@bp.route("/codex-product-api/connected-system/dashboard/tab/<int:conn_system_dashboard_tab_id>", methods=["DELETE"])
@login_required
def delete(conn_system_dashboard_tab_id):
    return dashboard_tab_controller.delete_dashboard_tab(request)


@bp.route("/codex-product-api/connected-system/dashboard/tab/<int:conn_system_dashboard_tab_id>", methods=["POST"])
@login_required
def save(conn_system_dashboard_tab_id):
    return dashboard_tab_controller.save_dashboard_tab(request)


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/tab", methods=["POST"])
@login_required
def add(conn_system_dashboard_id):
    return dashboard_tab_controller.save_dashboard_tab(request)
