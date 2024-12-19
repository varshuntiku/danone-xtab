from typing import List

from api.controllers.users.app_users_controller import AppUsersController
from api.middlewares.auth_middleware import authenticate_user
from api.schemas import GenericResponseSchema
from api.schemas.users.app_users_schema import (
    AppUserRoleSchema,
    AppUserSchema,
    CreateUpdateAppUserRequestSchema,
    CreateUpdateAppUserRoleRequestSchema,
    CreateUpdateDeleteAppUserRoleResponseSchema,
    DeleteAppUserResponseSchema,
    MessageResponseSchema,
    UpdateAppUserResponseSchema,
)
from fastapi import APIRouter, Request, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()

app_users_controller = AppUsersController()

auth_scheme = HTTPBearer(auto_error=False)


###########################################
# APP USERS AND USER ROLES related routes #
###########################################


@router.get("/app-admin/app-users/{app_id}", status_code=status.HTTP_200_OK, response_model=List[AppUserSchema])
@authenticate_user
async def get_app_users(request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get app users details of the given app id
    """

    return app_users_controller.get_app_users(app_id)


@router.get(
    "/app-admin/app-user-roles/{app_id}", status_code=status.HTTP_200_OK, response_model=List[AppUserRoleSchema]
)
@authenticate_user
async def get_app_user_roles(
    request: Request, app_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to get app user roles details of the given app id
    """

    return app_users_controller.get_app_user_roles(app_id)


@router.post(
    "/app-admin/app-user-roles",
    status_code=status.HTTP_200_OK,
    response_model=CreateUpdateDeleteAppUserRoleResponseSchema,
)
@authenticate_user
async def create_app_user_role(
    request: Request,
    request_data: CreateUpdateAppUserRoleRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create new app user role \n
    Example Request Parameters: \n
        {
            "name": "test group",
            "app_id": 2,
            "permissions": []
        }
    """
    user_id = request.state.user.id
    return app_users_controller.create_app_user_role(request_data, user_id)


@router.post(
    "/app-admin/app-users",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def create_app_user(
    request: Request,
    request_data: CreateUpdateAppUserRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create new app user \n
    Example Request Parameters: \n
        {
            "app_id": 2,
            "first_name": "John",
            "last_name": "Doe",
            "email_address": "abc@test.com",
            "user_roles": [],
            "responsibilities": []
        }
    """
    user_id = request.state.user.id
    return app_users_controller.create_app_user(request_data, user_id)


@router.post(
    "/app-admin/app-user-roles/{app_user_role_id}",
    status_code=status.HTTP_200_OK,
    response_model=CreateUpdateDeleteAppUserRoleResponseSchema,
)
@authenticate_user
async def update_app_user_role(
    request: Request,
    request_data: CreateUpdateAppUserRoleRequestSchema,
    app_user_role_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update app user role \n
    Example Request Parameters: \n
        {
            "app_id": 2,
            "name": "View",
            "permissions": ["app_screen_1"]
        }
    """
    user_id = request.state.user.id
    return app_users_controller.update_app_user_role(request_data, user_id, app_user_role_id)


@router.post(
    "/app-admin/app-users/{app_user_id}",
    status_code=status.HTTP_200_OK,
    response_model=GenericResponseSchema,
)
@authenticate_user
async def update_app_user(
    request: Request,
    request_data: CreateUpdateAppUserRequestSchema,
    app_user_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update app user \n
    Example Request Parameters: \n
        {
            "app_id": 2,
            "first_name": "John",
            "last_name": "Doe",
            "email_address": "abc@test.com",
            "user_roles": [],
            "responsibilities": []
        }
    """
    user_id = request.state.user.id
    return app_users_controller.update_app_user(request_data, user_id, app_user_id)


@router.delete(
    "/app-admin/app-user-roles/{app_user_role_id}",
    status_code=status.HTTP_200_OK,
    response_model=CreateUpdateDeleteAppUserRoleResponseSchema,
)
@authenticate_user
async def delete_app_user_role(
    request: Request,
    app_user_role_id: int,
    confirm: bool | str | None = False,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the app user role
    """
    user_id = request.state.user.id
    return app_users_controller.delete_app_user_role(app_user_role_id, confirm, user_id)


@router.delete(
    "/app-admin/app-users/{app_user_id}", status_code=status.HTTP_200_OK, response_model=DeleteAppUserResponseSchema
)
@authenticate_user
async def delete_app_user(
    request: Request, app_user_id: int, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to delete the app user
    """
    user_id = request.state.user.id
    logged_in_email = request.state.logged_in_email
    return app_users_controller.delete_app_user(app_user_id, user_id, logged_in_email)


@router.put("/app-admin/app-users/{app_id}", status_code=status.HTTP_200_OK, response_model=MessageResponseSchema)
@authenticate_user
async def update_app_user_responsibilities(
    request: Request,
    request_data: UpdateAppUserResponseSchema,
    app_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the app user responsibilities \n
    Example Request Parameters: \n
        {
            "deleted_responsibilities": ["All"]
        }
    """
    user_id = request.state.user.id
    return app_users_controller.update_app_user_responsibilities(request_data, user_id, app_id)
