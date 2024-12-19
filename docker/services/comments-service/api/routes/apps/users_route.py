from api.controllers.apps.users_controller import UsersController
from api.middlewares.auth_middleware import authenticate_user, get_access_token
from fastapi import APIRouter, Depends, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from api.configs.settings import AppSettings

router = APIRouter()

auth_scheme = HTTPBearer(auto_error=False)

users_controller = UsersController()


@router.get("/user/get-info", status_code=status.HTTP_200_OK)
@authenticate_user
async def get_user(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    user = users_controller.get_user(request=request)
    return user


@router.get("/users/details", status_code=status.HTTP_200_OK)
@authenticate_user
async def get_all_users_details(request: Request, access_token: str = Depends(get_access_token), token: HTTPAuthorizationCredentials = Security(auth_scheme)):  # type: ignore
    users_details = users_controller.get_all_users_details( access_token)
    return users_details


@router.get("/users/ad-details", status_code=status.HTTP_200_OK)
async def get_ad_details(request: Request):  # type: ignore
    app_settings = AppSettings()
    return {
        "clientId": app_settings.AZURE_OAUTH_APPLICATION_ID,
        "tenantId": app_settings.AZURE_OAUTH_TENANCY
    }
