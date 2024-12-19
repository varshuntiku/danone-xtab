#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

from api.blueprints.widget_groups import list as widget_group_list_fn
from api.codex_models.code_utils import code_demo as jupyter_code_demo
from api.codex_models.code_utils import get_code_metadata as git_code_metadata
from api.codex_models.code_utils import preview_code as git_preview_code
from api.codex_models.widgets import Widgets
from api.constants.functions import ExceptionLogger, json_response, json_response_count
from api.helpers import get_clean_postdata
from api.middlewares import app_required, login_required, widget_factory_required
from api.models import Widget, WidgetAttachment, db
from flasgger.utils import swag_from
from flask import Blueprint, g, json, request
from sqlalchemy.sql import func

bp = Blueprint("Widgets", __name__)


@bp.route("/codex-api/widgets", methods=["GET"])
# @swag_from("./documentation/widgets/list.yml")
@login_required
@widget_factory_required
def list():
    return json_response_count(
        [
            {
                "id": row.id,
                "name": row.name,
                "widget_group": row.widget_group.name,
                "created_by": f"{row.created_by_user.first_name} {row.created_by_user.last_name}"
                if row.created_by
                else "--",
                "updated_by": f"{row.updated_by_user.first_name} {row.updated_by_user.last_name}"
                if row.updated_by
                else "--",
                "created_at": row.created_at.strftime("%d %B, %Y %H:%M") if row.created_at else "--",
                "updated_at": row.updated_at.strftime("%d %B, %Y %H:%M") if row.updated_at else "--",
                "contributor_code": True if row.contributor_code else False,
                "test_code": True if row.test_code_params else False,
                "prod_code": True if row.prod_code_params else False,
                "attachment_count": WidgetAttachment.query.filter_by(widget_id=row.id).count(),
            }
            for row in Widget.query.order_by(Widget.name)
        ],
        200,
        Widget.query.count(),
    )


@bp.route("/codex-api/widgets/widget-groups", methods=["GET"])
@swag_from("./documentation/widgets/widget_group_list.yml")
@login_required
@widget_factory_required
def widget_group_list():
    return widget_group_list_fn()


@bp.route("/codex-api/widgets", methods=["POST"])
@swag_from("./documentation/widgets/create.yml")
@login_required
@widget_factory_required
def create():
    try:
        request_data = get_clean_postdata(request)

        widget = Widget(
            name=request_data["name"],
            group_id=request_data["group_id"],
            created_by=g.user.id,
        )
        db.session.add(widget)
        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error creating widget"}, 422)

    return json_response({"id": widget.id, "name": widget.name})


