import logging
from typing import Dict, List

from api.constants.apps.report_error_messages import ReportErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    App,
    Story,
    StoryAccess,
    StoryAppMapping,
    StoryContent,
    StoryLayout,
    StoryPages,
    StoryShare,
    User,
)
from fastapi import status
from sqlalchemy import and_, asc
from sqlalchemy.orm import Session
from sqlalchemy.sql import func


class ReportDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def perform_rollback(self):
        """
        Perform rollback if an error occured
        """
        return super().perform_rollback()

    def perform_commit(self):
        """
        Perform commit after all necessary operation are completed without error
        """
        return super().perform_commit()

    def get_user_created_stories(self, user_id: int, app_id: int) -> List:
        """
        Gets user created stories

        Args:
            user_id: user's id
            app_id: app's id

        Returns:
            List of user created stories
        """
        try:
            return (
                self.db_session.query(
                    Story,
                    func.array_agg(func.json_build_object("id", App.id, "name", App.name)).label("apps"),
                )
                .filter(and_(Story.created_by == user_id, Story.deleted_at.is_(None)))
                .join(
                    StoryAppMapping,
                    and_(
                        StoryAppMapping.story_id == Story.id,
                        StoryAppMapping.deleted_at.is_(None),
                    ),
                )
                .join(App, StoryAppMapping.app_id == App.id)
                .filter(((App.id == app_id) if app_id else True))
                .group_by(Story.id)
                .order_by(asc(Story.name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_USER_CREATED_STORIES_ERROR.value},
            )

    def get_story_access_by_user_id(self, user_id: int) -> List:
        """
        Gets story access given user id

        Args:
            user_id: user's id

        Returns:
            Story access list
        """
        try:
            return self.db_session.query(StoryAccess).filter_by(user_id=user_id).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_STORY_ACCESS_ERROR.value},
            )

    def get_user_accessible_stories(self, user_id: int, app_id: int, story_access_ids: List) -> List:
        """
        Gets user accessible stories

        Args:
            user_id: user's id
            app_id: app's id
            story_access_id: story access ids List

        Returns:
            List of user accessible stories
        """
        try:
            return (
                self.db_session.query(
                    Story,
                    func.array_agg(func.json_build_object("id", App.id, "name", App.name)).label("apps"),
                )
                .filter(Story.id.in_(story_access_ids), Story.created_by != user_id)
                .join(StoryAppMapping, StoryAppMapping.story_id == Story.id)
                .join(App, StoryAppMapping.app_id == App.id)
                .filter(((App.id == app_id) if app_id else True))
                .group_by(Story.id)
                .order_by(asc(Story.name))
                .all()
            )
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_USER_ACCESSIBLE_STORIES_ERROR.value},
            )

    def get_story_content_by_story_id(self, story_id: int) -> List[StoryContent]:
        """
        Gets story content given story id

        Args:
            story_id: story's id

        Returns:
            Story content list
        """
        try:
            return self.db_session.query(StoryContent).filter_by(story_id=story_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_STORY_CONTENT_ERROR.value},
            )

    def get_story_page_count_by_story_id(self, story_id: int) -> int:
        """
        Gets story page count given story id

        Args:
            story_id: story's id

        Returns:
            Story page count
        """
        try:
            return self.db_session.query(StoryPages).filter_by(story_id=story_id, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            return 0

    def get_story_by_id(self, story_id: int) -> Story:
        """
        Gets story given story id

        Args:
            story_id: story's id

        Returns:
            Story object
        """
        try:
            return self.db_session.query(Story).filter_by(id=story_id).first()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_STORY_ERROR.value},
            )

    def get_story_layouts(self) -> List[StoryLayout]:
        """
        Gets all story layouts

        Args:
            None

        Returns:
            List of story layouts
        """
        try:
            return self.db_session.query(StoryLayout).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORY_LAYOUTS_ERROR.value},
            )

    def get_story_pages_by_story_id(self, story_id: int) -> List[StoryPages]:
        """
        Gets story pages given story id

        Args:
            story_id: story's id

        Returns:
            Story pages list
        """
        try:
            return self.db_session.query(StoryPages).filter_by(story_id=story_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORY_PAGES_ERROR.value},
            )

    def get_app_ids_from_story_id(self, id: int) -> List[int]:
        """Returns app ids associated to the given story id.

        Args:
            id: story id

        Returns:
            List of app ids
        """
        ids = []
        try:
            entity = (
                self.db_session.query(StoryAppMapping)
                .filter(and_(StoryAppMapping.story_id == id, StoryAppMapping.deleted_at.is_(None)))
                .all()
            )
            if entity:
                ids = [item.app_id for item in entity]
            else:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": ReportErrors.STORY_NOT_EXIST_ERROR.value},
                )
        except Exception as e:
            logging.exception(e)
        return ids

    def get_story_layouts_by_id(self, layout_id: int) -> List[StoryLayout]:
        """
        Gets story layouts given id

        Args:
            layout_id: layout id

        Returns:
            List of story layouts
        """
        try:
            return self.db_session.query(StoryLayout).filter_by(id=int(layout_id), deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORY_LAYOUTS_ERROR.value},
            )

    def add_story_layout(
        self, layout_style: Dict, layout_props: Dict, thumbnail_blob_name: str, layout_name: str
    ) -> None:
        """
        Creates new story layout

        Args:
            layout_style: layout styles
            layout_props: layout properties
            thumbnail_blob_name: layout's thumbnail blob name
            layout_name: layout name

        Returns:
            None
        """
        try:
            new_layout = StoryLayout(
                layout_style=layout_style,
                layout_props=layout_props,
                thumbnail_blob_name=thumbnail_blob_name,
                layout_name=layout_name,
            )
            self.db_session.add(new_layout)
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_LAYOUT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_story_layout(self, layout_id: int) -> Dict:
        """
        Deletes story layout with the given layout id

        Args:
            layout_id: layout id

        Returns:
            Success message
        """
        try:
            layout = self.db_session.query(StoryLayout).filter_by(id=int(layout_id)).first()
            layout.deleted_at = func.now()
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.DELETE_LAYOUT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_story_layout(
        self, layout_id: int, layout_style: Dict, layout_props: Dict, thumbnail_blob_name: str, layout_name: str
    ) -> Dict | None:
        """
        Updates story layout with the given layout id

        Args:
            layout_id: layout id

        Returns:
            Success message
        """
        try:
            layout = self.db_session.query(StoryLayout).filter_by(id=int(layout_id)).first()
            if layout:
                layout.layout_props = layout_props
                layout.layout_style = layout_style
                layout.thumbnail_blob_name = thumbnail_blob_name
                layout.layout_name = layout_name
                layout.updated_at = func.now()
                self.db_session.commit()

            return layout
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.DELETE_LAYOUT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_story_access(
        self, story_id: int, user_id: int, read: bool, write: bool, delete: bool, created_by: int
    ) -> StoryAccess:
        """
        Creates new story access record

        Args:
            story_id: story id
            user_id: user id
            read: read access flag
            write: write access flag
            delete: delete access flag

        Returns:
            Story Access object
        """
        try:
            story_access = StoryAccess(
                story_id=story_id, user_id=user_id, read=read, write=write, delete=delete, created_by=created_by
            )
            self.db_session.add(story_access)
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_ACCESS_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_shared_story_data(self, story_id: int) -> List:
        """
        Gets shared story data

        Args:
            story_id: story id

        Returns:
            Shared story data
        """
        try:
            q1 = (
                self.db_session.query(StoryShare, User, StoryAccess)
                .filter(StoryShare.story_id == story_id)
                .distinct(StoryShare.email)
                .outerjoin(User, User.email_address == StoryShare.email)
                .outerjoin(
                    StoryAccess,
                    and_(StoryAccess.story_id == story_id, StoryAccess.user_id == User.id),
                )
            )
            q2 = (
                self.db_session.query(StoryShare, User, StoryAccess)
                .filter(StoryAccess.story_id == story_id)
                .outerjoin(User, User.id == StoryAccess.user_id)
                .outerjoin(
                    StoryShare,
                    and_(
                        StoryShare.story_id == story_id,
                        StoryShare.email == User.email_address,
                    ),
                )
            )
            return q1.union(q2).order_by(StoryAccess.created_at).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.SHARED_STORY_DATA_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_story_content(
        self,
        name: str,
        description: str,
        user_id: int,
        story_id: int,
        app_id: int,
        app_screen_id: int,
        app_screen_widget_id: int,
        app_screen_widget_value_id: int,
        filter_data: str,
        content_json: str,
    ) -> StoryContent:
        """
        Creates story content

        Args:
            name: name
            description: description
            user_id: user id
            story_id: story id
            app_id: app id
            app_screen_id: app screen id
            app_screen_widget_id: app screen widget id
            app_screen_widget_value_id: app screen widget value id
            filter_data: filter data
            content_json: content json

        Returns:
            Story Content object
        """
        try:
            story_content = StoryContent(
                name=name,
                description=description,
                created_by=user_id,
                story_id=story_id,
                app_id=app_id,
                app_screen_id=app_screen_id,
                app_screen_widget_id=app_screen_widget_id,
                app_screen_widget_value_id=app_screen_widget_value_id,
                filter_data=filter_data,
                content_json=content_json,
            )
            self.db_session.add(story_content)
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_CONTENT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_story_content(self, id: int, user_id: int) -> StoryContent | None:
        """
        Deletes story content given its id

        Args:
            id: story content id
            user_id: id of user deleting content

        Returns:
            Story Content
        """
        try:
            content = self.db_session.query(StoryContent).filter_by(id=id).first()
            if content:
                content.deleted_at = func.now()
                content.deleted_by = user_id
                self.db_session.flush()
            return content
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.DELETE_STORY_CONTENT_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_story(self, id: int, name: str, description: str, user_id: int) -> Story | None:
        """
        Updates story given id

        Args:
            id: story id
            name: story name
            description: story description
            user_id: user id

        Returns:
            Updated story object
        """
        try:
            story = self.db_session.query(Story).filter_by(id=id).first()
            story.name = name
            story.description = description
            story.updated_at = func.now()
            story.updated_by = user_id
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.UPDATE_STORY_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_all_story_pages(self, story_id: int, user_id: int) -> Dict:
        """
        Deletes all story pages for the given story id

        Args:
            story_id: story id
            user_id: user id

        Returns:
            Success message
        """
        try:
            pages_for_story = self.db_session.query(StoryPages).filter_by(story_id=story_id).all()
            for page in pages_for_story:
                page.deleted_at = func.now()
                page.deleted_by = user_id
                self.db_session.flush()
            return {"success": True}
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.DELETE_STORY_PAGES.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_story_page(
        self, story_id: int, layout_id: int, user_id: int, page_order: int, page_json: Dict
    ) -> StoryPages:
        """
        Creates story pages

        Args:
            story_id: story id
            layout_id: layout id
            page_order: story page order
            page_json: story page json data
            user_id: id of user creating story page

        Returns:
            Story Pages object
        """
        try:
            story_page = StoryPages(
                story_id=story_id, layout_id=layout_id, page_order=page_order, page_json=page_json, created_by=user_id
            )
            self.db_session.add(story_page)
            self.db_session.flush()
            return story_page
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_PAGES.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def delete_story_app_mappings(self, story_id: int, app_ids: List, user_id: int) -> None:
        """
        Deletes the story mappings for given story id and app ids

        Args:
            story_id: story id
            app_ids: List of app ids
            user_id: user deleting the story mappings

        Returns: None
        """
        try:
            self.db_session.query(StoryAppMapping).filter(
                and_(
                    StoryAppMapping.story_id == story_id,
                    StoryAppMapping.app_id.in_(app_ids) if len(app_ids) else True,
                )
            ).update({"deleted_at": func.now(), "deleted_by": user_id})
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORY_MAPPING_DELETE_ERROR.value},
            )

    def get_story_app_mappings_by_story_id(self, story_id: int) -> List[StoryAppMapping]:
        """
        Get list of story app mappings for given story id

        Args:
            story_id: story id


        Returns: List of StoryAppMapping
        """
        try:
            return self.db_session.query(StoryAppMapping).filter_by(story_id=story_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_STORY_APP_MAPPING_ERROR.value},
            )

    def delete_stories(self, story_id: int, user_id: int) -> None:
        """
        Deletes the stories for given story id

        Args:
            story_id: story id
            user_id: user deleting the stories

        Returns: None
        """
        try:
            self.db_session.query(Story).filter_by(id=story_id, deleted_at=None).update(
                {"deleted_at": func.now(), "deleted_by": user_id}
            )
            self.db_session.flush()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORIES_DELETE_ERROR.value},
            )

    def delete_story_contents(self, story_id: int, user_id: int) -> None:
        """
        Deletes the story contents for given story id

        Args:
            story_id: story id
            user_id: user deleting the stories

        Returns: None
        """
        try:
            self.db_session.query(StoryContent).filter_by(id=story_id, deleted_at=None).update(
                {"deleted_at": func.now(), "deleted_by": user_id}
            )
            self.db_session.flush()
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.STORY_CONTENT_DELETE_ERROR.value},
            )

    def create_story(
        self,
        name: str,
        description: str,
        user_id: int,
        system_created: bool,
        story_type: str = "oneshot",
    ) -> Story:
        """
        Creates story

        Args:
            name: story name
            description: story description
            story_type: type of story
            user_id: id of user creating story page

        Returns:
            Story object
        """
        try:
            new_story = Story(
                name=name,
                description=description,
                created_by=user_id,
                system_created=system_created,
                story_type=story_type,
            )
            self.db_session.add(new_story)
            self.db_session.flush()
            return new_story
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_story_mappings(self, story_id: int, app_id: int, user_id: int) -> StoryAppMapping:
        """
        Creates story mapping

        Args:
            story_id: int
            app_id: int
            user_id: id of user creating story page

        Returns:
            StoryAppMapping object
        """
        try:
            new_story_app_mapping = StoryAppMapping(story_id=story_id, app_id=app_id, created_by=user_id)
            self.db_session.add(new_story_app_mapping)
            self.db_session.flush()
            return new_story_app_mapping
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_APP_MAPPING_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_story_user_by_story_id(self, story_id: int):
        """
        Get story user by story id

        Args:
            story_id: int
        """
        try:
            return (
                self.db_session.query(Story, User)
                .filter(Story.id == story_id)
                .join(User, User.id == Story.created_by)
                .first()
            )
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.GET_STORY_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def create_story_share(
        self, story_id: int, receipent: Dict, is_link: bool, is_attachment: bool, user_email: str
    ) -> StoryShare:
        """
        Get story user by story id

        Returns:
            StoryShare object
        """
        try:
            shared_report = StoryShare(
                story_id=story_id,
                email=receipent.get("email", ""),
                is_link=is_link,
                is_attachment=is_attachment,
                shared_by=user_email,
            )
            self.db_session.add(shared_report)
            self.db_session.flush()
            return shared_report
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.CREATE_STORY_SHARE_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def update_story_schedule_info(self, story: Story, schedule_info: Dict | None, user_id: int) -> None:
        """
        Get story user by story id

        Args:
            story: story to be updated
            schedule_info: schedule_info to be updated
            user_id: id of user updating

        Returns:
            None
        """
        try:
            story.schedule_info = schedule_info
            story.updated_at = func.now()
            story.updated_by = user_id
            self.db_session.commit()
        except Exception as e:
            self.db_session.rollback()
            logging.exception(e)
            raise GeneralException(
                message={"error": ReportErrors.UPDATE_STORY_SCHEDULE_INFO_ERROR.value},
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

    def get_story_access_by_story_id(self, story_id: int) -> List[StoryAccess]:
        """
        Gets story access given story id

        Args:
            story_id: story's id

        Returns:
            Story Access list
        """
        try:
            return self.db_session.query(StoryAccess).filter_by(story_id=story_id, deleted_at=None).all()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": ReportErrors.GET_STORY_ACCESS_ERROR.value},
            )
