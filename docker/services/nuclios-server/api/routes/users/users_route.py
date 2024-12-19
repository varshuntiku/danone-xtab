import json
from typing import Annotated, Dict, List

from api.constants.users.user_error_messages import UserErrors
from api.controllers.users.users_controller import UsersController
from api.middlewares.auth_middleware import (
    authenticate_user,
    nac_role_info_required,
    rbac_required,
)
from api.middlewares.error_middleware import GeneralException
from api.middlewares.ratelimit_middleware import rate_limit
from api.schemas.generic_schema import StatusResponseSchema
from api.schemas.users.users_schema import (
    DeleteUserSchema,
    DeleteUsersRequestDataSchema,
    GetUserSchema,
    NacUserRolesCreateRequestSchema,
    NacUserRolesCreateResponseSchema,
    NacUserRolesResponseSchema,
    NacUserRolesUpdateRequestSchema,
    UpdateUserInfoRequestSchema,
    UploadBulkUsersResponseSchema,
    UserChangePasswordRequestSchema,
    UserCreateRequestSchema,
    UserCreateResponseSchema,
    UserGenerateOtpRequestSchema,
    UserGenerateOtpResponseSchema,
    UserGenerateTokenRequestSchema,
    UserGenerateTokenResponseSchema,
    UserGetTokensResponseSchema,
    UserGroupCreateRequestSchema,
    UserGroupCreateResponseSchema,
    UserGroupDeleteResponseSchema,
    UserGroupSchema,
    UserInfoSchema,
    UserResponseSchema,
    UserUpdatePasswordRequestSchema,
    UserUpdatePasswordResponseSchema,
    UserUpdateRequestSchema,
    UserValidateOtpRequestSchema,
    UserValidateOtpResponseSchema,
)
from api.utils.user.user import get_user_details
from fastapi import APIRouter, Header, Request, Response, Security, UploadFile, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

router = APIRouter()  # Router Initialization

users_controller = UsersController()

auth_scheme = HTTPBearer(auto_error=False)


##############################
# USER GROUPS Related routes #
##############################


