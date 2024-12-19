from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.models.base_models import User
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
from api.services.apps.report_service import ReportService


class ReportController(BaseController):
    def get_stories_list(self, app_id: int | None) -> StoriesListResponseSchema:
        with ReportService() as report_service:
            response = report_service.get_stories_list(app_id)
            return response

    def get_story_details(self, story_id: int, user_info: Dict) -> StoryDetailsResponseSchema:
        with ReportService() as report_service:
            response = report_service.get_story_details(story_id, user_info)
            return response

    def get_user_emails(self) -> List[UserEmailsResponseSchema]:
        with ReportService() as report_service:
            response = report_service.get_user_emails()
            return self.get_serialized_list(UserEmailsResponseSchema, response)

    def get_layout(self, layout_id: int | bool) -> List[LayoutResponseSchema]:
        with ReportService() as report_service:
            response = report_service.get_layout(layout_id)
            return self.get_serialized_list(LayoutResponseSchema, response)

    def add_layout(self, request_data: List[LayoutRequestSchema]) -> MessageResponseSchema:
        with ReportService() as report_service:
            response = report_service.add_layout(request_data)
            return response

    def update_layout(self, request_data: LayoutRequestSchema, layout_id: int) -> MessageResponseSchema:
        with ReportService() as report_service:
            response = report_service.update_layout(request_data, layout_id)
            return response

    def delete_layout(self, layout_id: int) -> MessageResponseSchema:
        with ReportService() as report_service:
            response = report_service.delete_layout(layout_id)
            return response

    def get_story_users(self) -> List[StoryUsersResponseSchema]:
        with ReportService() as report_service:
            response = report_service.get_story_users()
            return self.get_serialized_list(StoryUsersResponseSchema, response)

    def give_user_access(
        self, request_data: StoryAccessRequestDataSchema, created_by_user_id: int
    ) -> MessageResponseSchema:
        with ReportService() as report_service:
            response = report_service.give_user_access(request_data, created_by_user_id)
            return response

    def get_shared_list(self, story_id: int) -> List[SharedStoryResponseSchema]:
        with ReportService() as report_service:
            response = report_service.get_shared_list(story_id)
            return self.get_serialized_list(SharedStoryResponseSchema, response)

    def update_story(self, incoming_user_id: int, request_data: UpdateStoryRequestDataSchema) -> MessageResponseSchema:
        with ReportService() as report_service:
            response = report_service.update_story(incoming_user_id, request_data)
            return response

    def delete_story(self, story_id: int, stories_list: str, user_id: int) -> Dict:
        with ReportService() as report_service:
            response = report_service.delete_story(story_id, stories_list, user_id=user_id)
            return response

    def create_story(self, request_data: CreateStoryRequestSchema, user_id: int) -> CreateStoryResponseSchema:
        with ReportService() as report_service:
            response = report_service.create_story(request_data, user_id=user_id)
            return response

    def share_story(self, request_data: ShareStoryRequestSchema, user: User) -> Dict:
        with ReportService() as report_service:
            response = report_service.share_story(request_data, user=user)
            return response

    def schedule_story(self, request_data: ScheduleStoryRequestSchema, user_id: int) -> Dict:
        with ReportService() as report_service:
            response = report_service.schedule_story(request_data, user_id=user_id)
            return response

    def recreate_story_snapshot(
        self, story_id: int, user_id: int, user_info: Dict | None
    ) -> RecreateStoryResponseSchema:
        with ReportService() as report_service:
            response = report_service.recreate_story_snapshot(story_id=story_id, user_id=user_id, user_info=user_info)
            return response
