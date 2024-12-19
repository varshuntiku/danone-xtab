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
from app.models.minerva_app_consumer_mapping import MinervaAppConsumerMapping
from sqlalchemy.orm import Session


class CRUDMinervaAppConsumerMapping(
    CRUDBase[MinervaAppConsumerMapping, MinervaAppConsumerMapping, MinervaAppConsumerMapping]
):
    def get_all_by_consumer_id(self, db: Session, consumer_id: int) -> list[MinervaAppConsumerMapping]:
        return db.query(self.model).filter(self.model.consumer_id == consumer_id).all()

    def remove(self, db: Session, *, consumer_id: int, copilot_app_id: int) -> Optional[MinervaAppConsumerMapping]:
        obj = (
            db.query(self.model)
            .filter(self.model.consumer_id == consumer_id, self.model.copilot_app_id == copilot_app_id)
            .first()
        )
        db.delete(obj)
        db.commit()
        return obj


minerva_app_consumer_mapping = CRUDMinervaAppConsumerMapping(MinervaAppConsumerMapping)
