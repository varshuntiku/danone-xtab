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

import requests
from app.db.crud.copilot_app_published_tool_mapping_crud import (
    copilot_app_published_tool_mapping,
)
from app.db.crud.copilot_tool_base_version_crud import copilot_tool_base_version
from app.db.crud.copilot_tool_deployment_agent_crud import copilot_tool_deployment_agent
from app.db.crud.copilot_tool_registry_crud import copilot_tool_registry
from app.db.crud.copilot_tool_version_crud import copilot_tool_version_crud
from app.db.crud.copilot_tool_version_orchestrator_mapping_crud import (
    minerva_app_consumer_mapping_crud,
)
from app.db.crud.copilot_tool_version_registry_mapping_crud import (
    copilot_tool_version_registry_mapping,
    tool_deployment_urls_cache,
)
from app.dependencies.dependencies import get_db
from app.main import websocket_manager
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
    CopilotUnusedPublishedToolsMetaData,
)
from app.schemas.copilot_tool_version_registry_mapping import (
    CopilotToolDeploymentAgentEnum,
    CopilotToolDeployStatusEnum,
    CopilotToolVersionRegistryMappingCreate,
    CopilotToolVersionRegistryMappingMetaData,
    CopilotToolVersionRegistryMappingUpdatePayload,
    PublishedToolVersionsMetaData,
    ToolDeployStatusUpdatePayload,
)
from app.utils.config import get_settings
from app.utils.git_operations.azure_devops import AzureDevops  # noqa: F401
from app.utils.git_operations.base import GitOperations
from app.utils.git_operations.github import GitHub  # noqa: F401
from app.utils.git_operations.schema import GitFileContentList
from app.utils.websocket.request import Request as MockRequest
from fastapi import Depends, HTTPException

settings = get_settings()


