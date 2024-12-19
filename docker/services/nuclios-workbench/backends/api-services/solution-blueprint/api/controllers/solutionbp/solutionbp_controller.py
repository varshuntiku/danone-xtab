import logging
from typing import Any, Dict, List

from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import SolutionBlueprintType
from api.controllers.base_controller import BaseController
from api.schemas.solutionbp.solutionbp_schema import (
    DefaultSolutionBlueprint,
    OnSaveRequest,
)
from api.services.solutionbp.solutionbp_service import SolutionBlueprintService
from fastapi import status
from fastapi.responses import StreamingResponse


class SolutionBlueprintController(BaseController):
    def __init__(self) -> None:
        self.solution_bp_service = SolutionBlueprintService()
        self.settings = get_app_settings()
        self.response = None

    async def get_directory_tree(
        self, user, share_name: str, directory_path: str = "", name: str = None, project_id: int = None
    ):
        response = {
            "message": "Get directory tree failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "file_share_name": share_name,
            "file_prefix": directory_path,
        }
        try:
            result = await self.solution_bp_service.get_directory_tree(
                user, share_name, directory_path, name, project_id
            )

            if result:
                response.update(result)
        except Exception as e:
            logging.debug(e)
        return response

    async def save_solution_bpn(
        self,
        user,
        source_share_name: str,
        destination_share_name: str,
        nodes: OnSaveRequest,
        directory_path: str = None,
    ):
        response = {
            "message": "Save solution blueprint failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            action_response = await self.solution_bp_service.process_save_actions(
                source_share_name, destination_share_name, nodes
            )
            if action_response["status"] == "failed":
                response.update(action_response)
                return response
            save_response = (
                await self.solution_bp_service.save_solution_bp(user, destination_share_name, nodes)
                if not directory_path
                else await self.solution_bp_service.save_solution_bp(
                    user, destination_share_name, nodes, directory_path
                )
            )
            if save_response["status"] == "success":
                response.update(
                    {
                        "message": "Blueprint saved successfully.",
                        "status": "success",
                        "status_code": status.HTTP_200_OK,
                        "project_id": nodes.project_id,
                        "visual_graph": nodes.visual_graph if nodes.visual_graph else [],
                        "dir_tree": save_response if save_response else [],
                    }
                )
        except Exception as e:
            logging.debug(e)
        return response

    async def on_default(
        self, user, source_share_name: str, destination_share_name: str, node: DefaultSolutionBlueprint
    ):
        response = {
            "message": "on default is unsuccessful.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            default_bp = await self.get_directory_tree(
                user,
                source_share_name,
                f"{SolutionBlueprintType.GOLDEN.value}/{SolutionBlueprintType.DEFAULT.value}",
                name=SolutionBlueprintType.DEFAULT.value,
            )
            default_dbp = await self.solution_bp_service.save_solution_bp_on_default(
                user, source_share_name, destination_share_name, node, default_bp
            )
            if default_dbp["status"] == "success":
                response["message"] = "Blueprint saved successfully."
                response["status"] = "success"
                response["status_code"] = status.HTTP_200_OK
                response["project_id"] = node.project_id
                response["bp_name"] = node.bp_name
                response["visual_graph"] = default_bp["visual_graph"] if default_bp["visual_graph"] else []
                response["dir_tree"] = default_bp["dir_tree"]
        except Exception as e:
            logging.debug(e)
        return response

    async def merge_directory_trees(
        self, project_id, current_state: List[Dict[str, Any]], import_list: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        response = {
            "message": "Import failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            import_action_response = await self.solution_bp_service.generate_import_actions(import_list, project_id)
            traversed_import_list = await self.solution_bp_service.traverse_import_list(import_list)
            merge_response = await self.solution_bp_service.merge_jsons(current_state, traversed_import_list)
            if merge_response["status"] == "success":
                updated_merge_response = await self.solution_bp_service.update_node_ids(merge_response["data"])
            if (
                merge_response["status"] == "success"
                and import_action_response["status"] == "success"
                and updated_merge_response["status"] == "success"
            ):
                response["message"] = "Import successful."
                response["status"] = "success"
                response["status_code"] = status.HTTP_200_OK
                response["current_state"] = merge_response["data"]
                response["import_action_list"] = import_action_response["data"]
        except Exception as e:
            logging.debug(e)
        return response

    async def download_blueprint(self, user, node: List[Dict[str, Any]], image, visual_graph, share_name: str):
        response = {
            "message": "Download failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            if image:
                return StreamingResponse(
                    self.solution_bp_service.sas_zip_link(user, node, image, visual_graph, share_name),
                    media_type="text/event-stream",
                )
            else:
                await self.solution_bp_service.save_image_download(user, node, visual_graph)
                response.update(
                    {
                        "message": "Download Initiated successfully.",
                        "status": "success",
                        "status_code": status.HTTP_200_OK,
                    }
                )
        except Exception as e:
            logging.debug(e)
        return response

    async def upload_file(self, user, files, request_data) -> dict:
        response = {
            "message": "File upload failed.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            model_job = await self.solution_bp_service.upload_file(
                user, request_data["share_name"], request_data["server_file_path"], files, request_data["extract_zip"]
            )

            if model_job["status"] == "success":
                response["message"] = "File uploaded successfully."
                response["status_code"] = status.HTTP_200_OK
                response["dir_tree"] = model_job["dir_tree"]
                return response
            return response
        except Exception as e:
            logging.debug(e)
            return response

    async def get_solution_bp(self, user, all_dirs: bool = False, share_name: str = None):
        response = {
            "message": "Get solution bp failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            if all_dirs:
                dir_tree = await self.solution_bp_service.get_directory_tree(
                    user, share_name, f"{SolutionBlueprintType.GOLDEN.value}", name=SolutionBlueprintType.GOLDEN.value
                )
                result = dir_tree["dir_tree"]
            else:
                result = await self.solution_bp_service.get_solution_bp(user)
            if result:
                response.update(result)
        except Exception as e:
            logging.debug(e)
        return response

    async def create_solution_bp(
        self, user, share_name: str, name: str, directory_path: str, is_super_admin: bool
    ) -> dict:
        response = {
            "message": "Create solution bp failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            result = await self.solution_bp_service.create_solution_bp(
                user, share_name, name, directory_path, is_super_admin
            )
            if result:
                response.update(result)
        except Exception as e:
            logging.debug(e)
        return response

    async def on_load_solution_bp(self, user, bp_name: str, share_name: str, directory_path: str) -> dict:
        response = {
            "message": "On load solution bp failed.",
            "status": "failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            result = await self.solution_bp_service.on_load_solution_bp(user, bp_name, share_name, directory_path)
            if result:
                response.update(result)
        except Exception as e:
            logging.debug(e)
        return response
