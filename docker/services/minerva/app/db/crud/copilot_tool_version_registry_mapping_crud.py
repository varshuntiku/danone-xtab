#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import json
from datetime import datetime
from typing import List

from app.db.crud.base import CRUDBase
from app.db.crud.copilot_tool_crud import CopilotTool
from app.db.crud.copilot_tool_version_crud import CopilotToolVersion
from app.models.copilot_app_published_tool_mapping import CopilotAppPublishedToolMapping
from app.models.copilot_tool_version_registry_mapping import (
    CopilotToolVersionRegistryMapping,
)
from app.models.nuclios_user import NucliOSUser
from app.schemas.copilot_tool_version_registry_mapping import (
    CopilotToolVersionRegistryMappingCreate,
    CopilotToolVersionRegistryMappingUpdate,
    ToolDeployStatusUpdatePayload,
)
from cachetools import TTLCache, cached
from dateutil.relativedelta import relativedelta
from sqlalchemy import and_, text
from sqlalchemy.orm import Session, aliased
from sqlalchemy.sql import case


def my_cache_key(*args, ids, **kwargs):
    return tuple(ids)


tool_deployment_urls_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)


class CRUDCopilotToolVersionRegistryMapping(
    CRUDBase[
        CopilotToolVersionRegistryMapping,
        CopilotToolVersionRegistryMappingCreate,
        CopilotToolVersionRegistryMappingUpdate,
    ]
):
    def update(
        self, db: Session, *, id: int, obj_in: CopilotToolVersionRegistryMappingUpdate
    ) -> CopilotToolVersionRegistryMapping:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj_res = super().update(db, db_obj=db_obj, obj_in=obj_in)
        return db_obj_res

    def get_tool_version_registry_mapping_list(self, db: Session, registry_id: int):
        return (
            db.query(self.model, CopilotToolVersion, CopilotTool)
            .filter(
                self.model.deprecated.is_not(True),
                self.model.deleted_at.is_(None),
                self.model.registry_id == registry_id,
            )
            .join(CopilotToolVersion, self.model.tool_version_id == CopilotToolVersion.id)
            .join(CopilotTool, CopilotToolVersion.tool_id == CopilotTool.id)
            .all()
        )

    def get_tool_version_registry_mapping(self, db: Session, id: int):
        return (
            db.query(self.model, CopilotToolVersion, CopilotTool)
            .filter(
                self.model.id == id,
            )
            .join(CopilotToolVersion, self.model.tool_version_id == CopilotToolVersion.id)
            .join(CopilotTool, CopilotToolVersion.tool_id == CopilotTool.id)
            .first()
        )

    def get_tool_version_registry_mapping_by_tool_version_id(
        self, db: Session, *, tool_version_id: int, registry_id: int
    ):
        return (
            db.query(self.model)
            .filter(
                self.model.tool_version_id == tool_version_id,
                self.model.registry_id == registry_id,
                self.model.deprecated.is_not(True),
                self.model.deleted_at.is_(None),
            )
            .first()
        )

    def update_multiple_tools_status(self, db: Session, payload: ToolDeployStatusUpdatePayload):
        ids = [i.id for i in payload.items]
        status_mapping = {}
        info_mapping = {}
        for el in payload.items:
            status_mapping[el.id] = el.deployment_status
            info_mapping[el.id] = text(f"CAST('{ el.info.json() if el.info else json.dumps({}) }' AS JSON)")
        result = (
            db.query(self.model)
            .filter(self.model.id.in_(ids))
            .update(
                {
                    self.model.deployment_status: case(
                        status_mapping,
                        value=self.model.id,
                    ),
                    self.model.info: case(
                        info_mapping,
                        value=self.model.id,
                    ),
                },
                synchronize_session=False,
            )
        )
        db.commit()
        return result

    @cached(cache=tool_deployment_urls_cache, key=my_cache_key)
    def get_tool_deployment_urls(self, db: Session, ids: List[id]):
        result = db.query(self.model.info, self.model.id).filter(self.model.id.in_(ids)).all()
        return result

    def get_tool_deployment_url(self, db: Session, id: id):
        result = db.query(self.model.info, self.model.id).filter(self.model.id == id).first()
        return result

    def soft_delete(
        self,
        db: Session,
        *,
        id: int,
    ) -> CopilotToolVersionRegistryMapping:
        db_obj = db.query(self.model).filter(self.model.id == id).one()
        db_obj.deleted_at = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_latest_version_by_tool_id(self, db: Session, *, tool_id: int):
        recent_version = (
            db.query(self.model.version)
            .join(CopilotToolVersion, CopilotToolVersion.id == self.model.tool_version_id)
            .filter(CopilotToolVersion.tool_id == tool_id)
            .order_by(self.model.created_at.desc())
            .first()
        )
        return recent_version or None

    def get_removable_tool_versions(self, db: Session) -> dict:
        ptm2 = aliased(CopilotAppPublishedToolMapping)

        result = (
            db.query(self.model, CopilotAppPublishedToolMapping)
            .outerjoin(CopilotAppPublishedToolMapping)  # Using the relationship with CopilotToolVersionRegistryMapping
            .outerjoin(
                ptm2,
                and_(
                    CopilotToolVersionRegistryMapping.id == ptm2.tool_version_registry_mapping_id,
                    ptm2.deleted_at.is_(None),
                ),
            )
            .filter(
                CopilotToolVersionRegistryMapping.deprecated.is_(True),
                CopilotToolVersionRegistryMapping.deleted_at.is_(None),
                ptm2.tool_version_registry_mapping_id.is_(None),
            )
            .order_by(CopilotToolVersionRegistryMapping.created_at.desc())
            .all()
        )
        return result

    def get_app_linked_deprecated_tools(self, db: Session) -> dict:
        result = (
            db.query(self.model, CopilotAppPublishedToolMapping, NucliOSUser)
            .join(
                CopilotAppPublishedToolMapping,
                self.model.id == CopilotAppPublishedToolMapping.tool_version_registry_mapping_id,
            )
            .join(NucliOSUser, NucliOSUser.id == self.model.created_by)
            .filter(
                self.model.deprecated.is_(True),
                self.model.deleted_at.is_(None),
                CopilotAppPublishedToolMapping.deleted_at.is_(None),
            )
            .order_by(CopilotToolVersionRegistryMapping.created_at.desc())
            .all()
        )
        return result

    def get_unused_published_tools(self, db: Session, interval: int) -> dict:
        now = datetime.utcnow()
        interval_ago = now - relativedelta(months=interval)
        result = (
            db.query(self.model, CopilotAppPublishedToolMapping, NucliOSUser, CopilotToolVersion, CopilotTool)
            .outerjoin(
                CopilotAppPublishedToolMapping,
                self.model.id == CopilotAppPublishedToolMapping.tool_version_registry_mapping_id,
            )
            .join(NucliOSUser, NucliOSUser.id == self.model.created_by)
            .join(CopilotToolVersion, CopilotToolVersion.id == self.model.tool_version_id)
            .join(CopilotTool, CopilotTool.id == CopilotToolVersion.tool_id)
            .filter(
                self.model.deprecated.is_(False),  # vrm.deprecated = false
                self.model.deleted_at.is_(None),  # vrm.deleted_at is null
                CopilotAppPublishedToolMapping.deleted_at.is_(None),  # ptm.deleted_at is null
                CopilotAppPublishedToolMapping.copilot_app_id.is_(None),  # ptm.copilot_app_id is null
                self.model.created_at <= interval_ago,
            )
            .all()
        )
        return result


copilot_tool_version_registry_mapping = CRUDCopilotToolVersionRegistryMapping(CopilotToolVersionRegistryMapping)
