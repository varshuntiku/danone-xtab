class UserInfoDTO:
    """
    Data Tranformation Object for the User Info.
    """

    def __init__(self, user):
        self.access_key = user.access_key
        self.feature_access = user.feature_access
        self.first_name = user.first_name
        self.is_restricted_user = user.restricted_user
        self.last_login = (
            user.last_login.strftime("%d %B, %Y %H:%M") if hasattr(user, "last_login") and user.last_login else None
        )
        self.last_name = user.last_name
        self.status = "success"
        self.user_id = user.id
        self.username = user.email_address
        self.nac_roles = user.nac_roles if hasattr(user, "nac_roles") and user.nac_roles else []
        self.nac_access_token = (
            user.nac_access_token if hasattr(user, "nac_access_token") and user.nac_access_token else None
        )
