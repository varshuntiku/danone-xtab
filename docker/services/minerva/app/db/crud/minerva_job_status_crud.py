#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.db.crud.base import CRUDBase
from app.models.minerva_job_status import MinervaJobStatus
from app.schemas.minerva_job_status_schema import (
    MinervaJobStatusCreate,
    MinervaJobStatusUpdate,
)
from sqlalchemy.orm import Session


class CRUDMinervaJobStatus(CRUDBase[MinervaJobStatus, MinervaJobStatusCreate, MinervaJobStatusUpdate]):
    def update(self, db: Session, *, id: int | None, obj_in: MinervaJobStatusUpdate) -> MinervaJobStatus:
        db_obj = db.query(self.model).filter(self.model.run_id == obj_in.run_id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_job_status_by_app_id(self, db: Session, minerva_application_id: int) -> str:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.application_id, self.model.run_id, self.model.status)
            .filter(self.model.deleted_at.is_(None), self.model.application_id == minerva_application_id)
            .order_by(self.model.created_at.desc())
            .first()
        )
        if db_obj is not None:
            app_job_status = db_obj[3]
        else:
            app_job_status = "N/A"
        return app_job_status


minerva_job_status = CRUDMinervaJobStatus(MinervaJobStatus)
