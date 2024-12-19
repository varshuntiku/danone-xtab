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
from app.db.crud.minerva_job_status_crud import minerva_job_status
from app.models.minerva_application import MinervaApplication
from app.schemas.minerva_application_schema import (
    MinervaApplicationCreate,
    MinervaApplicationMetadata,
    MinervaApplicationUpdate,
)
from sqlalchemy.orm import Session


class CRUDMinervaApplication(CRUDBase[MinervaApplication, MinervaApplicationCreate, MinervaApplicationUpdate]):
    def update(self, db: Session, *, id: int, obj_in: MinervaApplicationUpdate) -> MinervaApplication:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_apps(self, db: Session) -> List[MinervaApplicationMetadata]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.description, self.model.app_config)
            .filter(self.model.deleted_at.is_(None))
        )
        db_obj = [
            {
                "name": app.name,
                "description": app.description,
                "id": app.id,
                "source_type": app.app_config[0].get("type")
                if app.app_config and app.app_config[0].get("type")
                else None,
                "status": minerva_job_status.get_job_status_by_app_id(db=db, minerva_application_id=app.id)
                if app.app_config
                and (
                    app.app_config[0].get("type") == "document_query"
                    or (app.app_config[0].get("type") == "sql" and app.app_config[0].get("data_summary", False))
                )
                else "N/A",
            }
            for app in db_obj
        ]
        return db_obj

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> MinervaApplication:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


minerva_application = CRUDMinervaApplication(MinervaApplication)
