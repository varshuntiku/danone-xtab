#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import Optional

from app.db.crud.base import CRUDBase
from app.models.copilot_tool_version_orchestrator_mapping import (
    CopilotToolVersionOrchestratorMapping,
)
from sqlalchemy.orm import Session


class CRUDCopilotToolVersionOrchestratorMapping(
    CRUDBase[
        CopilotToolVersionOrchestratorMapping,
        CopilotToolVersionOrchestratorMapping,
        CopilotToolVersionOrchestratorMapping,
    ]
):
    def get_all_by_tool_version_id(
        self, db: Session, tool_version_id: int
    ) -> list[CopilotToolVersionOrchestratorMapping]:
        return db.query(self.model).filter(self.model.tool_version_id == tool_version_id).all()

    def get_all_by_orchestrator_id(
        self, db: Session, orchestrator_id: int
    ) -> list[CopilotToolVersionOrchestratorMapping]:
        return db.query(self.model).filter(self.model.orchestrator_id == orchestrator_id).all()

    def remove(
        self, db: Session, *, tool_version_id: int, orchestrator_id: int
    ) -> Optional[CopilotToolVersionOrchestratorMapping]:
        obj = (
            db.query(self.model)
            .filter(self.model.tool_version_id == tool_version_id, self.model.orchestrator_id == orchestrator_id)
            .first()
        )
        db.delete(obj)
        db.commit()
        return obj

    def remove_all_by_tool_id(
        self, db: Session, *, tool_version_id: int
    ) -> Optional[CopilotToolVersionOrchestratorMapping]:
        obj = (
            db.query(self.model).filter(self.model.tool_version_id == tool_version_id).delete(synchronize_session=False)
        )
        db.commit()
        return obj


minerva_app_consumer_mapping_crud = CRUDCopilotToolVersionOrchestratorMapping(CopilotToolVersionOrchestratorMapping)
