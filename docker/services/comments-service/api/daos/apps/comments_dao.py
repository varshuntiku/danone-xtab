import asyncio
import json
import logging
import re
from concurrent.futures import ThreadPoolExecutor

from api.constants.apps.comment_error_messages import CommentErrors
from api.daos.alerts_notifications.notifications_dao import NotificationsDao
from api.daos.base_daos import BaseDao
from api.dtos.apps.comments_dto import CommentDTO, FiltersDTO
from api.helpers.alerts_notifications.alerts_helper import AlertsHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Comment, Filter, Notifications, Reply
from api.schemas.apps.comments_schema import (
    BookmarkCommentSchema,
    CommentAddRequestSchema,
    CommentAddResponseSchema,
    CommentEditRequestSchema,
    CommentsResponseSchema,
    FilterResponseSchema,
    GeneralCommentsResponseSchema,
    ReplyAddRequestSchema,
    ReplyAddResponseSchema,
    ReplyEditRequestSchema,
    ReplyResponseSchema,
    StatusEditSchema,
)
from bs4 import BeautifulSoup
from fastapi import BackgroundTasks, Request, status
from lxml.html.clean import Cleaner
from sqlalchemy import and_, asc, or_
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

executor = ThreadPoolExecutor(max_workers=5)


class CommentsDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)
        self.notifications_dao = NotificationsDao(self.db_session)
        self.alerts_helper = AlertsHelper(db_session)
        # self.users_doa = UsersDao(self.db_session)

    async def add_comment(
        self, request: Request, request_data: CommentAddRequestSchema, background_tasks: BackgroundTasks
    ) -> CommentAddResponseSchema:
        try:
            # ordered_users = []
            # unique_user_ids = list(set(request_data.tagged_users))
            # for i in unique_user_ids:
            #     ordered_users.append(self.users_doa.get_user_by_id(i).email_address)
            attachments_json = json.dumps(request_data.attachments) if request_data.attachments is not None else None
            tagged_users_json = json.dumps(request_data.tagged_users) if request_data.tagged_users is not None else None

            new_comment = Comment(
                identifier=request_data.identifier,
                comment_text=request_data.comment_text,
                attachments=attachments_json,
                tagged_users=tagged_users_json,
                created_by=request.state.full_name,
                status=request_data.status,
                bookmarked=request_data.bookmarked,
            )

            self.db_session.add(new_comment)
            self.db_session.commit()
            updated_link = await self.create_filter_and_generate_link(
                new_comment, request_data.filters, request_data.link
            )
            notifications_list = self.create_notification_objects(
                ordered_users=request_data.tagged_users,
                identifier=request_data.identifier,
                user_data=request.state.logged_in_email,
                updated_link=updated_link,
                title="Comment Notification",
                message=f"{request.state.full_name} mentioned you in a comment",
                type="Mentions",
            )
            try:
                self.notifications_dao.bulk_save_notification_objects(notifications_list=notifications_list)
            except Exception as e:
                logging.exception(e)

            # Send email notifications
            loop = asyncio.get_running_loop()
            background_tasks.add_task(
                loop.run_in_executor, executor, asyncio.run, self.send_comment_notifications(new_comment, updated_link)
            )
            return new_comment
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": CommentErrors.ADD_COMMENT_ERROR.value},
            )

    async def add_reply(
        self, request, user_email: str, request_data: ReplyAddRequestSchema, background_tasks: BackgroundTasks
    ) -> ReplyAddResponseSchema:
        try:
            # ordered_users = []
            # unique_user_ids = list(set(request_data.tagged_users))
            # for i in unique_user_ids:
            #     ordered_users.append(self.users_doa.get_user_by_id(i).email_address)
            # user_data = self.users_doa.get_user_by_id(user_id=user_id)
            attachments_json = json.dumps(request_data.attachments) if request_data.attachments is not None else None
            tagged_users_json = json.dumps(request_data.tagged_users) if request_data.tagged_users is not None else None

            new_reply = Reply(
                comment_id=request_data.comment_id,
                reply_text=request_data.reply_text,
                attachments=attachments_json,
                tagged_users=tagged_users_json,
                created_by=request.state.full_name,
            )
            self.db_session.add(new_reply)
            self.db_session.commit()
            comment = self.db_session.query(Comment).filter_by(id=request_data.comment_id).first()
            updated_link = await self.create_filter_and_generate_link(comment, request_data.filters, request_data.link)
            notifications_list = self.create_notification_objects(
                ordered_users=request_data.tagged_users,
                identifier=comment.identifier,
                user_data=request.state.logged_in_email,
                updated_link=updated_link,
                title="Comment Notification",
                message=f"{request.state.full_name} mentioned you in a Reply",
                type="Mentions",
            )
            try:
                self.notifications_dao.bulk_save_notification_objects(notifications_list=notifications_list)
            except Exception as e:
                logging.exception(e)
            loop = asyncio.get_running_loop()
            background_tasks.add_task(
                loop.run_in_executor, executor, asyncio.run, self.send_reply_notifications(new_reply, updated_link)
            )
            return new_reply
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": CommentErrors.ADD_REPLY_ERROR.value},
            )

    def add_filter(self, request_data: ReplyAddRequestSchema) -> ReplyAddResponseSchema:
        """
        creates a filter entry which will act as a store for all the value required for comment hyperlink params
        Args:
            filters: filters json

        Returns:
            filter entity
        """
        try:
            # Create a new Filter instance
            new_filter = Filter(filters=request_data.filters)

            # Add the new filter to the session and commit
            self.db_session.add(new_filter)
            self.db_session.commit()
            self.db_session.refresh(new_filter)

            return new_filter

        except Exception as e:
            self.db_session.rollback()
            raise GeneralException(status.HTTP_500_INTERNAL_SERVER_ERROR, message={"error": str(e)})

    async def get_comments(
        self, identifier, include_deleted, bookmarked, resolved, unresolved
    ) -> CommentsResponseSchema:
        """
        Fetches all the comments against an app_id and its screen_id.

        Args:
            app_id: app's id
            app_screen_id: screen's id
            widget_id: widget's id
            include_deleted: whether to return only deleted comments
            bookmarked: whether to return only bookmarked comments
            resolved: whether to return only resolved comments
            unresolved: whether to return only unresolved comments

        Returns:
            comments list
        """
        try:
            query = self.db_session.query(Comment).filter_by(identifier=identifier)

            # Filter based on bookmarked status if not None
            if bookmarked is not None:
                query = query.filter(Comment.bookmarked == bookmarked)

            # Filter based on resolved and unresolved status
            if resolved and unresolved:
                query = query.filter((Comment.status == "resolved") | (Comment.status == "unresolved"))
            elif resolved:
                query = query.filter(Comment.status == "resolved")
            elif unresolved:
                query = query.filter(Comment.status == "unresolved")

            # If include_deleted is True, include deleted comments in the results
            if include_deleted:
                query = query.filter(Comment.deleted_at.isnot(None))
            else:
                query = query.filter(Comment.deleted_at.is_(None))

                # Apply default filter for unresolved comments if neither resolved nor unresolved is specified
                if not resolved and not unresolved:
                    query = query.filter(Comment.status == "unresolved")

            query = query.order_by(Comment.created_at.desc())
            comments = query.all()

            comments_dto = [CommentDTO(comment).__dict__ for comment in comments]

            return comments_dto

        except Exception as e:
            logging.exception(e)
            print(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": CommentErrors.GET_COMMENTS_ERROR.value},
            )

    def get_filters_by_id(self, filter_id: int) -> FilterResponseSchema:
        """
        Retrieves the first filter entry with the given ID.

        Args:
            filter_id (int): The ID of the filter to retrieve.

        Returns:
            FilterResponseSchema: The filter entry.
        """
        try:
            filter_entry = self.db_session.query(Filter).filter_by(id=filter_id).first()
            if not filter_entry:
                raise Exception("Filter not found")

            return FiltersDTO(filter_entry)

        except Exception as e:
            raise Exception(f"An error occurred while retrieving the filter: {str(e)}")

    def delete_state_change(self, user_id: int, comment_id: int, type: str):
        """
        Deletes or restores the comment against the comment_id if user_id matches the created user_id.

        Args:
            user_id: user's id
            comment_id: comment's id
            type: action type ("delete" or other)

        Returns:
            The updated comment
        """
        try:
            comment = self.db_session.query(Comment).filter_by(id=comment_id).first()
            if comment.created_by == user_id:
                if type == "delete":
                    comment.deleted_at = func.now()
                else:
                    comment.deleted_at = None

                self.db_session.add(comment)
                self.db_session.commit()
                return comment
            else:
                raise GeneralException(
                    status.HTTP_405_METHOD_NOT_ALLOWED, message={"error": CommentErrors.USER_ID_MISMATCH_ERROR.value}
                )
        except GeneralException as ge:
            self.db_session.rollback()
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": CommentErrors.DELETE_COMMENT_ERROR.value},
            )

    def bookmark_comment(self, request_data: BookmarkCommentSchema):
        """
        Bookmarks the comment againist the comment_id and changes bookmark to either true or False given by user

        Args:
            request_data : data of comment_id and bookmark status

        Returns:
            Bookmarked comment
        """
        try:
            comment = self.db_session.query(Comment).filter_by(id=request_data.comment_id, deleted_at=None).first()
            if comment:
                comment.bookmarked = request_data.bookmarked
                self.db_session.add(comment)
                self.db_session.commit()
                return comment
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CommentErrors.COMMENT_NOT_FOUND.value.format(request_data.comment_id)},
                )
        except GeneralException as ge:
            self.db_session.rollback()
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY, message={"error": CommentErrors.BOOKMARKING_COMMENT_ERROR}
            )

    def status_edit(self, request_data: StatusEditSchema):
        """
        Edits the status of the comment againist the comment_id

        Args:
            request_data : data of comment_id and status message

        Returns:
            status_edited comment
        """
        try:
            comment = self.db_session.query(Comment).filter_by(id=request_data.comment_id, deleted_at=None).first()
            if comment:
                comment.status = request_data.status
                self.db_session.add(comment)
                self.db_session.commit()
                return comment
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CommentErrors.COMMENT_NOT_FOUND.value.format(request_data.comment_id)},
                )
        except GeneralException as ge:
            self.db_session.rollback()
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY, message={"error": CommentErrors.STATUS_EDIT_ERROR.value}
            )

    def edit_comment(self, user_id: str, request_data: CommentEditRequestSchema):
        """
        Edits the comment(comment_text, attachments, tagged users) against the comment id

        Args:
            user_id: user's id
            request_data : data of comment text, attachments, tagged_users and comment_id

        Returns:
            Edited comment
        """
        try:
            comment = self.db_session.query(Comment).filter_by(id=request_data.comment_id, deleted_at=None).first()
            if comment:
                if comment.created_by == user_id:
                    ordered_users = []
                    for i in request_data.tagged_users:
                        ordered_users.append(i)
                    # user_data = self.users_doa.get_user_by_id(user_id=user_id)
                    if request_data.comment_text is not None:
                        comment.comment_text = request_data.comment_text
                    if request_data.attachments is not None:
                        comment.attachments = json.dumps(request_data.attachments)
                    if request_data.tagged_users is not None:
                        comment.tagged_users = json.dumps(request_data.tagged_users)
                    self.db_session.add(comment)
                    self.db_session.commit()
                    # notifications_list = []
                    # for email in ordered_users:
                    #     notifications_list.append(
                    #         Notifications(
                    #             alert_id=None,
                    #             app_id=request_data.app_id,
                    #             widget_id=None,
                    #             title="Comment Notification",
                    #             message=f"{user_data.full_name} mentioned you in a comment",
                    #             is_read=False,
                    #             user_email=email,
                    #             widget_name=None,
                    #             shared_by=user_data.email_address,
                    #             additional_info=None,
                    #             type="mentions",
                    #         )
                    #     )
                    # self.notifications_dao.bulk_save_notification_objects(notifications_list=notifications_list)
                    return comment
                else:
                    raise GeneralException(
                        status.HTTP_403_FORBIDDEN, message={"error": "You do not have permission to edit this comment."}
                    )
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CommentErrors.COMMENT_NOT_FOUND.value.format(request_data.comment_id)},
                )
            # pass
        except GeneralException as ge:
            self.db_session.rollback()
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY, message={"error": CommentErrors.EDIT_COMMENT_ERROR.value}
            )

    def edit_reply(self, user_id: int, request_data: ReplyEditRequestSchema):
        """
        Edits the reply(reply_text, attachments, tagged users) aganist the reply_id

        Args:
            user_id: user's id
            request_data : data of reply text, attachments, tagged_users and reply_id

        Returns:
            Edited reply
        """
        try:
            attachments_json = json.dumps(request_data.attachments) if request_data.attachments is not None else None
            tagged_users_json = json.dumps(request_data.tagged_users) if request_data.tagged_users is not None else None
            reply = self.db_session.query(Reply).filter_by(id=request_data.reply_id).first()
            if reply:
                if reply.created_by == user_id:
                    reply.reply_text = request_data.reply_text
                    reply.attachments = attachments_json
                    reply.tagged_users = tagged_users_json
                    self.db_session.add(reply)
                    self.db_session.commit()
                    return reply
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": CommentErrors.REPLY_NOT_FOUND.value.format(request_data.reply_id)},
                )
        except GeneralException as ge:
            self.db_session.rollback()
            logging.exception(ge)
            raise ge
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY, message={"error": CommentErrors.EDIT_REPLY_ERROR.value}
            )

    def sanitize_and_transform(self, text):
        try:
            # Step 1: Sanitize the input text using lxml_html_clean
            cleaner = Cleaner(
                scripts=True,
                javascript=True,
                comments=True,
                style=False,
                links=True,
                meta=True,
                page_structure=False,
                processing_instructions=True,
                embedded=True,
                frames=True,
                forms=True,
                annoying_tags=True,
                remove_unknown_tags=False,
                safe_attrs_only=False,
            )
            cleaned_html = cleaner.clean_html(text)

            # Step 2: Use BeautifulSoup to parse the cleaned HTML
            soup = BeautifulSoup(cleaned_html, "lxml")

            allowed_tags = ["span", "strong"]
            allowed_attributes = ["class", "data-id", "style"]

            for tag in soup.find_all(True):
                if tag.name not in allowed_tags:
                    tag.unwrap()
                else:
                    tag.attrs = {key: value for key, value in tag.attrs.items() if key in allowed_attributes}

            # Convert the soup back to a string
            sanitized_text = str(soup)

            # Step 3: Transform mentions by processing each mention individually
            def replace_mention(tag):
                mention_text = tag.text.replace("@", "")
                new_tag = soup.new_tag("span", style="color: #2B70C2; font-weight: bold;", **tag.attrs)
                new_tag.string = mention_text
                return new_tag

            # Find all spans with mentions
            soup = BeautifulSoup(sanitized_text, "lxml")
            for mention in soup.find_all("span", class_="mention"):
                mention.replace_with(replace_mention(mention))

            transformed_text = str(soup)

            # Step 4: Wrap the entire text in a div with normal text style and marginBottom
            final_text = f"<div style='font-size: 15px; margin-bottom: 15px;'>{transformed_text}</div>"

            return final_text

        except Exception as e:
            logging.exception(f"Transformation failed: {e}")
            return "<span></span>"

    async def create_filter_and_generate_link(self, comment: Comment, filters: dict, link: str) -> str:
        try:
            # Step 1: Add the comment ID to the filters dictionary
            print("filters",filters,comment.id)
            filters["comment"] = comment.id

            # Step 2: Create a new filter entry in the database
            new_filter = Filter(filters=filters)
            self.db_session.add(new_filter)
            self.db_session.commit()
            self.db_session.refresh(new_filter)

            # Step 3: Update the link to include only the filter ID
            updated_link = f"{link}?filters={new_filter.id}"
            return updated_link

        except Exception as e:
            logging.exception("Failed to create filter and generate link: %s", e)
            return link

    async def send_comment_notifications(self, comment: Comment, updated_link: str):
        try:
            if comment.tagged_users:
                tagged_user_ids = json.loads(comment.tagged_users)
                unique_user_ids = list(set(tagged_user_ids))

                for user_id in unique_user_ids:
                    # user = self.db_session.query(User).filter_by(id=user_id).first()
                    if user_id:
                        # Sanitize the comment text
                        sanitized_html = self.sanitize_and_transform(comment.comment_text)

                        email_data = {
                            "email": user_id,
                            "link": updated_link,
                            "type": "comment",
                            "author": comment.created_by,
                            "subject": "You have been tagged in a comment",
                            "sanitized_html": sanitized_html,
                        }

                        try:
                            await self.alerts_helper.send_comment_notification_email(email_data)
                        except Exception as e:
                            logging.exception(f"Failed to send email to {user_id}: {e}")

        except Exception as e:
            logging.exception(e)

    async def send_reply_notifications(self, reply: Reply, updated_link: str):
        try:
            # Step 1: Fetch the related comment and add the comment ID to the filters dictionary

            if reply.tagged_users:
                tagged_user_ids = json.loads(reply.tagged_users)
                unique_user_ids = list(set(tagged_user_ids))  # Remove duplicate user IDs

                for user_id in unique_user_ids:
                    # user = self.db_session.query(User).filter_by(id=user_id).first()
                    if user_id:
                        # Step 3: Update the link to include only the filter ID

                        # Sanitize the reply text
                        sanitized_html = self.sanitize_and_transform(reply.reply_text)

                        email_data = {
                            "email": user_id,
                            "link": updated_link,
                            "type": "comment thread",
                            "author": reply.created_by,
                            "subject": "You have been tagged in a comment thread",
                            "sanitized_html": sanitized_html,
                        }

                        try:
                            await self.alerts_helper.send_comment_notification_email(email_data)
                        except Exception as e:
                            logging.exception(f"Failed to send email to {user_id}: {e}")

        except Exception as e:
            logging.exception(e)

    def create_notification_objects(
        self,
        ordered_users,
        identifier,
        user_data,
        updated_link,
        title,
        message,
        is_read=False,
        additional_info=None,
        type="Alerts",
        
    ):
        notifications_list = []
        for email in ordered_users:
            notifications_list.append(
                Notifications(
                    identifier=identifier,
                    title=title,
                    message=message,
                    is_read=is_read,
                    user_email=email,
                    shared_by=user_data,
                    additional_info=additional_info,
                    type=type,
                    link=updated_link,
                    created_by=user_data,
                )
            )
        return notifications_list
