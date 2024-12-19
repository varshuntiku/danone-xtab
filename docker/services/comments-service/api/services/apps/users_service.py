import requests
from api.services.base_service import BaseService
from fastapi import Request


class UsersService(BaseService):
    def get_user(self, request: Request):
        user = {}
        user["first_name"] = request.state.full_name.split(" ")[0]
        user["last_name"] = request.state.full_name.split(" ")[1]
        user["email"] = request.state.logged_in_email

        return user

    def get_all_users_details(self, access_token: str):
        endpoint = f"https://graph.microsoft.com/v1.0/users?$select=id,displayName,givenName,surname,mail,userPrincipalName"
        headers = {"Authorization": f"Bearer {access_token}"}

        response = requests.get(endpoint, headers=headers)
        if response.status_code == 200:
            # print(response.json()["value"][:5])
            return response.json()["value"]
        else:
            raise Exception(status_code=response.status_code, detail=response.text)
