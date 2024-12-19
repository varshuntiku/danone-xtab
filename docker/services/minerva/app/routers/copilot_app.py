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
from typing import Annotated, List

from app.db.crud.copilot_app_crud import copilot_app
from app.dependencies.dependencies import get_db
from app.schemas.copilot_app_published_tool_mapping import (
    CopilotAppPublishedToolMappingCreatePayload,
    CopilotAppPublishedToolMappingMetaData,
    CopilotAppPublishedToolMappingMetaDataExtended,
    CopilotAppPublishedToolMappingUpdatePayload,
    CopilotAppPublishedToolMappingUpdateStatusPayload,
    UpgradeCopilotAppPublishedToolPayload,
)
from app.schemas.copilot_app_schema import (
    CopilotAppCreate,
    CopilotAppCreatePayload,
    CopilotAppDBBase,
    CopilotAppMeta,
    CopilotAppMetaExtended,
    CopilotAppUpdate,
)
from app.schemas.copilot_conversation_schema import (
    CopilotConversationUpdatePayload,
    CopilotConversationUpdateResponse,
)
from app.schemas.copilot_conversation_window_schema import (
    ConversationWindowMetadata,
    CopilotConversationWindowUpdatePayload,
)
from app.schemas.llm_deployed_model_schema import (
    LLMDeployedModelCreatePayload,
    LLMDeployedModelMetaData,
    LLMDeployedModelResponse,
    LLMDeployedModelUpdatePayload,
    LLMModelInfo,
)
from app.schemas.llm_model_registry_schema import (
    ModelRegistryCreatePayload,
    ModelRegistryResponse,
)
from app.schemas.llm_model_type_schema import ModelTypeCreatePayload, ModelTypeResponse
from app.schemas.services_schema import ConversationResponse
from app.services.copilot_app.copilot_app_service import CopilotAppService
from app.services.copilot_llm.copilot_llm_service import CopilotLLMService
from app.utils.auth.middleware import AuthMiddleware, URIAuthMiddleware, validate_copilot_tool_auth_token
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile, Request
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/app", status_code=200)
async def create_copilot_app(
    payload: CopilotAppCreatePayload,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotAppMetaExtended:
    """Creates a copilot app with the required configuration.

    Args:
        payload (CopilotAppCreate): configuration to create a copilot app
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(validate_user).

    Raises:
        HTTPException: Raise exception if there is an error occurred while copilot app creation

    Returns:
        CopilotAppMetaExtended: Returns details of created copilot app
    """
    try:
        app_obj = CopilotAppCreate(
            name=payload.name,
            desc=payload.desc,
            config=payload.config,
            created_by=user_info.get("user_id", None),
            orchestrator_id=payload.orchestrator_id,
            orchestrator_config=payload.orchestrator_config,
            is_test=bool(payload.is_test),
        )
        app = copilot_app.create(db, obj_in=app_obj)
        return CopilotAppMetaExtended(
            name=app.name,
            desc=app.desc,
            config=app.config,
            id=app.id,
            orchestrator_config=app.orchestrator_config,
            orchestrator_id=app.orchestrator_id,
            is_test=bool(app.is_test),
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot app creation")


@router.post("/app/{copilot_app_id}/avatar", status_code=200)
async def upload_copilot_avatar(
    copilot_app_id: int,
    avatar: Annotated[list[UploadFile], File(description="Multiple files as UploadFile")] = [],
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> dict:
    """Add an avatar to copilot application."""
    try:
        url = copilotAppService.upload_copilot_avatar(copilot_app_id=copilot_app_id, file=avatar[0])
        return {"message": "Upload successfully", "url": url}
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while ")


@router.get("/app/{copilot_app_id}", status_code=200)
async def get_copilot_app(
    copilot_app_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> CopilotAppMetaExtended:
    """Fetch details of given copilot app id

    Args:
        copilot_app_id (int): id of copilot app
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(validate_user).

    Raises:
        HTTPException: Raise exception if there is an error occurred while fetching details of copilot app

    Returns:
        CopilotAppMetaExtended: Return details of the app for the given copilot app id
    """
    try:
        app = copilot_app.get(db=db, id=copilot_app_id)
        return CopilotAppMetaExtended(
            name=app.name,
            desc=app.desc,
            config=app.config,
            id=app.id,
            orchestrator_id=app.orchestrator_id,
            orchestrator_config=app.orchestrator_config,
            is_test=bool(app.is_test),
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching copilot app")


@router.put("/app/{copilot_app_id}", status_code=200)
async def update_copilot_app(
    copilot_app_id: int,
    payload: CopilotAppUpdate,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotAppDBBase:
    """Update the copilot app for the given app id

    Args:
        copilot_app_id (int): id of the copilot application
        payload (CopilotAppUpdate): detail of copilot app that needs to be updated
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(validate_user).

    Raises:
        HTTPException: Raise exception if there is an error occurred while updating details of copilot app

    Returns:
        CopilotAppDBBase: Returns updated details of the give copilot app id
    """
    try:
        return copilotAppService.update_copilot_app(copilot_app_id=copilot_app_id, obj_in=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in updating Copilot app")


@router.delete("/app/{copilot_app_id}", status_code=200)
async def delete_copilot_app(
    copilot_app_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> int:
    """Deletes(Soft delete) the copilot app for the given app id

    Args:
        copilot_app_id (int): id of the copilot application that needs to be deleted
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(validate_user).

    Raises:
        HTTPException: Raise exception if there is an error occurred while deleting copilot app

    Returns:
        int: deleted app id
    """
    try:
        # TODO: check if datasource needs to be deleted in cascade and files when datasource type is upload
        return copilotAppService.soft_delete(copilot_app_id=copilot_app_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in deleting Copilot app")


@router.get("/apps", status_code=200)
async def get_copilot_apps(
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
) -> list[CopilotAppMeta]:
    """Returns list of copilot apps along with its config

    Args:
        db (Session, optional): _description_. Defaults to Depends(get_db).
        user_info (dict, optional): _description_. Defaults to Depends(validate_user).

    Raises:
        HTTPException: Raise exception if there is an error occurred while fetching copilot apps list

    Returns:
        list[CopilotAppMetaExtended]: Returns list of copilot app along with its configuration
    """
    try:
        return copilot_app.get_copilot_apps(db=db)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching copilot apps")


@router.post("/app/{copilot_app_id}/tool", status_code=200)
async def add_tool_to_copilot_app(
    copilot_app_id: int,
    payload: CopilotAppPublishedToolMappingCreatePayload,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotAppPublishedToolMappingMetaData:
    try:
        return await copilotAppService.add_tool(copilot_app_id=copilot_app_id, copilot_tool_obj=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while adding tool to copilot app")


@router.get("/app/{copilot_app_id}/tool/list", status_code=200)
async def get_copilot_app_tools(
    copilot_app_id: int,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> list[CopilotAppPublishedToolMappingMetaDataExtended]:
    try:
        return copilotAppService.get_all_tools(copilot_app_id=copilot_app_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching all mapped tools for a copilot app")


@router.get("/app-tool/{copilot_app_tool_id}", status_code=200)
async def get_copilot_app_tool(
    copilot_app_tool_id: int,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotAppPublishedToolMappingMetaDataExtended:
    try:
        return copilotAppService.get_copilot_app_tool(copilot_app_tool_id=copilot_app_tool_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching tool for a copilot app")


@router.put("/app-tool/{copilot_app_tool_id}", status_code=200)
async def update_copilot_app_tool_mapping(
    copilot_app_tool_id: int,
    payload: CopilotAppPublishedToolMappingUpdatePayload,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotAppPublishedToolMappingMetaData:
    try:
        return await copilotAppService.update_tool(copilot_app_tool_id=copilot_app_tool_id, update_obj=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating tool to copilot app mapping")


@router.put("/app-tool/{copilot_app_tool_id}/status", status_code=200)
async def update_copilot_app_tool_mapping_status(
    copilot_app_tool_id: int,
    payload: CopilotAppPublishedToolMappingUpdateStatusPayload,
    user_info: dict = Depends(validate_copilot_tool_auth_token),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotAppPublishedToolMappingMetaData:
    try:
        return copilotAppService.update_tool_status(copilot_app_tool_id=copilot_app_tool_id, update_obj=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating tool to copilot app mapping")


@router.delete("/app-tool/{app_tool_mapping_id}", status_code=200)
async def delete_copilot_app_tool_mapping(
    app_tool_mapping_id: int,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> int:
    try:
        return copilotAppService.delete_tool(app_tool_mapping_id=app_tool_mapping_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deleting tool to copilot app mapping")


@router.post("/app/{copilot_app_id}/deploy", status_code=200)
async def deploy_copilot_app(
    copilot_app_id: int,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> int:
    try:
        result = copilotAppService.deploy_app(copilot_app_id=copilot_app_id, user_info=user_info)
        return result.id
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while deploying application")


@router.get("/app/{copilot_app_id}/query_audio", status_code=200)
async def get_audio_output(
    copilot_app_id: int,
    text_to_audio: str = "",
    restructure_text: str = "",
    user_info: dict = Depends(URIAuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
):
    """
    Query audio agent to extract bytes in stream.
    """
    try:
        if not text_to_audio:
            raise HTTPException(status_code=400, detail="Text to convert to audio must be present")
        return StreamingResponse(
            copilotAppService.query_audio(
                copilot_app_id=copilot_app_id,
                text_to_audio=text_to_audio,
                restructure_text=restructure_text,
            ),
            media_type="audio/mpeg",
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500, detail="Error occurred while querying audio feature in copilot application"
        )


@router.post("/app/{copilot_app_id}/query", status_code=200)
async def query_copilot_app(
    copilot_app_id: int,
    user_query: str = Form(""),
    query_trace_id: str = Form(None),
    window_id: str = Form("0"),
    skip_conversation_window: str = Form(""),
    input_mode: str = Form("text"),
    extra_query_param: str = Form(""),
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
    payload: str = Form(None),
    query_datasource: List[UploadFile] = File([]),
    query_type: str = Form(""),
):
    """
    Query copilot agent with the user's input along with the minerva application id
    query_trace_id to be used only for socket connection and emitting the steps progress
    """
    try:
        if not user_query and not query_datasource:
            raise HTTPException(status_code=400, detail="Either user_query or query_datasource must be provided.")
        return StreamingResponse(
            copilotAppService.query_app(
                copilot_app_id=copilot_app_id,
                user_info=user_info,
                user_query=user_query,
                query_trace_id=query_trace_id,
                window_id=int(window_id),
                user_form_input=json.loads(payload) if payload else {},
                skip_conversation_window=skip_conversation_window,
                input_mode=input_mode,
                extra_query_param=extra_query_param,
                query_datasource=query_datasource if query_datasource else [],
                query_type=query_type,
            ),
            media_type="application/json",
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while querying copilot application")


@router.post("/conversation/{conversation_id}", status_code=200)
async def update_conversation(
    conversation_id: int,
    request_body: CopilotConversationUpdatePayload,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> CopilotConversationUpdateResponse:
    """
    Update a conversation with this api to update the feedback or pin column
    """
    try:
        result = copilotAppService.update_conversation(
            conversation_id=conversation_id,
            obj_in=request_body,
        )
        return CopilotConversationUpdateResponse(
            id=result.id,
            feedback=result.feedback or False,
            pinned=result.pinned or False,
            comment=result.comment,
            output=result.copilot_response,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating the conversation record")


@router.get("/app/{copilot_app_id}/conversation-windows", status_code=200)
async def get_conversation_windows(
    copilot_app_id: int,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> list[ConversationWindowMetadata]:
    """
    Returns list of conversation window for an copilot application and user
    """
    try:
        return copilotAppService.get_conversation_windows(copilot_app_id=copilot_app_id, user_info=user_info)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching conversation windows")


@router.put("/conversation-window/{window_id}", status_code=200)
async def update_conversation_window(
    window_id: int,
    window_obj: CopilotConversationWindowUpdatePayload,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> ConversationWindowMetadata:
    """
    Returns list of conversation window for an copilot application and user
    """
    try:
        return copilotAppService.update_conversation_window(window_id=window_id, window_obj=window_obj)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating conversation window")


@router.delete("/conversation-window/{window_id}", status_code=200)
async def delete_conversation_window(
    window_id: int,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> int:
    """
    Returns list of conversation window for an copilot application and user
    """
    try:
        return copilotAppService.delete_conversation_window(window_id=window_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500,
            detail="Error occured while deleting the conversation window",
        )


@router.get("/app/{copilot_app_id}/conversations", status_code=200)
async def get_conversations(
    copilot_app_id: int,
    window_id: int = None,
    query_offset: int = 0,
    query_limit: int = 999,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> ConversationResponse:
    """
    Return user conversation history for a specific copilot application id.
    """
    try:
        return copilotAppService.get_conversations(
            copilot_app_id=copilot_app_id,
            window_id=window_id,
            query_offset=query_offset,
            query_limit=query_limit,
            user_info=user_info,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching user conversations")


@router.post("/app/upgrade-tool", status_code=200)
async def upgrade_tool_version(
    payload: UpgradeCopilotAppPublishedToolPayload,
    user_info: dict = Depends(AuthMiddleware()),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
) -> bool:
    """
    This api shifts a published tool to another if they are compatible
    """
    try:
        copilotAppService.upgrade_published_tool_for_copilot_app(payload=payload)
        return True
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in shifting tool in copilot app")


@router.get("/llm-models/list", status_code=200)
async def get_llm_deployed_models(
    search: str = "",
    approval_status: str = "approved",
    status: str = "Completed",
    user_info: dict = Depends(AuthMiddleware()),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> List[LLMDeployedModelMetaData]:
    """
    This api fetches list of llm deployed models
    """
    try:
        return copilotLLMService.get_llm_deployed_models(search=search, status=status, approval_status=approval_status)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500,
            detail="Error occured in fetching llm-models",
        )


@router.post("/llm-model/create", status_code=201)
async def create_llm_deployed_model(
    payload: LLMDeployedModelCreatePayload,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> LLMDeployedModelResponse:
    """
    This api creates new llm deployed model\n\n

    Note: **model_id** is the ID of llm_model_registry table. You can use existing IDs or create a new entry in the llm_model_registry table using create llm model registry api.
    """
    try:
        return copilotLLMService.create_llm_deployed_model(payload=payload, user_info=user_info)
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in creating LLM deployed model")


@router.put("/llm-model/{llm_model_id}", status_code=200)
async def update_llm_deployed_model(
    llm_model_id: int,
    payload: LLMDeployedModelUpdatePayload,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> LLMDeployedModelResponse:
    """
    This api creates new llm deployed model\n\n

    Note: **model_id** is the ID of llm_model_registry table. You can use existing IDs or create a new entry in the llm_model_registry table using create llm model registry api.
    """
    try:
        return copilotLLMService.update_llm_deployed_model(
            payload=payload, user_info=user_info, llm_model_id=llm_model_id
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in updating LLM deployed model")


@router.delete("/llm-model/{llm_model_id}", status_code=200, include_in_schema=False)
async def delete_llm_deployed_model(
    llm_model_id: int,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> dict:
    try:
        return copilotLLMService.delete_llm_deployed_model(llm_model_id=llm_model_id, user_id=user_info["user_id"])
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in deleting LLM deployed model")


@router.post("/llm-model-registry", status_code=201)
async def create_llm_model_registry(
    payload: ModelRegistryCreatePayload,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> ModelRegistryResponse:
    """
    This api creates new llm model registry\n\n

    Note: **model_type** should be in this format "text-to-text" and should be similar to any of the types in llm_model_type table.
    """
    try:
        res = copilotLLMService.create_llm_model_registry(payload=payload, user_info=user_info)
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in creating LLM deployed model")


@router.post("/llm-model-type", status_code=201)
async def create_llm_model_type(
    payload: ModelTypeCreatePayload,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> ModelTypeResponse:
    """
    This api creates new llm model type
    """
    try:
        res = copilotLLMService.create_llm_model_type(payload=payload, user_info=user_info)
        return res
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in creating LLM model type")


@router.get("/video")
async def get_video_stream_and_headers(
    request: Request,
    url: str = Query(..., alias="src_url"),
    start_time: int = Query(0, alias="start_time"),
    copilotAppService: CopilotAppService = Depends(CopilotAppService),
    user_info: dict = Depends(URIAuthMiddleware())
):
    try:
        media_range = request.headers.get("range")
        video_stream, headers = await copilotAppService.get_video_stream_and_headers(
            url=url, start_time=start_time, range=media_range
        )
        return StreamingResponse(video_stream.chunks(), headers=headers, status_code=206)

    except Exception as e:
        logging.exception("Error streaming video", e)
        raise HTTPException(status_code=500, detail="Error streaming video")


# skillset used api (llminference)
@router.get("/llm-model/{model_id}", status_code=200)
async def get_llm_model_info(
    model_id: int,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> LLMModelInfo:
    """
    This api gets llm model info for skillset
    """
    try:
        return copilotLLMService.get_model_info(llm_model_id=model_id)
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in getting model info")


# skillset used api (llminference)
@router.get("/llm-models/models-list", status_code=200)
async def get_llm_models(
    name: str = "",
    source: str = "",
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotLLMService: CopilotLLMService = Depends(CopilotLLMService),
) -> List[LLMModelInfo]:
    """
    This api gets list of available llm models for skillset
    """
    try:
        return copilotLLMService.get_llm_models_list(name=name, source=source)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500,
            detail="Error occured in fetching llm-models",
        )
