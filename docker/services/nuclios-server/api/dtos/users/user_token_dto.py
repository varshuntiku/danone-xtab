class UserTokenDTO:
    """
    Data Tranformation Object for User Token.
    """

    def __init__(self, user_token):
        self.id = user_token.id
        self.user_id = user_token.user_id
        self.user_email = user_token.user_email
        self.token = user_token.execution_token
        self.access = user_token.access
        self.created_at = user_token.created_at
