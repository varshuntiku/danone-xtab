from api.controllers.connected_systems.driver_controller import DriverController
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("connected_systems_driver", __name__)

driver_controller = DriverController()


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/drivers", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_drivers(conn_system_dashboard_id):
    """
    API to get conn system dashboard drivers.
    Args:
        conn_system_dashboard_id ([type]): [description]

    Returns:
        json: [description]
    """
    return driver_controller.get_drivers(request)


@bp.route("/codex-product-api/connected-system/dashboard/driver/<int:conn_system_driver_id>", methods=["GET"])
# @swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_driver_details(conn_system_driver_id):
    """
    API to get conn system driver details.
    Args:
        conn_system_driver_id ([type]): [description]

    Returns:
        json: [description]
    """
    return driver_controller.get_driver_data(request)


@bp.route("/codex-product-api/connected-system/dashboard/driver/<int:conn_system_driver_id>", methods=["DELETE"])
@login_required
def delete(conn_system_driver_id):
    return driver_controller.delete_driver(request)


@bp.route("/codex-product-api/connected-system/dashboard/driver/<int:conn_system_driver_id>", methods=["POST"])
@login_required
def save(conn_system_driver_id):
    return driver_controller.save_driver(request)


@bp.route("/codex-product-api/connected-system/dashboard/<int:conn_system_dashboard_id>/driver", methods=["POST"])
@login_required
def add(conn_system_dashboard_id):
    return driver_controller.save_driver(request)
