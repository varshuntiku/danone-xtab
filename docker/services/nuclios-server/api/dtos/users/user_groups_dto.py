from api.constants.users.user_variables import UserGroupType


class UserGroupDTO:
    def __init__(self, user_group):
        self.id = user_group.id
        self.name = user_group.name
        self.app = user_group.app
        self.case_studies = user_group.case_studies
        self.my_projects_only = user_group.my_projects_only
        self.my_projects = user_group.my_projects
        self.all_projects = user_group.all_projects
        self.widget_factory = user_group.widget_factory
        self.environments = user_group.environments
        self.app_publish = user_group.app_publish
        self.prod_app_publish = user_group.prod_app_publish
        self.rbac = user_group.rbac
        self.user_group_type = UserGroupType.get_label(user_group.user_group_type)
        self.created_by = (
            f"{user_group.created_by_user.first_name} {user_group.created_by_user.last_name}"
            if user_group.created_by_user
            else "--"
        )
