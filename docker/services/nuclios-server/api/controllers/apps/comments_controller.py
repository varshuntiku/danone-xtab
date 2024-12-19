from api.controllers.base_controller import BaseController
from api.schemas.apps.comments_schema import (
    ApprovalEditRequestSchema,
    ApprovalEditResponseSchema,
    BookmarkCommentSchema,
    BookmarkEditResponseSchema,
    CommentAddRequestSchema,
    CommentAddResponseSchema,
    CommentEditRequestSchema,
    CommentEditResponseSchema,
    CommentsResponseSchema,
    FilterAddRequestSchema,
    FilterAddResponseSchema,
    FilterResponseSchema,
    ReplyAddRequestSchema,
    ReplyAddResponseSchema,
    ReplyEditRequestSchema,
    ReplyEditResponseSchema,
    StatusEditResponseSchema,
    StatusEditSchema,
)
from api.services.apps.comments_service import CommentsService
from fastapi import BackgroundTasks


class CommentsController(BaseController):
    async def add_comment(
        self, user_id: int, request_data: CommentAddRequestSchema, background_tasks: BackgroundTasks
    ) -> CommentAddResponseSchema:
        with CommentsService() as comments_service:
            new_comment_id = await comments_service.add_comment(user_id, request_data, background_tasks)
            return CommentAddResponseSchema(comment_id=new_comment_id, status="success")

    async def add_reply(
        self, user_id: int, request_data: ReplyAddRequestSchema, background_tasks: BackgroundTasks
    ) -> ReplyAddResponseSchema:
        with CommentsService() as comments_service:
            new_reply_id = await comments_service.add_reply(user_id, request_data, background_tasks)
            return ReplyAddResponseSchema(reply_id=new_reply_id, status="success")

    def add_filter(self, request_data: FilterAddRequestSchema) -> FilterAddResponseSchema:
        with CommentsService() as comments_service:
            new_filter_id = comments_service.add_filter(request_data)
            return FilterAddResponseSchema(id=new_filter_id, status="success")

    async def get_comments(
        self,
        app_id: int,
        app_screen_id: int,
        widget_id: int,
        include_deleted: bool,
        bookmarked: bool,
        resolved: str,
        unresolved: str,
        user_id: int,
    ) -> CommentsResponseSchema:
        with CommentsService() as comments_service:
            comments_dto = await comments_service.get_comments(
                app_id, app_screen_id, widget_id, include_deleted, bookmarked, resolved, unresolved, user_id
            )
            return CommentsResponseSchema(comments=comments_dto, status="success")

    def get_filters_by_id(self, id: int) -> FilterResponseSchema:
        with CommentsService() as comments_service:
            filter_entry = comments_service.get_filters_by_id(id)
            return FilterResponseSchema(filters=filter_entry.filters, status="success")

    def delete_state_change(self, user_id: int, comment_id: int, type: str) -> CommentAddRequestSchema:
        with CommentsService() as comments_service:
            deleted_comment_id = comments_service.delete_state_change(user_id=user_id, comment_id=comment_id, type=type)
            return {"status": "success", "comment_id": deleted_comment_id}

    def bookmark_comment(self, request_data: BookmarkCommentSchema) -> BookmarkEditResponseSchema:
        with CommentsService() as comments_service:
            bookmarked_comment_id = comments_service.bookmark_comment(request_data)
            return BookmarkEditResponseSchema(comment_id=bookmarked_comment_id, status="success")

    def status_edit(self, request_data: StatusEditSchema) -> StatusEditResponseSchema:
        with CommentsService() as comments_service:
            status_editied_comment_id = comments_service.status_edit(request_data)
            return StatusEditResponseSchema(comment_id=status_editied_comment_id, status="success")

    def edit_comment(self, user_id: int, request_data: CommentEditRequestSchema) -> CommentEditResponseSchema:
        with CommentsService() as comments_service:
            edited_comment_id = comments_service.edit_comment(user_id=user_id, request_data=request_data)
            return CommentEditResponseSchema(comment_id=edited_comment_id, status="success")

    def edit_reply(self, user_id: int, request_data: ReplyEditRequestSchema) -> ReplyEditResponseSchema:
        with CommentsService() as comments_service:
            edited_reply_id = comments_service.edit_reply(user_id=user_id, request_data=request_data)
            return ReplyEditResponseSchema(reply_id=edited_reply_id, status="success")

    def edit_approval(self, user_id: int, request_data: ApprovalEditRequestSchema) -> ApprovalEditResponseSchema:
        with CommentsService() as comments_service:
            edited_approval_id = comments_service.edit_approval(user_id=user_id, request_data=request_data)
            return ApprovalEditResponseSchema(status="success", approval_id=edited_approval_id)
