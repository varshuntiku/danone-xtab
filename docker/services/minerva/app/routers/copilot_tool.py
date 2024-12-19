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

from app.db.crud.copilot_tool_crud import copilot_tool
from app.db.crud.copilot_tool_version_crud import copilot_tool_version_crud
from app.dependencies.dependencies import get_db

# from app.main import websocket_manager
from app.schemas.copilot_tool import (
    CopilotToolCreate,
    CopilotToolCreatePayload,
    CopilotToolMetaData,
    CopilotToolUpdate,
)
from app.schemas.copilot_tool_base_version import CopilotToolBaseVersion
from app.schemas.copilot_tool_deployment_agent import CopilotToolDeploymentAgent
from app.schemas.copilot_tool_version import (
    CopilotRemovableToolVersionMetaData,
    CopilotToolVersionCreate,
    CopilotToolVersionCreatePayload,
    CopilotToolVersionDetail,
    CopilotToolVersionMetaData,
    CopilotToolVersionUpdatePayload,
    CopilotToolVersionVerifyMetaData,
    CopilotToolVersionVerifyPayload,
    CopilotUnusedPublishedToolsMetaData,
)
from app.schemas.copilot_tool_version_registry_mapping import (
    CopilotToolVersionRegistryMappingMetaData,
    CopilotToolVersionRegistryMappingUpdatePayload,
    PublishedToolVersionsMetaData,
    ToolDeployStatusUpdatePayload,
    ToolVersionPublishPayload,
)
from app.services.copilot_tool.copilot_tool_service import CopilotToolService
from app.utils.auth.middleware import AuthMiddleware
from app.utils.config import get_settings

# from app.utils.websocket.request import Request as MockRequest
from fastapi import APIRouter, Depends, HTTPException

# from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session

settings = get_settings()
auth_scheme = HTTPBearer()
router = APIRouter()


