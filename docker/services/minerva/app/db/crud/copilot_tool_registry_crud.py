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
from app.models.copilot_tool_registry import CopilotToolRegistry
from app.schemas.copilot_tool_registry import (
    CopilotToolRegistryCreate,
    CopilotToolRegistryUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotToolRegistry(CRUDBase[CopilotToolRegistry, CopilotToolRegistryCreate, CopilotToolRegistryUpdate]):
    def get_global_registry(self, db: Session) -> CopilotToolRegistry:
        return db.query(self.model).order_by(self.model.id).limit(1).first()

    def update(self, db: Session, *, id: int, obj_in: CopilotToolRegistryUpdate) -> CopilotToolRegistry:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_tool_registries(self, db: Session) -> list[CopilotToolRegistry]:
        db_obj = db.query(self.model).filter(self.model.deleted_at.is_(None)).order_by(self.model.id).all()
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotToolRegistry:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_tool_registry = CRUDCopilotToolRegistry(CopilotToolRegistry)
