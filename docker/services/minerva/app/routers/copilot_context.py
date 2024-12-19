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
import logging
from typing import Annotated, Any

from app.db.crud.copilot_context_crud import copilot_context
from app.dependencies.dependencies import get_db
from app.schemas.copilot_context_datasource_schema import (
    CopilotContextDatasourceExtended,
)
from app.schemas.copilot_context_schema import (
    CopilotContextDBBase,
    CopilotContextMetadata,
)
from app.services.copilot_context.copilot_context_service import CopilotContextService
from app.utils.auth.middleware import AuthMiddleware
from app.utils.config import get_settings
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

settings = get_settings()
auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/app/{copilot_app_id}/context", status_code=200)
async def create_app_context(
    copilot_app_id: int,
    payload: Annotated[str, Form()],
    new_documents: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    copilot_context_service: CopilotContextService = Depends(CopilotContextService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotContextMetadata:
    try:
        payload = json.loads(payload)

        context = copilot_context_service.create_context(
            copilot_app_id=copilot_app_id,
            creator_id=user_info["user_id"] if user_info.get("user_id", False) else None,
            payload_obj=payload,
            new_documents=new_documents if new_documents else [],
        )

        return context
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while configuring context for copilot app")


@router.get("/app/{copilot_app_id}/context-datasources", status_code=200)
async def get_app_context_datasources(
    copilot_app_id: int,
    context_id: int | None = None,
    copilot_context_service: CopilotContextService = Depends(CopilotContextService),
    user_info: dict = Depends(AuthMiddleware()),
) -> list[CopilotContextDatasourceExtended]:
    try:
        if context_id:
            return copilot_context_service.get_context_datasource_list(
                copilot_app_id=copilot_app_id, context_id=context_id
            )
        else:
            return copilot_context_service.get_app_context_datasource_list(copilot_app_id=copilot_app_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching context detail")


@router.get("/app/{copilot_app_id}/contexts", status_code=200)
async def get_app_context_list(
    copilot_app_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> list[CopilotContextMetadata]:
    try:
        app_context_list = copilot_context.get_copilot_app_context_list(db=db, copilot_app_id=copilot_app_id)
        return app_context_list
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching contexts for copilot app")


@router.put("/app/{copilot_app_id}/context/{context_id}", status_code=200)
async def update_app_context(
    copilot_app_id: int,
    context_id: int,
    payload: Annotated[str, Form()],
    deleted_documents: Annotated[str, Form()] = None,
    new_documents: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    copilot_context_service: CopilotContextService = Depends(CopilotContextService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> list[CopilotContextDatasourceExtended]:
    try:
        payload = json.loads(payload)
        return copilot_context_service.update_context(
            context_id=context_id,
            payload_obj=payload,
            new_documents=new_documents,
            deleted_documents=deleted_documents,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500, detail=e.detail if e.detail else "Error occurred in updating copilot app context"
        )


@router.delete("/app/{copilot_app_id}/context/{context_id}", status_code=200)
async def delete_app_context(
    copilot_app_id: int,
    context_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
    copilot_context_service: CopilotContextService = Depends(CopilotContextService),
) -> CopilotContextDBBase:
    try:
        return copilot_context_service.delete_context(copilot_app_id=copilot_app_id, context_id=context_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deleting context for copilot app")


@router.post("/context/{context_type}/validate", status_code=200)
async def validate_context_configuration(
    context_type: str,
    payload: dict,
    copilot_context_service: CopilotContextService = Depends(CopilotContextService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> Any:
    try:
        context_obj = copilot_context_service.validate_context_config(context_type=context_type, validation_obj=payload)
        return context_obj
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while validating configuration of context")
