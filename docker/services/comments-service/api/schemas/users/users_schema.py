from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class UserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email_address: str
    restricted_user: str
    nac_user_roles: List[str]
    user_group: List[str]
    created_at: datetime | None

    class config:
        orm_mode = True


class UserInfoSchema(BaseModel):
    access_key: str | None
    feature_access: dict
    first_name: str
    is_restricted_user: bool
    last_login: str | None
    last_name: str
    status: str
    user_id: int
    username: str
    nac_roles: List[dict] | None
    nac_access_token: str | None

    class config:
        orm_mode = True


class UserUpdatePasswordResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True


class UserUpdatePasswordSchema(BaseModel):
    password: str
    new_password: Optional[str] = None
    confirm_password: str
    email: Optional[str] = None

    class config:
        orm_mode = True


class UserUpdatePasswordRequestSchema(BaseModel):
    password: str
    new_password: str
    confirm_password: str

    class config:
        orm_mode = True


class UserChangePasswordRequestSchema(BaseModel):
    email: Optional[str]
    password: str
    confirm_password: str

    class config:
        orm_mode = True


class UserGenerateOtpRequestSchema(BaseModel):
    email: str

    class config:
        orm_mode = True


class UserGenerateOtpResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True


class UserValidateOtpRequestSchema(BaseModel):
    code: str

    class config:
        orm_mode = True


class UserValidateOtpResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True


class UserGenerateTokenRequestSchema(BaseModel):
    user_email: str
    user_name: str
    access: dict

    class config:
        orm_mode = True


class UserGenerateTokenResponseSchema(BaseModel):
    token: str
    message: str

    class config:
        orm_mode = True


class UserTokenSchema(BaseModel):
    id: int
    user_id: int | None
    user_email: str
    token: str
    access: str | dict
    created_at: datetime | None

    class config:
        orm_mode = True


class UserGetTokensResponseSchema(BaseModel):
    tokens: List[UserTokenSchema]
    message: str

    class config:
        orm_mode = True


class UserSuccessResponseSchema(BaseModel):
    message: str

    class config:
        orm_mode = True


class UserResponseSchema(BaseModel):
    data: List[UserSchema]
    page: int | None
    pages: int | None
    count: int | None
    pageSize: int | None

    class config:
        orm_mode = True


class UserCreateRequestSchema(BaseModel):
    first_name: str
    last_name: str
    email_address: str
    restricted_user: bool
    nac_user_roles: List[int]
    user_groups: List[int]
    user_apps: List[int]
    password: str

    class config:
        orm_mode = True


class UserCreateResponseSchema(BaseModel):
    id: int
    first_name: str

    class config:
        orm_mode = True


class UserUpdateRequestSchema(BaseModel):
    first_name: str
    last_name: str
    email_address: str
    restricted_user: Optional[bool] = None
    restricted_access: Optional[bool] = None
    user_groups: Optional[List[int]] = None
    password: Optional[str] = None
    createNewUser: Optional[bool] = None

    class config:
        orm_mode = True


class UserGroupSchema(BaseModel):
    id: int
    name: str
    app: bool | None
    case_studies: bool | None
    my_projects_only: bool | None
    my_projects: bool | None
    all_projects: bool | None
    widget_factory: bool | None
    environments: bool | None
    app_publish: bool | None
    prod_app_publish: bool | None
    rbac: bool | None
    user_group_type: str
    created_by: str

    class config:
        orm_mode = True


class UserGroupCreateRequestSchema(BaseModel):
    name: str
    app: bool | None
    case_studies: bool | None
    my_projects_only: bool | None
    my_projects: bool | None
    all_projects: bool | None
    widget_factory: bool | None
    environments: bool | None
    app_publish: bool | None
    prod_app_publish: Optional[bool] = None
    rbac: bool | None

    class config:
        orm_mode = True


class UserGroupCreateResponseSchema(BaseModel):
    id: int
    name: str
    message: str

    class config:
        orm_mode = True


class UserGroupDeleteResponseSchema(BaseModel):
    message: str
    deleted_user_group: str

    class config:
        orm_mode = True


class NacUserRolesResponseSchema(BaseModel):
    id: int
    name: str
    permissions: List[str]
    user_role_type: str
    created_by: str

    class config:
        orm_mode = True


class NacUserRolesCreateRequestSchema(BaseModel):
    name: str
    role_permissions: List[int]

    class config:
        orm_mode = True


class NacUserRolesCreateResponseSchema(BaseModel):
    message: str
    id: int
    name: str

    class config:
        orm_mode = True


class NacUserRolesUpdateRequestSchema(BaseModel):
    name: str
    permissions: List[int]

    class config:
        orm_mode = True


class GetUserSchema(BaseModel):
    id: int
    first_name: str
    last_name: str
    email_address: str
    restricted_user: bool | None
    restricted_access: bool | None
    nac_user_roles: List
    user_groups: List

    class config:
        orm_mode = True


class DeleteUserSchema(BaseModel):
    deleted_rows: int

    class config:
        orm_mode = True


class DeleteUsersRequestDataSchema(BaseModel):
    user_ids: List[int]

    class config:
        orm_mode = True


class UpdateUserInfoRequestSchema(BaseModel):
    email_address: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    user_groups: Optional[List] = None
    nac_user_roles: Optional[List | bool] = None
    password: Optional[str] = None
    restricted_user: Optional[bool | None] = False
    restricted_access: Optional[bool | None] = False

    class config:
        orm_mode = True


class GetProjectUsersResponseSchema(BaseModel):
    id: int
    name: str
    email: str

    class config:
        orm_mode = True


class UploadBulkUsersResponseSchema(BaseModel):
    filename: str
    users_added: int
    users_ignored: int
    user_access_reinstated: int
