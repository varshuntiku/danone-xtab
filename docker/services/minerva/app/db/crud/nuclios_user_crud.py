#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.db.crud.base import CRUDBase
from app.models.nuclios_user import NucliOSUser
from sqlalchemy.orm import Session


class CRUDNucliOSUser(CRUDBase[NucliOSUser, NucliOSUser, NucliOSUser]):
    def get_user_id(self, db: Session, email: str) -> int:
        user = db.query(self.model).with_entities(self.model.id).filter(self.model.email_address == email).first()
        return user.id if user else None

    def get_user(self, db: Session, email: str) -> int:
        user = db.query(self.model).filter(self.model.email_address == email).first()
        return user if user else None


nuclios_user = CRUDNucliOSUser(NucliOSUser)