@router.post("/tool", status_code=200)
async def create_copilot_tool(
    payload: CopilotToolCreatePayload,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    db: Session = Depends(get_db),
    base_version_id: int = 1,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolMetaData:
    try:
        tool = copilot_tool.is_tool_exist(db, name=payload.name)
        if tool:
            raise HTTPException(status_code=409, detail="Tool with name already exist")
        base_version = copilotToolService.get_tool_base_version_by_id(base_version_id=base_version_id)
        if not base_version:
            raise HTTPException(status_code=404, detail="Please provide a valid base_version_id")
        tool_obj = copilot_tool.create(
            db, obj_in=CopilotToolCreate(name=payload.name, desc=payload.desc, created_by=user_info["user_id"])
        )
        tool_id = tool_obj.id
        try:
            commit_id = copilotToolService.create_initial_commit(
                tool_id=tool_id, commit_msg="initial commit for tool: " + str(tool_id), base_version=base_version
            )
            copilot_tool_version_crud.create(
                db=db,
                obj_in=CopilotToolVersionCreate(
                    tool_id=tool_id,
                    commit_id=commit_id,
                    desc="initial commit for tool: " + str(tool_id),
                    created_by=user_info["user_id"],
                    input_params={},
                    config={},
                    verified=False,
                    base_version_id=base_version_id,
                ),
            )
            return CopilotToolMetaData(name=tool_obj.name, desc=tool_obj.desc, id=tool_obj.id)
        except Exception as e:
            db.rollback()
            logging.exception(e)
            raise HTTPException(status_code=500, detail="Error occurred in Copilot app creation -> git operation")
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot tool creation")


@router.put("/tool/{tool_id}", status_code=200)
async def update_copilot_tool(
    tool_id: int,
    payload: CopilotToolUpdate,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolMetaData:
    try:
        tool = copilot_tool.is_tool_exist(db, name=payload.name, tool_id=tool_id)
        if tool:
            raise HTTPException(status_code=409, detail="Tool with name already exist")
        tool_obj = copilot_tool.update(db, id=tool_id, obj_in=payload)
        return CopilotToolMetaData(name=tool_obj.name, desc=tool_obj.desc, config=tool_obj.config, id=tool_obj.id)
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in update Copilot tool")


@router.get("/tool/list", status_code=200)
async def get_tools(
    limit: int = 1000,
    offset: int = 0,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotToolMetaData]:
    try:
        tool_objs = copilot_tool.get_tools(db, limit=limit, offset=offset)
        result = [
            CopilotToolMetaData(name=tool_obj.name, desc=tool_obj.desc, id=tool_obj.id, config=tool_obj.config)
            for tool_obj in tool_objs
        ]
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot tools list")


@router.get("/tool/{tool_id}", status_code=200)
async def get_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolMetaData:
    try:
        tool_obj = copilot_tool.get(db, id=tool_id)
        result = CopilotToolMetaData(name=tool_obj.name, desc=tool_obj.desc, id=tool_obj.id, config=tool_obj.config)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot tools list")


@router.post("/tool/{tool_id}/tool-version", status_code=200)
async def create_tool_version(
    tool_id: int,
    payload: CopilotToolVersionCreatePayload,
    base_version_id: int = 1,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionMetaData:
    try:
        return copilotToolService.create_tool_version(
            tool_id=tool_id, payload=payload, user_info=user_info, base_version_id=base_version_id
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in create Copilot tool version")


@router.put("/tool/{tool_version_id}/tool-version", status_code=200)
async def update_tool_version(
    tool_version_id: int,
    payload: CopilotToolVersionUpdatePayload,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionMetaData:
    try:
        return copilotToolService.update_tool_version(tool_version_id=tool_version_id, obj_in=payload)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in update Copilot tool version")


@router.get("/tool/{tool_id}/tool-version/list", status_code=200)
async def get_tool_versions(
    tool_id: int,
    limit: int = 10,
    offset: int = 0,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotToolVersionMetaData]:
    try:
        return copilotToolService.get_tool_versions(tool_id=tool_id, limit=limit, offset=offset)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get copilot tool versions")


@router.get("/tool/{tool_id}/tool-version", status_code=200)
async def get_tool_version_detail(
    tool_id: int,
    commit_id: str = None,
    tool_version_id: int = None,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionDetail:
    try:
        return copilotToolService.get_tool_version_detail(
            tool_id=tool_id, commit_id=commit_id, tool_version_id=tool_version_id
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get copilot tool version detail")


@router.get("/tool-version/{tool_version_id}", status_code=200)
async def get_tool_version_detail_by_version_id(
    tool_version_id: int = None,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionDetail:
    try:
        return copilotToolService.get_tool_version_detail_by_version_id(tool_version_id=tool_version_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get copilot tool version detail")


@router.post("/tool-version/{tool_version_id}/publish", status_code=200)
async def publish_tool_version(
    tool_version_id: int,
    payload: ToolVersionPublishPayload,
    deployment_agent_id: int = 1,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionRegistryMappingMetaData:
    try:
        obj = copilotToolService.publish_tool_version(
            tool_version_id=tool_version_id,
            registry_id=payload.registry_id,
            user_info=user_info,
            release_type=payload.release_type.lower(),
            deployment_agent_id=deployment_agent_id,
        )
        return CopilotToolVersionRegistryMappingMetaData(
            tool_version_id=obj.tool_version_id,
            registry_id=obj.registry_id,
            deprecated=obj.deprecated,
            approved=obj.approved,
            id=obj.id,
            created_at=obj.created_at.isoformat(),
            deployment_status=obj.deployment_status,
            info=obj.info,
            version=obj.version,
            deployment_agent_id=obj.deployment_agent_id,
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in Copilot tool version publish")


@router.get("/published-tool/list", status_code=200)
async def get_published_tool_versions(
    registry_id: int,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[PublishedToolVersionsMetaData]:
    try:
        return copilotToolService.get_published_tool_versions(registry_id=registry_id)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get published Copilot tools")


@router.put("/published-tool/update-status")
async def update_tool_deploy_status(
    payload: ToolDeployStatusUpdatePayload,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
):
    try:
        result = copilotToolService.update_multiple_tools_status(payload)
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating published Copilot tools status")


@router.put("/published-tool/{tool_version_registry_mapping_id}")
async def update_published_tool_version(
    tool_version_registry_mapping_id: int,
    payload: CopilotToolVersionRegistryMappingUpdatePayload,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionRegistryMappingMetaData:
    try:
        obj = copilotToolService.update_published_tool_version(id=tool_version_registry_mapping_id, obj_in=payload)
        return CopilotToolVersionRegistryMappingMetaData(
            tool_version_id=obj.tool_version_id,
            registry_id=obj.registry_id,
            deprecated=obj.deprecated,
            approved=obj.approved,
            id=obj.id,
            created_at=obj.created_at.isoformat(),
            deployment_status=obj.deployment_status,
            info=obj.info,
            version=obj.version,
            deployment_agent_id=obj.deployment_agent_id,
        )
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while updating published Copilot tools")


@router.get("/published-tool/{tool_version_registry_mapping_id}/doc")
async def get_published_tool_doc_content(
    tool_version_registry_mapping_id: int,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> str:
    try:
        file_content = await copilotToolService.get_published_tool_doc_content(
            tool_version_registry_mapping_id=tool_version_registry_mapping_id
        )
        return file_content
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred while getting doc for published Copilot tools")


@router.delete("/published-tool/{tool_version_registry_mapping_id}/delete")
async def delete_published_tool(
    tool_version_registry_mapping_id: int,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> dict:
    try:
        return copilotToolService.delete_published_tool(
            tool_version_registry_mapping_id=tool_version_registry_mapping_id
        )
    except Exception as e:
        logging.exception(e)
        exception_detail = e.detail if e.detail else "Error occurred while deleting the published tool"
        raise HTTPException(status_code=500, detail=exception_detail)


@router.put("/tool-version/verify", status_code=200)
async def verify_tool_versions(
    payload: CopilotToolVersionVerifyPayload,
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> CopilotToolVersionVerifyMetaData:
    try:
        return copilotToolService.verify_tool_versions(
            tool_version_ids=payload.tool_version_list, user_email=user_info["email"]
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in verifying copilot tool versions")


@router.get("/deployment-agents", status_code=200)
async def get_tool_deployment_Agents(
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
) -> list[CopilotToolDeploymentAgent]:
    try:
        result = copilotToolService.get_tool_deployment_agents()
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot tool deployment agents")


@router.get("/base-versions", status_code=200)
async def get_tool_base_versions(
    db: Session = Depends(get_db),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
) -> list[CopilotToolBaseVersion]:
    try:
        result = copilotToolService.get_tool_base_versions()
        return result
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in get Copilot tool deployment agents")


# @router.post("/tool-version/test/{conn_id}", status_code=200)
# async def test_skillset(
#     conn_id: str,
# ) -> StreamingResponse:
#     try:
#         res = await websocket_manager.request(conn_id=conn_id, req=MockRequest(path="/", method="get"))

#         # data = await res.iter_lines()
#         # return data
#         return StreamingResponse(res.iter_content())
#     except Exception as e:
#         logging.exception(e)
#         raise HTTPException(status_code=500, detail="Error occurred in verifying copilot tool versions")


@router.get("/removable-tool-versions/list", status_code=200)
async def get_removable_tool_versions(
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotRemovableToolVersionMetaData]:
    try:
        removable_tool_versions = copilotToolService.get_removable_tool_versions()
        return removable_tool_versions
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching removable tools")


@router.get("/app-linked-deprecated-tools/list", status_code=200)
async def get_app_linked_deprecated_tools(
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotRemovableToolVersionMetaData]:
    try:
        app_linked_deprecated_tools = copilotToolService.get_app_linked_deprecated_tools()
        return app_linked_deprecated_tools
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching app linked deprecated tools")


@router.get("/unused-published-tools/list", status_code=200)
async def get_unused_published_tools(
    copilotToolService: CopilotToolService = Depends(CopilotToolService),
    interval: int = 1,
    user_info: dict = Depends(AuthMiddleware(fetch_user_id=True)),
) -> list[CopilotUnusedPublishedToolsMetaData]:
    try:
        unused_publised_tool_list = copilotToolService.get_unused_published_tools(interval=interval)
        return unused_publised_tool_list
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail="Error occurred in fetching unused published tools")
