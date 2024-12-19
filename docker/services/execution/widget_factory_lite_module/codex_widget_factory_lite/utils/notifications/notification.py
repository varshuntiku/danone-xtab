# from abc import ABC
import json
import logging
from enum import Enum, EnumMeta

import requests

# NotificationTypes = Enum('NotificationTypes',['InApp', 'IntraApp', 'Information', "Confirmation", "Approval"])

api_endpoint = "/custom-notification"


class NotificationTypesEnumMeta(EnumMeta):
    def __contains__(cls, item):
        try:
            # print('item ',item,  item in cls.__members__.keys() or cls(item)) # TODO: condition to check for either the enum key or value
            cls(item)
        except ValueError:
            return False
        else:
            return True


class NotificationTypes(Enum, metaclass=NotificationTypesEnumMeta):
    Default = "DEFAULT"
    InApp = "INAPP"
    IntraApp = "INTRAAPP"
    Information = "INFORMATION"
    Confirmation = "CONFIRM"
    Approval = "APPROVAL"


class NotificationMetadata:
    def __init__(self, source_app_id, notification_triggered_by) -> None:
        self._source_app_id = source_app_id
        self._notification_triggered_by = notification_triggered_by

    @property
    def source_app_id(self):
        return self._source_app_id

    @source_app_id.setter
    def source_app_id(self, value: str) -> None:
        self._source_app_id = value

    @property
    def notification_triggered_by(self):
        return self._notification_triggered_by

    @notification_triggered_by.setter
    def notification_triggered_by(self, value: str) -> None:
        self._notification_triggered_by = value

    def __iter__(self) -> dict:
        yield from {
            "source_app_id": self._source_app_id,
            "notification_triggered_by": self._notification_triggered_by,
        }.items()

    def __str__(self) -> str:
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> str:
        return self.__str__()


class Notification:
    def __init__(
        self,
        notification_body: str,
        notification_heading: str,
        base_url: str,
        access_token,
        source_app_id: int,
        user_info: str,
    ) -> None:
        self._notification_body = notification_body
        self._notification_type = NotificationTypes.Default
        self._notification_heading = notification_heading
        self._notification_target_users = []
        self._notification_target_apps = []
        self._base_url = base_url
        self.__access_token__ = access_token
        self._notification_info = NotificationMetadata(
            source_app_id=source_app_id, notification_triggered_by=user_info.get("user", {}).get("email", None)
        )

    @property
    def notification_body(self):
        return self._notification_body

    @notification_body.setter
    def notification_body(self, value: str) -> None:
        self._notification_body = value

    @property
    def notification_type(self):
        return self._notification_type

    @notification_type.setter
    def notification_type(self, value: NotificationTypes) -> None:
        attr_value = NotificationTypes.Default
        if value in NotificationTypes:
            attr_value = NotificationTypes(value)
        else:
            warning_message = f"ValueError: Invalid value received for notification_types. \n Received Value: {value}"
            logging.warning(warning_message)
        self._notification_type = attr_value

    @property
    def notification_heading(self):
        return self._notification_heading

    @notification_heading.setter
    def notification_header(self, value: str) -> None:
        self._notification_heading = value

    @property
    def notification_target_users(self):
        return self._notification_target_users

    @notification_target_users.setter
    def notification_target_users(self, value: list) -> None:
        self._notification_target_users = value

    @property
    def notification_target_apps(self):
        return self._notification_target_apps

    @notification_target_apps.setter
    def notification_target_apps(self, value: list) -> None:
        self._notification_target_apps = value

    # TODO: add annotation for push_notification
    def push_notification(self, mock=False):
        notification_url = self._base_url + api_endpoint
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.__access_token__}",
        }
        # if mock:
        #     print("request is sent")
        # metadata - source app_id, notification triggered by
        # self.data = {
        #     "socket_data": {
        #         "title": self.notification_heading,
        #         "message": self.notification_body,
        #         "email": [*self.notification_target_users],
        #     },
        #     "notification_type": self.notification_type.value,
        #     "notification_additional_info": self._notification_info.to_json(),
        # }
        self.data = {
            "socket_data": {
                "title": self.notification_heading,
                "message": self.notification_body,
                "email": [*self.notification_target_users],
                "mail_template": {
                    "subject": self.notification_heading,
                    "plain_text": self.notification_body,
                    "html": f"<p>{self.notification_body}</p>",
                },
            },
            "notification_type": self.notification_type.value,
            "notification_additional_info": self._notification_info.to_json(),
        }
        for item in self.notification_target_apps:
            # self.data["socket_data"] = {**self.data["socket_data"], "app_id": item}
            self.data["socket_data"]["app_id"] = item
            requests.post(url=notification_url, data=json.dumps(self.data), headers=headers)

    def __iter__(self) -> dict:
        notification_type = (
            self.notification_type.value
            if isinstance(self.notification_type, NotificationTypes)
            else NotificationTypes.Default
        )
        yield from {
            "body": self.notification_body,
            "type": notification_type,
            "header": self.notification_header,  # need to check if it should be notification_heading
            "users": self.notification_target_users,
        }.items()

    def __str__(self) -> str:
        return json.dumps(dict(self), ensure_ascii=False)

    def __repr__(self) -> str:
        return self.__str__()

    def to_json(self) -> str:
        return self.__str__()


