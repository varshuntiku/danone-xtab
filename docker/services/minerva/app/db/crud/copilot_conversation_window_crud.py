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
from app.models.copilot_conversation_window import CopilotConversationWindow
from app.schemas.copilot_conversation_window_schema import (
    CopilotConversationWindowCreate,
    CopilotConversationWindowUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotConversationWindow(
    CRUDBase[CopilotConversationWindow, CopilotConversationWindowCreate, CopilotConversationWindowUpdate]
):
    def update(self, db: Session, *, id: int, obj_in: CopilotConversationWindowUpdate) -> CopilotConversationWindow:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_conversation_windows(
        self, db: Session, *, application_id: int, user_id: str
    ) -> List[CopilotConversationWindow]:
        res = (
            db.query(self.model)
            .filter(
                self.model.deleted_at.is_(None),
                self.model.application_id == application_id,
                self.model.user_id == user_id,
            )
            .order_by(self.model.created_at.desc())
            .all()
        )
        return res

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotConversationWindow:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_conversation_window = CRUDCopilotConversationWindow(CopilotConversationWindow)
