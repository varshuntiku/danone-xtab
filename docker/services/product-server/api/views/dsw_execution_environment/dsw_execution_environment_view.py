from api.controllers.dsw_execution_environment.dsw_execution_environment_controller import (
    DSWExecutionEnvironmentController,
)
from api.middlewares import login_required
from flask import Blueprint, request

bp = Blueprint("ExecutionEnvironment", __name__)

execution_environment_controller = DSWExecutionEnvironmentController()


@bp.route("/codex-product-api/dsw-execution-environment", methods=["POST"])
@login_required
def create():
    return execution_environment_controller.create(data=request.get_json())


@bp.route("/codex-product-api/dsw-execution-environment/<int:id>", methods=["GET"])
@login_required
def get(id):
    return execution_environment_controller.get(id=id)


@bp.route("/codex-product-api/dsw-execution-environment/list", methods=["GET"])
@login_required
def get_list():
    return execution_environment_controller.get_all()


@bp.route("/codex-product-api/dsw-execution-environment/<int:id>", methods=["PUT"])
@login_required
def update(id):
    return execution_environment_controller.update(id=id, data=request.get_json())


@bp.route("/codex-product-api/dsw-execution-environment/<int:id>", methods=["DELETE"])
@login_required
def delete(id):
    return execution_environment_controller.delete(id=id)
