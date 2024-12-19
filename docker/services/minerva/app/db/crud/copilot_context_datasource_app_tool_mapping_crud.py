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
from app.models.copilot_context_datasource_app_tool_mapping import (
    CopilotContextDatasourceAppToolMapping,
)
from app.schemas.copilot_context_datasource_app_tool_mapping_schema import (
    CopilotContextDatasourceAppToolMappingBase,
    CopilotContextDatasourceAppToolMappingCreate,
    CopilotContextDatasourceAppToolMappingUpdate,
)
from cachetools import TTLCache, cached
from sqlalchemy.orm import Session


def my_cache_key(*args, tool_id, **kwargs):
    return tool_id


tool_context_datasource_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)


class CRUDCopilotContextDatasourceAppToolMapping(
    CRUDBase[
        CopilotContextDatasourceAppToolMapping,
        CopilotContextDatasourceAppToolMappingCreate,
        CopilotContextDatasourceAppToolMappingUpdate,
    ]
):
    @cached(cache=tool_context_datasource_cache, key=my_cache_key)
    def get_all_tool_context_datasource(
        self, db: Session, tool_id: int
    ) -> list[CopilotContextDatasourceAppToolMappingBase]:
        db_obj = (
            db.query(self.model)
            .with_entities(self.model.context_datasource_id, self.model.app_tool_id, self.model.config)
            .filter(self.model.app_tool_id == tool_id)
            .order_by(self.model.id.desc())
            .all()
        )

        db_obj_list = []
        for item in db_obj:
            db_obj_list.append(
                CopilotContextDatasourceAppToolMappingBase(
                    context_datasource_id=item.context_datasource_id,
                    app_tool_id=item.app_tool_id,
                    config=item.config,
                )
            )

        return db_obj_list

    def remove_by_tool_id_context_datasource_id(
        self, db: Session, *, tool_id: int, context_datasource_id: int
    ) -> Optional[CopilotContextDatasourceAppToolMapping]:
        db_obj = (
            db.query(self.model)
            .filter(self.model.app_tool_id == tool_id, self.model.context_datasource_id == context_datasource_id)
            .first()
        )
        db.delete(db_obj)
        db.commit()
        return db_obj

    def is_context_datasource_app_tool_mapping_active(self, db: Session, *, context_datasource_id: int):
        db_obj = (
            db.query(self.model)
            .filter(self.model.context_datasource_id == context_datasource_id, self.model.deleted_at.is_(None))
            .order_by(self.model.id.desc())
            .first()
        )
        return db_obj

    def update(
        self, db: Session, *, tool_id: int, obj_in: CopilotContextDatasourceAppToolMappingCreate
    ) -> CopilotContextDatasourceAppToolMapping:
        db_obj = (
            db.query(self.model)
            .filter(self.model.app_tool_id == tool_id, self.model.context_datasource_id == obj_in.context_datasource_id)
            .one()
        )
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res


copilot_context_datasource_app_tool_mapping = CRUDCopilotContextDatasourceAppToolMapping(
    CopilotContextDatasourceAppToolMapping
)
