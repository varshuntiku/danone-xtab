from typing import List, Optional

from api.controllers.apps.report_controller import ReportController
from api.middlewares.auth_middleware import app_user_info_required, authenticate_user
from api.schemas.apps.report_schema import (
    CreateStoryRequestSchema,
    CreateStoryResponseSchema,
    LayoutRequestSchema,
    LayoutResponseSchema,
    RecreateStoryResponseSchema,
    ScheduleStoryRequestSchema,
    SharedStoryResponseSchema,
    ShareStoryRequestSchema,
    StoriesListResponseSchema,
    StoryAccessRequestDataSchema,
    StoryDetailsResponseSchema,
    StoryUsersResponseSchema,
    UpdateStoryRequestDataSchema,
    UserEmailsResponseSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.utils.app.report import get_story_id_from_token
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

report_controller = ReportController()

auth_scheme = HTTPBearer(auto_error=False)


##############################
# Reports related routes #
##############################


@router.get(
    "/stories/get-user-emails",
    status_code=status.HTTP_200_OK,
    response_model=List[UserEmailsResponseSchema],
)
@authenticate_user
async def get_user_emails(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to return list of all users name & email
    """
    response = report_controller.get_user_emails()
    return response


@router.get(
    "/stories/layout",
    status_code=status.HTTP_200_OK,
    response_model=List[LayoutResponseSchema],
)
async def get_layout(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the layout infomation in the correct format
    """
    layout_id = False
    response = report_controller.get_layout(layout_id)
    return response


@router.get(
    "/stories/published",
    status_code=status.HTTP_200_OK,
    response_model=StoryDetailsResponseSchema,
)
async def get_published_story_details(
    request: Request,
    id_token: Optional[str] = None,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get story details and content to create a new story by filtering the graphs and contents to create a json layout
    and pages for new story. Finally returns all the details of the created story
    """
    story_id = get_story_id_from_token(id_token)
    response = report_controller.get_story_details(story_id, None)
    return response


@router.get(
    "/app/{app_id}/stories",
    status_code=status.HTTP_200_OK,
    response_model=StoriesListResponseSchema,
)
@authenticate_user
async def get_stories_list(
    request: Request,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to generate a list of all the stories with their info accessible for the given user.
    """
    response = report_controller.get_stories_list(app_id)
    return response


@router.get(
    "/stories",
    status_code=status.HTTP_200_OK,
    response_model=StoriesListResponseSchema,
)
@authenticate_user
async def get_stories(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to generate a list of all the stories with their info accessible for the given user.
    """
    app_id = None
    response = report_controller.get_stories_list(app_id)
    return response


@router.get(
    "/stories/{story_id}",
    status_code=status.HTTP_200_OK,
    response_model=StoryDetailsResponseSchema,
)
@authenticate_user
@app_user_info_required
async def get_story_details(
    request: Request,
    story_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get story details and content to create a new story by filtering the graphs and contents to create a json layout
    and pages for new story. Finally returns all the details of the created story
    """
    response = report_controller.get_story_details(story_id, request.state.user_info)
    return response


@router.get(
    "/stories/layout/{layout_id}",
    status_code=status.HTTP_200_OK,
    response_model=List[LayoutResponseSchema],
)
async def get_story_layout(
    request: Request,
    layout_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the layout infomation in the correct format
    """
    response = report_controller.get_layout(layout_id)
    return response


@router.post(
    "/stories/layout",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
async def add_layout(
    request: Request,
    request_data: List[LayoutRequestSchema],
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to add new layouts \n
    Example Request Parameters: \n
        [
            {
                "layout_style": {},
                "layout_props": {},
                "thumbnail_blob_name": "layout-1",
                "layout_name": "Layout One"
            }
        ]
    """
    response = report_controller.add_layout(request_data)
    return response


@router.put(
    "/stories/layout/{layout_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
async def update_layout(
    request: Request,
    request_data: LayoutRequestSchema,
    layout_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the layout details for the given layout id \n
    Example Request Parameters: \n
        {
            "layout_style": {},
            "layout_props": {},
            "thumbnail_blob_name": "layout-1",
            "layout_name": "Layout One"
        }
    """
    response = report_controller.update_layout(request_data, layout_id)
    return response


@router.delete(
    "/stories/layout/{layout_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
async def delete_layout(
    request: Request,
    layout_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the layout with the given layout id
    """
    response = report_controller.delete_layout(layout_id)
    return response


@router.get(
    "/stories/{story_id}/users",
    status_code=status.HTTP_200_OK,
    response_model=List[StoryUsersResponseSchema],
)
async def get_story_users(
    request: Request,
    story_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to return the list of all users with their info
    """
    response = report_controller.get_story_users()
    return response


@router.post(
    "/stories/give-access",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def give_user_access(
    request: Request,
    request_data: StoryAccessRequestDataSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to grant the user access to read, write & delete the story \n
    Example Request Parameters: \n
        {
            "email": "testuser@mathco.com",
            "story_id": 2,
            "read": true,
            "write": true,
            "delete": false
        }
    """
    created_by_user_id = request.state.user.id
    response = report_controller.give_user_access(request_data, created_by_user_id)
    return response


@router.get(
    "/stories/{story_id}/shared",
    status_code=status.HTTP_200_OK,
    response_model=List[SharedStoryResponseSchema],
)
async def get_shared_list(
    request: Request,
    story_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to return the shared story details for the given story id
    """
    response = report_controller.get_shared_list(story_id)
    return response


@router.put(
    "/stories/{story_id}",
    status_code=status.HTTP_200_OK,
    response_model=MessageResponseSchema,
)
@authenticate_user
async def update_story(
    request: Request,
    story_id: int | str,
    request_data: UpdateStoryRequestDataSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the existing content of a story by adding pages and more visualizations to the story \n
    Example Request Parameters: \n
        {
            "email": "testuser@mathco.com",
            "add": [{"content": [1, 2, 3], "pages": [3]}],
            "delete": [],
            "update": [],
            "story_id": 2,
            "is_multiple_add": true,
            "name": "Test Data Story",
            "description": "Test data story description",
        }
    """
    incoming_user_id = request.state.user.id
    response = report_controller.update_story(incoming_user_id, request_data)
    return response


@router.delete("/stories/{story_id}", status_code=status.HTTP_200_OK)
@authenticate_user
async def delete_story(
    request: Request,
    story_id: int,
    stories_list: str,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Deletes the story for the given app & story id.
    """
    user_id = request.state.user.id
    response = report_controller.delete_story(story_id, stories_list, user_id)
    return response


@router.post("/stories", status_code=status.HTTP_200_OK, response_model=CreateStoryResponseSchema)
@authenticate_user
async def create_story(
    request: Request,
    request_data: CreateStoryRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Creates a new story and content for the apps to which the story in linked,
         also adds user & master access for the story.
    Example Request Parameters: \n
        {
            "email": "testuser@mathco.com",
            "name": "story name",
            "description": "description",
            "story_type": "static",
            "app_id": [],
            "content": []
        }
    """
    user_id = request.state.user.id
    response = report_controller.create_story(request_data, user_id)
    return response


@router.post("/stories/share", status_code=status.HTTP_200_OK)
@authenticate_user
async def share_story(
    request: Request,
    request_data: ShareStoryRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Shares the story over the email to the given email address and
        adds the sharing details in the story share table.
    Example Request Parameters: \n
        {
            "isLink": false,
            "isAttachment": false,
            "link": "localhost:3001/preview-published-story?id_token=eyhjkhdfhfhfgjhfghdfhfdhdfgfdg",
            "story_id": 0,
            "receipents": [{"email": "user1@email.com"}, {"email": "user2@email.com"}]
        }
    """
    user = request.state.user
    response = report_controller.share_story(request_data, user)
    return response


@router.post("/stories/schedule", status_code=status.HTTP_200_OK)
@authenticate_user
async def schedule_story(
    request: Request,
    request_data: ScheduleStoryRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    Updates the schedule details for the given story id.
    Example Request Parameters: \n
        {
            "isLink": false,
            "isAttachment": false,
            "link": "localhost:3001/preview-published-story?id_token=eyhjkhdfhfhfgjhfghdfhfdhdfgfdg",
            "story_id": 0,
            "receipents": [{"email": "user1@email.com"}, {"email": "user2@email.com"}]
        }
    """
    user_id = request.state.user.id
    response = report_controller.schedule_story(request_data, user_id)
    return response


@router.post(
    "/stories/schedule/{story_id}",
    status_code=status.HTTP_200_OK,
    response_model=RecreateStoryResponseSchema,
)
@authenticate_user
async def recreate_story_snapshot(
    request: Request,
    story_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    For the given story_id, recreate a new story capturing the latest snapshot
    """
    user_id = request.state.user.id
    user_info = request.state.user_info if hasattr(request.state, "user_info") else None
    response = report_controller.recreate_story_snapshot(story_id, user_id, user_info)
    return response
