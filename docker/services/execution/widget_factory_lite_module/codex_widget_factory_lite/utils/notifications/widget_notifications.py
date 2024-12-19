import json

import requests


def ExceptionLogger(error_msg, log_exception):
    if log_exception:
        print(error_msg)


class WidgetNotifications:
    def __init__(self, app_id, screen_name, widget_name, url, access_token) -> None:
        self.app_id = app_id
        self.screen_name = screen_name
        self.widget_name = widget_name
        self.url = url
        self.access_token = access_token
        self.data = {
            "app_id": self.app_id,
            "widget_name": self.widget_name,
            "screen_name": self.screen_name,
            "progress_info": {},
        }

    def update_progress(self, id, progress) -> None:
        try:
            self.data["progress_info"][id] = {"currentProgress": progress}
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def update_error_state(self, id, value) -> None:
        try:
            self.data["progress_info"][id]["error"] = value
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def update_cancel_state(self, id, value):
        try:
            self.data["progress_info"][id]["cancelled"] = value
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def update_execution_time(self, id, time):
        try:
            self.data["progress_info"][id]["executionTime"] = time
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def update_custom_message(self, id, message):
        try:
            self.data["progress_info"][id]["message"] = message
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def primary_color(self, id, color):
        try:
            self.data["progress_info"][id]["iconColor"] = color
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def active_color(self, id, color):
        try:
            self.data["progress_info"][id]["activeIconColor"] = color
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)

    def push(self) -> None:
        try:
            access_token = self.access_token
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            }
            requests.post(url=self.url, data=json.dumps(self.data), headers=headers)
        except Exception as error_msg:
            ExceptionLogger(error_msg, log_exception=True)


# Use this to update widget state
# if __name__ == '__main__':
# notification_handler = WidgetNotifications(app_id=721, screen_name="LinearScreen", widget_name="PROGRESSBAR",
# url='https://codex-products-api-test.azurewebsites.net/codex-product-api/widget/state', access_token='')
# notification_handler.update_progress(id="456",progress=50)
# notification_handler.active_color("456","blue")
# notification_handler.primary_color("456","red")
# notification_handler.update_error_state("456",True)
# To update error state
# notification_handler.update_error_state(id="456",value=True)
# To update execution time
# notification_handler.update_execution_time(id="456",time="1h 30m")
# To push updates
# notification_handler.push()
