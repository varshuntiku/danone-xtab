from datetime import timedelta

from api.configs.settings import get_app_settings
from api.daos.auth.saml_login_dao import SAMLDao
from api.helpers.generic_helpers import GenericHelper
from saml2 import BINDING_HTTP_POST, BINDING_HTTP_REDIRECT
from saml2.config import Config
from sqlalchemy.orm import Session

settings = get_app_settings()


class SAMLUtil:
    def __init__(self, db_session: Session):
        self.db_session = db_session
        self.generic_helper = GenericHelper()
        self.saml_login_dao = SAMLDao(db_session)

    def getConfigData(self):
        login_config = self.saml_login_dao.get_login_config("saml")
        config_data = (
            login_config.config_data if login_config.config_data else {"callback_url": "", "metadata_blob_name": ""}
        )
        return (settings.BACKEND_APP_URI + "/login/callback", config_data["metadata_blob_name"])

    def load_saml_config(self):
        login_config = self.saml_login_dao.get_login_config("saml")
        if login_config.is_enabled and login_config.config_data:
            (callback_url, metadata_blob_name) = self.getConfigData()

            SSO_ASSERTION_CONSUMER_SERVICE_URL = callback_url
            SSO_ENTITY_ID = callback_url
            # META_DATA_PATH = os.getcwd() + "/saml_metadata.xml"

            settings = {
                "metadata": {
                    # "local": [META_DATA_PATH],
                    "remote": [
                        {"url": self.generic_helper.get_blob(metadata_blob_name, "saml-metadata", timedelta(days=999))},
                    ],
                },
                "service": {
                    "sp": {
                        "endpoints": {
                            "assertion_consumer_service": [
                                (SSO_ASSERTION_CONSUMER_SERVICE_URL, BINDING_HTTP_REDIRECT),
                                (SSO_ASSERTION_CONSUMER_SERVICE_URL, BINDING_HTTP_POST),
                            ],
                        },
                        "allow_unsolicited": True,
                        "authn_requests_signed": False,
                        "logout_requests_signed": True,
                        "want_assertions_signed": True,
                        "want_response_signed": False,
                    },
                },
            }

            saml_config = Config()
            saml_config.load(settings)
            saml_config.allow_unknown_attributes = True
            saml_config.entityid = SSO_ENTITY_ID
            return saml_config
