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
from app.models.copilot_datasource import CopilotDatasource
from app.schemas.copilot_datasource_schema import (
    CopilotDatasourceCreate,
    CopilotDatasourceMetadata,
    CopilotDatasourceUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotDatasource(CRUDBase[CopilotDatasource, CopilotDatasourceCreate, CopilotDatasourceUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotDatasourceUpdate) -> CopilotDatasource:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_copilot_app_datasource(
        self, db: Session, datasource_id: int, copilot_app_id: int
    ) -> CopilotDatasourceMetadata:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.id, self.model.name, self.model.type, self.model.config, self.model.copilot_app_id
            )
            .filter(
                self.model.deleted_at.is_(None),
                self.model.copilot_app_id == copilot_app_id,
                self.model.id == datasource_id,
            )
            .first()
        )
        datasource_obj = CopilotDatasourceMetadata(
            name=db_obj.name, type=db_obj.type, id=db_obj.id, config=db_obj.config, copilot_app_id=db_obj.copilot_app_id
        )

        return datasource_obj

    def get_copilot_app_datasources(self, db: Session, copilot_app_id: int) -> List[CopilotDatasourceMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.id, self.model.name, self.model.type, self.model.config, self.model.copilot_app_id
            )
            .filter(self.model.deleted_at.is_(None), self.model.copilot_app_id == copilot_app_id)
            .order_by(self.model.created_at.desc())
        )
        db_obj = [
            {
                "name": app.name,
                "type": app.type,
                "id": app.id,
                "config": app.config,
                "copilot_app_id": app.copilot_app_id,
            }
            for app in db_obj
        ]
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotDatasource:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_datasource = CRUDCopilotDatasource(CopilotDatasource)
