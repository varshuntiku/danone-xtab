import html
import json
import logging
import math
import time
import uuid
from datetime import timedelta
from typing import Dict, List

from api.configs.settings import AppSettings
from api.constants.apps.projects_success_messages import ProjectSuccess
from api.constants.error_messages import GeneralErrors
from api.constants.success_messages import GeneralSuccess
from api.daos.apps.execution_env_dao import ExecutionEnvDao
from api.daos.apps.projects_dao import ProjectsDao
from api.daos.users.users_dao import UsersDao
from api.dtos import GenericResponseDTO
from api.dtos.apps.projects_dto import (
    GetProjectsListDTO,
    GetVersionViewDTO,
    ProblemDefinitionVersionsDTO,
    ProjectAjaxListDTO,
    ProjectDTO,
)
from api.dtos.generic_dto import FileDeleteResponseDTO, FileUploadResponseDTO
from api.dtos.users.users_dto import GetProjectUsersDTO
from api.helpers.generic_helpers import GenericHelper
from api.helpers.projects.hub_helper import (
    encode_token,
    fetch_default_image_url,
    fetch_image_url,
    fetch_node_pool_name,
)
from api.middlewares.error_middleware import GeneralException
from api.schemas.apps.projects_schema import (
    CreateProjectRequestSchema,
    CreateProjectResponseSchema,
    CreateVersionResponseSchema,
    DeleteProjectResponseSchema,
    GetProblemDefinitionVersionResponseSchema,
    JupyterHubAccessTokenResponseSchema,
    ProjectCreateFolder,
    ProjectsAjaxListRequestSchema,
    ProjectsAjaxListResponseSchema,
    ProjectVersionCreateRequestSchema,
    SetVersionRequestSchema,
    UpdateProjectRequestSchema,
)
from api.schemas.generic_schema import MessageResponseSchema, StatusResponseSchema
from api.services.base_service import BaseService
from api.utils.app.app import sanitize_content
from api.utils.app.projects import has_edit_access, has_view_access
from azure.storage.fileshare import ShareServiceClient
from fastapi import Response, UploadFile, status


