#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import uuid

from api.blueprints.projects import has_edit_access, has_view_access
from api.constants.functions import ExceptionLogger, json_response
from api.helpers import get_clean_postdata
from api.middlewares import (  # all_projects_required,
    any_projects_required,
    app_required,
    login_required,
    projects_access_info_required,
)
from api.models import ProblemDefinitionVersion, Project, User, db
from flask import Blueprint, g, json, request
from sqlalchemy import asc, desc
from sqlalchemy.sql import and_, func

bp = Blueprint("ProblemDefinitionVersion", __name__)


@bp.route("/codex-api/projects/<int:project_id>/versions", methods=["GET"])
@login_required
@app_required
@projects_access_info_required
def versions_list(project_id):
    try:
        request_data = None
        if request.args:
            request_data = request.args
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)
    try:
        project_pd_versions = ProblemDefinitionVersion.query.filter_by(project_id=project_id, deleted_at=None)
        if request_data:
            data_per_page = get_data_per_page(int(request_data.get("pageSize", False)))
            filter_request = json.loads(request_data["filtered"]) if request_data.get("filtered", False) else []
            sort_request = json.loads(request_data["sorted"]) if request_data.get("sorted", False) else []
            if len(filter_request):
                project_pd_versions = filter_query(filter_request, project_pd_versions)

            if len(sort_request):  # desc == descending order
                project_pd_versions = sort_query(sort_request, project_pd_versions)
            else:
                project_pd_versions = project_pd_versions.order_by(desc(ProblemDefinitionVersion.created_at))

            project_pd_versions = paginate_query(request_data, data_per_page, project_pd_versions)
        else:
            project_pd_versions = project_pd_versions.all()
        version_list = project_pd_versions.items if request_data else project_pd_versions
        response = {
            "data": [
                {
                    "version_id": pd_version.version_id,
                    "version_name": pd_version.version_name,
                    "is_current": pd_version.is_current,
                    "created_by_user": f"{pd_version.created_by_user.first_name} {pd_version.created_by_user.last_name}"
                    if pd_version.created_by
                    else "--",
                    "created_at": pd_version.created_at.timestamp(),
                    "updated_by_user": f"{pd_version.updated_by_user.first_name} {pd_version.updated_by_user.last_name}"
                    if pd_version.updated_by
                    else "--",
                }
                for pd_version in version_list
            ]
        }
        if request_data:
            response["page"] = project_pd_versions.page - 1
            response["pages"] = project_pd_versions.pages
            response["count"] = project_pd_versions.total
            response["pageSize"] = len(project_pd_versions.items)
            response["hasNext"] = project_pd_versions.has_next
        return json_response(response)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "No versions found"}, 404)
    finally:
        db.session.close()


def filter_query(filter_request, model_ref):
    try:
        filter_data = []
        for filter_item in filter_request:
            if filter_item["id"] == "updated_by_user" or filter_item["id"] == "created_by_user":
                filter_data.append(
                    ProblemDefinitionVersion.__getattribute__(ProblemDefinitionVersion, filter_item["id"]).has(
                        User.first_name.ilike(filter_item["value"] + "%")
                    )
                )
            else:
                filter_data.append(
                    ProblemDefinitionVersion.__getattribute__(ProblemDefinitionVersion, filter_item["id"]).ilike(
                        "%" + filter_item["value"] + "%"
                    )
                )
        if len(filter_data):
            filter_query = tuple(filter_data)
            return model_ref.filter(and_(*filter_query))
            # project_pd_versions = project_pd_versions.filter(and_(*filter_query))
        else:
            return model_ref
    except Exception as ex:
        ExceptionLogger(ex)


def sort_query(sort_request, model_ref):
    try:
        added_name_sort = False
        for sort_item in sort_request:
            if "desc" in sort_item and sort_item["desc"]:
                if sort_item["id"] == "version_name":
                    added_name_sort = True
                return model_ref.order_by(desc(getattr(ProblemDefinitionVersion, sort_item["id"])))

            else:
                if sort_item["id"] == "id":
                    added_name_sort = True
                return model_ref.order_by(asc(getattr(ProblemDefinitionVersion, sort_item["id"])))

        if not added_name_sort:
            return model_ref.order_by(ProblemDefinitionVersion.version_name)
    except Exception as ex:
        ExceptionLogger(ex)


def paginate_query(paginate_data, data_per_page, model_ref):
    try:
        paginate_query = {
            "page": int(paginate_data["page"]) + 1 if paginate_data.get("page", False) else None,
            "per_page": data_per_page,
        }
        model_ref = model_ref.paginate(
            error_out=False,
            page=paginate_query["page"],
            per_page=paginate_query["per_page"],
        )
        return model_ref
    except Exception as ex:
        ExceptionLogger(ex)