@bp.route("/codex-api/widgets/<int:widget_id>", methods=["GET"])
@swag_from("./documentation/widgets/show.yml")
@login_required
@widget_factory_required
def show(widget_id):
    try:
        item = Widget.query.filter_by(id=widget_id).first()
        return json_response(
            {
                "id": item.id,
                "name": item.name,
                "group_id": item.group_id,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)


@bp.route("/codex-api/widgets/<int:widget_id>", methods=["PUT", "POST"])
@swag_from("./documentation/widgets/update.yml")
@login_required
@widget_factory_required
def update(widget_id):
    try:
        widget = Widget.query.filter_by(id=widget_id).first()
        if widget is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        widget.name = request_data["name"]
        widget.group_id = request_data["group_id"]
        widget.updated_by = g.user.id
        db.session.commit()
        widget = Widget.query.filter_by(id=widget_id).first()
        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating widget"}, 500)


@bp.route("/codex-api/widgets/<int:widget_id>", methods=["DELETE"])
@swag_from("./documentation/widgets/delete.yml")
@login_required
@widget_factory_required
def delete(widget_id):
    try:
        widget = Widget.query.filter_by(id=widget_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        widget.deleted_at = func.now()
        widget.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting widget"}, 500)


@bp.route("/codex-api/widgets/get-contributor-code/<int:widget_id>", methods=["GET"])
@swag_from("./documentation/widgets/get_contributor_code.yml")
@login_required
@widget_factory_required
def get_contributor_code(widget_id):
    try:
        widget = Widget.query.filter_by(id=widget_id).first()

        if widget.contributor_code is None:
            return json_response({"data": ""})
        else:
            return json_response({"data": widget.contributor_code})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching widget contributor code"}, 422)


# TODO change api name


@bp.route("/codex-api/widgets/save-contributor-code/<int:widget_id>", methods=["PUT"])
@swag_from("./documentation/widgets/save_contributor_code.yml")
@login_required
@widget_factory_required
def save_contributor_code(widget_id):
    try:
        request_data = get_clean_postdata(request)

        widget = Widget.query.filter_by(id=widget_id).first()
        widget.contributor_code = request_data["code_text"]

        db.session.commit()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error saving widget contributor code"}, 422)

    return json_response({"status": True})


@bp.route("/codex-api/widgets/get-code-details/<int:widget_id>/<code_type>", methods=["GET"])
@login_required
@widget_factory_required
def get_code_details(widget_id, code_type):
    """Returns the code details of the given widget id and code type

    Args:
        widget_id ([type]): [description]
        code_type ([type]): [description]

    Returns:
        JSON:{repo, branch, path, tag}
    """
    try:
        widget = Widget.query.filter_by(id=widget_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        code_details = {"repo": "", "branch": "", "path": "", "tag": ""}

        if code_type == "TEST" and widget.test_code_params and widget.test_code_params != "":
            code_details = json.loads(widget.test_code_params)
        elif code_type == "PROD" and widget.prod_code_params and widget.prod_code_params != "":
            code_details = json.loads(widget.prod_code_params)

        return json_response(code_details)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching widget code details"}, 500)


@bp.route(
    "/codex-api/widgets/save-code-details/<int:widget_id>/<code_type>",
    methods=["PUT", "POST"],
)
@login_required
@widget_factory_required
def save_code_details(widget_id, code_type):
    """Updates the code details of the given widget id and code type

    Args:
        widget_id ([type]): [description]
        code_type ([type]): [description]

    Returns:
        JSON: {'status': True}
    """
    try:
        widget = Widget.query.filter_by(id=widget_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        code_details = {
            "repo": request_data["repo"],
            "branch": request_data["branch"],
            "path": request_data["path"],
            "tag": request_data["tag"],
        }

        if code_type == "TEST":
            widget.test_code_params = json.dumps(code_details)
        if code_type == "PROD":
            widget.prod_code_params = json.dumps(code_details)

        db.session.commit()

        return json_response({"status": True})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error updating widget code"}, 500)


@bp.route("/codex-api/widgets/get-artifacts/<int:widget_id>", methods=["GET"])
@login_required
@app_required
def get_artifacts(widget_id):
    """Retrieves artifacts data for the given widget_id

    Args:
        widget_id ([type]): [description]

    Returns:
        JSON: {status, data}
    """
    try:
        if widget_id == "CONTAINER" or widget_id == "PLACEHOLDER":
            return json_response({"status": "success", "data": []})
        else:
            widgets_object = Widgets(widget_id)
            data = widgets_object.get_artifacts()

            return json_response({"status": "success", "data": data})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error retrieving widget artifact data"}, 422)


@bp.route("/codex-api/widgets/save-artifact/<int:widget_id>", methods=["PUT"])
@login_required
@widget_factory_required
def save_artifacts(widget_id):
    """Saves new artifact name and data in the given widget id

    Args:
        widget_id ([type]): [description]

    Returns:
        JSON: {status, tiny_url, attachment_id}
    """
    try:
        request_data = get_clean_postdata(request)
        artifact_data = request_data["data"]
        artifact_name = request_data["name"] if "name" in request_data else None
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    try:
        widgets_object = Widgets(widget_id)
        widget_attachment = widgets_object.save_artifact(artifact_data, artifact_name)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error saving widget artifact data"}, 422)

    return json_response(
        {
            "status": "success",
            "tiny_url": widget_attachment["tiny_url"],
            "attachment_id": widget_attachment["attachment_id"],
        }
    )


@bp.route("/codex-api/widgets/delete-artifact/<int:widget_attachment_id>", methods=["DELETE"])
@login_required
@widget_factory_required
def delete_widget_artifact(widget_attachment_id):
    """Deletes the widget_attachment for the given id.

    Args:
        widget_attachment_id ([type]): [description]

    Returns:
        JSON: {'deleted_rows': 1}
    """
    try:
        widget_attachment = WidgetAttachment.query.filter_by(id=widget_attachment_id).first()
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        widget_attachment.deleted_at = func.now()
        widget_attachment.deleted_by = g.user.id
        db.session.commit()
        return json_response({"deleted_rows": 1})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error deleting widget artifact"}, 500)


@bp.route("/codex-api/widgets/preview-code/<int:widget_id>", methods=["PUT"])
@login_required
@widget_factory_required
def preview_code(widget_id):
    """Generates the preview and demo for the given widget.

    Args:
        widget_id ([type]): [description]

    Returns:
        JSON: {status, code, metadata, code_demo}
    """
    try:
        widget = Widget.query.filter_by(id=widget_id).first()
        request_data = get_clean_postdata(request)
        code_details = {
            "repo": request_data["repo"],
            "branch": request_data["branch"],
            "path": request_data["path"],
            "tag": request_data["tag"],
        }
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    widget_code = False
    code_metadata = False
    code_demo = False
    try:
        widget_code = git_preview_code(code_details)
        code_metadata = git_code_metadata(widget_code, widget.widget_group.code)
        code_demo = jupyter_code_demo(code_details)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response(
            {
                "status": "success",
                "code": False,
                "error_msg": "Error in generating preview code",
            }
        )

    return json_response(
        {
            "status": "success",
            "code": widget_code,
            "metadata": code_metadata,
            "code_demo": code_demo,
        }
    )
