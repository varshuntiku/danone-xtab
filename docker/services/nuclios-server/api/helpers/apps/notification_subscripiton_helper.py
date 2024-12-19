import json

from api.daos.apps.screen_dao import ScreenDao
from api.daos.apps.widget_dao import WidgetDao
from sqlalchemy.orm import Session


class NotificationSubscripitonHelper:
    def __init__(self, db_session: Session) -> None:
        self.screen_dao = ScreenDao(db_session=db_session)
        self.widget_dao = WidgetDao(db_session=db_session)

    def is_valid_json(self, value):
        try:
            json.loads(value)
            return True
        except (ValueError, TypeError):
            return False

    def get_widget_comment_enabled_for_screen(self, screen_id):
        try:
            widgets = self.widget_dao.get_widgets_by_screen_id(screen_id=screen_id)
            enabled = False
            for widget in widgets:
                widget_value = self.widget_dao.get_widget_value_by_widget_id(widget_id=widget.id)
                if widget_value:
                    if widget_value.widget_value and self.is_valid_json(widget_value.widget_value):
                        code = json.loads(widget_value.widget_value)
                        if type(code) is dict and "code" in code:
                            code = code["code"]
                            if """"commentEnabled":True""" in code:
                                enabled = True
                                break

            return enabled
        except Exception as e:
            raise e
