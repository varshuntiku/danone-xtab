#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.constants.functions import ExceptionLogger, json_response
from api.middlewares import login_required
from api.models import (
    Objectives,
    ObjectivesGroup,
    ObjectivesSteps,
    objectives_steps_widget_value,
)
from flasgger.utils import swag_from
from flask import Blueprint
from sqlalchemy import asc

bp = Blueprint("Navigator", __name__)


# TODO Add item not found in 404
@bp.route("/codex-product-api/app/<int:app_id>/objectives", methods=["GET"])
@swag_from("./documentation/navigator/get_objectives.yml")
@login_required
def get_objectives(app_id):
    try:
        objectives_group = ObjectivesGroup.query.filter_by(app_id=app_id)
        response = [
            {
                "description": row.description,
                "group_name": row.group_name,
                "objectives_list": [
                    {
                        "objective_id": list.id,
                        "objective_name": list.objective_name,
                        "next_recommended_objective": list.next_recommended_objective,
                    }
                    for list in Objectives.query.filter_by(group_id=row.id)
                ],
            }
            for row in objectives_group
        ]

        return json_response(response)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)


# TODO add item not found 404 exception
@bp.route("/codex-product-api/objectives/<int:objective_id>/steps", methods=["GET"])
@swag_from("./documentation/navigator/get_objective_steps.yml")
@login_required
def get_objective_steps(objective_id):
    try:
        step_content = (
            ObjectivesSteps.query.filter_by(objective_id=objective_id, deleted_at=None)
            .order_by(asc(ObjectivesSteps.order))
            .all()
        )

        response = [
            {
                "title": step.title,
                "description": step.description,
                "graph_type": step.graph_type,
                "horizontal": step.horizontal,
                "order": step.order,
                "app_screen_id": step.app_screen_id,
                "graph_widgets": [
                    {
                        "title": list.title,
                        "sub_title": list.sub_title,
                        "widget_value": list.widget_value,
                    }
                    for list in objectives_steps_widget_value.query.filter_by(objectives_steps_id=step.id).order_by(
                        asc(objectives_steps_widget_value.order)
                    )
                ],
            }
            for step in step_content
        ]

        return json_response(response)

    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 500)