@bp.route("/codex-api/projects/<int:project_id>/versions/<string:version_id>", methods=["GET"])
@login_required
@app_required
@projects_access_info_required
def version_view(project_id, version_id):
    try:
        item = Project.query.filter_by(id=project_id).first()

        if not has_view_access(item):
            return json_response({"error": "You do not have access to view this data"}, 403)
        pd_version = ProblemDefinitionVersion.query.filter_by(
            project_id=project_id, deleted_at=None, version_id=version_id
        ).first()

        return json_response(
            {
                "version_id": pd_version.version_id,
                "version_name": pd_version.version_name,
                "is_current": pd_version.is_current,
                "content": json.loads(pd_version.content) if pd_version.content else {},
                "created_by_user": f"{pd_version.created_by_user.first_name} {pd_version.created_by_user.last_name}"
                if pd_version.created_by
                else "--",
                "created_at": pd_version.created_at.timestamp(),
                "updated_by_user": f"{pd_version.updated_by_user.first_name} {pd_version.updated_by_user.last_name}"
                if pd_version.updated_by
                else "--",
                "version_updated_at": pd_version.updated_at.timestamp() if pd_version.updated_at else None,
            }
        )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error fetching version details"}, 404)
    finally:
        db.session.close()


@bp.route("/codex-api/projects/<int:project_id>/versions", methods=["POST"])
@login_required
@any_projects_required
@projects_access_info_required
def version_create(project_id):
    try:
        project = Project.query.filter_by(id=project_id, deleted_at=None).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)

    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "post data error"}, 422)

    if not has_edit_access(project):
        return json_response({"error": "You do not have access to edit this data"}, 403)
    try:
        project.name = request_data["name"]
        project.industry = request_data["industry"]
        project.project_status = request_data["project_status"]
        project.assignees = (
            [User.query.filter_by(id=group_row).first() for group_row in request_data["assignees"]]
            if "assignees" in request_data
            else []
        )
        project.assignees = [id for id in project.assignees if id is not None]
        project.reviewer = request_data["reviewer"]
        project.updated_by = g.user.id
        project.account = request_data.get("account", None)
        project.problem_area = request_data.get("problem_area", None)

        is_existing_version = ProblemDefinitionVersion.query.filter_by(
            project_id=project_id, deleted_by=None, version_name=request_data["version_name"]
        ).first()
        if is_existing_version:
            return json_response({"error": "Version name already exist"}, 400)
        else:
            project_pd_version = ProblemDefinitionVersion(
                version_id=uuid.uuid4(),
                version_name=request_data["version_name"],
                project_id=project_id,
                is_current=False,
                content=json.dumps(request_data.get("content", {})),
                created_by=g.user.id,
            )

            db.session.add(project_pd_version)
            db.session.commit()
            return json_response(
                {"message": "New version created successfully", "version_id": project_pd_version.version_id}
            )
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "error while creating new version"}, 404)
    finally:
        db.session.close()


@bp.route("/codex-api/projects/<int:project_id>/versions", methods=["PUT"])
@login_required
@any_projects_required
@projects_access_info_required
def set_version(project_id):
    try:
        project = Project.query.filter_by(id=project_id, deleted_at=None).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)
    try:
        request_data = get_clean_postdata(request)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error parsing request data"}, 422)
    if not has_edit_access(project):
        return json_response({"error": "You do not have access to edit this data"}, 403)
    try:
        request_version_urn = "urn:uuid:" + request_data["version_id"]
        pd_versions = ProblemDefinitionVersion.query.filter_by(project_id=project_id, deleted_at=None).all()
        for version in pd_versions:
            if version.version_id.urn == request_version_urn:
                version.is_current = True
            else:
                version.is_current = False
        # db.session.execute(f"UPDATE public.problem_definition_version SET is_current = False WHERE version_id <> {request_data['version_id']}")
        # db.session.execute(f"UPDATE public.problem_definition_version SET is_current = True WHERE version_id = {request_data['version_id']}")

        db.session.commit()
        return json_response({"message": "Version set as current version"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "Error while setting version as default"}, 404)
    finally:
        db.session.close()


@bp.route("/codex-api/projects/<int:project_id>/versions/<string:version_id>", methods=["DELETE"])
@login_required
@any_projects_required
@projects_access_info_required
def version_delete(project_id, version_id):
    try:
        project = Project.query.filter_by(id=project_id).first()
        if project is None:
            return json_response({"error": "item not found"}, 404)
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "item not found"}, 404)
    if not has_edit_access(project):
        return json_response({"error": "You do not have access to edit this data"}, 403)
    try:
        project_pd_version = ProblemDefinitionVersion.query.filter_by(
            project_id=project_id, version_id=version_id
        ).first()

        project_pd_version.deleted_at = func.now()
        project_pd_version.deleted_by = g.user.id

        db.session.commit()
        return json_response({"message": "Version deleted successfully"})
    except Exception as error_msg:
        ExceptionLogger(error_msg)
        return json_response({"error": "error while deleting the version"}, 404)
    finally:
        db.session.close()


def get_data_per_page(data):
    if data:
        return data if data <= 100 else 100
    else:
        return 10
