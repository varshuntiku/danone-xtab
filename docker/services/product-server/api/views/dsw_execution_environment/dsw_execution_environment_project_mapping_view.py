from api.controllers.dsw_execution_environment.dsw_execution_environment_project_mapping_controller import (
    DSWExecutionEnvironmentProjectMappingController,
)
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("ExecutionEnvironmentProjectMapping", __name__)

execution_environment_project_mapping_controller = DSWExecutionEnvironmentProjectMappingController()


@bp.route("/codex-product-api/dsw-execution-environment-project-mapping", methods=["POST"])
@login_required
def create():
    return execution_environment_project_mapping_controller.create(data=request.get_json())


@bp.route("/codex-product-api/dsw-execution-environment-project-mapping", methods=["GET"])
@login_required
def get_by():
    project_id = request.args.get("project_id")
    return execution_environment_project_mapping_controller.get_by_project_id(project_id=project_id)


@bp.route("/codex-product-api/dsw-execution-environment-project-mapping/<int:id>", methods=["PUT"])
@login_required
def update(id):
    return execution_environment_project_mapping_controller.update(id=id, data=request.get_json())


@bp.route("/codex-product-api/dsw-execution-environment-project-mapping/<int:id>", methods=["DELETE"])
@login_required
def delete(id):
    return execution_environment_project_mapping_controller.delete(id=id)
