from typing import Dict, List, Optional

from pydantic import BaseModel


class StoriesListResponseSchema(BaseModel):
    my_stories: List[Dict]
    accessed_stories: List[Dict]

    class config:
        orm_mode = True


class StoryDetailsResponseSchema(BaseModel):
    story_id: int
    id_token: str
    name: str
    description: str | None
    app_id: List
    created_by: Dict
    content: Dict
    layouts: List[Dict]
    pages: List[Dict]

    class config:
        orm_mode = True


class UserEmailsResponseSchema(BaseModel):
    email: str
    name: str

    class config:
        orm_mode = True


class LayoutResponseSchema(BaseModel):
    id: int
    layout_props: Dict | None
    layout_style: Dict | None

    class config:
        orm_mode = True


class LayoutRequestSchema(BaseModel):
    layout_style: Optional[Dict] = None
    layout_props: Optional[Dict] = None
    thumbnail_blob_name: Optional[str] = None
    layout_name: Optional[str] = None

    class config:
        orm_mode = True


class StoryUsersResponseSchema(BaseModel):
    user_id: int
    email: str | None
    first_name: str | None
    last_name: str | None

    class config:
        orm_mode = True


class StoryAccessRequestDataSchema(BaseModel):
    email: str | None
    story_id: int | None
    read: bool
    write: bool
    delete: bool

    class config:
        orm_mode = True


class SharedStoryResponseSchema(BaseModel):
    email: str | None
    story: int
    is_owner: bool
    first_name: str | None
    last_name: str | None

    class config:
        orm_mode = True


class UpdateStoryRequestDataSchema(BaseModel):
    email: Optional[str] = None
    add: Optional[List] = None
    delete: Optional[List] = None
    update: Optional[Dict | List] = None
    story_id: Optional[int | List[int]] = None
    is_multiple_add: Optional[bool] = None
    name: Optional[str] = None
    description: Optional[str] = None

    class config:
        orm_mode = True


class CreateStoryRequestSchema(BaseModel):
    email: Optional[str] = None
    name: str
    description: str
    story_type: str | None
    app_id: List
    content: List

    class config:
        orm_mode = True


class CreateStoryResponseSchema(BaseModel):
    message: str
    id: int

    class config:
        orm_mode = True


class ShareStoryRequestSchema(BaseModel):
    receipents: List
    isLink: bool
    isAttachment: bool
    link: str
    story_id: int

    class config:
        orm_mode = True


class ScheduleStoryRequestSchema(BaseModel):
    email: Optional[str] = None
    story_id: int
    isScheduled: bool
    frequency: str
    startDate: str
    endDate: str
    time: str
    occuringOn: str
    occuringAt: str
    days: List

    class config:
        orm_mode = True


class RecreateStoryResponseSchema(BaseModel):
    message: str
    id: int
    name: str

    class config:
        orm_mode = True
