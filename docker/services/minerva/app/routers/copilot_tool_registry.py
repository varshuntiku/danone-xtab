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

from app.schemas.copilot_tool_registry import (
    CopilotToolRegistryCreatePayload,
    CopilotToolRegistryMetaData,
    CopilotToolRegistryUpdate,
)
from app.services.copilot_tool.copilot_tool_registry_service import (
    CopilotToolRegistryService,
)
from app.utils.auth.middleware import AuthMiddleware
from app.utils.config import get_settings
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer

settings = get_settings()
auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/tool-registry", status_code=200)
async def create_copilot_tool_registry(
    payload: CopilotToolRegistryCreatePayload,
    copilotToolRegistryService: CopilotToolRegistryService = Depends(CopilotToolRegistryService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolRegistryMetaData:
    try:
        return copilotToolRegistryService.create_registry(payload=payload, user_info=user_info)
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot tool registry  creation")


@router.put("/tool-registry/{tool_registry_id}", status_code=200)
async def update_copilot_tool_registry(
    tool_registry_id: int,
    payload: CopilotToolRegistryUpdate,
    copilotToolRegistryService: CopilotToolRegistryService = Depends(CopilotToolRegistryService),
) -> CopilotToolRegistryMetaData:
    try:
        return copilotToolRegistryService.update_registry(id=tool_registry_id, payload=payload)
    except HTTPException as e:
        logging.exception(e)
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in update Copilot tool registry")


@router.delete("/tool-registry/{tool_registry_id}", status_code=200)
async def delete_copilot_tool_registry(
    tool_registry_id: int, copilotToolRegistryService: CopilotToolRegistryService = Depends(CopilotToolRegistryService)
) -> bool:
    try:
        copilotToolRegistryService.delete_registry(id=tool_registry_id)
        return True
    except HTTPException as e:
        logging.exception(e)
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deleting Copilot tool registry")


@router.get("/tool-registry/list", status_code=200)
async def get_tool_registries(
    copilotToolRegistryService: CopilotToolRegistryService = Depends(CopilotToolRegistryService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotToolRegistryMetaData]:
    try:
        return copilotToolRegistryService.get_registries()
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot tool registry list")
