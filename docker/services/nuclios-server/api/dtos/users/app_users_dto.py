import json


class AppUserDTO:
    def __init__(self, user):
        self.id = user.id
        self.first_name = user.first_name
        self.last_name = user.last_name
        self.email_address = user.user_email
        self.is_admin = user.is_admin
        self.user_roles = [{"id": user_role.id, "name": user_role.name} for user_role in user.user_roles]
        self.responsibilities = json.loads(user.permissions).get("responsibilities", []) if user.permissions else False


class AppUserRoleDTO:
    def __init__(self, user_role):
        self.id = user_role.id
        self.name = user_role.name
        self.permissions = json.loads(user_role.permissions) if user_role.permissions else False
