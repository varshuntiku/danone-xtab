#
# Author: Mathco Innovation Team
# TheMathCompany, Inc. (c) 2023
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without -
# the express permission of TheMathCompany, Inc.
#

import logging

from app.dependencies.dependencies import get_db
from app.schemas.copilot_orchestrator_schema import (
    CopilotOrchestratorCreate,
    CopilotOrchestratorCreatePayload,
    CopilotOrchestratorMetadata,
    CopilotOrchestratorUpdate,
)
from app.services.copilot_orchestrator.copilot_orchestrator_service import (
    CopilotOrchestratorService,
)
from app.utils.auth.middleware import AuthMiddleware
from app.utils.config import get_settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

settings = get_settings()
auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/orchestrator", status_code=200)
async def create_copilot_orchestrator(
    payload: CopilotOrchestratorCreatePayload,
    copilot_orchestrator_service: CopilotOrchestratorService = Depends(CopilotOrchestratorService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotOrchestratorMetadata:
    try:
        obj_in = CopilotOrchestratorCreate(
            name=payload.name or "",
            identifier=payload.identifier or payload.name or "",
            desc=payload.desc or "",
            config=payload.config or {},
            disabled=payload.disabled or False,
        )
        result = copilot_orchestrator_service.create_orchestrator(obj_in=obj_in)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot orchestrator creation")


@router.put("/orchestrator/{orchestrator_id}", status_code=200)
async def update_copilot_orchestrator(
    orchestrator_id: int,
    payload: CopilotOrchestratorUpdate,
    copilot_orchestrator_service: CopilotOrchestratorService = Depends(CopilotOrchestratorService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotOrchestratorMetadata:
    try:
        return copilot_orchestrator_service.update_orchestrator(id=orchestrator_id, obj_in=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in update Copilot orchestrator")


@router.get("/orchestrator/list", status_code=200)
async def get_orchestrators(
    ignore_disabled: bool = False,
    copilot_orchestrator_service: CopilotOrchestratorService = Depends(CopilotOrchestratorService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotOrchestratorMetadata]:
    try:
        result = copilot_orchestrator_service.get_orchestrators(ignore_disabled=ignore_disabled)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot orchestrator list")


@router.get("/orchestrator/{orchestrator_id}", status_code=200)
async def get_orchestrator(
    orchestrator_id: int,
    copilot_orchestrator_service: CopilotOrchestratorService = Depends(CopilotOrchestratorService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotOrchestratorMetadata:
    try:
        result = copilot_orchestrator_service.get_orchestrator(id=orchestrator_id)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot orchestrator")


@router.delete("/orchestrator/{orchestrator_id}", status_code=200)
async def delete_orchestrator(
    orchestrator_id: int,
    copilot_orchestrator_service: CopilotOrchestratorService = Depends(CopilotOrchestratorService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> int:
    try:
        result = copilot_orchestrator_service.remove_orchestrator(id=orchestrator_id)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in remove Copilot orchestrator")