class ProjectsService(BaseService):
    def __init__(self):
        super().__init__()
        self.users_dao = UsersDao(self.db_session)
        self.genereic_helpers = GenericHelper()
        self.projects_dao = ProjectsDao(self.db_session)
        self.execution_env_dao = ExecutionEnvDao(self.db_session)
        self.app_settings = AppSettings()

    def user_list(self, response: Response) -> List[GetProjectUsersDTO]:
        users_list = self.users_dao.get_users_list_ordered()
        response_list = [GetProjectUsersDTO(user) for user in users_list]
        response.headers["X-Total-Count"] = html.escape(str(len(users_list)))
        return response_list

    def reviewers_list(self, response: Response) -> List[GetProjectUsersDTO]:
        users_list = self.users_dao.get_project_reviewers_list()
        response_list = [GetProjectUsersDTO(user) for user in users_list]
        response.headers["X-Total-Count"] = html.escape(str(len(users_list)))
        return response_list

    async def project_content_upload(self, file: UploadFile) -> FileUploadResponseDTO:
        try:
            file_name = file.filename
            t = round(time.time() * 1000)
            file_name = file_name.split(".")[0] + "_" + str(t) + "." + ".".join(file_name.split(".")[1:])

            url = self.genereic_helpers.upload_blob(
                await file.read(), "projects/" + file_name, timedelta(days=365 * 1000)
            )
            response = {"path": url, "filename": file_name}
            return FileUploadResponseDTO(response)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GeneralErrors.BLOB_UPLOAD_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def project_content_delete(self, file_name: str) -> FileDeleteResponseDTO:
        try:
            self.genereic_helpers.delete_blob("projects/" + file_name)
            response = {"message": GeneralSuccess.BLOB_DELETE_SUCCESS.value, "filename": file_name}
            return FileDeleteResponseDTO(response)
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": GeneralErrors.BLOB_DELETE_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def projects_ajax_list(
        self, projects_access: Dict, user_id: int, request_data: ProjectsAjaxListRequestSchema
    ) -> ProjectsAjaxListResponseSchema:
        projects_list, projects_count = self.projects_dao.projects_ajax_list(projects_access, user_id, request_data)
        response_data = []
        for project in projects_list:
            case_study_count = self.projects_dao.get_casestudy_count(project.id)
            get_problem_Definitions = self.projects_dao.get_problem_definition(project.id)
            project = ProjectAjaxListDTO(project, projects_access, user_id, case_study_count, get_problem_Definitions)
            response_data.append(project)

        response_dict = {
            "data": response_data,
            "page": request_data.page,
            "pages": math.ceil(projects_count / request_data.pageSize),
            "count": projects_count,
        }
        return response_dict

    def projects_list(self, response: Response, user_groups_list: List, user_id: int) -> List[GetProjectsListDTO]:
        filter_projects = False

        for user_group in user_groups_list:
            if user_group.my_projects_only:
                filter_projects = True

        projects = self.projects_dao.get_projects_list()
        if filter_projects:
            my_projects = []

            for project in projects:
                for assignee in project.assignees:
                    if assignee.id == user_id:
                        my_projects.append(project)

            projects = my_projects
        projects_list = []
        for project in projects:
            case_study_count = self.projects_dao.get_casestudy_count(project.id)
            projects_list.append(GetProjectsListDTO(project, case_study_count))

        response.headers["X-Total-Count"] = html.escape(str(len(projects_list)))
        return projects_list

    def create_project(self, request_data: CreateProjectRequestSchema, user_id: int) -> CreateProjectResponseSchema:
        project = self.projects_dao.create_project(request_data, user_id)
        response = {"id": project.id, "name": project.name}

        if request_data.origin in ["PDF", "DS-Workbench"]:
            pd_version_id = uuid.uuid4()
            # TODO: delete the testing version name
            pd_version_name = (
                request_data.version_name if request_data.version_name else project.name + " (auto-generated)"
            )
            content = json.dumps(request_data.content)
            content = sanitize_content(content)
            project_pd = self.projects_dao.add_problem_definition(
                pd_version_id, pd_version_name, project.id, content, user_id
            )
            project_pd_data = {
                "version_id": project_pd.version_id,
                "version_updated_at": project_pd.updated_at.timestamp() if project_pd.updated_at else None,
            }

            response["version_id"] = project_pd_data["version_id"]
            response["version_updated_at"] = project_pd_data["version_updated_at"]
        self.db_session.commit()

        return response

    def version_view(self, project_id: int, version_id: int, projects_access: Dict, user_id: int) -> GetVersionViewDTO:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        if not has_view_access(projects_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        pd_version = self.projects_dao.version_view(project_id, version_id)
        response = GetVersionViewDTO(pd_version)
        return response

    def version_delete(
        self, project_id: int, version_id: int, projects_access: Dict, user_id: int
    ) -> MessageResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        if not has_edit_access(projects_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        self.projects_dao.version_delete(project_id, version_id, user_id)
        return {"message": ProjectSuccess.PROJECT_VERSION_DELETE_SUCCESS.value}

    def versions_list(
        self,
        request_data: Dict,
        project_id: int,
    ) -> GetProblemDefinitionVersionResponseSchema:
        result = self.projects_dao.get_problem_definition_version_list(request_data, project_id)
        result_data = []
        for version in result["data"]:
            result_data.append(ProblemDefinitionVersionsDTO(version))
        result["data"] = result_data
        return result

    def version_create(
        self, request_data: ProjectVersionCreateRequestSchema, project_id, project_access, user_id
    ) -> CreateVersionResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        if not has_edit_access(project_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        project_pd_version = self.projects_dao.create_project_version(project, request_data, user_id)
        response = {
            "message": ProjectSuccess.PROJECT_VERSION_CREATE_SUCCESS.value,
            "version_id": project_pd_version.version_id,
        }
        return response

    def set_version(
        self, projects_access: Dict, user_id: int, project_id: int, request_data: SetVersionRequestSchema
    ) -> MessageResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        if not has_edit_access(projects_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        request_version_urn = "urn:uuid:" + str(request_data.version_id)
        self.projects_dao.set_version(project_id, request_version_urn)
        return {"message": ProjectSuccess.PROJECT_VERSION_SET_SUCCESS.value}

    def get_jupyterhub_access_token(
        self, projects_access: Dict, user: dict, project_id: int
    ) -> JupyterHubAccessTokenResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        exec_envs = self.execution_env_dao.get_execution_environments(project_id=project_id)
        nodepool = None
        image_url = None
        exec_env_id = None
        for exec_env in exec_envs:
            if exec_env and exec_env.is_active and str(exec_env.status).lower() == "running":
                if str(exec_env.compute_type).lower() == "dedicated":
                    nodepool = fetch_node_pool_name(exec_env.__dict__)
                image_url = fetch_image_url(exec_env.__dict__)
                exec_env_id = exec_env.id
                break
        data = {
            "u": user["email_address"],
            "uid": user["id"],
            "fn": user["first_name"],
            "ln": user["last_name"],
            "pid": project_id,
            "es": [
                {
                    "id": obj.id,
                    "eid": exec_env_id,
                    "c": {},  # for config
                    "ec": {},  # for env config
                }
                for obj in [project]
            ]
            if project
            else [],
        }
        if nodepool:
            data["nodepool"] = nodepool
        if image_url:
            data["image"] = image_url
        else:
            default_image = fetch_default_image_url()
            if default_image:
                data["image"] = default_image

        encoded_token = encode_token(data)
        return {"token": encoded_token}

    def show_project(self, project_id: int, projects_access: Dict, user_id: int) -> ProjectDTO:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )

        if not has_view_access(projects_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        problem_definition = self.projects_dao.get_problem_definition(project_id)
        response = ProjectDTO(project, projects_access, user_id, problem_definition)
        return response

    def update_project(
        self, project_id: int, projects_access: Dict, user_id: int, request_data: UpdateProjectRequestSchema
    ) -> StatusResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )

        if not has_edit_access(projects_access, project, user_id):
            raise GeneralException(
                message={"error": GeneralErrors.ACCESS_DENIED_ERROR.value},
                status_code=status.HTTP_403_FORBIDDEN,
            )
        self.projects_dao.update_project(project, user_id, request_data)
        return GenericResponseDTO(True)

    def delete_project(self, project_id: int, user_id: int) -> DeleteProjectResponseSchema:
        project = self.projects_dao.get_project_by_id(project_id)
        if project is None:
            raise GeneralException(
                message={"error": GeneralErrors.NOT_FOUND_ERROR.value}, status_code=status.HTTP_404_NOT_FOUND
            )
        self.projects_dao.delete_project(project, user_id)
        return {"project_deleted": 1}

    def create_file_share(self, request_data: ProjectCreateFolder) -> Dict:
        try:
            folder_name = request_data.folder_name
            FILESHARE_NAME = self.app_settings.FILESHARE_NAME
            AZURE_FILESHARE_CONNECTION_STRING = self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING
            if folder_name:
                share_service_client = ShareServiceClient.from_connection_string(AZURE_FILESHARE_CONNECTION_STRING)
                share_client = share_service_client.get_share_client(FILESHARE_NAME)
                main_directory_client = share_client.get_directory_client(folder_name)
                if not main_directory_client.exists():
                    share_client.create_directory(folder_name)
                scripts_directory_client = main_directory_client.get_subdirectory_client("scripts")
                dags_directory_client = main_directory_client.get_subdirectory_client("dags")
                if not scripts_directory_client.exists():
                    scripts_directory_client.create_directory()
                if not dags_directory_client.exists():
                    dags_directory_client.create_directory()

                return {"success": f"Folder '{folder_name}' ensured with subfolders 'scripts' and 'dags'."}

            return {"error": "Folder name is not provided."}
        except Exception as error_msg:
            logging.exception(error_msg)
            return {"error": "Error in create-file-share"}
