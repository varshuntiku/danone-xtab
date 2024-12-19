import base64
import logging
from dataclasses import dataclass

import msal
import requests
from api.configs.settings import AppSettings
from api.daos.users.users_dao import UsersDao

# from api.helpers.generic_helpers import GenericHelper
from api.middlewares.error_middleware import GeneralException
from api.utils.auth.saml import SAMLUtil
from fastapi import Request, Response, status
from saml2 import BINDING_HTTP_POST
from saml2.client import Saml2Client
from saml2.saml import name_id_from_string
from sqlalchemy.orm import Session


@dataclass
class SAMLService:
    def __init__(self, db_session: Session):
        self.saml_config = SAMLUtil(db_session).load_saml_config()
        self.saml_client = Saml2Client(config=self.saml_config) if self.saml_config else None
        self.users_dao = UsersDao(db_session)
        self.app_settings = AppSettings()

    def prepare_for_authenticate(self, redirect_url=None):
        relay_state = ""
        if redirect_url:
            relay_state = base64.b64encode(redirect_url.encode("utf-8"))
            try:
                request_id, info = self.saml_client.prepare_for_authenticate(relay_state=relay_state)
            except Exception as e:
                print(e)
        for key, value in info["headers"]:
            if key == "Location":
                sso_redirect_url = value
                return sso_redirect_url
        return None

    def process_saml_response(self, saml_response_data):
        # Parse and process the SAML response
        authn_response = self.saml_client.parse_authn_request_response(
            saml_response_data,
            BINDING_HTTP_POST,
        )
        # print(authn_response)
        # ide = authn_response.get_identity()
        # test = authn_response.get_subject()
        # print(ide, test)
        return authn_response

    def get_user_info(self, saml_response):
        user_info = {
            "user_id": saml_response.ava.get("http://schemas.microsoft.com/identity/claims/objectidentifier")[0],
            "email": saml_response.ava.get("emailAddress", [""])[0],
            "first_name": "",
            "last_name": "",
        }
        # print("SAML Response:", saml_response.ava)

        if "givenName" in saml_response.ava and "surname" in saml_response.ava:
            user_info["first_name"] = saml_response.ava["givenName"][0]
            user_info["last_name"] = saml_response.ava["surname"][0]
        else:
            if "http://schemas.microsoft.com/identity/claims/displayname" in saml_response.ava:
                display_name = saml_response.ava["http://schemas.microsoft.com/identity/claims/displayname"][0]
                names = display_name.split()
                user_info["first_name"] = names[0] if len(names) > 0 else ""
                user_info["last_name"] = " ".join(names[1:]) if len(names) > 1 else ""
            else:
                full_name = saml_response.ava.get("name", [""])[0]
                if full_name:
                    names = full_name.split()
                    user_info["first_name"] = names[0] if len(names) > 0 else ""
                    user_info["last_name"] = " ".join(names[1:]) if len(names) > 1 else ""

        # print("User Info:", user_info)

        return user_info

    def handle_user(self, saml_response):
        user_info = self.get_user_info(saml_response)
        if user_info:
            found_user = self.users_dao.get_user_by_email(user_info["email"])

            if not found_user:
                found_user = self.users_dao.add_user(
                    first_name=user_info["first_name"],
                    last_name=user_info["last_name"],
                    email_address=user_info["email"],
                    user_groups=[],
                    restricted_user=False,
                    access_key=True,
                    login=True,
                )
            else:
                self.users_dao.update_user_last_login(found_user)

    def is_logged_in(self, sso_name_id):
        return self.saml_client.is_logged_in(name_id=name_id_from_string(sso_name_id))

    def logout(self, sso_name_id):
        # local logout. does not logout from azure
        return self.saml_client.local_logout(name_id=name_id_from_string(sso_name_id))

    def authenticate_user(self, user_attributes):
        # placeholder to verify user roles etc
        return True

    def get_azure_token(self) -> str:
        client_id = self.app_settings.AZURE_OAUTH_APPLICATION_ID
        client_secret = self.app_settings.AZURE_OAUTH_CLIENT_SECRET
        tenant_id = self.app_settings.AZURE_OAUTH_TENANCY
        authority = f"https://login.microsoftonline.com/{tenant_id}"
        scope = ["https://graph.microsoft.com/.default"]

        try:
            # Create a client instance
            app = msal.ConfidentialClientApplication(client_id, authority=authority, client_credential=client_secret)

            # Acquire token
            result = app.acquire_token_for_client(scopes=scope)

            return result["access_token"]
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message={"error": "Error fetching azure access token."},
            )

    def get_avatar(self, user_id: str, access_token: str) -> Response:
        url = f"https://graph.microsoft.com/v1.0/users/{user_id}/photos/48x48/$value"
        # Set the authorization headers
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        try:
            response = requests.get(url, headers=headers)
            return response
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                message={"error": "Error fetching user avatar."},
            )


class RequiresLoginException(Exception):
    def __init__(self, redirect_url: str = None):
        self.redirect_url = redirect_url
        super().__init__()


def is_user_logged_in(request: Request):
    saml_service = SAMLService()
    if not saml_service.is_logged_in(request.session["saml_name_id"]):
        redirect_url = str(request.url)
        raise RequiresLoginException(redirect_url=redirect_url)
    else:
        return request.session["user_info"]
