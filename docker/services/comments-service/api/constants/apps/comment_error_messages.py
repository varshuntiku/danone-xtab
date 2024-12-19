from enum import Enum


class CommentErrors(Enum):
    ADD_COMMENT_ERROR = "Error adding a comment"
    ADD_REPLY_ERROR = "Error adding a reply"
    GET_COMMENTS_ERROR = "Error fetching comments"
    DELETE_COMMENT_ERROR = "Error deleting a comment"
    USER_ID_MISMATCH_ERROR = "User who created a comment can only delete or edit that comment"
    BOOKMARKING_COMMENT_ERROR = "Error while bookmarking a comment"
    COMMENT_NOT_FOUND = "Comment not found with id : {}"
    STATUS_EDIT_ERROR = "Error while editing status of a comment"
    EDIT_COMMENT_ERROR = "Error while editing a comment"
    EDIT_REPLY_ERROR = "Error while editing a reply"
    REPLY_NOT_FOUND = "Reply not found with id : {}"
