from api.controllers.auth.login_controller import LoginController
from api.databases import dependencies
from api.middlewares.auth_middleware import authenticate_user
from api.middlewares.ratelimit_middleware import rate_limit
from api.schemas.auth.login_schema import (
    LoginInputSchema,
    LoginResponseSchema,
    LogoutSchema,
    RefreshResponseSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization
get_db = dependencies.get_db  # DB reference

auth_scheme = HTTPBearer(auto_error=False)

login_controller = LoginController()


@router.post("/login", status_code=status.HTTP_200_OK, response_model=LoginResponseSchema)
@rate_limit
async def login(request: Request, request_data: LoginInputSchema):
    """
    API for user login \n
    Example Request Parameters: \n
        {
            "username": "testuser@mathco.com",
            "password": "pass@123"
        }
    """
    return login_controller.login(request_data)


@router.get("/refresh", status_code=status.HTTP_200_OK, response_model=RefreshResponseSchema)
async def refresh(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to regenerate access tokens \n
    """
    return login_controller.refresh(request)


@router.put("/logout", status_code=status.HTTP_200_OK, response_model=LogoutSchema)
@authenticate_user
async def logout(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to logout user
    """
    user_email_address = request.state.user.email_address
    return login_controller.logout(user_email_address)
