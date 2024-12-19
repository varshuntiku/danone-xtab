from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.middlewares import login_required
from api.models import Scenarios, db
from flasgger.utils import swag_from
from flask import Blueprint, g, json, request
from sqlalchemy import desc

bp = Blueprint("Scenarios", __name__)


@bp.route(
    "/codex-product-api/app/<app_id>/<widget_id>/<app_screen_id>/scenario/validation/<name>",
    methods=["GET"],
)
@swag_from("./documentation/scenarios/scenarioNameValidation.yml")
@login_required
def scenarioNameValidation(app_id, widget_id, app_screen_id, name):
    try:
        scenario = Scenarios.query.filter_by(
            app_id=app_id,
            user_email=g.logged_in_email,
            name=name,
            app_screen_id=app_screen_id,
            widget_id=widget_id,
        ).first()
        isexists = "false" if scenario is None else "true"
        return json_response({"isexists": isexists})
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"message": "Error while Validating Scenario name"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/scenario/save", methods=["POST"])
@swag_from("./documentation/scenarios/save.yml")
@login_required
def save():
    try:
        body = request.get_json()
        scenario_name = Scenarios.query.filter_by(
            name=body["scenarioname"],
            app_id=body["app_id"],
            user_email=g.logged_in_email,
            app_screen_id=body["app_screen_id"],
            widget_id=body["widget_id"],
        ).first()
        if scenario_name is not None:
            return json_response({"error": "Scenario Name already exists"}, 409)

        scenario = Scenarios(
            body["scenarioname"],
            body["comment"],
            g.logged_in_email,
            body["app_id"],
            body["app_screen_id"],
            body["widget_id"],
            json.dumps(body["scenarios_json"]),
            str(body["filters_json"]),
        )
        db.session.add(scenario)
        db.session.flush()
        db.session.commit()
        return json_response({"message": "Successfully Saved the Scenario", "status": 200}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"message": "Error while Saving Scenario"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/scenario/list", methods=["PUT"])
@swag_from("./documentation/scenarios/list.yml")
@login_required
def list():
    try:
        request_data = json.loads(request.data)
        filters = str(request_data["filters"])
        scenarios = Scenarios.query.filter_by(
            app_id=request_data["app_id"],
            app_screen_id=request_data["screen_id"],
            widget_id=request_data["widget_id"],
            filters_json=filters,
            user_email=g.logged_in_email,
        ).order_by(desc(Scenarios.id))
        return json_response_count(
            [
                {
                    "id": row.id,
                    "name": row.name,
                    "comment": row.description,
                    "app_id": row.app_id,
                    "scenarios_json": (json.loads(row.scenarios_json) if row.scenarios_json else False),
                    "createdAt": row.created_at.strftime("%d %B, %Y %H:%M"),
                }
                for row in scenarios.all()
            ],
            count=scenarios.count(),
        )
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"message": "Error while Fetching Scenarios"}, 500)
    finally:
        db.session.close()


@bp.route("/codex-product-api/app/<app_id>/scenario/<scenario_id>", methods=["DELETE"])
@swag_from("./documentation/scenarios/delete.yml")
@login_required
def delete(app_id, scenario_id):
    try:
        Scenarios.query.filter(Scenarios.id == scenario_id).delete()
        db.session.commit()
        return json_response({"message": "Successfully Deleted the Scenario", "status": 200}, 200)
    except Exception as ex:
        ExceptionLogger(ex)
        db.session.rollback()
        return json_response({"message": "Error while Deleting Scenario"}, 500)
    finally:
        db.session.close()