@router.get(
    "/user-groups",
    status_code=status.HTTP_200_OK,
    response_model=List[UserGroupSchema],
    tags=["User Groups"],
)
@authenticate_user
async def get_user_groups(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to list all user groups.\n
    """

    user_groups = users_controller.get_user_groups()
    return user_groups


@router.get(
    "/users/user-groups",
    status_code=status.HTTP_200_OK,
    response_model=List[UserGroupSchema],
    tags=["User Groups"],
)
@authenticate_user
async def get_user_groups_2(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to list all user groups.\n
    """

    response = await get_user_groups(request, token)
    return response


########################
# USERS related routes #
########################


@router.post(
    "/users",
    status_code=status.HTTP_200_OK,
    response_model=UserCreateResponseSchema,
    tags=["User Management"],
)
@authenticate_user
async def create_user(
    request: Request,
    request_body: UserCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create new user.\n
    Example Request Parameters: \n
        {
            "first_name": "test",
            "last_name": "user",
            "email_address": "testuser@mathco.com",
            "restricted_user": false,
            "nac_user_roles": [
                4
            ],
            "user_groups": [
                2
            ],
            "user_apps": [],
            "password": "pass@123"
        }
    """
    new_user = users_controller.create_user(request, request_body)
    return new_user


@router.get(
    "/users/list",
    status_code=status.HTTP_200_OK,
    response_model=UserResponseSchema,
    tags=["User Management"],
)
@authenticate_user
async def list_user(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    page: int = 0,
    pageSize: int = 10,
    filtered: str = "[]",
    user_type: str = "active",
):
    """
    API to list all users.\n
    """

    query_params = {
        "pageSize": pageSize,
        "page": page,
        "user_type": user_type,
        "filtered": json.loads(filtered),
    }

    users_list = users_controller.get_users_list(query_params)
    return users_list


@router.get(
    "/bulk/lists/users",
    status_code=status.HTTP_200_OK,
    response_model=UserResponseSchema,
    tags=["User Management"],
)
@authenticate_user
async def list_user_2(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    page: int = 0,
    pageSize: int = 10,
    filtered: str = "[]",
    user_type: str = "active",
):
    """
    API to list all users.\n
    """

    response = await list_user(request, token, page, pageSize, filtered, user_type)
    return response


@router.post(
    "/users/update",
    status_code=status.HTTP_200_OK,
    response_model=UserCreateResponseSchema,
    tags=["User Management"],
)
@authenticate_user
async def update_user(
    request: Request,
    request_body: UserUpdateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update user details \n
    Example Request Parameters: \n
        {
            "first_name": "test",
            "last_name": "user",
            "email_address": "testuser@mathco.com",
            "restricted_user": false,
            "restricted_access": false,
            "user_groups": [
                2
            ],
            "password": "pass@123"
        }
    """
    user_id = request.state.user.id
    new_user = users_controller.update_user(request_body, user_id)
    return new_user


@router.get(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=GetUserSchema,
    tags=["User Management"],
)
@authenticate_user
async def get_user_info(
    request: Request,
    user_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get the user info for the given user id \n
    """
    response = users_controller.get_user_info(user_id)
    return response


@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=DeleteUserSchema,
    tags=["User Management"],
)
@authenticate_user
@rbac_required
async def delete_user(
    request: Request,
    user_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the user with the given user id \n
    """
    deleted_by = request.state.user.id
    response = users_controller.delete_user(user_id, deleted_by)
    return response


@router.post(
    "/delete_users",
    status_code=status.HTTP_200_OK,
    response_model=DeleteUserSchema,
    tags=["User Management"],
)
@authenticate_user
@rbac_required
async def delete_users(
    request: Request,
    request_data: DeleteUsersRequestDataSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete the users specified in the given list of user ids \n
    Example Request Parameters: \n
    {
        user_ids: [1, 2]
    }
    """
    deleted_by_user = request.state.user
    user_ids = getattr(request_data, "user_ids")
    response = users_controller.delete_users(user_ids, deleted_by_user)
    return response


@router.put(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    response_model=StatusResponseSchema,
    tags=["User Management"],
)
@authenticate_user
@rbac_required
async def update_user_info(
    request: Request,
    request_data: UpdateUserInfoRequestSchema,
    user_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update the user info for the given user id \n
    Example Request Parameters: \n
        {
            "email_address": "testuser@mathco.com",
            "first_name": "John",
            "last_name": "Doe",
            "user_groups": [],
            "nac_user_roles": [],
            "password": "pass123",
            "restricted_user": False,
            "restricted_access": False
        }
    """
    updated_by = request.state.user.id
    response = users_controller.update_user_info(user_id, updated_by, request_data)
    return response


########################
# USER related routes #
########################


@router.get("/user/get-info", status_code=status.HTTP_200_OK, response_model=UserInfoSchema, tags=["User"])
@authenticate_user
async def get_user(request: Request, token: HTTPAuthorizationCredentials = Security(auth_scheme)):
    """
    API to get user details
    """

    user_id = request.state.user.id
    user = users_controller.get_user(user_id)
    return user


@router.post(
    "/user/update-password",
    status_code=status.HTTP_200_OK,
    response_model=UserUpdatePasswordResponseSchema,
    tags=["User"],
)
@authenticate_user
@rate_limit
async def update_user_password(
    request: Request,
    request_data: UserUpdatePasswordRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update user login password \n
    Example Request Parameters: \n
        {
            "password": "pass@123",
            "new_password": "pass@456",
            "confirm_password": "pass@456"
        }
    """
    user_email_address = request.state.user.email_address
    return users_controller.update_password(user_email_address, request_data)


@router.post(
    "/user/change-password",
    status_code=status.HTTP_200_OK,
    response_model=UserUpdatePasswordResponseSchema,
    tags=["User"],
)
@rate_limit
async def change_user_password(
    request: Request,
    request_data: UserChangePasswordRequestSchema,
    password_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to update user login password using email \n
    Example Request Parameters: \n
        {
            "email": "testuser@mathco.com",
            "password": "pass@456",
            "confirm_password": "pass@456"
        }
    Example Request Header: \n
        {
            "password_token": "example.token"
        }
    """
    user_email_address = get_user_details(password_token)
    if user_email_address == getattr(request_data, "email"):
        return users_controller.update_password(user_email_address, request_data)
    else:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_EMAIL_ERROR.value},
        )


@router.post(
    "/user/generate-code",
    status_code=status.HTTP_200_OK,
    response_model=UserGenerateOtpResponseSchema,
    tags=["User"],
)
@rate_limit
async def generate_otp(request: Request, request_data: UserGenerateOtpRequestSchema, response: Response):
    """
    API to generate 6 digit OTP for user which will be valid for 5 mins and send it over email \n
    Example Request Parameters: \n
        {
            "email": "testuser@mathco.com"
        }
    Returns: \n
    JSON content: \n
        {"message": "Code generated successfully"}
    Response headers: \n
        {"userid": 1}
    """
    user_email_address = getattr(request_data, "email", None)
    if not user_email_address:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_EMAIL_REQUIRED_ERROR.value},
        )
    return users_controller.generate_otp(response, user_email_address)


@router.post(
    "/user/validate-otp",
    status_code=status.HTTP_200_OK,
    response_model=UserValidateOtpResponseSchema,
    tags=["User"],
)
@rate_limit
async def validate_otp(
    request: Request,
    request_data: UserValidateOtpRequestSchema,
    response: Response,
    userId: Annotated[int | None, Header(convert_underscores=False)] = None,
):
    """
    API to validate the OTP provided by the user and create a jwt token
    which will be valid for 5 mins allows user to authenticate themselves
    to change their password. \n
    Example Request Parameters: \n
        {
            "code": "12345"
        }
    Example Request Header: \n
        {
            "userId": 2
        }

    Returns: \n
    JSON content: \n
        {"message": "OTP validated successfully"}
    Response headers: \n
        {"password_token": <generated jwt token to change password>}
    """
    otp = getattr(request_data, "code", None)
    if not otp:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_OTP_ERROR.value},
        )
    if not userId:
        raise GeneralException(
            status.HTTP_400_BAD_REQUEST,
            message={"error": UserErrors.USER_ID_ERROR.value},
        )
    return users_controller.validate_otp(response, userId, otp)


