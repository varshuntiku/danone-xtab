from api.controllers.solution_workbench.screen_controller import (
    SolutionWorkbenchScreenController,
)
from api.middlewares import login_required
from flasgger.utils import swag_from
from flask import Blueprint, request

bp = Blueprint("solution_workbench_screen", __name__)

solution_workbench_screen_controller = SolutionWorkbenchScreenController()


@bp.route("/codex-product-api/app/<int:app_id>/screens/<int:screen_id>/overview", methods=["GET"])
@swag_from("./documentation/app/get_screen_config.yml")
@login_required
def get_overview_details(app_id, screen_id):
    """
    API to get overview details.
    List of Packages and Libraries available to write UIaC.
    Args:
        app_id ([type]): [description]
        screen_id ([type]): [description]

    Returns:
        json: [description]
    """
    return solution_workbench_screen_controller.get_overview_details(request)
