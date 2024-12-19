#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

from app.db.crud.copilot_orchestrator_crud import copilot_orchestrator
from app.dependencies.dependencies import get_db
from app.schemas.copilot_orchestrator_schema import (
    CopilotOrchestratorCreate,
    CopilotOrchestratorMetadata,
    CopilotOrchestratorUpdate,
)
from app.utils.config import get_settings
from cachetools import TTLCache, cached
from fastapi import Depends


def my_cache_key(*args, id, **kwargs):
    return id


orchestrator_cache = TTLCache(maxsize=640 * 1024 * 10, ttl=60 * 60)

settings = get_settings()


class CopilotOrchestratorService:
    def __init__(self, db=Depends(get_db)):
        self.db = db

    def create_orchestrator(self, obj_in: CopilotOrchestratorCreate) -> CopilotOrchestratorMetadata:
        result = copilot_orchestrator.create(db=self.db, obj_in=obj_in)
        return CopilotOrchestratorMetadata(
            id=result.id,
            name=result.name,
            desc=result.desc,
            config=result.config,
            disabled=bool(result.disabled),
            identifier=result.identifier,
        )

    def update_orchestrator(self, id: int, obj_in: CopilotOrchestratorUpdate) -> CopilotOrchestratorMetadata:
        result = copilot_orchestrator.update(db=self.db, id=id, obj_in=obj_in)
        orchestrator_cache.pop(id, None)
        return CopilotOrchestratorMetadata(
            id=result.id,
            name=result.name,
            desc=result.desc,
            config=result.config,
            disabled=bool(result.disabled),
            identifier=result.identifier,
        )

    def get_orchestrators(self, ignore_disabled: bool = False) -> list[CopilotOrchestratorMetadata]:
        if ignore_disabled:
            return copilot_orchestrator.get_all_orchestrators(db=self.db)
        else:
            return copilot_orchestrator.get_enabled_orchestrators(db=self.db)

    @cached(cache=orchestrator_cache, key=my_cache_key)
    def get_orchestrator(self, id: int) -> CopilotOrchestratorMetadata:
        result = copilot_orchestrator.get(db=self.db, id=id)
        return CopilotOrchestratorMetadata(
            id=result.id,
            name=result.name,
            identifier=result.identifier,
            desc=result.desc,
            config=result.config,
            disabled=bool(result.disabled),
        )

    def remove_orchestrator(self, id: int) -> int:
        orchestrator_cache.pop(id, None)
        result = copilot_orchestrator.soft_delete(db=self.db, id=id)
        return result.id
