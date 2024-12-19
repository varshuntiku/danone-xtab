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
from app.models.minerva_document import MinervaDocument
from app.schemas.minerva_document_schema import (
    MinervaDocumentCreate,
    MinervaDocumentMetadata,
    MinervaDocumentUpdate,
)
from sqlalchemy.orm import Session


class CRUDMinervaDocument(CRUDBase[MinervaDocument, MinervaDocumentCreate, MinervaDocumentUpdate]):
    def update(self, db: Session, *, db_obj: MinervaDocument, obj_in: MinervaDocumentUpdate) -> MinervaDocument:
        db_obj = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj

    def get_document_id(self, db: Session, document_id: int) -> List[MinervaDocumentMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.application_id, self.model.meta)
            .filter(self.model.deleted_at.is_(None), self.model.id == document_id)
        )
        db_obj = [
            MinervaDocumentMetadata(id=app.id, application_id=app.application_id, name=app.name, meta=app.meta)
            for app in db_obj
        ]
        return db_obj[0]

    def get_documents(self, db: Session, minerva_application_id: int) -> List[MinervaDocumentMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.application_id, self.model.meta)
            .filter(self.model.deleted_at.is_(None), self.model.application_id == minerva_application_id)
        )
        db_obj = [
            MinervaDocumentMetadata(id=app.id, application_id=app.application_id, name=app.name, meta=app.meta)
            for app in db_obj
        ]
        return db_obj

    def soft_delete(self, db: Session, id: int):
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


minerva_document = CRUDMinervaDocument(MinervaDocument)
