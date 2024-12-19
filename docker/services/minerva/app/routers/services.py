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
from typing import Dict, List

from app.db.crud.minerva_application_crud import minerva_application
from app.db.crud.minerva_conversation_crud import minerva_conversation
from app.db.crud.minerva_conversation_window_crud import minerva_conversation_window
from app.db.crud.minerva_models_crud import minerva_models
from app.dependencies.dependencies import get_db
from app.schemas.minerva_conversation_schema import MinervaConversationCreate
from app.schemas.minerva_conversation_window_schema import (
    ConversationWindowMetadata,
    MinervaConversationWindowCreate,
    MinervaConvoWindowUpdatePayload,
)
from app.schemas.services_schema import ConversationResponse, QueryResponse
from app.utils.auth.middleware import validate_user
from app.utils.config import get_settings

# from app.utils.socket.connection_events import emit_query_processing_step
from app.utils.tools.agent import Agent
from app.utils.tools.storage_util import StorageServiceClient, StorageType, get_blob_name, get_container_name
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

settings = get_settings()

auth_scheme = HTTPBearer()


router = APIRouter()


@router.post("/query/{minerva_application_id}", status_code=200)
async def user_query(
    minerva_application_id: int,
    user_query: str,
    query_type: str = "",
    query_trace_id: str = None,
    window_id: int = 0,
    request_body: Dict = None,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> QueryResponse:
    """
    Query Minerva's Conversational agent with the user's input along with the minerva application id
    query_trace_id to be used only for socket connection and emitting the steps progress
    """
    try:
        # emit step 1: started
        # await emit_query_processing_step(
        #     room=user_info["email"],
        #     data={
        #         "progress_message": "Preparing user query",
        #         "query_trace_id": query_trace_id,
        #         "window_id": window_id,
        #     },
        # )
        # query minerva app config
        app_config = minerva_application.get(db=db, id=minerva_application_id)
        # query historical user queries to pass as additional context
        # TODO: filter history based on conversation window
        history = minerva_conversation.get_recent_convo(
            db=db,
            application_id=app_config.id,
            user_id=user_info["email"],
            window_id=window_id,
            limit=5,
            offset=0,
        )
        # get model and embedding to be used
        for tool_config in app_config.app_config:
            llm_model_id = tool_config["llm_model"] if "llm_model" in tool_config else None
            llm_config = minerva_models.get(db=db, id=llm_model_id) if llm_model_id is not None else None
            tool_config["llm_model"] = llm_config
            embedding_model_id = tool_config["embedding_model"] if "embedding_model" in tool_config else None
            embedding_config = (
                minerva_models.get(db=db, id=embedding_model_id) if embedding_model_id is not None else None
            )
            tool_config["embedding_model"] = embedding_config
        # initialise agent
        # await emit_query_processing_step(
        #     room=user_info["email"],
        #     data={
        #         "progress_message": "An agent is generating the response.",
        #         "query_trace_id": query_trace_id,
        #         "window_id": window_id,
        #     },
        # )
        minerva_agent = Agent(app_config, history, db, query_trace_id, window_id, user_info=user_info)
        response = await minerva_agent.generate_response(user_input_text=user_query, user_input_form=request_body)
        if not window_id:
            convo_window_obj = MinervaConversationWindowCreate(
                application_id=app_config.id,
                user_id=user_info["email"],
                title=user_query,
            )
            convo_window_obj = minerva_conversation_window.create(db, obj_in=convo_window_obj)
            window_id = convo_window_obj.id

        # insert conversation into db
        convo_obj = MinervaConversationCreate(
            application_id=app_config.id,
            user_id=user_info["email"],
            user_query=user_query,
            minerva_response=response,
            conversation_window_id=window_id,
        )
        convo_obj = minerva_conversation.create(db=db, obj_in=convo_obj)
        return {
            "id": convo_obj.id,
            "input": user_query,
            "output": response,
            "window_id": window_id,
        }
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in processing user query")


@router.get("/conversations/{minerva_application_id}", status_code=200)
async def get_conversations(
    minerva_application_id: int,
    window_id: int = None,
    query_offset: int = 0,
    query_limit: int = 10,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> ConversationResponse:
    """
    Return user conversation history for a specific minerva application id.
    """
    try:
        user_minerva_conversations = minerva_conversation.get_recent_convo(
            db=db,
            application_id=minerva_application_id,
            user_id=user_info["email"],
            window_id=window_id,
            limit=query_limit,
            offset=query_offset,
        )
        convo_ount = minerva_conversation.get_convo_count(
            db=db,
            application_id=minerva_application_id,
            user_id=user_info["email"],
            window_id=window_id,
        )
        return {
            "list": [
                QueryResponse(
                    id=el.id,
                    input=el.user_query,
                    output=el.minerva_response,
                    window_id=el.conversation_window_id,
                    feedback=el.feedback,
                )
                for el in user_minerva_conversations
            ],
            "next_offset": query_offset + query_limit,
            "total_count": convo_ount,
        }
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching user conversations")


@router.get("/conversation-window/{minerva_application_id}", status_code=200)
async def get_conversation_window_list(
    minerva_application_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> List[ConversationWindowMetadata]:
    """
    Returns list of conversation window for an minerva application and user
    """
    try:
        res = minerva_conversation_window.get_convo_windows(
            db=db,
            minerva_application_id=minerva_application_id,
            user_id=user_info["email"],
        )
        return [
            {
                "id": el.id,
                "title": el.title,
                "pinned": bool(el.pinned),
                "created_at": el.created_at.isoformat(),
            }
            for el in res
        ]
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured in fetching conversation window list")


@router.put("/conversation-window/{window_id}", status_code=200)
async def update_conversation_window(
    window_id: int,
    window_obj: MinervaConvoWindowUpdatePayload,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> ConversationWindowMetadata:
    """
    Returns list of conversation window for an minerva application and user
    """
    try:
        updated_obj = minerva_conversation_window.update(db=db, id=window_id, obj_in=window_obj)
        return ConversationWindowMetadata(
            id=updated_obj.id,
            title=updated_obj.title,
            pinned=bool(updated_obj.pinned),
            created_at=updated_obj.created_at.isoformat(),
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occured while updating conversation window")


@router.delete("/conversation-window/{window_id}", status_code=200)
async def delete_conversation_window(
    window_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(validate_user),
) -> int:
    """
    Returns list of conversation window for an minerva application and user
    """
    try:
        deleted_obj = minerva_conversation_window.soft_delete(db=db, id=window_id)
        return deleted_obj.id
    except Exception as e:
        logging.exception(e)
        raise HTTPException(
            status_code=500,
            detail="Error occured while deleting the conversation window",
        )


@router.get("/get_blob_sas_url", status_code=200)
async def get_blob_sas_url(
    blob_url: str,
    user_info: dict = Depends(validate_user),
) -> str:
    """
    Returns image url or base64 encoded object
    """
    try:
        blob_name = get_blob_name(StorageType[settings.STORAGE_SERVICE], blob_url)
        container_name = get_container_name(StorageType[settings.STORAGE_SERVICE], blob_url)
        storage_client = StorageServiceClient.get_storage_client(StorageType[settings.STORAGE_SERVICE])
        sas_url = storage_client.get_url(container=container_name, file_name=blob_name)
        return sas_url
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while fetching the sas url")
