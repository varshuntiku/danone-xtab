from api.controllers.connected_systems.business_process_controller import (
    BusinessProcessController,
)
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_business_process", __name__)

business_process_controller = BusinessProcessController()


@bp.route(
    "/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/business-processes", methods=["GET"]
)
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_business_processes(conn_system_dashboard_id):
    """
    API to get conn system dashboard tab details.
    Args:
        conn_system_dashboard_tab_id ([type]): [description]

    Returns:
        json: [description]
    """
    return business_process_controller.get_business_processes(request)


@bp.route(
    "/codex-product-api/connected-system/dashboard/business-process/<int:conn_system_business_process_id>",
    methods=["GET"],
)
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_business_process_details(conn_system_business_process_id):
    """
    API to get conn system goal details.
    Args:
        conn_system_goal_id ([type]): [description]

    Returns:
        json: [description]
    """
    return business_process_controller.get_business_process_data(request)


@bp.route(
    "/codex-product-api/connected-system/dashboard/business-process/<int:conn_system_business_process_id>/flow",
    methods=["GET"],
)
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_business_process_flow(conn_system_business_process_id):
    """
    API to get conn system dashboard tab details.
    Args:
        conn_system_dashboard_tab_id ([type]): [description]

    Returns:
        json: [description]
    """
    return business_process_controller.get_business_process_flow(request)


@bp.route(
    "/codex-product-api/connected-system/dashboard/business-process/<int:conn_system_business_process_id>",
    methods=["DELETE"],
)
@login_required
def delete(conn_system_business_process_id):
    return business_process_controller.delete_business_process(request)


@bp.route(
    "/codex-product-api/connected-system/dashboard/business-process/<int:conn_system_business_process_id>",
    methods=["POST"],
)
@login_required
def save(conn_system_business_process_id):
    return business_process_controller.save_business_process(request)


@bp.route("/codex-product-api/connected-system/dashboard/business-process", methods=["POST"])
@login_required
def add():
    return business_process_controller.save_business_process(request)
