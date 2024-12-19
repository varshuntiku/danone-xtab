import json
import logging
import math
import uuid
from typing import Dict, List, Tuple

from api.constants.apps.projects_error_messages import ProjectsErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import ProblemDefinitionVersion, Project, User
from api.schemas.apps.projects_schema import (
    CreateProjectRequestSchema,
    ProjectsAjaxListRequestSchema,
    ProjectVersionCreateRequestSchema,
    UpdateProjectRequestSchema,
)
from api.utils.app.app import sanitize_content
from fastapi import status
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_, func, or_


class ProjectsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_projects_list(self) -> List[Project]:
        """
        Get a list of projects oredered by name.

        Args:
            None
        Returns:
            List of projects
        """
        try:
            return (
                self.db_session.query(Project)
                .filter_by(parent_project_id=None, deleted_at=None)
                .order_by(Project.name)
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ProjectsErrors.GET_PROJECTS_LIST_ERROR.value},
            )

    def get_project_by_id(self, project_id: int) -> Project:
        """
        Get project by project id.

         Args:
            project_id: project id

        Returns:
            Project: Project object
        """
        try:
            return self.db_session.query(Project).filter_by(id=project_id, deleted_at=None).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ProjectsErrors.GET_PROJECT_ID_ERROR.value},
            )

    def projects_ajax_list(
        self, projects_access: Dict, user_id: int, request_data: ProjectsAjaxListRequestSchema
    ) -> Tuple:
        """
        Get all projects list

        Args:
            projects_access: projects access object
            user_id: user's id
            request_data: request data

        Returns:
            Project's list and count of projects
        """
        try:
            my_projects_only = projects_access["my_projects_only"]
            my_projects = projects_access["my_projects"]
            all_projects = projects_access["all_projects"]

            projects = self.db_session.query(Project).filter_by(parent_project_id=None, deleted_at=None)

            # projects_count = Project.query.filter_by(parent_project_id=None)

            if my_projects_only and not (my_projects or all_projects):
                projects = projects.filter(Project.assignees.any(User.id == user_id))
                # projects_count = projects_count.filter(
                #     Project.assignees.any(User.id == g.user.id))

            if request_data.filtered:
                for filter_item in request_data.filtered:
                    if filter_item.value:
                        if filter_item.id == "name":
                            projects = projects.filter(
                                func.lower(Project.name).like("%" + filter_item.value.lower() + "%")
                            )
                        if filter_item.id == "industry":
                            projects = projects.filter(
                                func.lower(Project.industry).like("%" + filter_item.value.lower() + "%")
                            )
                        elif filter_item.id == "assignees_label":
                            projects = projects.filter(
                                Project.assignees.any(
                                    or_(
                                        func.lower(User.first_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.last_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.first_name + " " + User.last_name).like(
                                            "%" + filter_item.value.lower() + "%"
                                        ),
                                    )
                                )
                            )
                        elif filter_item.id == "reviewer":
                            projects = projects.filter(
                                Project.review_user.has(
                                    or_(
                                        func.lower(User.first_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.last_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.first_name + " " + User.last_name).like(
                                            "%" + filter_item.value.lower() + "%"
                                        ),
                                    )
                                )
                            )
                        elif filter_item.id == "created_by":
                            projects = projects.filter(
                                Project.created_by_user.has(
                                    or_(
                                        func.lower(User.first_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.last_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.first_name + " " + User.last_name).like(
                                            "%" + filter_item.value.lower() + "%"
                                        ),
                                    )
                                )
                            )
                        elif filter_item.id == "updated_by":
                            projects = projects.filter(
                                Project.updated_by_user.has(
                                    or_(
                                        func.lower(User.first_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.last_name).like("%" + filter_item.value.lower() + "%"),
                                        func.lower(User.first_name + " " + User.last_name).like(
                                            "%" + filter_item.value.lower() + "%"
                                        ),
                                    )
                                )
                            )
                        elif filter_item.id == "account":
                            projects = projects.filter(
                                func.lower(Project.account).like("%" + filter_item.value.lower() + "%")
                            )

                        elif filter_item.id == "origin":
                            projects = projects.filter(
                                func.lower(Project.origin).like("%" + filter_item.value.lower() + "%")
                            )

            projects_count = projects.count()

            if request_data.sorted:  # desc == descending order
                added_name_sort = False
                for sort_item in request_data.sorted:
                    if "desc" in sort_item and sort_item["desc"]:
                        if sort_item["id"] == "name":
                            added_name_sort = True
                        projects = projects.order_by(desc(getattr(Project, sort_item["id"])))

                    else:
                        if sort_item["id"] == "id":
                            added_name_sort = True
                        projects = projects.order_by(asc(getattr(Project, sort_item["id"])))

                if not added_name_sort:
                    projects = projects.order_by(Project.name)
            else:
                projects = projects.order_by(desc(Project.created_at))

            projects = projects.limit(request_data.pageSize).offset(request_data.page * request_data.pageSize)

            return projects, projects_count
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ProjectsErrors.GET_PROJECTS_LIST_ERROR.value},
            )

    def get_casestudy_count(self, project_id: int) -> int:
        """
        Get a count of casestudy.

        Args:
            project_id: project's id

        Returns:
            Count of casestudies
        """
        try:
            return self.db_session.query(Project).filter_by(parent_project_id=project_id, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": ProjectsErrors.GET_CASESTUDY_COUNT_ERROR.value},
            )

    def create_project(self, request_data: CreateProjectRequestSchema, user_id: int) -> Project:
        """
        Creates a new project.

        Args:
            request_data: request data
            user_id: user's id

        Return:
            Project object
        """
        try:
            project = Project(
                name=request_data.name,
                industry=request_data.industry,
                project_status=request_data.project_status,
                assignees=[group_row for group_row in request_data.assignees] if request_data.assignees else [],
                # assignee=request_data['assignee'],
                reviewer=request_data.reviewer,
                created_by=user_id,
                account=request_data.account,  # account name
                # problem area to come from UI
                problem_area=request_data.problem_area,
                origin=request_data.origin,
            )
            if request_data.assignees:
                for assignee_id in request_data.assignees:
                    assignee = self.db_session.query(User).filter_by(id=assignee_id).first()
                    if assignee:
                        project.assignees.append(assignee)
            self.db_session.add(project)
            self.db_session.flush()
            return project

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.CREATE_PROJECT_ERROR.value},
            )

    def add_problem_definition(
        self, version_id: int, version_name: str, project_id: int, content: Dict, user_id: int
    ) -> ProblemDefinitionVersion:
        """
        Add project definition.

        Args:
            version_id: problem defintion verison id
            version_name: problem defintion verison name
            project_id: project id
            content: project definition json
            user_id: user id

        Returns:
            ProblemDefinitionVersion object
        """
        try:
            project_pd = ProblemDefinitionVersion(
                version_id=version_id,
                version_name=version_name,
                project_id=project_id,
                is_current=True,
                content=content,
                created_by=user_id,
            )

            self.db_session.add(project_pd)
            self.db_session.flush()
            return project_pd

        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.ADD_PROBLEM_DEFINITION_ERROR.value},
            )

    def get_problem_definition(self, project_id: int) -> ProblemDefinitionVersion:
        """
        Get project definition.

        Args:
            project_id: project id

        Returns:
            ProblemDefinitionVersion object
        """
        try:
            return (
                self.db_session.query(ProblemDefinitionVersion)
                .filter_by(project_id=project_id, deleted_at=None, is_current=True)
                .first()
            )
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.GET_PROBLEM_DEFINITION_ERROR.value},
            )

    def version_view(self, project_id: int, version_id: int) -> ProblemDefinitionVersion:
        """
        Gets project definition version.

        Args:
            project_id: project id

        Returns:
            ProblemDefinitionVersion object
        """
        try:
            return (
                self.db_session.query(ProblemDefinitionVersion)
                .filter_by(project_id=project_id, version_id=version_id, deleted_at=None)
                .first()
            )
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.GET_PROBLEM_DEFINITION_ERROR.value},
            )

    def version_delete(self, project_id: int, version_id: int, user_id: int) -> Dict:
        """
        Delete project definition version.

        Args:
            project_id: project id
            version_id: project definition version id

        Returns:
            Success object
        """
        try:
            project_pd_version = (
                self.db_session.query(ProblemDefinitionVersion)
                .filter_by(project_id=project_id, version_id=version_id)
                .first()
            )
            project_pd_version.deleted_at = func.now()
            project_pd_version.deleted_by = user_id
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.DELETE_PROBLEM_DEFINITION_ERROR.value},
            )

    def filter_query(self, filter_request: List, model_ref: ProblemDefinitionVersion) -> ProblemDefinitionVersion:
        """
        Filter project definition version.

        Args:
            filter_request: filter request list
            model_ref: project definition version model

        Returns:
            Filtered ProblemDefinitionVersion object
        """
        try:
            filter_data = []
            for filter_item in filter_request:
                if filter_item.id == "updated_by_user" or filter_item.id == "created_by_user":
                    filter_data.append(
                        ProblemDefinitionVersion.__getattribute__(ProblemDefinitionVersion, filter_item.id).has(
                            User.first_name.ilike(filter_item.value + "%")
                        )
                    )
                else:
                    filter_data.append(
                        ProblemDefinitionVersion.__getattribute__(ProblemDefinitionVersion, filter_item.id).ilike(
                            "%" + filter_item.value + "%"
                        )
                    )
            if len(filter_data):
                filter_query = tuple(filter_data)
                return model_ref.filter(and_(*filter_query))
                # project_pd_versions = project_pd_versions.filter(and_(*filter_query))
            else:
                return model_ref

        except Exception as e:
            logging.exception(e)

    def sort_query(self, sort_request: List, model_ref: ProblemDefinitionVersion) -> ProblemDefinitionVersion:
        """
        Sort project definition version.

        Args:
            sort_request: sort request list
            model_ref: project definition version model

        Returns:
            Sorted ProblemDefinitionVersion object
        """
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
        except Exception as e:
            logging.exception(e)

    def get_problem_definition_version_list(self, request_data: Dict, project_id: int) -> Tuple:
        """
        Get problem definitions version list

        Args:
            request_data: dictionary containing pageSize, filtered, sorted
            project_id: project id

        Returns:
            List of ProblemDefinitionVersion objects

        """
        try:
            page_size = request_data["pageSize"]
            page = request_data["page"]
            project_pd_versions = self.db_session.query(ProblemDefinitionVersion).filter_by(
                project_id=project_id, deleted_at=None
            )
            total = project_pd_versions.count()
            if request_data:
                data_per_page = page_size if page_size <= 100 else 100
                filter_request = json.loads(request_data["filtered"]) if request_data.get("filtered", False) else []
                sort_request = json.loads(request_data["sorted"]) if request_data.get("sorted", False) else []
                if len(filter_request):
                    project_pd_versions = self.filter_query(filter_request, project_pd_versions)

                if len(sort_request):
                    project_pd_versions = self.sort_query(sort_request, project_pd_versions)
                else:
                    project_pd_versions = project_pd_versions.order_by(desc(ProblemDefinitionVersion.created_at))

                project_pd_versions = project_pd_versions.offset(page * data_per_page).limit(data_per_page)
            else:
                project_pd_versions = project_pd_versions.all()
            # version_list = project_pd_versions
            return {
                "data": project_pd_versions,
                "page": page,
                "pages": math.ceil(total / data_per_page),
                "count": total,
                "pageSize": data_per_page,
                "hasNext": bool(total - (page * data_per_page)),
            }

        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": ProjectsErrors.PROJECT_VERSION_NOT_FOUND_ERROR.value},
            )

    def create_project_version(
        self, project: Project, request_data: ProjectVersionCreateRequestSchema, user_id: int
    ) -> ProblemDefinitionVersion:
        """
        Update project and problem definition version.

        Args:
            project: project object
            request_data: dictionary containing project data
            user_id: user id

        Returns:
            ProblemDefinitionVersion object
        """
        try:
            project.name = request_data.name
            project.industry = request_data.industry
            project.project_status = request_data.project_status
            project.assignees = (
                [self.db_session.query(User).filter_by(id=group_row).first() for group_row in request_data.assignees]
                if "assignees" in request_data
                else []
            )
            project.assignees = [id for id in project.assignees if id is not None]
            project.reviewer = request_data.reviewer
            project.updated_by = user_id
            project.account = request_data.account
            project.problem_area = request_data.problem_area

            is_existing_version = (
                self.db_session.query(ProblemDefinitionVersion)
                .filter_by(project_id=project.id, deleted_by=None, version_name=request_data.version_name)
                .first()
            )
            if is_existing_version:
                raise GeneralException(
                    status.HTTP_400_BAD_REQUEST,
                    message={"error": ProjectsErrors.VERSION_NAME_ALREADY_EXISTS.value},
                )

            else:
                project_pd_version = ProblemDefinitionVersion(
                    version_id=uuid.uuid4(),
                    version_name=request_data.version_name,
                    project_id=project.id,
                    is_current=False,
                    content=json.dumps(request_data.content),
                    created_by=user_id,
                )

                self.db_session.add(project_pd_version)
                self.db_session.commit()
                return project_pd_version
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            if e.exception_type == "General Exception":
                raise GeneralException(status_code=e.status_code, message=e.message)
            else:
                raise GeneralException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    message={"error": ProjectsErrors.CREATE_VERSION_ERROR.value},
                )

    def set_version(self, project_id: int, request_version_urn: str) -> Dict:
        """
        Set problem definition version

        Args:
            project_id: project id
            request_version_urn: problem definition version urn

        Returns:
            Success dict
        """
        try:
            project_pd_versions = (
                self.db_session.query(ProblemDefinitionVersion).filter_by(project_id=project_id, deleted_at=None).all()
            )
            for project_pd_version in project_pd_versions:
                if project_pd_version.version_id.urn == request_version_urn:
                    project_pd_version.is_current = True
                else:
                    project_pd_version.is_current = False

            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.SET_VERSION_ERROR.value},
            )

    def update_project(self, project: Project, user_id: int, request_data: UpdateProjectRequestSchema) -> Dict:
        """
        Updates project info

        Args:
            Project: Project to update
            user_id: int

        Returns:
            Success dict
        """
        try:
            project.name = request_data.name
            project.industry = request_data.industry
            project.project_status = request_data.project_status
            project.assignees = (
                [self.db_session.query(User).filter_by(id=group_row).first() for group_row in request_data.assignees]
                if request_data.assignees
                else []
            )
            project.assignees = [id for id in project.assignees if id is not None]
            project.reviewer = request_data.reviewer
            project.updated_by = user_id
            project.account = request_data.account
            project.problem_area = request_data.problem_area

            project.assignees.clear()

            if request_data.assignees:
                for assignee_id in request_data.assignees:
                    assignee = self.db_session.query(User).filter_by(id=assignee_id).first()
                    if assignee:
                        project.assignees.append(assignee)

            if project.origin in ["PDF", "DS-Workbench"]:
                project_pd = (
                    self.db_session.query(ProblemDefinitionVersion)
                    .filter_by(
                        project_id=project.id,
                        deleted_at=None,
                        version_id=request_data.version_id,
                    )
                    .first()
                )
                project_pd.content = json.dumps(request_data.content)
                project_pd.content = sanitize_content(project_pd.content)
                project_pd.updated_by = user_id

            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.SET_VERSION_ERROR.value},
            )

    def delete_project(self, project: Project, user_id: int) -> Dict:
        """
        Deletes the project info and its versions

        Args:
            project_id: int
            user_id: int
        Returns:
            Success dict
        """
        try:
            project.deleted_at = func.now()
            project.deleted_by = user_id
            if project.origin == "PDF":
                project_pd_versions = (
                    self.db_session.query(ProblemDefinitionVersion)
                    .filter_by(project_id=project.id, deleted_at=None)
                    .all()
                )
                for version in project_pd_versions:
                    version.deleted_at = func.now()
                    version.deleted_by = user_id
            self.db_session.commit()
            return {"success": True}
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ProjectsErrors.DELETE_PROJECT_ERROR.value},
            )
