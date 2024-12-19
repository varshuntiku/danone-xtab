import json
import logging
import zipfile
from datetime import datetime
from io import BytesIO
from typing import Any, Dict, List, Optional

from api.configs.settings import get_app_settings
from api.constants.code_executor import CodeExecutionStatus
from api.constants.execution_environment.variables import SolutionBlueprintType
from api.daos.solutionbp.solutionbp_dao import SolutionBluePrintDao
from api.dtos.solutionbp.solutionbp_dto import SolutionbpDetailDTO
from api.schemas.solutionbp.solutionbp_schema import (
    DefaultSolutionBlueprint,
    OnSaveRequest,
)
from fastapi import status
from infra_manager.core.cloud.azure.fileshare_service import FileShareService

settings = get_app_settings()


class SolutionBlueprintService:
    def __init__(self):
        self.azure_file_share_service = FileShareService(settings.AZURE_FILE_SHARE_CONNECTION_STRING, None, None)
        self.blueprint_dao = SolutionBluePrintDao()
        self.data = None
        self.status = "failed"
        self.message = "Failed to perform given action."
        self.node_counter = 0

    def get_response(self):
        return {"data": self.data, "status": self.status, "message": self.message}

    async def get_directory_tree(
        self, user, share_name: str, directory_path: str, name: str = None, project_id: int = None
    ):
        try:
            if not name:
                solution_bp = await self.get_blueprint_by_project_id(project_id)
            else:
                solution_bp = await self.get_blueprint_by_name(name=name)

            last_modified, total_size = await self.azure_file_share_service.get_directory_last_modified(
                share_name, directory_path
            )

            if (name or project_id) and solution_bp:
                stored_last_modified = (
                    solution_bp["data"].meta_data.get("last_modified") if solution_bp["data"].meta_data else None
                )
                stored_size = solution_bp["data"].meta_data.get("total_size") if solution_bp["data"].meta_data else None

                if not stored_last_modified or last_modified != stored_last_modified or stored_size != total_size:
                    bp = await self.azure_file_share_service.get_directory_tree(share_name, directory_path)

                    if bp["status"] == "success":
                        await self.update_blueprint(
                            user,
                            solution_bp["data"].id,
                            visual_graph=None,
                            dir_tree=bp["data"],
                            meta_data={"last_modified": last_modified, "total_size": total_size},
                            project_id=project_id if project_id else None,
                        )
                        return {
                            "project_id": project_id,
                            "visual_graph": None,
                            "dir_tree": {"data": bp["data"], "status": "success"},
                            "status": "success",
                            "message": "Directory tree updated successfully.",
                            "status_code": status.HTTP_200_OK,
                        }
                else:
                    return {
                        "project_id": solution_bp["data"].project_id,
                        "visual_graph": solution_bp["data"].visual_graph,
                        "dir_tree": {"data": solution_bp["data"].dir_tree, "status": "success"},
                        "status": "success",
                        "message": "Get directory tree successfully.",
                        "status_code": status.HTTP_200_OK,
                    }
            else:
                bp = await self.azure_file_share_service.get_directory_tree(share_name, directory_path)
                if bp["status"] == "success":
                    await self.create_blueprint(
                        user,
                        name=name if name else f"bp_{project_id}",
                        kind="custom" if project_id else "default",
                        meta_data=None,
                        filepath=directory_path,
                        visual_graph=None,
                        dir_tree=bp["data"],
                        refs=None,
                        project_id=project_id if project_id else None,
                    )
                    return {
                        "project_id": project_id,
                        "visual_graph": [],
                        "dir_tree": bp,
                        "status": "success",
                        "message": "Get directory tree successfully.",
                        "status_code": status.HTTP_200_OK,
                    }
        except Exception as e:
            logging.debug(e)
            raise e

    async def process_save_actions(self, source_share_name: str, destination_share_name: str, nodes: OnSaveRequest):
        response = {
            "message": "Action processing failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        duplicate = {}

        try:
            for action in nodes.actions:
                if not (action.action in duplicate):
                    duplicate[action.action] = []

                for payload in action.payload:
                    if payload.name.lower() in duplicate[action.action]:
                        response.update(
                            {
                                "status": "failed",
                                "message": "Duplicate Blueprint exists.",
                                "status_code": status.HTTP_400_BAD_REQUEST,
                            }
                        )
                        return response
                    duplicate[action.action].append(payload.name.lower())

                if action.action == "add":
                    for payload in action.payload:
                        action_add = self.azure_file_share_service.create_sub_directory(
                            share_name=destination_share_name,
                            directory_path=f"{nodes.project_id}" if nodes.project_id else f"{payload.path}",
                            sub_directory_name=payload.name,
                        )
                        if action_add["status"] == "failed":
                            response.update(
                                {
                                    "status": "failed",
                                    "message": action_add["message"].split(".")[0],
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                            )
                            return response

                elif action.action == "copy":
                    for payload in action.payload:
                        action_copy = await self.azure_file_share_service.import_directory_or_file(
                            source_share_name=source_share_name,
                            destination_share_name=destination_share_name,
                            source_path=payload.source,
                            destination_path=payload.path,
                        )
                        if action_copy["status"] == "failed":
                            response.update(
                                {
                                    "status": "failed",
                                    "message": "Copy action failed.",
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                            )
                            return response

                elif action.action == "remove":
                    for payload in action.payload:
                        action_remove = await self.azure_file_share_service.delete_directory_tree_from_share(
                            share_name=destination_share_name,
                            directory_path=f"{nodes.project_id}/{payload.path}"
                            if nodes.project_id
                            else f"{payload.path}",
                        )
                        if action_remove["status"] == "failed":
                            response.update(
                                {
                                    "status": "failed",
                                    "message": "Remove action failed.",
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                            )
                            return response

                else:
                    response.update(
                        {
                            "message": f"Provided Action is not Supported, {action.action}",
                            "status": "failed",
                            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                        }
                    )
                    return response

            response.update(
                {
                    "status": "success",
                    "message": "Actions processed successfully.",
                    "status_code": status.HTTP_200_OK,
                }
            )

        except Exception as e:
            logging.debug(e)
            response.update(
                {
                    "status": "failed",
                    "message": "An unexpected error occurred during action processing.",
                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                }
            )

        return response

    async def save_solution_bp(self, user, share_name, nodes: OnSaveRequest, directory_path=None):
        try:
            directory_path = (
                self.azure_file_share_service.get_share_directory_path(share_name, nodes.project_id)
                if not directory_path
                else directory_path
            )
            blueprint = (
                self.blueprint_dao.get_blueprint_by_project_id(nodes.project_id)
                if nodes.project_id
                else self.blueprint_dao.get_blueprint_by_name(nodes.bp_name)
            )
            dir_tree = await self.azure_file_share_service.get_directory_tree(share_name, directory_path=directory_path)
            if dir_tree["status"] == "failure":
                self.status = CodeExecutionStatus.failed.value
                self.message = dir_tree["message"]
                return self.get_response()
            if blueprint:
                last_modified, total_size = await self.azure_file_share_service.get_directory_last_modified(
                    share_name, directory_path
                )
                meta_data = {"last_modified": last_modified, "total_size": total_size}
                self.blueprint_dao.update_blueprint(user, blueprint, nodes.visual_graph, dir_tree["data"], meta_data)
            else:
                await self.create_blueprint(
                    user,
                    name=f"bp_{nodes.project_id}" if not nodes.bp_name else nodes.bp_name,
                    kind="custom",
                    meta_data=None,
                    filepath=directory_path,
                    visual_graph=nodes.visual_graph,
                    dir_tree=dir_tree["data"],
                    refs=None,
                    project_id=nodes.project_id,
                )

            self.data = dir_tree["data"]
            self.status = "success"
            self.message = "Solution blueprint saved successfully."
        except Exception as e:
            logging.debug(e)
            self.data = None
            self.status = "failed"
            self.message = str(e)
        return self.get_response()

    async def save_solution_bp_on_default(
        self,
        user,
        source_share_name,
        destination_share_name,
        nodes: DefaultSolutionBlueprint,
        default_bp,
    ):
        try:
            blueprint = self.blueprint_dao.get_blueprint_by_project_id(nodes.project_id)
            directory_path = self.azure_file_share_service.get_share_directory_path(
                destination_share_name, nodes.project_id
            )
            delete = await self.azure_file_share_service.delete_directory_tree_from_share(
                destination_share_name, directory_path=directory_path
            )
            copy = await self.azure_file_share_service.import_directory_or_file(
                source_share_name,
                destination_share_name,
                f"{SolutionBlueprintType.GOLDEN.value}/{SolutionBlueprintType.DEFAULT.value}",
                directory_path,
            )
            if blueprint and delete["status"] == "success" and copy["status"] == "success":
                last_modified, total_size = await self.azure_file_share_service.get_directory_last_modified(
                    destination_share_name, directory_path
                )
                meta_data = {"last_modified": last_modified, "total_size": total_size}
                self.blueprint_dao.update_blueprint(
                    user, blueprint, default_bp["visual_graph"], default_bp["dir_tree"]["data"], meta_data
                )
            elif not blueprint and copy["status"] == "success" and delete["status"] == "success":
                await self.create_blueprint(
                    user,
                    name=f"bp_{nodes.project_id}",
                    kind="custom",
                    meta_data=None,
                    filepath=directory_path,
                    visual_graph=nodes.visual_graph,
                    dir_tree=default_bp["dir_tree"]["data"],
                    refs=None,
                    project_id=nodes.project_id,
                )
            else:
                self.message = "Blueprint saving failed."
                self.status = "failure"
                return self.get_response()
            self.status = "success"
            self.message = "Blueprint saved successfully."
        except Exception as e:
            logging.debug(e)
            self.status = "failed"
            self.data = None
            self.message = str(e)
        return self.get_response()

    async def get_blueprint_by_name(self, name: str):
        try:
            blueprint = self.blueprint_dao.get_blueprint_by_name(name)
            if blueprint:
                transformed_blueprint = SolutionbpDetailDTO(blueprint)
                self.data = transformed_blueprint
                self.status = "success"
                self.message = "Blueprint fetched successfully."
                return self.get_response()
            else:
                return None
        except Exception as e:
            logging.debug(e)
            return None

    async def get_blueprint_by_project_id(self, project_id: int):
        try:
            blueprint = self.blueprint_dao.get_blueprint_by_project_id(project_id)
            if blueprint:
                transformed_blueprint = SolutionbpDetailDTO(blueprint)
                self.data = transformed_blueprint
                self.status = "success"
                self.message = "Blueprint fetched successfully."
                return self.get_response()
            else:
                return None
        except Exception as e:
            logging.debug(e)
            return None

    async def create_blueprint(self, user, name, kind, meta_data, filepath, visual_graph, dir_tree, refs, project_id):
        blueprint = self.blueprint_dao.create_blueprint(
            user,
            name=name,
            kind=kind,
            meta_data=meta_data,
            filepath=filepath,
            visual_graph=visual_graph,
            dir_tree=dir_tree,
            refs=refs,
            project_id=project_id,
        )
        if blueprint:
            transformed_blueprint = SolutionbpDetailDTO(blueprint)
            self.data = transformed_blueprint
            self.status = "success"
            self.message = "Blueprint created successfully."
            return self.get_response()
        else:
            self.data = None
            self.status = "failure"
            self.message = "Blueprint creation failed."
            return self.get_response()

    async def update_blueprint(self, user, solution_bp_id, visual_graph, dir_tree, meta_data, project_id):
        try:
            solution_bp = self.blueprint_dao.get_blueprint_by_id(solution_bp_id)
            if solution_bp:
                blueprint = self.blueprint_dao.update_blueprint(
                    user,
                    solution_bp,
                    visual_graph,
                    dir_tree,
                    meta_data,
                    project_id=project_id,
                )
            if solution_bp and blueprint:
                transformed_blueprint = SolutionbpDetailDTO(blueprint)
                self.data = transformed_blueprint
                self.status = "success"
                self.message = "Blueprint updated successfully."
                return self.get_response()
            self.data = None
            self.status = "failure"
            self.message = "Blueprint update failed."
            return self.get_response()
        except Exception as e:
            logging.debug(e)
            self.data = None
            self.status = "failure"
            self.message = "Blueprint update failed."
        return self.get_response()

    async def back_traverse(self, node: Dict[str, Any]):
        async def traverse(node: Dict[str, Any]):
            if node.selected:
                return True, node

            if node.child:
                children = []
                any_selected = False
                for child in node.child:
                    selected, child_structure = await traverse(child)
                    if selected:
                        any_selected = True
                        children.append(child_structure)

                if any_selected:
                    node.child = children
                    return True, node

            return False, None

        _, result = await traverse(node)

        def set_selected_true(node: Dict[str, Any]):
            node.selected = True
            if node.child:
                for child in node.child:
                    set_selected_true(child)

        if result:
            set_selected_true(result)

        return result

    async def traverse_import_list(self, nodes: List[Dict[str, Any]], skip=True):
        result = []
        for node in nodes:
            if not skip:
                back_traversed = await self.back_traverse(node)
                if back_traversed:
                    result.append(back_traversed)
                continue
            for child in node.child:
                back_traversed = await self.back_traverse(child)
                if back_traversed:
                    result.append(back_traversed)
        return result

    async def merge_jsons(
        self, current_state: List[Dict[str, Any]], import_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        try:
            merged_dir_tree = [node for node in current_state]

            def find_child_node(nodes: List[Dict[str, Any]], name: str) -> Optional[Dict[str, Any]]:
                for index, child in enumerate(nodes):
                    if child.name == name:
                        return index
                return None

            for node in import_list:
                current = next((n for n in merged_dir_tree if n.name == node.name), None)
                if node.selected and not current:
                    merged_dir_tree.append(node)
                elif node.selected and current:
                    if not current.child:
                        current.child = []

                    for imported_child in node.child:
                        existing_child_index = find_child_node(current.child, imported_child.name)

                        if existing_child_index is not None:
                            existing_child = current.child[existing_child_index]
                            merged_children = await self.merge_jsons(existing_child.child, imported_child.child)
                            current.child[existing_child_index].child = merged_children["data"]
                        else:
                            current.child.append(imported_child)
                elif node.child and len(node.child) > 0:
                    merged_children = await self.merge_jsons(merged_dir_tree, node.child)
                    merged_dir_tree = merged_children["data"]

            self.data = merged_dir_tree
            self.status = "success"
            self.message = "Directory tree merged successfully."
        except Exception as e:
            self.data = None
            self.status = "failed"
            self.message = "Directory tree merge failed."
            logging.debug(e)
        return self.get_response()

    async def update_node_ids(self, tree: List[Dict[str, Any]], parent_id: Optional[int] = None) -> int:
        try:
            for node in tree:
                if parent_id is None:
                    node.parentNodeId = None
                else:
                    if node.parentNodeId != parent_id:
                        node.parentNodeId = parent_id
                if node.child:
                    await self.update_node_ids(node.child, node.nodeId)
            self.data = tree
            self.status = "success"
            self.message = "Directory tree updated successfully."
        except Exception as e:
            self.data = None
            self.status = "failed"
            self.message = "Directory tree update failed."
            logging.debug(e)
        return self.get_response()

    async def generate_import_actions(
        self, import_list: List[Dict[str, Any]], project_id: int = None
    ) -> List[Dict[str, Any]]:
        try:
            import_actions = {"action": "copy", "payload": []}
            add_actions = {"action": "add", "payload": []}
            selected_parents = set()
            nodes_to_exclude = set()
            path_mapping = {}

            async def traverse_and_mark_nodes(node: Dict[str, Any], parent_path: str, parent_selected: bool):
                node = dict(node)
                current_selected = node.get("selected", False)
                current_path = f"{parent_path}/{node['name']}" if parent_path else node["name"]

                if current_selected or parent_selected:
                    if not parent_selected:
                        # Mark as selected parent if its parent is not selected
                        selected_parents.add(node["name"])
                        path_mapping[node["name"]] = current_path
                    else:
                        # Mark as to be excluded if parent is selected
                        nodes_to_exclude.add(node["name"])
                        path_mapping[node["name"]] = current_path

                if node.get("child"):
                    for child in node["child"]:
                        await traverse_and_mark_nodes(child, current_path, current_selected)

            async def traverse_and_add_actions(node: Dict[str, Any]):
                # Add action for nodes that are selected parents only
                node = dict(node)
                if node["name"] in selected_parents:
                    segments = path_mapping[node["name"]].split("/")
                    dest_path = "/".join(segments[1:])
                    if project_id:
                        import_actions["payload"].append(
                            {
                                "name": node["name"],
                                "source": f"{SolutionBlueprintType.GOLDEN.value}/{path_mapping[node['name']]}",
                                "path": f"{project_id}/{dest_path}" if dest_path else f"{project_id}/{node['name']}",
                            }
                        )
                    elif node["name"] == "add":
                        add_actions["payload"].append(
                            {
                                "name": node["name"],
                                "path": f"{dest_path}" if dest_path else f"{node['name']}",
                            }
                        )
                    else:
                        import_actions["payload"].append(
                            {
                                "name": node["name"],
                                "source": f"{SolutionBlueprintType.GOLDEN.value}/{path_mapping[node['name']]}",
                                "path": f"{dest_path}" if dest_path else f"{node['name']}",
                            }
                        )

                if node.get("child"):
                    for child in node["child"]:
                        await traverse_and_add_actions(child)

            # Traverse to mark nodes and construct paths
            for node in import_list:
                node = dict(node)
                await traverse_and_mark_nodes(node, "", False)

            # Traverse to add actions based on the marked nodes
            for node in import_list:
                node = dict(node)
                await traverse_and_add_actions(node)
            if add_actions["payload"]:
                self.data = [import_actions, add_actions]
            else:
                self.data = [import_actions]
            self.status = "success"
            self.message = "Import actions generated successfully."
        except Exception as e:
            logging.debug(e)
            self.data = None
            self.status = "failed"
            self.message = "Import actions generation failed."
        return self.get_response()

    async def update_progress(self, id, status: str, progress: int, log: str, visual_graph=None):
        response = self.blueprint_dao.update_blueprint_download_info(id, status, progress, log, visual_graph)
        if not response:
            return None
        return response

    async def create_blueprint_download_info(self, user, status: str, progress: int, log: str, visual_graph=None):
        request_body = {
            "status": status,
            "progress": progress,
            "log": log,
            "visual_graph": visual_graph,
        }
        response = self.blueprint_dao.create_blueprint_download_info(user, request_body)
        return response

    async def sas_zip_link(self, user, node: List[Dict[str, Any]], image, visual_graph, share_name: str):
        response = {
            "message": "SAS link generation failed.",
            "status": CodeExecutionStatus.failed.value,
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        duplicate = {}
        try:
            download_name = f"{user['first_name']}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            create_response = await self.create_blueprint_download_info(
                user, CodeExecutionStatus.pending.value, 20, "Copying started"
            )
            if create_response:
                response.update(
                    {
                        "status": create_response.status,
                        "progress": create_response.progress,
                        "message": create_response.log,
                        "status_code": status.HTTP_200_OK,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
            for action in node:
                if not (action["action"] in duplicate):
                    duplicate[action["action"]] = []
                for payload in action["payload"]:
                    if payload["name"].lower() in duplicate[action["action"]]:
                        response.update(
                            {
                                "status": "failed",
                                "message": "Duplicate Blueprint exists.",
                                "status_code": status.HTTP_400_BAD_REQUEST,
                            }
                        )
                        yield f"data: {json.dumps(response)}\n\n"
                        return
                    duplicate[action["action"]].append(payload["name"].lower())
                for payload in action["payload"]:
                    if action["action"] == "add":
                        action_copy = await self.azure_file_share_service._ensure_directory_structure(
                            share_name=share_name, directory_path=f"temp/{download_name}/{payload['path']}"
                        )
                    elif action["action"] == "copy":
                        action_copy = await self.azure_file_share_service.import_directory_or_file(
                            source_share_name=share_name,
                            destination_share_name=share_name,
                            source_path=payload["source"],
                            destination_path=f"temp/{download_name}/{payload['path']}",
                        )
                        if action_copy["status"] == CodeExecutionStatus.failed.value:
                            await self.update_progress(
                                create_response.id,
                                CodeExecutionStatus.failed.value,
                                0,
                                f"Failed to copy {payload['source']}",
                            )
                            response.update(
                                {
                                    "status": action_copy["status"],
                                    "message": action_copy["message"],
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                            )
                            yield f"data: {json.dumps(response)}\n\n"
                            return
                    elif action["action"] == "remove":
                        action_copy = await self.azure_file_share_service.delete_directory_tree_from_share(
                            share_name=share_name, directory_path=f"temp/{download_name}/{payload['path']}"
                        )
                        if action_copy["status"] == CodeExecutionStatus.failed.value:
                            await self.update_progress(
                                create_response.id,
                                CodeExecutionStatus.failed.value,
                                0,
                                f"Failed to remove {payload['path']}",
                            )
                            response.update(
                                {
                                    "status": action_copy["status"],
                                    "message": action_copy["message"],
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                            )
                            yield f"data: {json.dumps(response)}\n\n"
                            return
                    else:
                        response.update(
                            {
                                "status": CodeExecutionStatus.failed.value,
                                "message": "Unknown action",
                                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                            }
                        )
                        yield f"data: {json.dumps(response)}\n\n"
                        return
            file_stream = BytesIO(await image.read())
            response_img = await self.azure_file_share_service.upload_file_to_specific_path(
                share_name,
                f"temp/{download_name}/{image.filename}",
                file_stream=file_stream,
            )
            file_stream.close()
            if response_img["status"] == CodeExecutionStatus.failed.value:
                await self.update_progress(
                    create_response.id, CodeExecutionStatus.failed.value, 0, "Failed to upload image"
                )
                response.update(
                    {
                        "status": response_img["status"],
                        "message": response_img["message"],
                        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
                return
            response_json = await self.azure_file_share_service.upload_file_to_specific_path(
                share_name,
                f"temp/{download_name}/visual_graph.json",
                file_stream=json.dumps(visual_graph),
            )
            if response_json["status"] == CodeExecutionStatus.failed.value:
                await self.update_progress(
                    create_response.id, CodeExecutionStatus.failed.value, 0, "Failed to upload json"
                )
                response.update(
                    {
                        "status": response_json["status"],
                        "message": response_json["message"],
                        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
                return
            update_response = await self.update_progress(
                create_response.id,
                CodeExecutionStatus.pending.value,
                60,
                "Files copied, creating zip file",
                visual_graph,
            )
            if update_response:
                response.update(
                    {
                        "status": update_response.status,
                        "progress": update_response.progress,
                        "message": update_response.log,
                        "status_code": status.HTTP_200_OK,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
            zip_file_path = await self.azure_file_share_service.zip_directory_in_fileshare(
                share_name,
                f"temp/{download_name}",
                f"temp/{download_name}.zip",
            )
            delete_response = await self.azure_file_share_service.delete_directory_tree_from_share(
                share_name, directory_path=f"temp/{download_name}"
            )
            if delete_response["status"] == CodeExecutionStatus.failed.value:
                await self.update_progress(
                    create_response.id, CodeExecutionStatus.failed.value, 0, "Failed to delete temp directory"
                )
                response.update(
                    {
                        "status": delete_response["status"],
                        "message": delete_response["message"],
                        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
                return
            update_response = await self.update_progress(
                create_response.id, CodeExecutionStatus.pending.value, 80, "Zip file created"
            )
            if update_response and zip_file_path:
                response.update(
                    {
                        "status": update_response.status,
                        "progress": update_response.progress,
                        "message": update_response.log,
                        "status_code": status.HTTP_200_OK,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
            sas_link = (
                await self.azure_file_share_service.generate_sas_token(share_name, zip_file_path)
                if zip_file_path
                else None
            )
            update_response = await self.update_progress(
                create_response.id, CodeExecutionStatus.success.value, 100, "Download Initiated"
            )
            if update_response and sas_link:
                response.update(
                    {
                        "status": update_response.status,
                        "progress": update_response.progress,
                        "message": update_response.log,
                        "sas_link": sas_link,
                    }
                )
                yield f"data: {json.dumps(response)}\n\n"
            else:
                response["message"] = "SAS link generation unsuccessful."
                response["status"] = CodeExecutionStatus.failed.value
                response["status_code"] = status.HTTP_500_INTERNAL_SERVER_ERROR
                yield f"data: {json.dumps(response)}\n\n"
        except Exception as e:
            logging.debug(e)
            response["status_code"] = status.HTTP_500_INTERNAL_SERVER_ERROR
            response["message"] = str(e)
            response["status"] = CodeExecutionStatus.failed.value
            yield f"data: {json.dumps(response)}\n\n"
            return

    async def save_image_download(self, user, node: List[Dict[str, Any]], visual_graph):
        await self.create_blueprint_download_info(
            user, CodeExecutionStatus.success.value, 100, "Image Download Initiated", visual_graph
        )

    async def upload_file(self, user, share_name, server_file_path, files, extract_zip):
        upload_files = []
        for file in files:
            file_content = await file.read()
            file_name = file.filename

            if extract_zip and file_name.endswith(".zip"):
                with zipfile.ZipFile(BytesIO(file_content)) as zip_ref:
                    for extracted_item in zip_ref.namelist():
                        target_path = f"{server_file_path}/{file_name[:-4]}/{extracted_item}"
                        if not extracted_item.endswith("/"):
                            extracted_file_stream = BytesIO(zip_ref.read(extracted_item))
                            response = await self.azure_file_share_service.upload_file_to_specific_path(
                                share_name, target_path, file_stream=extracted_file_stream
                            )
                            extracted_file_stream.close()
                            if response["status"] == CodeExecutionStatus.failed.value:
                                return {
                                    "status": response["status"],
                                    "message": response["message"],
                                    "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                                }
                        else:
                            response = await self.azure_file_share_service._ensure_directory_structure(
                                share_name, target_path
                            )
                upload_files.append(file_name[:-4])
            else:
                file_stream = BytesIO(await file.read())
                response = await self.azure_file_share_service.upload_file_to_specific_path(
                    share_name, f"{server_file_path}/{file.filename}", file_stream=file_stream
                )
                file_stream.close()
                if response["status"] == CodeExecutionStatus.failed.value:
                    return {
                        "status": response["status"],
                        "message": response["message"],
                        "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                    }
                upload_files.append(file_name)
        save_response = await self.save_solution_bp(
            user=user,
            share_name=share_name,
            nodes=OnSaveRequest(bp_name=server_file_path.split("/")[-1]),
            directory_path=server_file_path,
        )
        if save_response["status"] == CodeExecutionStatus.failed.value:
            return {
                "status": save_response["status"],
                "message": save_response["message"],
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        dir_mapping = {dir["name"]: dir for dir in save_response["data"]}
        dir_response = {
            "data": [dir_mapping[name] for name in upload_files if name in dir_mapping],
            "status": save_response["status"],
            "message": save_response["message"],
        }
        return {
            "status": CodeExecutionStatus.success.value,
            "message": "File uploaded successfully",
            "dir_tree": dir_response,
            "status_code": status.HTTP_200_OK,
        }

    async def get_solution_bp(self, user):
        result = {"data": [], "status": "failed"}
        response = self.blueprint_dao.get_solution_bp(user)
        for i in response:
            result["data"].append({"name": i.name, "status": i.status})
        result["status"] = "success"
        result["message"] = "get solution bp successful"
        result["status_code"] = status.HTTP_200_OK
        return result

    async def create_solution_bp(self, user, share_name, name, directory_path, is_super_admin):
        response = self.azure_file_share_service.create_sub_directory(share_name, directory_path, name)
        if response["status"] == CodeExecutionStatus.failed.value:
            return {
                "status": response["status"],
                "message": response["message"],
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        db_response = (
            self.blueprint_dao.create_solution_bp(user, name, f"{directory_path}/{name}", is_super_admin)
            if is_super_admin
            else self.blueprint_dao.create_solution_bp(user, name, f"{directory_path}/{name}")
        )
        if not db_response:
            return {
                "status": "failed",
                "message": "solution bp creation failed",
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            }
        solution_bp = self.blueprint_dao.get_blueprint_by_name(name=directory_path)  # get the latest golden blueprint
        bp = await self.azure_file_share_service.get_directory_tree(share_name, directory_path)
        if bp["status"] == "success":
            self.blueprint_dao.update_blueprint(
                user,
                solution_bp,
                None,
                bp["data"],
            )
        return {"status": "success", "message": "solution bp creation successful", "status_code": status.HTTP_200_OK}

    async def on_load_solution_bp(self, user, bp_name: str, share_name: str, directory_path: str):
        response = {
            "message": "On load solution bp failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        bp = self.blueprint_dao.on_load_solution_bp(bp_name)
        if bp:
            response["dir_tree"] = {"data": bp.dir_tree}
            response["visual_graph"] = bp.visual_graph
            response["status"] = "success"
            response["status_code"] = status.HTTP_200_OK
            response["message"] = "On load solution bp successful."
            return response
        save_bp = await self.save_solution_bp(user, share_name, OnSaveRequest(bp_name=bp_name), directory_path)
        if save_bp["status"] == CodeExecutionStatus.success.value:
            response["dir_tree"] = save_bp
            response["visual_graph"] = None
            response["status"] = "success"
            response["status_code"] = status.HTTP_200_OK
            response["message"] = "On load solution bp successful."
            return response
        return response
