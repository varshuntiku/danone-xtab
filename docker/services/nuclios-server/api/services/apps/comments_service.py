from api.daos.apps.comments_dao import CommentsDao
from api.schemas.apps.comments_schema import (
    ApprovalEditRequestSchema,
    BookmarkCommentSchema,
    CommentAddRequestSchema,
    CommentEditRequestSchema,
    FilterAddRequestSchema,
    ReplyAddRequestSchema,
    ReplyEditRequestSchema,
    StatusEditSchema,
)
from api.services.base_service import BaseService
from fastapi import BackgroundTasks


class CommentsService(BaseService):
    def __init__(self):
        super().__init__()
        self.comments_dao = CommentsDao(self.db_session)

    async def add_comment(self, user_id: int, request_data: CommentAddRequestSchema, background_tasks: BackgroundTasks):
        new_comment = await self.comments_dao.add_comment(user_id, request_data, background_tasks)
        return new_comment.id

    async def add_reply(self, user_id: int, request_data: ReplyAddRequestSchema, background_tasks: BackgroundTasks):
        new_reply = await self.comments_dao.add_reply(user_id, request_data, background_tasks)
        return new_reply.id

    def add_filter(self, request_data: FilterAddRequestSchema):
        new_reply = self.comments_dao.add_filter(request_data)
        return new_reply.id

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
    ):
        comments_dto = await self.comments_dao.get_comments(
            app_id, app_screen_id, widget_id, include_deleted, bookmarked, resolved, unresolved, user_id
        )
        return comments_dto

    def get_filters_by_id(self, id: int):
        filter_entry = self.comments_dao.get_filters_by_id(id)
        return filter_entry

    def delete_state_change(self, user_id: int, comment_id: int, type: str):
        deleted_comment_id = self.comments_dao.delete_state_change(user_id=user_id, comment_id=comment_id, type=type)
        return deleted_comment_id.id

    def bookmark_comment(self, request_data: BookmarkCommentSchema):
        bookmarked_comment = self.comments_dao.bookmark_comment(request_data)
        return bookmarked_comment.id

    def status_edit(self, request_data: StatusEditSchema):
        status_edit_comment = self.comments_dao.status_edit(request_data)
        return status_edit_comment.id

    def edit_comment(self, user_id: int, request_data: CommentEditRequestSchema):
        edited_comment = self.comments_dao.edit_comment(user_id=user_id, request_data=request_data)
        return edited_comment.id

    def edit_reply(self, user_id: int, request_data: ReplyEditRequestSchema):
        edited_reply = self.comments_dao.edit_reply(user_id=user_id, request_data=request_data)
        return edited_reply.id

    def edit_approval(self, user_id: int, request_data: ApprovalEditRequestSchema):
        edited_approval = self.comments_dao.edit_approval(user_id=user_id, request_data=request_data)
        return edited_approval.id
