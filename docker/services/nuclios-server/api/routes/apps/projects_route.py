from typing import List

from api.controllers.apps.projects_controller import ProjectsController
from api.middlewares.auth_middleware import (
    all_projects_required,
    any_projects_required,
    app_required,
    authenticate_user,
    jp_hub_access_required,
    projects_access_info_required,
)
from api.schemas.apps.projects_schema import (
    CreateProjectRequestSchema,
    CreateProjectResponseSchema,
    CreateVersionResponseSchema,
    DeleteProjectResponseSchema,
    GetProblemDefinitionVersionResponseSchema,
    GetVersionViewSchema,
    JupyterHubAccessTokenResponseSchema,
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
from fastapi import APIRouter, Request, Response, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)  # Authorization Token

projects_controller = ProjectsController()


@router.get("/projects/users", status_code=status.HTTP_200_OK, response_model=List[GetProjectUsersResponseSchema])
@authenticate_user
@app_required
async def user_list(
    request: Request,
    response: Response,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns a list of all user with their id and name ordered by first_name.
    """

    return projects_controller.users_list(response)


@router.get("/projects/reviewers", status_code=status.HTTP_200_OK, response_model=List[GetProjectUsersResponseSchema])
@authenticate_user
@app_required
async def reviewers_list(
    request: Request, response: Response, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    Returns a list of all user with their id and name ordered by first_name.
    """

    return projects_controller.reviewers_list(response)


@router.get("/projects/{project_id}", status_code=status.HTTP_200_OK, response_model=ProjectSchema)
@authenticate_user
@app_required
@projects_access_info_required
async def show_project(request: Request, project_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    Gets the project info by project id
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    res = projects_controller.show_project(project_id, projects_access, user_id)
    return res


@router.put("/projects/list", status_code=status.HTTP_200_OK, response_model=ProjectsAjaxListResponseSchema)
@authenticate_user
@projects_access_info_required
async def projects_ajax_list_put(
    request: Request,
    request_data: ProjectsAjaxListRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns all the project list
    Example Request Parameters.\n
        {
            "page": 1,
            "pageSize": 10,
            "sorted": [],
            "filtered": [
                {
                    "id": "origin",
                    "value": "PDF"
                }
            ]
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    return projects_controller.projects_ajax_list(projects_access, user_id, request_data)


@router.put("/projects/{project_id}", status_code=status.HTTP_200_OK, response_model=StatusResponseSchema)
@authenticate_user
@app_required
@projects_access_info_required
async def update_project_put(
    request: Request,
    project_id: int,
    request_data: UpdateProjectRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the project info for the given project id.
    Example Request Parameters. \n
        {
            "id": 1522,
            "name": "A",
            "industry": "Automotive",
            "project_status": 1,
            "assignees": [],
            "reviewer": 500,
            "is_instance": false,
            "account": "Test account",
            "problem_area": "Area",
            "origin": "PDF",
            "created_by": "Akash Verma",
            "user_access": {
                "view": true,
                "edit": true,
                "delete": true
            },
            "content": {
                "stateProblem1": "",
                "statusQuo1": "",
                "statusQuo2": "",
                "statusQuo3": {
                    "content": "",
                    "attachments": []
                },
                "constraints": {
                    "timeline": "",
                    "dataSource": "",
                    "framework": "",
                    "infrastructure": "",
                    "businessProcess": "",
                    "anyOther": ""
                },
                "successCriteria1": "",
                "successCriteria2": "",
                "successCriteria3": ""
            },
            "version_id": "01698365-183b-46b1-a7bd-84501928523c",
            "version_updated_at": "2024-06-06T06:34:45.205863Z",
            "is_current": true,
            "version_name": "5"
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    res = projects_controller.update_project(project_id, projects_access, user_id, request_data)
    return res


@router.post("/projects/{project_id}", status_code=status.HTTP_200_OK, response_model=StatusResponseSchema)
@authenticate_user
@app_required
@projects_access_info_required
async def update_project_post(
    request: Request,
    project_id: int,
    request_data: UpdateProjectRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the project info for the given project id.
    Example Request Parameters. \n
        {
            "id": 1522,
            "name": "A",
            "industry": "Automotive",
            "project_status": 1,
            "assignees": [],
            "reviewer": 500,
            "is_instance": false,
            "account": "Test account",
            "problem_area": "Area",
            "origin": "PDF",
            "created_by": "Akash Verma",
            "user_access": {
                "view": true,
                "edit": true,
                "delete": true
            },
            "content": {
                "stateProblem1": "",
                "statusQuo1": "",
                "statusQuo2": "",
                "statusQuo3": {
                    "content": "",
                    "attachments": []
                },
                "constraints": {
                    "timeline": "",
                    "dataSource": "",
                    "framework": "",
                    "infrastructure": "",
                    "businessProcess": "",
                    "anyOther": ""
                },
                "successCriteria1": "",
                "successCriteria2": "",
                "successCriteria3": ""
            },
            "version_id": "01698365-183b-46b1-a7bd-84501928523c",
            "version_updated_at": "2024-06-06T06:34:45.205863Z",
            "is_current": true,
            "version_name": "5"
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    res = projects_controller.update_project(project_id, projects_access, user_id, request_data)
    return res


@router.delete("/projects/{project_id}", status_code=status.HTTP_200_OK, response_model=DeleteProjectResponseSchema)
@authenticate_user
@all_projects_required
async def delete_project(
    request: Request,
    project_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes the project info for the given project id.
    """
    user_id = request.state.user.id
    res = projects_controller.delete_project(project_id, user_id)
    return res


@router.post("/project-attachment", status_code=status.HTTP_200_OK, response_model=FileUploadResponseSchema)
@authenticate_user
async def project_content_upload(
    request: Request, file: UploadFile, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    Uploads projects attachment to blob storage.
    """
    response = await projects_controller.project_content_upload(file)
    return response


@router.delete("/project-attachment", status_code=status.HTTP_200_OK, response_model=FileDeleteResponseSchema)
@authenticate_user
async def project_content_delete(
    request: Request, file_name: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    Deletes projects attachment from blob storage.
    """
    return projects_controller.project_content_delete(file_name)


@router.post("/projects/list", status_code=status.HTTP_200_OK, response_model=ProjectsAjaxListResponseSchema)
@authenticate_user
@projects_access_info_required
async def projects_ajax_list_post(
    request: Request,
    request_data: ProjectsAjaxListRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Returns all the project list.
    Example Request Parameters.\n
        {
            "page": 1,
            "pageSize": 10,
            "sorted": [],
            "filtered": [
                {
                    "id": "origin",
                    "value": "PDF"
                }
            ]
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    return projects_controller.projects_ajax_list(projects_access, user_id, request_data)


@router.get("/projects", status_code=status.HTTP_200_OK, response_model=List[ProjectsListSchema])
@authenticate_user
async def projects_list(
    request: Request, response: Response, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    Returns all the project assigned to a particular user with the project detail.
    """
    user_groups_list = request.state.user.user_groups
    user_id = request.state.user.id
    return projects_controller.projects_list(response, user_groups_list, user_id)


@router.post("/projects", status_code=status.HTTP_200_OK, response_model=CreateProjectResponseSchema)
@authenticate_user
@any_projects_required
async def create_project(
    request: Request,
    request_data: CreateProjectRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Creates a new project, returns project id & name.
    Example Request Parameters. \n
        {
            "id": 0,
            "name": "Test name",
            "industry": "Automotive",
            "project_status": 1,
            "assignees": [
                1892
            ],
            "reviewer": 501,
            "account": "Test account",
            "problem_area": "Area",
            "content": {
                "stateProblem1": "",
                "statusQuo1": "",
                "statusQuo2": "",
                "statusQuo3": {
                    "content": "",
                    "attachments": []
                },
                "constraints": {
                    "timeline": "undefined",
                    "dataSource": "undefined",
                    "framework": "undefined",
                    "infrastructure": "undefined",
                    "businessProcess": "undefined",
                    "anyOther": "undefined"
                },
                "successCriteria1": "",
                "successCriteria2": "",
                "successCriteria3": ""
            },
            "origin": "PDF",
            "version_name": "1"
        }
    """
    user_id = request.state.user.id
    return projects_controller.create_project(request_data, user_id)


@router.get(
    "/projects/{project_id}/versions/{version_id}", status_code=status.HTTP_200_OK, response_model=GetVersionViewSchema
)
@authenticate_user
@app_required
@projects_access_info_required
async def version_view(
    request: Request, project_id: int, version_id: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to view problem definition versions
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    return projects_controller.version_view(project_id, version_id, projects_access, user_id)


@router.delete(
    "/projects/{project_id}/versions/{version_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema
)
@authenticate_user
@any_projects_required
@projects_access_info_required
async def version_delete(
    request: Request, project_id: int, version_id: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to delete problem definition versions
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    return projects_controller.version_delete(project_id, version_id, projects_access, user_id)


@router.get(
    "/projects/{project_id}/versions",
    status_code=status.HTTP_200_OK,
    response_model=GetProblemDefinitionVersionResponseSchema,
)
@authenticate_user
@app_required
@projects_access_info_required
async def versions_list(
    request: Request,
    project_id: int,
    page: int = 0,
    pageSize: int = 10,
    filtered: str = "{}",
    sorted: str = "{}",
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get problem definition versions
    """
    request_data = {"pageSize": pageSize, "page": page, "filtered": filtered, "sorted": sorted}
    response = projects_controller.versions_list(request_data, project_id)
    return response


@router.post(
    "/projects/{project_id}/versions",
    status_code=status.HTTP_200_OK,
    response_model=CreateVersionResponseSchema,
)
@authenticate_user
@any_projects_required
@projects_access_info_required
async def version_create(
    request: Request,
    project_id: int,
    request_data: ProjectVersionCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create problem definition versions
    Example Request Parameters. \n
        {
            "id": 1522,
            "name": "A",
            "industry": "Automotive",
            "project_status": 1,
            "assignees": [],
            "reviewer": 500,
            "is_instance": false,
            "account": "Test account",
            "problem_area": "Area",
            "origin": "PDF",
            "created_by": "Akash Verma",
            "user_access": {
                "view": true,
                "edit": true,
                "delete": true
            },
            "content": {
                "stateProblem1": "",
                "statusQuo1": "",
                "statusQuo2": "",
                "statusQuo3": {
                    "content": "",
                    "attachments": []
                },
                "constraints": {
                    "timeline": "",
                    "dataSource": "",
                    "framework": "",
                    "infrastructure": "",
                    "businessProcess": "",
                    "anyOther": ""
                },
                "successCriteria1": "",
                "successCriteria2": "",
                "successCriteria3": ""
            },
            "version_id": "5fbc90e8-aeab-4811-ac84-10eb9cc6c821",
            "version_updated_at": "Wed, 05 Jun 2024 05:10:20 GMT",
            "is_current": true,
            "version_name": "54",
            "project_id": "1522"
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    response = projects_controller.version_create(request_data, project_id, projects_access, user_id)
    return response


@router.put("/projects/{project_id}/versions", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
@any_projects_required
@projects_access_info_required
async def set_version(
    request: Request,
    project_id: int,
    request_data: SetVersionRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update current version.
    Example Request Parameters. \n
        {
            "version_id": "5fbc90e8-aeab-4811-ac84-10eb9cc6c821"
        }
    """
    projects_access = request.state.projects_access
    user_id = request.state.user.id
    return projects_controller.set_version(projects_access, user_id, project_id, request_data)


@router.get(
    "/projects/{project_id}/jphub_access_token",
    status_code=status.HTTP_200_OK,
    response_model=JupyterHubAccessTokenResponseSchema,
)
@authenticate_user
@any_projects_required
@projects_access_info_required
async def get_jupyterhub_access_token(
    request: Request,
    project_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get jupyterhub access token.
    """
    projects_access = request.state.projects_access
    user = request.state.user.__dict__
    return projects_controller.get_jupyterhub_access_token(projects_access, user, project_id)


@router.post(
    "/projects/project/create-file-share",
    status_code=status.HTTP_200_OK,
    response_model=dict,
)
@jp_hub_access_required
async def create_file_share(
    request: Request,
    request_data: ProjectCreateFolder,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """Creates a folder with the provided name.

    Returns:
        Status
    """
    return projects_controller.create_file_share(request_data)
