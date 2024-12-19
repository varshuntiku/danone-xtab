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
from typing import Annotated

from app.db.crud.copilot_datasource_crud import copilot_datasource
from app.dependencies.dependencies import get_db
from app.schemas.copilot_datasource_schema import (
    AmazonS3Buckets,
    AzureBlobContainers,
    CopilotAmazonS3FileStoragePayload,
    CopilotAzureBlobFileStoragePayload,
    CopilotDatasourceDBBase,
    CopilotDatasourceExtended,
    CopilotDatasourceMetadata,
    CopilotDatasourceValidationConfig,
    CopilotDatasourceValidationPayload,
)
from app.services.copilot_datasource.copilot_datasource_service import (
    CopilotDatasourceService,
)
from app.utils.auth.middleware import AuthMiddleware
from app.utils.config import get_settings
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.security import HTTPBearer
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

settings = get_settings()
auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/datasource/{datasource_type}/validate", status_code=200)
async def validate_app_datasource_configuration(
    datasource_type: str,
    payload: CopilotDatasourceValidationPayload,
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotDatasourceValidationConfig:
    """Validates initial configuration for the app datasource.

    Args:
        copilot_app_id (int): id of the copilot app
        payload (dict): configuration of the datasource for the given copilot app id like connection string or access key and secret key, etc.
        copilot_datasource_service (CopilotDatasourceService, optional): _description_. Defaults to Depends(CopilotDatasourceService).
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(AuthMiddleware(fetch_user_id=True)).

    Raises:
        HTTPException: Raise exception if there is an error occurred while validating the datasource configuration
        HTTPException: _description_

    Returns:
        CopilotDatasourceValidationConfig: Returns validated datasource configuration object
    """
    try:
        datasource_obj = copilot_datasource_service.validate_datasource_config(
            datasource_type=datasource_type, validation_obj=payload
        )

        return datasource_obj
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while validating datasource configuration")


@router.get("/list/blob/containers", status_code=200)
async def fetch_blob_containers(
    file_storage_type: str,
    blob_connection_string: str,
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> AzureBlobContainers:
    try:
        blob_containers_obj = copilot_datasource_service.fetch_blob_datasource_containers(
            blob_storage_config=CopilotAzureBlobFileStoragePayload(
                file_storage_type=file_storage_type, blob_connection_string=blob_connection_string
            )
        )

        return blob_containers_obj
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while validating datasource configuration")


@router.get("/list/s3/buckets", status_code=200)
async def fetch_amazon_s3_buckets(
    file_storage_type: str,
    aws_access_key_id: str,
    aws_secret_access_key: str,
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> AmazonS3Buckets:
    try:
        s3_buckets_obj = copilot_datasource_service.fetch_amazon_s3_buckets(
            azure_storage_config=CopilotAmazonS3FileStoragePayload(
                file_storage_type=file_storage_type,
                aws_access_key_id=aws_access_key_id,
                aws_secret_access_key=aws_secret_access_key,
            )
        )

        return s3_buckets_obj
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while validating datasource configuration")


@router.post("/app/{copilot_app_id}/datasource", status_code=200)
async def create_app_datasource(
    copilot_app_id: int,
    payload: Annotated[str, Form()],
    new_documents: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotDatasourceMetadata:
    """Validates Creates a datasource for given copilot app id with the required configuration.

    Args:
        payload (dict): configuration of the datasource for the given copilot app id
        copilot_app_id (int): id of the copilot app
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(AuthMiddleware(fetch_user_id=True)).

    Raises:
        HTTPException: Raise exception if there is an error occurred while configuring the datasource for given copilot app

    Returns:
        CopilotDatasourceMetadata: Returns details of configured datasource for the given copilot app
    """
    try:
        payload = json.loads(payload)

        datasource = copilot_datasource_service.create_datasource(
            copilot_app_id=copilot_app_id,
            creator_id=user_info["user_id"] if user_info.get("user_id", False) else None,
            payload_obj=payload,
            new_documents=new_documents if new_documents else [],
        )

        return datasource
    except OperationalError:
        raise HTTPException(status_code=500, detail="Error connecting to database")
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while configuring datasource for copilot app")


@router.get("/app/{copilot_app_id}/datasource/{datasource_id}", status_code=200)
async def get_app_datasource(
    copilot_app_id: int,
    datasource_id: int,
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    user_info: dict = Depends(AuthMiddleware()),
) -> CopilotDatasourceExtended:
    try:
        return copilot_datasource_service.get_datasource(copilot_app_id=copilot_app_id, datasource_id=datasource_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching datasource for copilot app")


@router.get("/app/{copilot_app_id}/datasources", status_code=200)
async def get_app_all_datasources(
    copilot_app_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> list[CopilotDatasourceMetadata]:
    try:
        app_datasources = copilot_datasource.get_copilot_app_datasources(db=db, copilot_app_id=copilot_app_id)
        return app_datasources
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching datasources for copilot app")


@router.put("/app/{copilot_app_id}/datasource/{datasource_id}", status_code=200)
async def update_copilot_app_datasource(
    copilot_app_id: int,
    datasource_id: int,
    payload: Annotated[str, Form()],
    deleted_documents: Annotated[str, Form()] = None,
    new_documents: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> CopilotDatasourceExtended:
    try:
        payload = json.loads(payload)
        return copilot_datasource_service.update_datasource(
            datasource_id=datasource_id,
            payload_obj=payload,
            new_documents=new_documents,
            deleted_documents=deleted_documents,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500, detail=e.detail if e.detail else "Error occurred in updating Copilot app datasource"
        )


@router.delete("/app/{copilot_app_id}/datasource/{datasource_id}", status_code=200)
async def delete_app_datasource(
    copilot_app_id: int,
    datasource_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
    copilot_datasource_service: CopilotDatasourceService = Depends(CopilotDatasourceService),
) -> CopilotDatasourceDBBase:
    try:
        return copilot_datasource_service.delete_datasource(copilot_app_id=copilot_app_id, datasource_id=datasource_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deleting datasource for copilot app")
