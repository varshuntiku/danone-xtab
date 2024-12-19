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

from app.db.crud.base import CRUDBase
from app.models.copilot_context import CopilotContext
from app.models.copilot_context_datasource import CopilotContextDatasource
from app.schemas.copilot_context_datasource_schema import (
    CopilotContextDatasourceCreate,
    CopilotContextDatasourceUpdate,
)
from cachetools import TTLCache, cached
from sqlalchemy.orm import Session


def my_cache_key(*args, context_datasource_id, **kwargs):
    return context_datasource_id


context_datasource_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)


class CRUDCopilotContextDatasource(
    CRUDBase[CopilotContextDatasource, CopilotContextDatasourceCreate, CopilotContextDatasourceUpdate]
):
    @cached(cache=context_datasource_cache, key=my_cache_key)
    def get(self, db: Session, context_datasource_id: int):
        db_obj_res = super().get(db, id=context_datasource_id)
        return db_obj_res

    def update(self, db: Session, *, id: int, obj_in: CopilotContextDatasourceUpdate) -> CopilotContextDatasource:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        context_datasource_cache.pop(id, None)
        return db_obj_res

    def get_datasources_by_context_id(self, db: Session, context_id: int):
        db_obj = db.query(self.model).filter(self.model.deleted_at.is_(None), self.model.context_id == context_id)
        return db_obj

    def get_datasources_by_app_id(self, db: Session, copilot_app_id: int):
        db_obj = (
            db.query(self.model, CopilotContext)
            .filter(
                self.model.deleted_at.is_(None),
                CopilotContext.deleted_at.is_(None),
                CopilotContext.copilot_app_id == copilot_app_id,
            )
            .join(CopilotContext, CopilotContext.id == self.model.context_id)
            .order_by(CopilotContext.created_at.desc())
            .all()
        )
        return db_obj

    def soft_delete(self, db: Session, id: int):
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        context_datasource_cache.pop(id, None)
        return db_obj


copilot_context_datasource = CRUDCopilotContextDatasource(CopilotContextDatasource)
