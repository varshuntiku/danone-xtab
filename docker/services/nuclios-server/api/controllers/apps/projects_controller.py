from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.schemas.apps.projects_schema import (
    CreateProjectRequestSchema,
    CreateProjectResponseSchema,
    CreateVersionResponseSchema,
    DeleteProjectResponseSchema,
    GetProblemDefinitionVersionResponseSchema,
    GetVersionViewSchema,
    JupyterHubAccessTokenResponseSchema,
    ProblemDefinitionSchema,
    ProjectAjaxListSchema,
    ProjectCreateFolder,
    ProjectsAjaxListRequestSchema,
    ProjectsAjaxListResponseSchema,
    ProjectSchema,
    ProjectsListSchema,
    ProjectVersionCreateRequestSchema,
    SetVersionRequestSchema,
    UpdateProjectRequestSchema,
)
from api.schemas.generic_schema import (
    FileDeleteResponseSchema,
    FileUploadResponseSchema,
    MessageResponseSchema,
    StatusResponseSchema,
)
from api.schemas.users.users_schema import GetProjectUsersResponseSchema
from api.services.apps.projects_service import ProjectsService
from fastapi import Response, UploadFile


class ProjectsController(BaseController):
    def users_list(self, response: Response) -> List[GetProjectUsersResponseSchema]:
        with ProjectsService() as projects_service:
            response = projects_service.user_list(response)
            return self.get_serialized_list(GetProjectUsersResponseSchema, response)

    def reviewers_list(self, response: Response) -> List[GetProjectUsersResponseSchema]:
        with ProjectsService() as projects_service:
            response = projects_service.reviewers_list(response)
            return self.get_serialized_list(GetProjectUsersResponseSchema, response)

    async def project_content_upload(self, file: UploadFile) -> FileUploadResponseSchema:
        with ProjectsService() as projects_service:
            response = await projects_service.project_content_upload(file)
            return self.get_serialized_data(FileUploadResponseSchema, response)

    def project_content_delete(self, file_name: str) -> FileDeleteResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.project_content_delete(file_name)
            return self.get_serialized_data(FileDeleteResponseSchema, response)

    def projects_ajax_list(
        self, projects_access: Dict, user_id: int, request_data: ProjectsAjaxListRequestSchema
    ) -> ProjectsAjaxListResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.projects_ajax_list(projects_access, user_id, request_data)
            response["data"] = self.get_serialized_list(ProjectAjaxListSchema, response["data"])
            return response

    def projects_list(self, response: Response, user_groups_list: List, user_id: int) -> List[ProjectsListSchema]:
        with ProjectsService() as projects_service:
            response = projects_service.projects_list(response, user_groups_list, user_id)
            return self.get_serialized_list(ProjectsListSchema, response)

    def create_project(self, request_data: CreateProjectRequestSchema, user_id: int) -> CreateProjectResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.create_project(request_data, user_id)
            return response

    def version_view(
        self, project_id: int, version_id: int, projects_access: Dict, user_id: int
    ) -> GetVersionViewSchema:
        with ProjectsService() as projects_service:
            response = projects_service.version_view(project_id, version_id, projects_access, user_id)
            return self.get_serialized_data(GetVersionViewSchema, response)

    def version_delete(
        self, project_id: int, version_id: int, projects_access: Dict, user_id: int
    ) -> MessageResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.version_delete(project_id, version_id, projects_access, user_id)
            return response

    def versions_list(self, request_data: Dict, project_id: int) -> GetProblemDefinitionVersionResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.versions_list(request_data, project_id)
            response["data"] = self.get_serialized_list(ProblemDefinitionSchema, response["data"])
            return response

    def version_create(
        self, request_data: ProjectVersionCreateRequestSchema, project_id: int, projects_access: Dict, user_id: int
    ) -> CreateVersionResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.version_create(request_data, project_id, projects_access, user_id)
            return response

    def set_version(
        self, projects_access: Dict, user_id: int, project_id: int, request_data: SetVersionRequestSchema
    ) -> MessageResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.set_version(projects_access, user_id, project_id, request_data)
            return response

    def get_jupyterhub_access_token(
        self, projects_access: Dict, user: dict, project_id: int
    ) -> JupyterHubAccessTokenResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.get_jupyterhub_access_token(projects_access, user, project_id)
            return response

    def create_file_share(self, request_data: ProjectCreateFolder) -> dict:
        with ProjectsService() as projects_service:
            response = projects_service.create_file_share(request_data)
            return response

    def show_project(self, project_id: int, project_access: Dict, user_id: int) -> ProjectSchema:
        with ProjectsService() as projects_service:
            response = projects_service.show_project(project_id, project_access, user_id)
            return self.get_serialized_data(ProjectSchema, response)

    def update_project(
        self, project_id: int, project_access: Dict, user_id: int, request_data: UpdateProjectRequestSchema
    ) -> StatusResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.update_project(project_id, project_access, user_id, request_data)
            return self.get_serialized_data(StatusResponseSchema, response)

    def delete_project(self, project_id: int, user_id: int) -> DeleteProjectResponseSchema:
        with ProjectsService() as projects_service:
            response = projects_service.delete_project(project_id, user_id)
            return response
