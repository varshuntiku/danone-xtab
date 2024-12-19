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
from app.models.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMapping,
)
from app.schemas.copilot_app_datasource_published_tool_mapping import (
    CopilotAppDatasourcePublishedToolMappingBase,
    CopilotAppDatasourcePublishedToolMappingCreate,
    CopilotAppDatasourcePublishedToolMappingUpdate,
)
from cachetools import TTLCache, cached
from sqlalchemy.orm import Session


def my_cache_key(*args, tool_id, **kwargs):
    return tool_id


tool_datasource_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)


class CRUDCopilotAppDatasourcePublishedToolMapping(
    CRUDBase[
        CopilotAppDatasourcePublishedToolMapping,
        CopilotAppDatasourcePublishedToolMappingCreate,
        CopilotAppDatasourcePublishedToolMappingUpdate,
    ]
):
    @cached(cache=tool_datasource_cache, key=my_cache_key)
    def get_all_tool_datasource(self, db: Session, tool_id: int) -> list[CopilotAppDatasourcePublishedToolMappingBase]:
        db_obj = (
            db.query(self.model)
            .with_entities(
                self.model.datasource_id, self.model.app_published_tool_id, self.model.config, self.model.key
            )
            .filter(self.model.app_published_tool_id == tool_id)
            .order_by(self.model.id.desc())
            .all()
        )

        db_obj_list = []
        for item in db_obj:
            db_obj_list.append(
                CopilotAppDatasourcePublishedToolMappingBase(
                    datasource_id=item.datasource_id,
                    app_published_tool_id=item.app_published_tool_id,
                    key=item.key,
                    config=item.config,
                )
            )

        return db_obj_list

    def is_exist(self, db: Session, tool_id: int) -> bool:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.datasource_id, self.model.app_published_tool_id, self.model.config)
            .filter(self.model.app_published_tool_id == tool_id)
            .order_by(self.model.id.desc())
            .first()
        )

        return False if db_obj is None else True

    def remove_by_tool_id_datasource_id(
        self, db: Session, *, tool_id: int, datasource_id: int
    ) -> Optional[CopilotAppDatasourcePublishedToolMapping]:
        db_obj = (
            db.query(self.model)
            .filter(self.model.app_published_tool_id == tool_id, self.model.datasource_id == datasource_id)
            .first()
        )
        db.delete(db_obj)
        db.commit()
        return db_obj

    def update(
        self, db: Session, *, tool_id: int, obj_in: CopilotAppDatasourcePublishedToolMappingCreate
    ) -> CopilotAppDatasourcePublishedToolMapping:
        db_obj = (
            db.query(self.model)
            .filter(self.model.app_published_tool_id == tool_id, self.model.datasource_id == obj_in.datasource_id)
            .one()
        )
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res


copilot_app_datasource_published_tool_mapping = CRUDCopilotAppDatasourcePublishedToolMapping(
    CopilotAppDatasourcePublishedToolMapping
)
