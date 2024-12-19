from enum import Enum


class UserGroupType(Enum):
    SYSTEM = 1
    USER_CREATED = 2

    def get_label(value):
        if value == 1:
            return "SYSTEM"
        elif value == 2:
            return "USER CREATED"
        else:
            return "NONE"
