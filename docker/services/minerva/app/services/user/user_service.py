#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.db.crud.nuclios_user_crud import nuclios_user
from app.dependencies.dependencies import get_db
from app.schemas.nuclios_user import UserCreate, UserMetaData
from app.utils.config import get_settings
from fastapi import Depends

settings = get_settings()


class UserService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def get_user_id_by_email(self, email: str) -> int | None:
        return nuclios_user.get_user_id(db=self.db, email=email)

    def get_user_by_email(self, email: str) -> UserMetaData:
        obj = nuclios_user.get_user(db=self.db, email=email)
        return UserMetaData(
            id=obj.id, email_address=obj.email_address, first_name=obj.first_name, last_name=obj.last_name
        )

    def create_user(self, obj_in: UserCreate) -> UserMetaData:
        obj = nuclios_user.create(db=self.db, obj_in=obj_in)
        return UserMetaData(
            id=obj.id, email_address=obj.email_address, first_name=obj.first_name, last_name=obj.last_name
        )
