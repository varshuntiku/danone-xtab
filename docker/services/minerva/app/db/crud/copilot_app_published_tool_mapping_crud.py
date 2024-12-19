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
from app.db.crud.copilot_tool_crud import CopilotTool
from app.db.crud.copilot_tool_version_crud import CopilotToolVersion
from app.db.crud.copilot_tool_version_registry_mapping_crud import (
    CopilotToolVersionRegistryMapping,
)
from app.models.copilot_app_published_tool_mapping import CopilotAppPublishedToolMapping
from app.schemas.copilot_app_published_tool_mapping import (
    CopilotAppPublishedToolMappingCreate,
    CopilotAppPublishedToolMappingMetaData,
    CopilotAppPublishedToolMappingUpdate,
)
from cachetools import TTLCache, cached
from sqlalchemy.orm import Session


def my_cache_key(*args, copilot_app_id, **kwargs):
    return copilot_app_id


copilot_app_tool_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)


class CRUDCopilotAppPublishedToolMapping(
    CRUDBase[
        CopilotAppPublishedToolMapping,
        CopilotAppPublishedToolMappingCreate,
        CopilotAppPublishedToolMappingUpdate,
    ]
):
    @cached(cache=copilot_app_tool_cache, key=my_cache_key)
    def get_all(self, db: Session, *, copilot_app_id: int) -> list[CopilotAppPublishedToolMappingMetaData]:
        data = (
            db.query(self.model)
            .filter(self.model.deleted_at.is_(None), self.model.copilot_app_id == copilot_app_id)
            .order_by(self.model.created_at.desc())
            .all()
        )
        return [
            CopilotAppPublishedToolMappingMetaData(
                id=el.id,
                copilot_app_id=copilot_app_id,
                tool_version_registry_mapping_id=el.tool_version_registry_mapping_id,
                name=el.name,
                desc=el.desc,
                status=el.status,
                config=el.config,
                preprocess_config=el.preprocess_config,
                input_params=el.input_params,
            )
            for el in data
        ]

    def get_extended(self, db: Session, *, id: int):
        return (
            db.query(self.model, CopilotToolVersionRegistryMapping, CopilotToolVersion, CopilotTool)
            .filter(self.model.deleted_at.is_(None), self.model.id == id)
            .join(
                CopilotToolVersionRegistryMapping,
                self.model.tool_version_registry_mapping_id == CopilotToolVersionRegistryMapping.id,
            )
            .join(CopilotToolVersion, CopilotToolVersionRegistryMapping.tool_version_id == CopilotToolVersion.id)
            .join(CopilotTool, CopilotToolVersion.tool_id == CopilotTool.id)
            .order_by(self.model.created_at.desc())
            .first()
        )

    def get_all_extended(self, db: Session, *, copilot_app_id: int):
        return (
            db.query(self.model, CopilotToolVersionRegistryMapping, CopilotToolVersion, CopilotTool)
            .filter(self.model.deleted_at.is_(None), self.model.copilot_app_id == copilot_app_id)
            .join(
                CopilotToolVersionRegistryMapping,
                self.model.tool_version_registry_mapping_id == CopilotToolVersionRegistryMapping.id,
            )
            .join(CopilotToolVersion, CopilotToolVersionRegistryMapping.tool_version_id == CopilotToolVersion.id)
            .join(CopilotTool, CopilotToolVersion.tool_id == CopilotTool.id)
            .order_by(self.model.created_at.desc())
            .all()
        )

    def update(
        self, db: Session, *, id: int, obj_in: CopilotAppPublishedToolMappingUpdate
    ) -> CopilotAppPublishedToolMapping:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def soft_delete(self, db: Session, *, id: int) -> CopilotAppPublishedToolMapping:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_apps_by_tool_version_registry_mapping_id(
        self, db: Session, *, tool_version_registry_mapping_id: int
    ) -> list:
        db_obj = (
            db.query(self.model)
            .filter(
                self.model.tool_version_registry_mapping_id == tool_version_registry_mapping_id,
                self.model.deleted_at.is_(None),
            )
            .all()
        )
        return db_obj


copilot_app_published_tool_mapping = CRUDCopilotAppPublishedToolMapping(CopilotAppPublishedToolMapping)
