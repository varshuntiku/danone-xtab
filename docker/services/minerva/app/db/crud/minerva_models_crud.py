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
from app.models.minerva_models import MinervaModels
from app.schemas.minerva_models_schema import MinervaModelMetadata, MinervaModelUpdate
from sqlalchemy.orm import Session


class CRUDMinervaModels(CRUDBase[MinervaModels, MinervaModels, MinervaModels]):
    def update(self, db: Session, *, id: int, obj_in: MinervaModelUpdate) -> MinervaModelMetadata:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_models(self, db: Session) -> List[MinervaModelMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.id, self.model.name, self.model.type, self.model.host, self.model.config, self.model.features
            )
            .filter(self.model.deleted_at.is_(None))
        )
        db_obj = [
            {
                "id": model.id,
                "name": model.name,
                "type": model.type,
                "host": model.host,
                "config": model.config,
                "features": model.features,
            }
            for model in db_obj
        ]
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> MinervaModels:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


minerva_models = CRUDMinervaModels(MinervaModels)
