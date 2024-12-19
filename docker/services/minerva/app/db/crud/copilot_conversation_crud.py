#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from typing import List

from app.db.crud.base import CRUDBase
from app.models.copilot_conversation import CopilotConversation
from app.schemas.copilot_conversation_schema import (
    CopilotConversationCreate,
    CopilotConversationUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotConversation(CRUDBase[CopilotConversation, CopilotConversationCreate, CopilotConversationUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotConversationUpdate) -> CopilotConversation:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_recent_conversations(
        self, db: Session, application_id: int, user_id: str, window_id: int, limit: int, offset: int
    ) -> List[CopilotConversation]:
        db_obj = (
            db.query(self.model)
            .filter(
                self.model.deleted_at.is_(None),
                self.model.application_id == application_id,
                self.model.user_id == user_id,
                self.model.conversation_window_id == window_id,
            )
            .order_by(self.model.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        db_obj.reverse()
        return db_obj

    def get_convo_count(self, db: Session, application_id: int, user_id: str, window_id: int) -> int:
        db_obj = (
            db.query(self.model)
            .filter(
                self.model.deleted_at.is_(None),
                self.model.application_id == application_id,
                self.model.user_id == user_id,
                self.model.conversation_window_id == window_id,
            )
            .count()
        )
        return db_obj


copilot_conversation = CRUDCopilotConversation(CopilotConversation)
