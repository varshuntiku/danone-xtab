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
from app.models.copilot_app import CopilotApp
from app.models.copilot_app_published_tool_mapping import CopilotAppPublishedToolMapping
from app.schemas.copilot_app_schema import (
    CopilotAppCreate,
    CopilotAppMeta,
    CopilotAppUpdate,
)
from sqlalchemy.orm import Session


class CRUDCopilotApplication(CRUDBase[CopilotApp, CopilotAppCreate, CopilotAppUpdate]):
    def update(self, db: Session, *, id: int, obj_in: CopilotAppUpdate) -> CopilotApp:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_copilot_apps(self, db: Session) -> List[CopilotAppMeta]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.id, self.model.name, self.model.desc)
            .filter(self.model.deleted_at.is_(None))
            .filter(self.model.is_test.is_not(True))
            .all()
        )
        db_obj = [{"name": app.name, "desc": app.desc, "id": app.id} for app in db_obj]
        return db_obj

    def get_copilot_apps_by_published_tool(self, db: Session, published_tool_id: int) -> List[CopilotAppMeta]:
        db_obj = (
            db.query(CopilotAppPublishedToolMapping, self.model)
            .filter(CopilotAppPublishedToolMapping.tool_version_registry_mapping_id == published_tool_id)
            .join(self.model, self.model.id == CopilotAppPublishedToolMapping.copilot_app_id)
            .filter(self.model.deleted_at.is_(None))
            .distinct(self.model.id)
            .all()
        )
        apps = []
        for items in db_obj:
            apps.append(items[1])
        return apps

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotApp:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


copilot_app = CRUDCopilotApplication(CopilotApp)
