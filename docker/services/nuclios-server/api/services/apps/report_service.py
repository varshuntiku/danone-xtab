import datetime
import json
import logging
from pathlib import Path
from typing import Dict, List

from api.configs.settings import AppSettings
from api.constants.apps.report_error_messages import ReportErrors
from api.constants.apps.report_success_messages import ReportSuccess
from api.daos.apps.report_dao import ReportDao
from api.daos.apps.widget_dao import WidgetDao
from api.daos.users.users_dao import UsersDao
from api.dtos.apps.report_dto import (
    AccessedStoryDTO,
    CreatedStoryDTO,
    LayoutDTO,
    SharedStoryDTO,
    StoryDTO,
    StoryLayoutDTO,
    StoryPageDTO,
    StoryUserEmailsDTO,
    StoryUsersDTO,
)
from api.helpers.apps.report_helper import ReportHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User
from api.schemas.apps.report_schema import (
    CreateStoryRequestSchema,
    CreateStoryResponseSchema,
    LayoutRequestSchema,
    RecreateStoryResponseSchema,
    ScheduleStoryRequestSchema,
    SharedStoryResponseSchema,
    ShareStoryRequestSchema,
    StoriesListResponseSchema,
    StoryAccessRequestDataSchema,
    StoryDetailsResponseSchema,
    UpdateStoryRequestDataSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from api.utils.auth.email import send_email_smtp
from api.utils.auth.token import encode_payload
from fastapi import status


class ReportService(BaseService):
    def __init__(self):
        super().__init__()
        self.report_dao = ReportDao(self.db_session)
        self.users_dao = UsersDao(self.db_session)
        self.widget_dao = WidgetDao(self.db_session)
        self.app_settings = AppSettings()
        self.report_helper = ReportHelper(self.db_session)

    def get_stories_list(self, app_id: int | None) -> StoriesListResponseSchema:
        user_id = 0
        user_created_stories = self.report_dao.get_user_created_stories(user_id, app_id)
        story_access = self.report_dao.get_story_access_by_user_id(user_id)
        story_access_ids = [access.id for access in story_access]
        user_accessible_stories = self.report_dao.get_user_accessible_stories(user_id, app_id, story_access_ids)
        access_user_name = []
        return {
            "my_stories": [
                CreatedStoryDTO(
                    el,
                    access_user_name,
                    self.report_dao.get_story_content_by_story_id(el.Story.id),
                    self.report_dao.get_story_page_count_by_story_id(el.Story.id),
                    encode_payload(
                        {
                            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=100000),
                            "iat": datetime.datetime.utcnow(),
                            "sub": "data_story_id_token",
                            "story_id": el.Story.id,
                        },
                        algorithm="HS256",
                    ),
                ).__dict__
                for el in user_created_stories
            ],
            "accessed_stories": [
                AccessedStoryDTO(
                    el,
                    access_user_name,
                    self.report_dao.get_story_content_by_story_id(el.Story.id),
                    self.report_dao.get_story_page_count_by_story_id(el.Story.id),
                    encode_payload(
                        {
                            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=100000),
                            "iat": datetime.datetime.utcnow(),
                            "sub": "data_story_id_token",
                            "story_id": el.Story.id,
                        },
                        algorithm="HS256",
                    ),
                ).__dict__
                for el in user_accessible_stories
            ],
        }

    def get_story_details(self, story_id: int, user_info: Dict) -> StoryDetailsResponseSchema:
        story = self.report_dao.get_story_by_id(story_id)
        if not story:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": ReportErrors.STORY_NOT_EXIST_ERROR.value},
            )
        created_by = self.users_dao.get_user_by_id(story.created_by)
        created_by_first_name = created_by.first_name
        created_by_last_name = created_by.last_name

        story_content = self.report_dao.get_story_content_by_story_id(story_id)

        story_content_values = [
            (
                self.widget_dao.get_widget_value_with_widget_by_id(
                    content.app_screen_widget_value_id, content.app_screen_widget_id
                ),
                content,
            )
            for content in story_content
        ]

        # Create the layout JSON:
        layout_data = self.report_dao.get_story_layouts()
        layout_json = [StoryLayoutDTO(layout).__dict__ for layout in layout_data]

        # Create the pages JSON:
        story_pages = self.report_dao.get_story_pages_by_story_id(story_id)
        page_json = [StoryPageDTO(page, layout_data).__dict__ for page in story_pages]
        page_json = list(filter(lambda pg: pg["layoutId"], page_json))

        id_token = encode_payload(
            {
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=100000),
                "iat": datetime.datetime.utcnow(),
                "sub": "data_story_id_token",
                "story_id": story_id,
            },
            algorithm="HS256",
        )
        app_ids = self.report_dao.get_app_ids_from_story_id(story.id)
        return StoryDTO(
            story,
            story_content_values,
            layout_json,
            page_json,
            id_token,
            app_ids,
            created_by_first_name,
            created_by_last_name,
            user_info,
        ).__dict__

    def get_user_emails(self) -> List[StoryUserEmailsDTO]:
        emails = self.users_dao.get_all_users()
        return [StoryUserEmailsDTO(item) for item in emails]

    def get_layout(self, layout_id: int | bool) -> List[LayoutDTO]:
        if layout_id:
            layouts = self.report_dao.get_story_layouts_by_id(layout_id)
        else:
            layouts = self.report_dao.get_story_layouts()

        return [LayoutDTO(layout) for layout in layouts]

    def add_layout(self, request_data: List[LayoutRequestSchema]) -> MessageResponseSchema:
        try:
            for layout in request_data:
                self.report_dao.add_story_layout(
                    getattr(layout, "layout_style"),
                    getattr(layout, "layout_props"),
                    getattr(layout, "thumbnail_blob_name"),
                    getattr(layout, "layout_name"),
                )
            self.report_dao.perform_commit()
            return {"message": ReportSuccess.CREATE_SUCCESS.value}
        except Exception as e:
            self.report_dao.perform_rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.ADD_LAYOUT_ERROR.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_layout(self, request_data: LayoutRequestSchema, layout_id: int) -> MessageResponseSchema:
        self.report_dao.update_story_layout(
            layout_id=layout_id,
            layout_props=getattr(request_data, "layout_props"),
            layout_style=getattr(request_data, "layout_style"),
            thumbnail_blob_name=getattr(request_data, "thumbnail_blob_name"),
            layout_name=getattr(request_data, "layout_name"),
        )
        return {"message": ReportSuccess.UPDATE_SUCCESS.value}

    def delete_layout(self, layout_id: int) -> MessageResponseSchema:
        self.report_dao.delete_story_layout(layout_id)
        return {"message": ReportSuccess.DELETE_SUCCESS.value}

    def get_story_users(self) -> List[StoryUsersDTO]:
        users = self.users_dao.get_all_users()
        return [StoryUsersDTO(user) for user in users]

    def give_user_access(
        self, request_data: StoryAccessRequestDataSchema, created_by_user_id: int
    ) -> MessageResponseSchema:
        # Kept it 0 because its the existing code, lets fix this after finding proper reasoning to fetch user id from user email address received in request data
        user_id = 0
        self.report_dao.create_story_access(
            story_id=getattr(request_data, "story_id"),
            user_id=user_id,
            read=getattr(request_data, "read"),
            write=getattr(request_data, "write"),
            delete=getattr(request_data, "delete"),
            created_by=created_by_user_id,
        )
        self.db_session.commit()
        return {"message": ReportSuccess.ACCESS_GRANTED_SUCCESS.value}

    def get_shared_list(self, story_id: int) -> List[SharedStoryResponseSchema]:
        response = self.report_dao.get_shared_story_data(story_id)
        return [SharedStoryDTO(elem, story_id) for elem in response]

    def update_story(self, incoming_user_id: int, request_data: UpdateStoryRequestDataSchema) -> MessageResponseSchema:
        # Kept it 0 because its the existing code, lets fix this after finding proper reasoning to fetch user id from user email address received in request data
        user_id = 0

        # will be used for adding Content to an existing Story
        story_content_add_data = getattr(request_data, "add")
        # Wont be used anymore
        story_content_delete_data = getattr(request_data, "delete")
        # {content: [id1, id2, id3], pages: [page_id]}
        # will be used to add pages for a story
        story_and_content_update_data = getattr(request_data, "update")

        if len(story_content_add_data) > 0:  # We add more visualizations to the story
            if getattr(request_data, "is_multiple_add"):
                story_id_ = request_data.story_id
                try:
                    if type(story_id_) is list:
                        story_list_ = story_id_
                        for story_id in story_list_:
                            for item in story_content_add_data:
                                self.report_dao.create_story_content(
                                    name=item.get("name"),
                                    description=item.get("description"),
                                    user_id=user_id,
                                    story_id=story_id,
                                    app_id=item.get("app_id"),
                                    app_screen_id=(item.get("app_screen_id") if item.get("app_screen_id") else None),
                                    app_screen_widget_id=(
                                        item.get("app_screen_widget_id") if item.get("app_screen_widget_id") else None
                                    ),
                                    app_screen_widget_value_id=(
                                        item.get("app_screen_widget_value_id")
                                        if item.get("app_screen_widget_value_id")
                                        else None
                                    ),
                                    filter_data=json.dumps(item.get("filter_data", {})),
                                    content_json=json.dumps(item.get("graph_data") if item.get("graph_data") else None),
                                )
                    else:
                        for item in story_content_add_data:
                            self.report_dao.create_story_content(
                                name=item.get("name"),
                                description=item.get("description"),
                                user_id=user_id,
                                story_id=story_id_,
                                app_id=item.get("app_id"),
                                app_screen_id=(item.get("app_screen_id") if item.get("app_screen_id") else None),
                                app_screen_widget_id=(
                                    item.get("app_screen_widget_id") if item.get("app_screen_widget_id") else None
                                ),
                                app_screen_widget_value_id=(
                                    item.get("app_screen_widget_value_id")
                                    if item.get("app_screen_widget_value_id")
                                    else None
                                ),
                                filter_data=json.dumps(item.get("filter_data", {})),
                                content_json=json.dumps(item.get("graph_data") if item.get("graph_data") else None),
                            )
                    self.report_dao.perform_commit()
                except Exception as e:
                    self.report_dao.perform_rollback()
                    logging.exception(e)
                    raise GeneralException(
                        message={"error": ReportErrors.ADD_STORY_CONTENT_ERROR.value},
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    )
            else:
                raise GeneralException(
                    message={"error": ReportErrors.INVALID_REQUEST_ERROR.value},
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        if len(story_content_delete_data) > 0:  # we delete visualization from the story
            try:
                for content_id in story_content_delete_data:
                    self.report_dao.delete_story_content(content_id, incoming_user_id)

                self.report_dao.perform_commit()
            except Exception as e:
                self.report_dao.perform_rollback()
                logging.exception(e)
                raise GeneralException(
                    message={"error": ReportErrors.DELETE_STORY_CONTENT_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        if len(story_and_content_update_data) > 0:
            try:
                self.report_dao.update_story(
                    id=getattr(request_data, "story_id"),
                    name=getattr(request_data, "name"),
                    description=getattr(request_data, "description"),
                    user_id=user_id,
                )

                # deleting all pages for the story:
                self.report_dao.delete_all_story_pages(getattr(request_data, "story_id"), incoming_user_id)

                # Creating new pages
                for page in story_and_content_update_data["pages"]:
                    self.report_dao.create_story_page(
                        story_id=getattr(request_data, "story_id"),
                        layout_id=page["layoutId"],
                        user_id=incoming_user_id,
                        page_order=page["pIndex"],
                        page_json={"data": page["data"]},
                    )

                self.report_dao.perform_commit()
            except Exception as e:
                self.report_dao.perform_rollback()
                logging.exception(e)
                raise GeneralException(
                    message={"error": ReportErrors.UPDATE_STORY_CONTENT_ERROR.value},
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return {"message": ReportSuccess.UPDATE_SUCCESS.value}

    def delete_story(self, story_id: int, stories_list: str, user_id: int) -> Dict:
        stories = json.loads(stories_list)

        for story in stories:
            story_id = story["story_id"]
            app_ids = story["app_ids"]
            self.report_dao.delete_story_app_mappings(story_id=story_id, app_ids=app_ids, user_id=user_id)

            app_left = self.report_dao.get_story_app_mappings_by_story_id(story_id=story_id)

            if not bool(len(app_left)):
                self.report_dao.delete_stories(story_id=story_id, user_id=user_id)

                self.report_dao.delete_story_contents(story_id=story_id, user_id=user_id)

        self.db_session.commit()
        return {"message": ReportSuccess.DELETE_SUCCESS.value}

    def create_story(self, request_data: CreateStoryRequestSchema, user_id: int) -> CreateStoryResponseSchema:
        user_id = self.report_helper.get_user_id_from_email(request_data.email)

        new_story = self.report_dao.create_story(
            name=request_data.name,
            description=request_data.description,
            story_type=getattr(request_data, "story_type", "oneshot"),
            user_id=user_id,
            system_created=False if user_id == 0 else True,
        )

        for app_id in request_data.app_id:
            self.report_dao.create_story_mappings(story_id=new_story.id, app_id=app_id, user_id=user_id)

        for content in request_data.content:
            self.report_dao.create_story_content(
                name=content["name"],
                description=content["description"],
                user_id=user_id,
                story_id=new_story.id,
                app_id=content["app_id"],
                app_screen_id=(content["app_screen_id"] if content["app_screen_id"] else None),
                app_screen_widget_id=(content["app_screen_widget_id"] if content["app_screen_widget_id"] else None),
                app_screen_widget_value_id=(
                    content["app_screen_widget_value_id"] if content["app_screen_widget_value_id"] else None
                ),
                filter_data=json.dumps(content.get("filter_data", {})),
                content_json=json.dumps(content["graph_data"]) if content["graph_data"] else None,
            )

        self.report_dao.create_story_access(
            story_id=new_story.id, user_id=user_id, read=True, write=True, delete=True, created_by=None
        )

        self.db_session.commit()

        return {"message": ReportSuccess.CREATE_SUCCESS.value, "id": new_story.id}

    def share_story(self, request_data: ShareStoryRequestSchema, user: User) -> Dict:
        is_link = getattr(request_data, "isLink", False)
        is_attachment = getattr(request_data, "isAttachment", False)
        receipents = getattr(request_data, "receipents", [])
        story_id = getattr(request_data, "story_id", 0)
        link = getattr(
            request_data,
            "link",
            self.app_settings.CLIENT_HTTP_ORIGIN
            + "/preview-published-story?id_token="
            + encode_payload(
                {
                    "exp": datetime.datetime.utcnow() + datetime.timedelta(days=100000),
                    "iat": datetime.datetime.utcnow(),
                    "sub": "data_story_id_token",
                    "story_id": story_id,
                },
                algorithm="HS256",
            ),
        )

        story = self.report_dao.get_story_user_by_story_id(story_id=story_id)

        created_by = story.User.first_name.capitalize() + " " + story.User.last_name.capitalize()
        sender = f"{user.first_name} {user.last_name}"
        cover_photo = f"{self.app_settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/share_email_cover.png"

        files = []
        html_path = Path(__file__).parent.parent / "../email-templates/share-story.html"
        html_template = open(html_path).read()
        html = html_template.format(
            blob_url=self.app_settings.AZURE_BLOB_ROOT_URL,
            story_name=story.Story.name,
            description=story.Story.description,
            sender=sender,
            created_by=created_by,
            link=link,
            cover_photo=cover_photo,
        )

        plain_Text_path = Path(__file__).parent.parent / "../email-templates/share-story.txt"
        plain_text_template = open(plain_Text_path).read()
        plain_text = plain_text_template.format(
            story_name=story.Story.name,
            description=story.Story.description,
            sender=sender,
            created_by=created_by,
            link=link,
        )

        send_email_smtp(
            email_type="1",
            cc=[user.email_address],
            to=[r.get("email") for r in receipents],
            subject="New Story shared by " + sender,
            body={"html": html, "plain": plain_text, "files": files},
        )

        for receipent in receipents:
            self.report_dao.create_story_share(
                story_id=story.Story.id,
                receipent=receipent,
                is_link=is_link,
                is_attachment=is_attachment,
                user_email=user.email_address,
            )

        self.db_session.commit()

        return {"message": ReportSuccess.SENT_SUCCESS.value}

    def schedule_story(self, request_data: ScheduleStoryRequestSchema, user_id: int) -> Dict:
        user_id = self.report_helper.get_user_id_from_email(request_data.email)

        story = self.report_dao.get_story_by_id(story_id=request_data.story_id)

        schedule_info = {
            "isScheduled": request_data.isScheduled,
            "frequency": request_data.frequency,
            "startDate": request_data.startDate,
            "endDate": request_data.endDate,
            "time": request_data.time,
            "days": request_data.days,
            "occuringOn": request_data.occuringOn,
            "occuringAt": request_data.occuringAt,
        }

        updated_schedule_info = None

        if request_data.isScheduled:
            cron_string = self.report_helper.generate_cron_string(schedule_info)
            generated_job_id = self.report_helper.create_databricks_job(cron_string, story.id, schedule_info)
            schedule_info["cron"] = cron_string
            schedule_info["job_id"] = generated_job_id
            updated_schedule_info = json.dumps(schedule_info)
        else:
            existing_job_id = json.loads(story.schedule_info)
            existing_job_id = existing_job_id.get("job_id", None)
            if existing_job_id:
                self.report_helper.delete_databricks_job(job_id=existing_job_id)

        self.report_dao.update_story_schedule_info(story, updated_schedule_info, user_id)

        return {"message": ReportSuccess.SCHEDULE_SUCCESS.value}

    def recreate_story_snapshot(
        self, story_id: int, user_id: int, user_info: Dict | None
    ) -> RecreateStoryResponseSchema:
        original_story = self.report_dao.get_story_by_id(story_id=story_id)
        original_story_content = self.report_dao.get_story_content_by_story_id(story_id=story_id)
        original_story_pages = self.report_dao.get_story_pages_by_story_id(story_id=story_id)

        original_story_access = self.report_dao.get_story_access_by_story_id(story_id=story_id)
        original_story_app_mapping = self.report_dao.get_story_app_mappings_by_story_id(story_id=story_id)

        new_story = self.report_dao.create_story(
            name=original_story.name + str(datetime.datetime.now().strftime("%d%b%Y_%H%M")),
            description=original_story.description,
            user_id=0,
            system_created=True,
        )

        new_story_content = [
            self.report_dao.create_story_content(
                name=content.name,
                description=content.description,
                story_id=new_story.id,
                app_id=content.app_id,
                user_id=0,
                app_screen_id=content.app_screen_id,
                app_screen_widget_id=content.app_screen_widget_id,
                app_screen_widget_value_id=content.app_screen_widget_value_id,
                filter_data=content.filter_data,
                content_json=self.report_helper.snapshot_generator(
                    widget_value_id=content.app_screen_widget_value_id,
                    filter_data=content.filter_data,
                    user_info=user_info,
                ),
            )
            for content in original_story_content
        ]

        old_new_contnet_id_mapping = {}
        for index in range(len(new_story_content)):
            old_new_contnet_id_mapping[str(original_story_content[index].id)] = new_story_content[index].id

        for page in original_story_pages:
            self.report_dao.create_story_page(
                story_id=new_story.id,
                layout_id=page.layout_id,
                page_json=self.report_helper.snapshot_replacer(
                    story_page_json=page.page_json, mapper=old_new_contnet_id_mapping
                ),
                page_order=page.page_order,
                user_id=None,
            )

        for access in original_story_access:
            self.report_dao.create_story_access(
                story_id=new_story.id,
                user_id=access.user_id,
                read=access.read,
                write=access.write,
                delete=access.delete,
                created_by=None,
            )

        for sam in original_story_app_mapping:
            self.report_dao.create_story_mappings(story_id=new_story.id, app_id=sam.app_id, user_id=0)

        self.db_session.commit()

        return {
            "message": "re-Created Successfully",
            "id": new_story.id,
            "name": new_story.name,
        }