class CopilotToolService:
    def __init__(self, db=Depends(get_db)):
        self.git_obj = GitOperations(
            git_api_type=settings.GIT_PROVIDER,
            organization=settings.AZURE_DEVOPS_ORGANIZATION_NAME,
            project=settings.AZURE_DEVOPS_PROJECT_NAME,
            repository=settings.AZURE_DEVOPS_REPO,
            personal_access_token=settings.AZURE_DEVOPS_PAT,
            branch=settings.AZURE_DEVOPS_BRANCH,
        )
        self.db = db

    def get_tool_base_version_by_id(self, base_version_id: int):
        base_version = copilot_tool_base_version.get_tool_base_version_by_id(
            db=self.db, base_version_id=base_version_id
        )
        return base_version

    def create_initial_commit(self, tool_id, commit_msg, base_version: dict):
        directory_path = base_version.config["path"]
        if not directory_path:
            if base_version.name == "v2":
                directory_path = settings.DEFAULT_TOOL_PATH_V2
            else:
                directory_path = settings.DEFAULT_TOOL_PATH
        git_files_content = self.git_obj.get_file_contents_list(path=directory_path, commit_hash=None)
        for ele in git_files_content:
            ele["path"] = settings.TOOL_DEFINITIONS_PATH + str(tool_id) + ele["path"][len(directory_path) :]
        return self.git_obj.update_files(files=git_files_content, commit_message=commit_msg)

    def _commit_tool_version(self, tool_id, commit_msg, files: GitFileContentList):
        # Fetch existing files
        existing_files = self._get_files(commit_id=None, tool_id=tool_id)
        # Extract paths from existing and current files
        existing_paths = {file["path"] for file in existing_files}
        cur_paths = {file["path"] for file in files}
        # Filter out the files which exist in existing files but not in current files
        removed_file_paths = existing_paths - cur_paths
        removed_file_path_list = list(removed_file_paths)
        # set content to None for files that needs to be removed
        for file_path in removed_file_path_list:
            files.append({"path": file_path, "content": None})

        for file in files:
            file["path"] = settings.TOOL_DEFINITIONS_PATH + str(tool_id) + "/" + file["path"]
        return self.git_obj.update_files(files=files, commit_message=commit_msg)

    def _get_files(self, commit_id, tool_id):
        files = (
            self.git_obj.get_file_contents_list(
                commit_hash=commit_id, path=settings.TOOL_DEFINITIONS_PATH + str(tool_id)
            )
            or []
        )
        prefix = settings.TOOL_DEFINITIONS_PATH + str(tool_id) + "/"
        for file in files:
            file["path"] = file["path"][len(prefix) :]
        return files

    def verify_tool_versions(self, tool_version_ids: list[int], user_email: str):
        if user_email not in settings.MINERVA_APPROVAL_USERS.split(","):
            raise HTTPException(status_code=403, detail="You don't have access to verify tool versions")
        copilot_tool_version_crud.verify_tool_versions(db=self.db, tool_version_ids=tool_version_ids)
        return CopilotToolVersionVerifyMetaData(verified=True, tool_version_list=tool_version_ids)

    def create_release_version(self, release_type: str, previous_version: str) -> str:
        if not previous_version:
            return "1.0.0"
        release_version = list(map(int, previous_version.split(".")))
        if release_type == "major":
            release_version[0] += 1
            release_version[1] = 0
            release_version[2] = 0
        elif release_type == "minor":
            release_version[1] += 1
            release_version[2] = 0
        elif release_type == "patch":
            release_version[2] += 1
        return ".".join(map(str, release_version))

    def get_release_version(self, tool_version_id: int, release_type: str):
        tool_version_obj = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
        recent_version = copilot_tool_version_registry_mapping.get_latest_version_by_tool_id(
            db=self.db, tool_id=tool_version_obj.tool_id
        )
        if not recent_version:
            release_version = self.create_release_version(release_type="major", previous_version=None)
        else:
            release_version = self.create_release_version(
                release_type=release_type, previous_version=recent_version.version
            )
        return release_version

    def get_deployment_agent_by_id(self, deployment_agent_id: int):
        deployment_agent = copilot_tool_deployment_agent.get_tool_deployment_agent_by_id(
            db=self.db, deployment_agent_id=deployment_agent_id
        )
        return deployment_agent

    def _is_valid_deployment(self, tool_version_id: int, deployment_agent_id: int):
        tool_version_detail = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
        if deployment_agent_id in [item.id for item in tool_version_detail.tool_base_version.deployment_agents]:
            return True

    def publish_tool_version(
        self,
        tool_version_id: int,
        user_info: dict,
        release_type: str,
        deployment_agent_id: int,
        registry_id: int = None,
    ):
        is_skillset_test_version = self._is_test_skillset(tool_version_id=tool_version_id)

        if not is_skillset_test_version:
            deployment_agent = self.get_deployment_agent_by_id(deployment_agent_id=deployment_agent_id)
            if not deployment_agent:
                raise HTTPException(status_code=404, detail="Please provide a valid deployment_agent_id")

            if not self._is_valid_deployment(tool_version_id=tool_version_id, deployment_agent_id=deployment_agent_id):
                raise HTTPException(
                    status_code=500,
                    detail="There is no mapping between provided deployment_agent_id and tool version's base_version_id",
                )

        if not (registry_id):
            registry_id = copilot_tool_registry.get_global_registry(db=self.db).id

        if self._is_published_tool(tool_version_id=tool_version_id, registry_id=registry_id):
            raise HTTPException(detail="Skillset version is already published in the same registry.", status_code=409)

        if is_skillset_test_version:
            if not self._is_test_registry(registry_id=registry_id):
                raise HTTPException(
                    detail="Test skillset version can only be published on test registry.", status_code=400
                )

        release_version = self.get_release_version(tool_version_id=tool_version_id, release_type=release_type)

        obj = copilot_tool_version_registry_mapping.create(
            db=self.db,
            obj_in=CopilotToolVersionRegistryMappingCreate(
                created_by=user_info["user_id"],
                registry_id=registry_id,
                tool_version_id=tool_version_id,
                approved=True,
                info={},
                deployment_status=CopilotToolDeployStatusEnum.Triggered,
                deprecated=False,
                version=release_version,
                deployment_agent_id=deployment_agent_id,
            ),
        )

        if not is_skillset_test_version:
            tool_version_obj = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
            commit_id = tool_version_obj.commit_id
            tool_id = tool_version_obj.tool_id
            files = self.git_obj.get_file_contents_list(
                commit_hash=commit_id, path=settings.TOOL_DEFINITIONS_PATH + str(tool_id)
            )
            prefix = settings.TOOL_DEFINITIONS_PATH + str(tool_id) + "/"
            tool_deployment_path = ""
            if obj.deployment_agent.name == CopilotToolDeploymentAgentEnum.DEE:
                tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH_V2
            else:
                tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH

            # TODO: rename this variable
            files_base_path = []
            if files:
                for file in files:
                    # To get just the file name in path as it is required for dee Eg: Dockerfile
                    files_base_path.append({**file, "path": file["path"][len(prefix) :], "content": file["content"]})
                    file["path"] = tool_deployment_path + str(obj.id) + "/" + file["path"][len(prefix) :]
            self.git_obj.update_files(
                files=files,
                commit_message="Deploy Tool: "
                + str(tool_id)
                + ", Tool version: "
                + str(tool_version_id)
                + ", Registry: "
                + str(registry_id)
                + ", tool_version_registry_mapping_id: "
                + str(obj.id),
            )

            if obj.deployment_agent.name == CopilotToolDeploymentAgentEnum.DEE:
                # call dee create skillset api
                try:
                    dee_create_skillset_url = settings.DEE_ENV_BASE_URL + "/services/copilot/skillset"
                    payload = {"id": obj.id, "files": files_base_path}
                    requests.post(dee_create_skillset_url, json=payload)
                except Exception as e:
                    logging.error(f"An error occurred during the DEE API call: {e}")
        return obj

    def _is_published_tool(self, tool_version_id: int, registry_id: int):
        record = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping_by_tool_version_id(
            db=self.db, tool_version_id=tool_version_id, registry_id=registry_id
        )
        return True if record else False

    def _is_test_skillset(self, tool_version_id: int):
        tool_version = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
        return bool(tool_version.is_test)

    def _is_test_registry(self, registry_id: int):
        registry = copilot_tool_registry.get(db=self.db, id=registry_id)
        return bool(registry.is_test)

    def get_published_tool_versions(self, registry_id: int) -> list[PublishedToolVersionsMetaData]:
        if not (registry_id):
            registry_id = copilot_tool_registry.get_global_registry(db=self.db).id
        obj_list = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping_list(
            db=self.db, registry_id=registry_id
        )
        result = [
            PublishedToolVersionsMetaData(
                id=obj[0].id,
                tool_version_id=obj[0].tool_version_id,
                registry_id=obj[0].registry_id,
                approved=obj[0].approved,
                deprecated=obj[0].deprecated,
                created_at=obj[0].created_at.isoformat(),
                deployment_status=obj[0].deployment_status,
                info=obj[0].info,
                tool_id=obj[2].id,
                tool_name=obj[2].name,
                tool_version_config=obj[1].config or {},
                input_params=obj[1].input_params or {},
                orchestrators=self._get_orchestrator_ids_by_tool_version(tool_version_id=obj[1].id),
                verified=obj[1].verified or False,
                version=obj[0].version or "",
                is_test=bool(obj[1].is_test),
                deployment_agent_id=obj[0].deployment_agent_id,
            )
            for obj in obj_list
        ]
        return result

    def update_published_tool_version(
        self, id: int, obj_in: CopilotToolVersionRegistryMappingUpdatePayload
    ) -> CopilotToolVersionRegistryMappingMetaData:
        result = copilot_tool_version_registry_mapping.update(db=self.db, id=id, obj_in=obj_in)
        try:
            for key in tool_deployment_urls_cache.keys():
                if id in key:
                    tool_deployment_urls_cache.pop(key, None)
        except Exception as ex:
            tool_deployment_urls_cache.clear()
            logging.exception(ex)
        return result

    def update_multiple_tools_status(self, payload: ToolDeployStatusUpdatePayload) -> dict:
        result = copilot_tool_version_registry_mapping.update_multiple_tools_status(db=self.db, payload=payload)
        try:
            for key in tool_deployment_urls_cache.keys():
                for el in payload.items:
                    if el.id in key:
                        tool_deployment_urls_cache.pop(key, None)
        except Exception as ex:
            tool_deployment_urls_cache.clear()
            logging.exception(ex)
        return result

    async def get_published_tool_doc_content(self, tool_version_registry_mapping_id: int) -> str:
        obj = copilot_tool_version_registry_mapping.get_tool_version_registry_mapping(
            db=self.db, id=tool_version_registry_mapping_id
        )
        if obj[1].is_test:
            res = await websocket_manager.request(conn_id=str(obj[1].id), req=MockRequest(path="/doc", method="get"))
            content = await res.text()
            return content
        tool_deployment_path = ""
        if obj[0].deployment_agent.name == CopilotToolDeploymentAgentEnum.DEE:
            tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH_V2
        else:
            tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH
        path = tool_deployment_path + str(tool_version_registry_mapping_id) + "/readme.md"
        files = self.git_obj.get_file_contents_list(path=path, commit_hash=None)
        readme_file = files[0] if files else None
        return readme_file["content"] if readme_file else ""

    def create_tool_version(
        self, tool_id: int, payload: CopilotToolVersionCreatePayload, user_info: dict, base_version_id: int
    ) -> CopilotToolVersionMetaData:
        base_version = self.get_tool_base_version_by_id(base_version_id=base_version_id)
        if not base_version:
            raise HTTPException(status_code=404, detail="Please provide a valid base_version_id")
        if not payload.is_test:
            commit_id = self._commit_tool_version(
                tool_id=tool_id, commit_msg=payload.desc or "Update tool: " + str(tool_id), files=payload.files
            )
        else:
            commit_id = None
        obj = copilot_tool_version_crud.create(
            db=self.db,
            obj_in=CopilotToolVersionCreate(
                tool_id=tool_id,
                commit_id=commit_id,
                desc=payload.desc,
                created_by=user_info["user_id"],
                input_params=payload.input_params,
                config=payload.config,
                verified=False,
                is_test=bool(payload.is_test),
                base_version_id=base_version_id,
            ),
        )
        created_orchestrators = []
        if hasattr(payload, "orchestrators"):
            for orchestrator_id in payload.orchestrators or []:
                res = minerva_app_consumer_mapping_crud.create(
                    db=self.db, obj_in={"tool_version_id": obj.id, "orchestrator_id": orchestrator_id}
                )
                created_orchestrators.append(res.orchestrator_id)
        return CopilotToolVersionMetaData(
            tool_id=obj.tool_id,
            commit_id=obj.commit_id,
            desc=obj.desc,
            id=obj.id,
            input_params=obj.input_params,
            config=obj.config,
            orchestrators=created_orchestrators,
            verified=obj.verified,
            is_test=bool(obj.is_test),
            base_version_id=obj.base_version_id,
        )

    def _get_orchestrator_ids_by_tool_version(self, tool_version_id: int) -> list[int]:
        orchestrators = minerva_app_consumer_mapping_crud.get_all_by_tool_version_id(
            db=self.db, tool_version_id=tool_version_id
        )
        orchestrators_ids = [el.orchestrator_id for el in orchestrators]
        return orchestrators_ids

    def update_tool_version(
        self, tool_version_id: int, obj_in: CopilotToolVersionUpdatePayload
    ) -> CopilotToolVersionMetaData:
        result = copilot_tool_version_crud.update(db=self.db, id=tool_version_id, obj_in=obj_in)
        orchestrators_ids = []
        if hasattr(obj_in, "orchestrators"):
            minerva_app_consumer_mapping_crud.remove_all_by_tool_id(db=self.db, tool_version_id=tool_version_id)
            for orchestrator_id in obj_in.orchestrators or []:
                res = minerva_app_consumer_mapping_crud.create(
                    db=self.db, obj_in={"tool_version_id": tool_version_id, "orchestrator_id": orchestrator_id}
                )
                orchestrators_ids.append(res.orchestrator_id)
        else:
            orchestrators_ids = self._get_orchestrator_ids_by_tool_version(tool_version_id=tool_version_id)
        return CopilotToolVersionMetaData(
            id=result.id,
            commit_id=result.commit_id,
            tool_id=result.tool_id,
            desc=result.desc,
            input_params=result.input_params,
            config=result.config,
            orchestrators=orchestrators_ids,
            verified=result.verified,
            is_test=bool(result.is_test),
            base_version_id=result.base_version_id,
        )

    def get_tool_versions(
        self,
        tool_id: int,
        limit: int = 10,
        offset: int = 0,
    ) -> list[CopilotToolVersionMetaData]:
        objs = copilot_tool_version_crud.get_tool_versions(db=self.db, tool_id=tool_id, limit=limit, offset=offset)
        result = [
            CopilotToolVersionMetaData(
                id=el.id,
                tool_id=el.tool_id,
                commit_id=el.commit_id,
                desc=el.desc,
                input_params=el.input_params,
                config=el.config,
                orchestrators=self._get_orchestrator_ids_by_tool_version(tool_version_id=el.id),
                verified=el.verified or False,
                is_test=bool(el.is_test),
                base_version_id=el.base_version_id,
            )
            for el in objs
        ]
        return result

    def get_tool_version_detail(
        self, tool_id: int, commit_id: str = None, tool_version_id: int = None
    ) -> CopilotToolVersionDetail:
        obj = None
        if tool_version_id:
            obj = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
        elif commit_id:
            obj = copilot_tool_version_crud.get_tool_version_by_commit_id(db=self.db, commit_id=commit_id)
        else:
            obj = copilot_tool_version_crud.get_latest_version(db=self.db, tool_id=tool_id)
        if obj.is_test:
            files = []
        else:
            files = self._get_files(commit_id=obj.commit_id, tool_id=tool_id)
        result = CopilotToolVersionDetail(
            id=obj.id,
            commit_id=obj.commit_id,
            desc=obj.desc,
            files=files,
            tool_id=obj.tool_id,
            input_params=obj.input_params,
            config=obj.config,
            orchestrators=self._get_orchestrator_ids_by_tool_version(obj.id),
            verified=obj.verified,
            is_test=bool(obj.is_test),
            base_version_id=obj.base_version_id,
        )
        return result

    def get_tool_version_detail_by_version_id(self, tool_version_id: int = None) -> CopilotToolVersionDetail:
        obj = copilot_tool_version_crud.get(db=self.db, id=tool_version_id)
        if obj.is_test:
            files = []
        else:
            files = self._get_files(commit_id=obj.commit_id, tool_id=obj.tool_id)
        result = CopilotToolVersionDetail(
            id=obj.id,
            commit_id=obj.commit_id,
            desc=obj.desc,
            files=files,
            tool_id=obj.tool_id,
            input_params=obj.input_params,
            config=obj.config,
            orchestrators=self._get_orchestrator_ids_by_tool_version(obj.id),
            verified=obj.verified,
            is_test=bool(obj.is_test),
            base_version_id=obj.base_version_id,
        )
        return result

    def __get_tool_files__(
        self, tool_version_registry_mapping_id: int, deployment_agent: CopilotToolDeploymentAgentEnum
    ) -> list:
        try:
            tool_deployment_path = ""
            tool_files = []
            if deployment_agent == CopilotToolDeploymentAgentEnum.DEE:
                tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH_V2
            else:
                tool_deployment_path = settings.TOOL_DEPLOYMENTS_PATH

            tool_version_files = self.git_obj.get_file_contents_list(
                commit_hash=None, path=tool_deployment_path + str(tool_version_registry_mapping_id)
            )
            tool_files = [*tool_version_files] if tool_version_files else []

            # skipping this part if it is DEE deployment as specs folder will not be there in repo
            if deployment_agent != CopilotToolDeploymentAgentEnum.DEE:
                specs_folder_prefix = tool_deployment_path + "specs/"

                tool_version_func_spec_file = self.git_obj.get_file_contents_list(
                    commit_hash=None,
                    path=specs_folder_prefix + f"function-{str(tool_version_registry_mapping_id)}.yaml",
                )
                tool_files = (
                    [*tool_files, *tool_version_func_spec_file] if tool_version_func_spec_file else [*tool_files]
                )

                tool_version_package_spec_file = self.git_obj.get_file_contents_list(
                    commit_hash=None, path=specs_folder_prefix + f"package-{str(tool_version_registry_mapping_id)}.yaml"
                )
                tool_files = (
                    [*tool_files, *tool_version_package_spec_file] if tool_version_package_spec_file else [*tool_files]
                )

                tool_version_route_spec_file = self.git_obj.get_file_contents_list(
                    commit_hash=None, path=specs_folder_prefix + f"route-{str(tool_version_registry_mapping_id)}.yaml"
                )
                tool_files = (
                    [*tool_files, *tool_version_route_spec_file] if tool_version_route_spec_file else [*tool_files]
                )

            return tool_files
        except Exception as ex:
            logging.exception(ex)

    def delete_published_tool(self, tool_version_registry_mapping_id: int) -> dict:
        try:
            tool_app_mappings = copilot_app_published_tool_mapping.get_apps_by_tool_version_registry_mapping_id(
                db=self.db,
                tool_version_registry_mapping_id=tool_version_registry_mapping_id,
            )
            if tool_app_mappings:
                mapped_tool_ids = [item.copilot_app_id for item in tool_app_mappings]
                raise HTTPException(
                    status_code=500,
                    detail={
                        "message": "Tool mapped to copilot application cannot be deleted",
                        "mapped_copilot_app_ids": mapped_tool_ids,
                    },
                )
            else:
                mapped_tool_detail = copilot_tool_version_registry_mapping.get(
                    db=self.db, id=tool_version_registry_mapping_id
                )
                tool_version_detail = copilot_tool_version_crud.get(db=self.db, id=mapped_tool_detail.tool_version_id)

                tool_all_files = self.__get_tool_files__(
                    tool_version_registry_mapping_id=tool_version_registry_mapping_id,
                    deployment_agent=mapped_tool_detail.deployment_agent.name,
                )

                for file in tool_all_files:
                    file["content"] = None

                update_git_files = self.git_obj.update_files(
                    files=tool_all_files,
                    commit_message="Delete Tool: "
                    + "tool_version_registry_mapping_id: "
                    + str(tool_version_registry_mapping_id)
                    + ", Tool version: "
                    + str(tool_version_detail.id)
                    + ", Tool id:"
                    + str(tool_version_detail.tool_id),
                )

                if update_git_files is None:
                    raise HTTPException(status_code=500, detail="Error occurred while deleting tool")
                else:
                    copilot_tool_version_registry_mapping.soft_delete(db=self.db, id=tool_version_registry_mapping_id)
                    try:
                        for key in tool_deployment_urls_cache.keys():
                            if tool_version_registry_mapping_id in key:
                                tool_deployment_urls_cache.pop(key, None)
                    except Exception as ex:
                        tool_deployment_urls_cache.clear()
                        logging.exception(ex)

                    try:
                        if mapped_tool_detail.deployment_agent.name == CopilotToolDeploymentAgentEnum.DEE:
                            # call dee delete skillset api
                            dee_delete_skillset_url = (
                                settings.DEE_ENV_BASE_URL
                                + f"/services/copilot/skillset/{tool_version_registry_mapping_id}"
                            )
                            requests.delete(dee_delete_skillset_url)
                    except Exception as e:
                        logging.error(f"An error occurred during the DEE API call: {e}")

                    return {
                        "message": f"tool_version_registry_mapping_id:{tool_version_registry_mapping_id} deleted successfully"
                    }

        except Exception as e:
            exception_detail = e.detail if hasattr(e, "detail") else "Error occurred while deleting tool"
            raise HTTPException(status_code=500, detail=exception_detail)

    def get_tool_deployment_agents(self) -> list[CopilotToolDeploymentAgent]:
        deployment_agents = copilot_tool_deployment_agent.get_tool_deployment_agents(db=self.db)
        result = [
            CopilotToolDeploymentAgent(
                id=el.id,
                name=el.name,
                desc=el.desc,
                supported_base_versions=[res.id for res in el.base_versions],
            )
            for el in deployment_agents
        ]
        return result

    def get_tool_base_versions(self) -> list[CopilotToolBaseVersion]:
        base_versions = copilot_tool_base_version.get_tool_base_versions(db=self.db)
        result = [
            CopilotToolBaseVersion(
                id=el.id,
                name=el.name,
                desc=el.desc,
                supported_deployment_agents=[res.id for res in el.deployment_agents],
            )
            for el in base_versions
        ]
        return result

    def get_removable_tool_versions(self) -> CopilotRemovableToolVersionMetaData:
        obj_list = copilot_tool_version_registry_mapping.get_removable_tool_versions(db=self.db)
        result = [
            CopilotRemovableToolVersionMetaData(
                id=obj[0].id,  # id from CopilotToolVersionRegistryMapping
                name=obj[1].name if obj[1] else None,  # name from CopilotAppPublishedToolMapping
                created_at=obj[0].created_at.isoformat(),  # created_at from CopilotToolVersionRegistryMapping
                deprecated=obj[0].deprecated,  # deprecated from CopilotToolVersionRegistryMapping
                email_address=obj[0].user.email_address,  # email from User
                copilot_app_id=obj[1].copilot_app_id
                if obj[1]
                else None,  # copilot_app_id from CopilotAppPublishedToolMapping
                linked_at=obj[1].created_at.isoformat()
                if obj[1]
                else None,  # linked_at from CopilotAppPublishedToolMapping
            )
            for obj in obj_list
        ]
        return result

    def get_app_linked_deprecated_tools(self) -> CopilotRemovableToolVersionMetaData:
        obj_list = copilot_tool_version_registry_mapping.get_app_linked_deprecated_tools(db=self.db)
        result = [
            CopilotRemovableToolVersionMetaData(
                id=obj[0].id,  # id from CopilotToolVersionRegistryMapping
                name=obj[1].name if obj[1] else None,  # name from CopilotAppPublishedToolMapping
                created_at=obj[0].created_at.isoformat(),  # created_at from CopilotToolVersionRegistryMapping
                deprecated=obj[0].deprecated,  # deprecated from CopilotToolVersionRegistryMapping
                email_address=obj[2].email_address,  # email from User
                copilot_app_id=obj[1].copilot_app_id
                if obj[1]
                else None,  # copilot_app_id from CopilotAppPublishedToolMapping
                linked_at=obj[1].created_at.isoformat()
                if obj[1]
                else None,  # linked_at from CopilotAppPublishedToolMapping
            )
            for obj in obj_list
        ]
        return result

    def get_unused_published_tools(self, interval: int) -> CopilotUnusedPublishedToolsMetaData:
        obj_list = copilot_tool_version_registry_mapping.get_unused_published_tools(db=self.db, interval=interval)
        result = [
            CopilotUnusedPublishedToolsMetaData(
                publish_id=obj[0].id,  # vrm.id as publish_id (from CopilotToolVersionRegistryMapping)
                version_id=obj[
                    0
                ].tool_version_id,  # vrm.tool_version_id as version_id (from CopilotToolVersionRegistryMapping)
                tool_id=obj[4].id,  # ct.id as tool_id (from CopilotTool)
                name=obj[4].name,  # ct.name (from CopilotTool)
                registry_id=obj[0].registry_id,  # vrm.registry_id (from CopilotToolVersionRegistryMapping)
                created_at=obj[0].created_at.isoformat(),  # vrm.created_at as ISO string
                deprecated=obj[0].deprecated,  # vrm.deprecated (from CopilotToolVersionRegistryMapping)
                email_address=obj[2].email_address,  # u.email_address (from User)
            )
            for obj in obj_list
        ]
        return result
