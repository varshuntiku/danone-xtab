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
from app.models.copilot_datasource_minerva_document import CopilotDatasourceDocument
from app.schemas.copilot_datasource_document_schema import (
    CopilotDatasourceDocumentCreate,
    CopilotDatasourceDocumentMetadata,
    CopilotDatasourceDocumentUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotDatasourceDocument(
    CRUDBase[CopilotDatasourceDocument, CopilotDatasourceDocumentCreate, CopilotDatasourceDocumentUpdate]
):
    def get_documents(self, db: Session, copilot_datasource_id: int) -> List[CopilotDatasourceDocumentMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.datasource_id, self.model.meta)
            .filter(self.model.deleted_at.is_(None), self.model.datasource_id == copilot_datasource_id)
        )
        db_obj = [
            CopilotDatasourceDocumentMetadata(
                id=item.id, datasource_id=item.datasource_id, name=item.name, meta=item.meta
            )
            for item in db_obj
        ]
        return db_obj

    def soft_delete(self, db: Session, id: int):
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_datasource_document = CRUDCopilotDatasourceDocument(CopilotDatasourceDocument)
