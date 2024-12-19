#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from datetime import datetime

from app.db.crud.base import CRUDBase
from app.models.copilot_app_deployment import CopilotAppDeployment
from sqlalchemy.orm import Session


class CRUDCopilotAppDeployment(CRUDBase[CopilotAppDeployment, CopilotAppDeployment, CopilotAppDeployment]):
    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotAppDeployment:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_app_deployment = CRUDCopilotAppDeployment(CopilotAppDeployment)
