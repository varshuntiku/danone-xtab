class UserDTO:
    def __init__(self, user):
        self.id = user.id
        self.first_name = user.first_name
        self.last_name = user.last_name
        self.email_address = user.email_address
        self.restricted_user = "Yes" if user.restricted_user else "No"
        self.nac_user_roles = [nac_user_role.name.upper() for nac_user_role in user.nac_user_roles]
        self.user_group = [user_group.name.upper() for user_group in user.user_groups]
        self.created_at = user.created_at


class GetUserDTO:
    def __init__(self, user):
        self.id = user.id
        self.first_name = user.first_name
        self.last_name = user.last_name
        self.email_address = user.email_address
        self.restricted_user = user.restricted_user
        self.restricted_access = user.restricted_access
        self.nac_user_roles = [group_row.id for group_row in user.nac_user_roles] if user.nac_user_roles else []
        self.user_groups = [group_row.id for group_row in user.user_groups] if user.user_groups else []


class GetProjectUsersDTO:
    def __init__(self, user):
        self.id = user.id
        self.name = user.first_name + " " + user.last_name
        self.email = user.email_address
