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
from app.models.copilot_tool_base_version import CopilotToolBaseVersion
from sqlalchemy.orm import Session


class CRUDCopilotToolBaseVersion(CRUDBase[CopilotToolBaseVersion, CopilotToolBaseVersion, CopilotToolBaseVersion]):
    def get_tool_base_versions(self, db: Session):
        db_obj = db.query(self.model).filter(self.model.deleted_at.is_(None)).order_by(self.model.id).all()
        return db_obj

    def get_tool_base_version_by_id(self, db: Session, base_version_id: int):
        db_obj = db.query(self.model).filter(self.model.id == base_version_id, self.model.deleted_at.is_(None)).first()
        return db_obj


copilot_tool_base_version = CRUDCopilotToolBaseVersion(CopilotToolBaseVersion)
