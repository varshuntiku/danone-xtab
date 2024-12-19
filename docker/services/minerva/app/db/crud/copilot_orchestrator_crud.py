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
from app.models.copilot_orchestrator import CopilotOrchestrator
from app.schemas.copilot_orchestrator_schema import (
    CopilotOrchestratorCreate,
    CopilotOrchestratorMetadata,
    CopilotOrchestratorUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotOrchestrator(CRUDBase[CopilotOrchestrator, CopilotOrchestratorCreate, CopilotOrchestratorUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotOrchestratorUpdate) -> CopilotOrchestratorMetadata:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_enabled_orchestrators(self, db: Session) -> List[CopilotOrchestratorMetadata]:
        db_obj = (
            db.query(self.model)
            .filter(self.model.deleted_at.is_(None), self.model.disabled.is_not(True))
            .order_by(self.model.id.asc())
        )
        db_obj = [
            {
                "id": model.id,
                "name": model.name,
                "identifier": model.identifier,
                "desc": model.desc,
                "config": model.config,
                "disabled": bool(model.disabled),
            }
            for model in db_obj
        ]
        return db_obj

    def get_all_orchestrators(self, db: Session) -> List[CopilotOrchestratorMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.id,
                self.model.name,
                self.model.config,
                self.model.disabled,
                self.model.desc,
                self.model.identifier,
            )
            .filter(self.model.deleted_at.is_(None))
            .order_by(self.model.id.asc())
        )
        db_obj = [
            {
                "id": model.id,
                "name": model.name,
                "identifier": model.identifier,
                "desc": model.desc,
                "config": model.config,
                "disabled": bool(model.disabled),
            }
            for model in db_obj
        ]
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotOrchestrator:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_orchestrator = CRUDCopilotOrchestrator(CopilotOrchestrator)
