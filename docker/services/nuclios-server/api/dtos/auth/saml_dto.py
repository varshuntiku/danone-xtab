from api.configs.settings import get_app_settings
from api.models.base_models import LoginConfig

settings = get_app_settings()


class LoginConfigDTO:
    def __init__(self, login_config: LoginConfig):
        self.config_name = login_config.config_name

        config_data = (
            (
                {
                    **login_config.config_data,
                    "callback_url": settings.BACKEND_APP_URI + "/login/callback",
                }
                if login_config.config_name == "saml"
                else login_config.config_data
            )
            if login_config.config_data
            else (
                {
                    "callback_url": settings.BACKEND_APP_URI + "/login/callback",
                }
                if login_config.config_name == "saml"
                else {}
            )
        )

        self.config_data = config_data
        self.is_enabled = login_config.is_enabled