@router.post(
    "/user/token/",
    status_code=status.HTTP_200_OK,
    response_model=UserGenerateTokenResponseSchema,
    tags=["User"],
)
@authenticate_user
@nac_role_info_required
async def generate_user_token(
    request: Request,
    request_data: UserGenerateTokenRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to generate user token given user details \n
    Example Request Parameters: \n
        {
            "user_email": "testuser@mathco.com",
            "user_name": "test",
            "access": {}
        }
    """
    response = users_controller.generate_user_token(request_data)
    return response


@router.get(
    "/user/token/",
    status_code=status.HTTP_200_OK,
    response_model=UserGetTokensResponseSchema,
    tags=["User"],
)
@authenticate_user
@nac_role_info_required
async def get_user_tokens(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to get user tokens of the logged in user
    """
    logged_in_email = request.state.user.email_address
    response = users_controller.get_user_tokens(logged_in_email)
    return response


##############################
# USER GROUPS Related routes #
##############################


@router.post(
    "/user-groups",
    status_code=status.HTTP_200_OK,
    response_model=UserGroupCreateResponseSchema,
    tags=["User Groups"],
)
@authenticate_user
async def create_user_groups(
    request: Request,
    request_data: UserGroupCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create new user group.\n
    Example Request Parameters: \n
        {
            "name": "test group",
            "app": true,
            "case_studies": true,
            "my_projects_only": false,
            "my_projects": true,
            "all_projects": true,
            "widget_factory": true,
            "environments": false,
            "app_publish": true,
            "prod_app_publish": null,
            "rbac": true
        }
    """

    user_id = request.state.user.id
    new_user_group = users_controller.create_user_groups(request_data, user_id)
    return new_user_group


@router.get(
    "/user-groups/{user_group_id}",
    status_code=status.HTTP_200_OK,
    response_model=UserGroupSchema,
    tags=["User Groups"],
)
@authenticate_user
async def get_user_group_by_id(
    request: Request,
    user_group_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get user group by id.\n
    """

    user_group = users_controller.get_user_group_by_id(user_group_id)
    return user_group


@router.put("/user-groups/{user_group_id}", status_code=status.HTTP_200_OK, tags=["User Groups"])
@authenticate_user
async def update_user_group(
    request: Request,
    request_data: UserGroupCreateRequestSchema,
    user_group_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update user group.\n
    Example Request Parameters: \n
        {
            "name": "test group",
            "app": true,
            "case_studies": true,
            "my_projects_only": false,
            "my_projects": true,
            "all_projects": true,
            "widget_factory": true,
            "environments": false,
            "app_publish": true,
            "prod_app_publish": null,
            "rbac": true
        }
    """

    user_id = request.state.user.id
    response = users_controller.update_user_group(request_data, user_group_id, user_id)
    return response


@router.delete(
    "/user-groups/{user_group_id}",
    status_code=status.HTTP_200_OK,
    response_model=UserGroupDeleteResponseSchema,
    tags=["User Groups"],
)
@authenticate_user
async def delete_user_group_by_id(
    request: Request,
    user_group_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete user group by id.\n
    """

    delete_response = users_controller.delete_user_group_by_id(user_group_id, request.state.user.id)
    return delete_response


########################
# NAC related routes #
########################


@router.get(
    "/nac-role-permissions",
    status_code=status.HTTP_200_OK,
    tags=["NAC Roles"],
)
@authenticate_user
async def get_nac_role_permissions(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get NAC role permissions.\n
    """
    response = users_controller.get_nac_role_permissions()
    return response


@router.get(
    "/nac-user-roles",
    status_code=status.HTTP_200_OK,
    response_model=List[NacUserRolesResponseSchema],
    tags=["NAC Roles"],
)
@authenticate_user
async def get_nac_user_roles(
    request: Request,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get NAC user roles.\n
    """
    response = users_controller.get_nac_user_roles()
    return response


@router.get(
    "/nac-user-roles/{nac_user_role_id}",
    status_code=status.HTTP_200_OK,
    response_model=NacUserRolesResponseSchema,
    tags=["NAC Roles"],
)
@authenticate_user
async def get_nac_user_role_by_id(
    request: Request,
    nac_user_role_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to get NAC user role by id.\n
    """
    response = users_controller.get_nac_user_role_by_id(nac_user_role_id)
    return response


@router.post(
    "/nac-user-roles",
    status_code=status.HTTP_200_OK,
    response_model=NacUserRolesCreateResponseSchema,
    tags=["NAC Roles"],
)
@authenticate_user
async def create_nac_user_role(
    request: Request,
    request_data: NacUserRolesCreateRequestSchema,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to create new NAC user role.\n
    Example Request Parameters: \n
        {
            "name": "test role",
            "role_permissions": [1,2]

        }
    """
    user_id = request.state.user.id
    response = users_controller.create_nac_user_role(request_data, user_id)
    return response


@router.put(
    "/nac-user-roles/{nac_user_role_id}",
    status_code=status.HTTP_200_OK,
    tags=["NAC Roles"],
)
@authenticate_user
async def update_nac_user_role(
    request: Request,
    request_data: NacUserRolesUpdateRequestSchema,
    nac_user_role_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to update NAC user role for given id.\n
    """
    user_id = request.state.user.id
    response = users_controller.update_nac_user_role(nac_user_role_id, request_data, user_id)
    return response


@router.delete(
    "/nac-user-roles/{nac_user_role_id}",
    status_code=status.HTTP_200_OK,
    tags=["NAC Roles"],
)
@authenticate_user
async def delete_nac_user_role(
    request: Request,
    nac_user_role_id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
):
    """
    API to delete NAC user role for given id.\n
    """
    user_id = request.state.user.id
    response = users_controller.delete_nac_user_role(nac_user_role_id, user_id)
    return response


@router.delete("/user/token/{id}", status_code=status.HTTP_200_OK, tags=["User"], response_model=Dict)
@authenticate_user
@nac_role_info_required
async def delete_jwt_token(
    request: Request,
    id: int,
    token: HTTPAuthorizationCredentials = Security(auth_scheme),
    nac_access_token: Annotated[str | None, Header(convert_underscores=False)] = None,
):
    """
    API to delete user token.\n
    """
    response = users_controller.delete_jwt_token(id)
    return response


@router.post("/bulk/users", status_code=status.HTTP_200_OK, tags=["User"], response_model=UploadBulkUsersResponseSchema)
@authenticate_user
async def upload_users_list(
    request: Request, file: UploadFile, token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    """
    API to upload bulk user list.\n
    """
    response = await users_controller.upload_users_list(file)
    return response
