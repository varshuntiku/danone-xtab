from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


# will be used while sending the comments fetch response
class TaggedUser(BaseModel):
    user_id: int
    email_id: str

    class config:
        orm_mode = True


class ApprovalAddSchema(BaseModel):
    user_id: int
    name: Optional[str] = None
    status: Optional[str] = "pending"


# will take email ids as
class CommentAddRequestSchema(BaseModel):
    app_id: int
    app_screen_id: int
    widget_id: Optional[int] = None
    comment_text: str
    attachments: Optional[List[str]] = []
    tagged_users: Optional[List[int]] = []
    bookmarked: Optional[bool] = None
    status: Optional[str] = None
    link: Optional[str] = ""
    filters: Optional[Dict] = None
    screen_name: Optional[str] = None
    widget_name: Optional[str] = None
    mode: Optional[str] = "conversation"
    approvals: Optional[List[ApprovalAddSchema]] = []
    scenario_list: Optional[List[str]] = []

    class config:
        orm_mode = True


class ReplyAddRequestSchema(BaseModel):
    comment_id: int
    reply_text: str
    attachments: Optional[List[str]] = []
    tagged_users: Optional[List[int]] = []
    link: Optional[str] = ""
    filters: Optional[Dict] = None
    screen_name: Optional[str] = ""
    widget_name: Optional[str] = None

    class config:
        orm_mode = True


class FilterAddRequestSchema(BaseModel):
    filters: Optional[Dict] = None

    class config:
        orm_mode = True


class ReplyEditRequestSchema(BaseModel):
    # attempt_by: int
    reply_id: int
    reply_text: str
    attachments: Optional[List[str]] = []
    tagged_users: Optional[List[str]] = []


class ApprovalEditRequestSchema(BaseModel):
    approval_id: int
    status: str


class ReplyResponseSchema(BaseModel):
    id: int
    reply_text: str
    created_by: int
    created_at: datetime
    attachments: Optional[List[TaggedUser]] = []
    tagged_users: Optional[List] = []


class CommentResponseSchema(BaseModel):
    id: int
    comment_text: str
    created_by: int
    replies: List[ReplyResponseSchema]
    created_at: datetime
    attachments: Optional[List] = []
    tagged_users: Optional[List] = []


# Main comments get response schema
class CommentsResponseSchema(BaseModel):
    comments: List
    status: str

    class config:
        orm_mode = True


class FilterResponseSchema(BaseModel):
    status: str
    filters: Dict

    class Config:
        orm_mode = True


class GeneralCommentsResponseSchema(BaseModel):
    status: str

    class config:
        orm_mode = True


class CommentAddResponseSchema(BaseModel):
    status: str
    comment_id: int

    class config:
        orm_mode = True


class ReplyAddResponseSchema(BaseModel):
    status: str
    reply_id: int

    class config:
        orm_mode = True


class FilterAddResponseSchema(BaseModel):
    status: str
    id: int

    class config:
        orm_mode = True


class BookmarkEditResponseSchema(BaseModel):
    status: str
    comment_id: int

    class config:
        orm_mode = True


class DeleteCommentResponseSchema(BaseModel):
    status: str
    comment_id: int

    class config:
        orm_mode = True


class BookmarkCommentSchema(BaseModel):
    comment_id: int
    bookmarked: bool


class StatusEditSchema(BaseModel):
    comment_id: int
    status: str


class StatusEditResponseSchema(BaseModel):
    status: str
    comment_id: int

    class config:
        orm_mode = True


class CommentEditRequestSchema(BaseModel):
    comment_id: int
    comment_text: Optional[str] = None
    attachments: Optional[List[str]] = None
    tagged_users: Optional[List[int]] = None

    class Config:
        orm_mode = True


class CommentEditResponseSchema(BaseModel):
    status: str
    comment_id: int

    class config:
        orm_mode = True


class ReplyEditResponseSchema(BaseModel):
    status: str
    reply_id: int

    class config:
        orm_mode = True


class ApprovalEditResponseSchema(BaseModel):
    status: str
    approval_id: int

    class config:
        orm_mode = True