# if __name__ == '__main__':
#     body = "THIS IS THE BODY OF MY NOTIFICATION"
#     headings = "NOTIFICATION FOR YOU"
#     base = "http://localhost:8001"
#     # token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTY1MTAyMjksImlhdCI6MTY4ODczNDIyOSwic3ViIjoiYmlzd2FqZWV0Lm1pc2hyYUB0aGVtYXRoY29tcGFueS5jb20iLCJhY2Nlc3MiOnsidHJpZ2dlcl9ub3RpZmljYXRpb24iOnRydWUsInRyaWdnZXJfZW1haWxfbm90aWZpY2F0aW9uIjp0cnVlfX0.arnFS0yPowJqFxLKV1-uVdCiaZI93YnxVi-B0ZqXwxM"
#     token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTU2MzUzMTAsImlhdCI6MTY4Nzg1OTMxMCwic3ViIjoiaXJhLnNocml2YXN0YXZhQHRoZW1hdGhjb21wYW55LmNvbSIsImFjY2VzcyI6eyJ0cmlnZ2VyX25vdGlmaWNhdGlvbiI6dHJ1ZSwidHJpZ2dlcl9lbWFpbF9ub3RpZmljYXRpb24iOnRydWV9fQ.Am9cJLC9aQ1W8aH2POWv1d9bHqoQmXPLh68efCzRg5w"
#     myNotification = Notification(notification_body=body, notification_heading=headings, base_url=base, access_token=token)
#     # myNotification.notification_type = NotificationTypes.InApp  # "DEFAULT00"
#     # myNotification.notification_target_apps = [1]
#     # myNotification.notification_target_users = ['biswajeet.atul@themathcompany.com']
#     # print(myNotification)
#     # myNotification.notification_type = "INFORMATION"  # "DEFAULT00"
#     # myNotification.notification_target_apps = [2, 3, 4]
#     # myNotification.notification_target_users = ['ira@themathcompany.com']
#     # print(myNotification)
#     # myNotification.notification_type = "TEST"  # "DEFAULT00"
#     # myNotification.notification_target_apps = [3]
#     # myNotification.notification_target_users = ['ira@themathcompany.com']
#     # print(myNotification)
#     # myNotification.notification_type = 10  # "DEFAULT00"
#     # myNotification.notification_target_apps = [4]
#     # myNotification.notification_target_users = ['ira@themathcompany.com']
#     # print(myNotification)
# myNotification.notification_type = "INFORMATION"  # "DEFAULT00"
# myNotification.notification_target_apps = [344]
# myNotification.notification_target_users = ['ira.shrivastava@themathcompany.com']
# print(myNotification)
# myNotification.push_notification()
