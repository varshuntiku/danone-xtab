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
from app.models.minerva_conversation import MinervaConversation
from app.schemas.minerva_conversation_schema import (
    MinervaConversationCreate,
    MinervaConversationUpdate,
)
from sqlalchemy.orm import Session


class CRUDMinervaConversation(CRUDBase[MinervaConversation, MinervaConversationCreate, MinervaConversationUpdate]):
    def update(
        self, db: Session, *, db_obj: MinervaConversation, obj_in: MinervaConversationUpdate
    ) -> MinervaConversation:
        db_obj = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj

    def get_recent_convo(
        self, db: Session, application_id: int, user_id: str, window_id: int, limit: int, offset: int
    ) -> List[MinervaConversation]:
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


minerva_conversation = CRUDMinervaConversation(MinervaConversation)
