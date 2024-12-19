from typing import Dict

import requests
from api.configs.settings import AppSettings
from api.schemas.apps.tableau_schema import TableauSignInRequestSchema
from api.services.base_service import BaseService


class TableauService(BaseService):
    def __init__(self):
        super().__init__()
        self.app_settings = AppSettings()

    def tableau_sign_in(self, request_data: TableauSignInRequestSchema) -> Dict:
        url = f"{self.app_settings.TABLEAU_BASE_URL}/auth/signin"
        headers = {"Accept": "application/json", "Content-Type": "application/json"}
        payload = {
            "credentials": {
                "personalAccessTokenName": request_data.pat_token_name,
                "personalAccessTokenSecret": request_data.pat_token_secret,
                "site": {"contentUrl": request_data.content_url or ""},
            }
        }
        response = requests.post(url, headers=headers, json=payload)
        return response.json()

    def get_workbooks(self, token: str, site_id: str, user_id: str) -> Dict:
        url = f"{self.app_settings.TABLEAU_BASE_URL}/sites/{site_id}/users/{user_id}/workbooks"
        headers = {"X-Tableau-Auth": token, "Accept": "application/json", "Content-Type": "application/json"}
        response = requests.get(url, headers=headers)
        return response.json()

    def get_views(self, token: str, site_id: str, workbook_id: str) -> Dict:
        url = f"{self.app_settings.TABLEAU_BASE_URL}/sites/{site_id}/workbooks/{workbook_id}/views"
        headers = {"X-Tableau-Auth": token, "Accept": "application/json", "Content-Type": "application/json"}
        response = requests.get(url, headers=headers)
        return response.json()
