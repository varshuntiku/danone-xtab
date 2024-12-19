from typing import List

from api.configs.settings import get_app_settings
from api.controllers.auth.saml_login_controller import SAMLLoginController
from api.databases.session import SessionLocal
from api.schemas.auth.saml_login_schema import (
    GetLoginConfigResponseSchema,
    SAMLGetTokenResponseSchema,
    SAMLLoginResponseSchema,
)
from fastapi import APIRouter, Request, Response, status
from fastapi.security import HTTPBearer

router = APIRouter()  # Router Initialization
auth_scheme = HTTPBearer(auto_error=False)
settings = get_app_settings()
db_session = SessionLocal()
saml_login_controller = SAMLLoginController()


@router.get("/login", status_code=status.HTTP_200_OK, response_model=SAMLLoginResponseSchema)
def saml_login(request: Request, redirect_url: str):
    """
    API to create SAML user login url \n
    """
    response = saml_login_controller.saml_login(request, redirect_url)
    return response


@router.post("/login/callback")
async def saml_callback(request: Request):
    """
    Callback API called by Azure on successful login\n
    """
    response = await saml_login_controller.saml_callback(request)
    return response


@router.get(
    "/login/get-token",
    status_code=status.HTTP_200_OK,
    response_model=SAMLGetTokenResponseSchema,
)
async def get_token(request: Request, response: Response):
    """
    API to generate tokens \n
    """
    res = saml_login_controller.get_token(request, response)
    return res


@router.get("/login/get-config", status_code=status.HTTP_200_OK, response_model=List[GetLoginConfigResponseSchema])
async def get_config(request: Request):
    """
    API to save login config \n
    """
    res = saml_login_controller.get_config()
    return res


@router.post(
    "/login/save-login-config",
    status_code=status.HTTP_200_OK,
)
async def save_login_config(request: Request):
    """
    API to save login config \n
    """
    form_data = await request.form()
    res = saml_login_controller.save_login_config(form_data._dict)
    return res


@router.get(
    "/saml/avatar/{user_id}",
    status_code=status.HTTP_200_OK,
)
async def get_saml_avatar(request: Request, user_id: str):
    """
    API to get avatar on SAML login \n
    """
    res = saml_login_controller.get_saml_avatar(user_id)
    return res
