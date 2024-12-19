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
from typing import List

from app.db.crud.base import CRUDBase
from app.models.copilot_context import CopilotContext
from app.schemas.copilot_context_schema import (
    CopilotContextCreate,
    CopilotContextMetadata,
    CopilotContextUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotContext(CRUDBase[CopilotContext, CopilotContextCreate, CopilotContextUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotContextUpdate) -> CopilotContext:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_copilot_app_context_list(self, db: Session, copilot_app_id: int) -> List[CopilotContextMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.id, self.model.name, self.model.type, self.model.source_type, self.model.copilot_app_id
            )
            .filter(self.model.deleted_at.is_(None), self.model.copilot_app_id == copilot_app_id)
            .order_by(self.model.created_at.desc())
        )
        db_obj = [
            {
                "name": context.name,
                "type": context.type,
                "id": context.id,
                "source_type": context.source_type,
                "copilot_app_id": context.copilot_app_id,
            }
            for context in db_obj
        ]
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotContext:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_context = CRUDCopilotContext(CopilotContext)
