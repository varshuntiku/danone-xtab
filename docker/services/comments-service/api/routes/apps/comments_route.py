from typing import Annotated, Dict, List, Optional, Union

from api.controllers.apps.comments_controller import CommentsController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas.apps.comments_schema import (
    BookmarkCommentSchema,
    BookmarkEditResponseSchema,
    CommentAddRequestSchema,
    CommentAddResponseSchema,
    CommentEditRequestSchema,
    CommentEditResponseSchema,
    CommentsResponseSchema,
    DeleteCommentResponseSchema,
    FilterAddRequestSchema,
    FilterAddResponseSchema,
    FilterResponseSchema,
    GeneralCommentsResponseSchema,
    ReplyAddRequestSchema,
    ReplyAddResponseSchema,
    ReplyEditRequestSchema,
    ReplyEditResponseSchema,
    StatusEditResponseSchema,
    StatusEditSchema,
)
from api.schemas.generic_schema import StatusDataResponseSchema
from fastapi import (
    APIRouter,
    BackgroundTasks,
    Header,
    Path,
    Query,
    Request,
    Response,
    Security,
    status,
)
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)
comments_controller = CommentsController()


@router.post("/app/screen/comment", status_code=status.HTTP_200_OK, response_model=CommentAddResponseSchema)
@authenticate_user
async def add_comment(
    request: Request,
    request_data: CommentAddRequestSchema,
    background_tasks: BackgroundTasks,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to add comment
    """

    return await comments_controller.add_comment(request, request_data, background_tasks)


@router.post("/app/screen/reply", status_code=status.HTTP_200_OK, response_model=ReplyAddResponseSchema)
@authenticate_user
async def add_reply(
    request: Request,
    request_data: ReplyAddRequestSchema,
    background_tasks: BackgroundTasks,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to add comment
    """
    user_email = request.state.full_name
    return await comments_controller.add_reply(request, user_email, request_data, background_tasks)


@router.post("/filters", status_code=status.HTTP_200_OK, response_model=FilterAddResponseSchema)
@authenticate_user
async def filter_add(
    request: Request, request_data: FilterAddRequestSchema, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to add comment
    """
    return comments_controller.add_filter(request_data)


@router.get(
    "/app", status_code=status.HTTP_200_OK, response_model=CommentsResponseSchema
)
@authenticate_user
async def get_comments(
    request: Request,
    identifier : str,
    include_deleted: bool = Query(None, description="Whether to return only deleted comments"),
    bookmarked: bool = Query(None, description="Whether to return only bookmarked comments"),
    resolved: str = Query(None, description="Returns comments of a specific status"),
    unresolved: str = Query(None, description="Returns comments of a specific status"),
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to fetch a list of screen level comments
    """
    print(request.state.full_name, request.state.logged_in_email)
    return await comments_controller.get_comments(
        identifier, include_deleted, bookmarked, resolved, unresolved
    )


@router.get("/filters/{id}", status_code=status.HTTP_200_OK, response_model=FilterResponseSchema)
async def get_filters_by_id(request: Request, id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to fetch the filters against a filter id
    """
    return comments_controller.get_filters_by_id(id)


@router.delete(
    "/app/comments/{comment_id}/{type}", status_code=status.HTTP_200_OK, response_model=DeleteCommentResponseSchema
)
@authenticate_user
async def delete_state_change(
    request: Request, comment_id: int, type: str, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to delete a comment
    """
    user_id = request.state.full_name
    return comments_controller.delete_state_change(user_id, comment_id, type)


@router.put(
    "/app/comments/{action}",
    status_code=status.HTTP_200_OK,
    response_model=Union[StatusEditResponseSchema, BookmarkEditResponseSchema],
)
@authenticate_user
async def status_edit(
    request: Request,
    action: str,
    request_data: Union[StatusEditSchema, BookmarkCommentSchema],
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to edit the status of the comment
    """
    if action.lower() == "status":
        return comments_controller.status_edit(request_data)
    elif action.lower() == "bookmark":
        return comments_controller.bookmark_comment(request_data)


@router.put("/edit", status_code=status.HTTP_200_OK, response_model=CommentEditResponseSchema)
@authenticate_user
async def edit_comment(
    request: Request,
    request_data: CommentEditRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to edit the comment
    """
    user_id = request.state.logged_in_email
    return comments_controller.edit_comment(user_id=user_id, request_data=request_data)


@router.put("/reply/edit", status_code=status.HTTP_200_OK, response_model=ReplyEditResponseSchema)
@authenticate_user
async def edit_reply(
    request: Request, request_data: ReplyEditRequestSchema, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to edit the reply
    """
    user_id = request.state.user.id
    return comments_controller.edit_reply(user_id=user_id, request_data=request_data)
