import logging

from api.constants.stories.story_error_messages import StoryErrors
from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import StoryAppMapping
from fastapi import status
from sqlalchemy.orm import Session


class StoryDao(BaseDao):
    def __init__(self, db_session: Session):
        super().__init__(db_session)

    def get_stories_by_app_id_count(self, app_id: int) -> int:
        """
        Get count of stories under given app id

        Args:
            app_id: int

        Returns:
            Number of stories under given app id
        """
        try:
            return self.db_session.query(StoryAppMapping).filter_by(app_id=app_id, deleted_at=None).count()
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                message={"error": StoryErrors.ERROR_GETTING_APP_STORY_COUNT.value},
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
