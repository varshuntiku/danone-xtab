import logging

from api.configs.settings import get_app_settings
from api.controllers.base_controller import BaseController
from api.orchestrators.copilot.handlers.skillset_orchestrator import Skillset
from api.services.copilot.skillset_service import SkillsetService


class SkillsetController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.execution_environment_service = SkillsetService()
        self.app_settings = get_app_settings()
        # self.execution_environment_event = SkillsetEventUtilityService()

    def get_current_env(self):
        name = self.app_settings.JPHUB_DEPLOYMENT_NAMESPACE
        all_envs = ["dev", "qa", "uat", "prod"]
        for env in all_envs:
            if env in name:
                return env
        return "dev"

    async def create_skillset(self, user, request_data) -> dict:
        skillset_model = {
            "name": request_data.get("name", ""),
            "id": request_data.get("id", ""),
            "connection_string": request_data.get("connection_string")
            or self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            "file_share_name": request_data.get("file_share_name") or "exec-env-repository",
            "file_share_parent": request_data.get("file_share_path") or "skillset-repository",
            "file_share_path": f"{self.get_current_env()}-{request_data.get('id', '')}",
            "image_url": self.app_settings.ACR_URL
            + "/"
            + (request_data.get("image_name") or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}"),
            "image_name": request_data.get("image_name")
            or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}",
            "files": request_data.get("files", []),
        }
        logging.info("User object in controller")

        await Skillset(user, self.to_dict(skillset_model)).create_skillset()
        return {
            "status": "success",
            "message": "Creation of Skillset has been initiated.",
        }

    async def delete_skillset(self, user, id) -> dict:
        request_data = {
            "id": id,
        }
        skillset_model = {
            "name": request_data.get("name", ""),
            "id": id,
            "connection_string": request_data.get("connection_string")
            or self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            "file_share_name": request_data.get("file_share_name") or "exec-env-repository",
            "file_share_parent": request_data.get("file_share_path") or "skillset-repository",
            "file_share_path": f"{self.get_current_env()}-{request_data.get('id', '')}",
            "image_url": self.app_settings.ACR_URL
            + "/"
            + (request_data.get("image_name") or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}"),
            "image_name": request_data.get("image_name")
            or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}",
        }
        await Skillset(user, self.to_dict(skillset_model)).delete_skillset()
        return {
            "message": "Execution Environment is deleted successfully.",
            "status": "success",
        }

    async def action_on_environment(self, user, id, action) -> dict:
        request_data = {
            "id": id,
        }
        skillset_model = {
            "name": request_data.get("name", ""),
            "id": id,
            "connection_string": request_data.get("connection_string")
            or self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            "file_share_name": request_data.get("file_share_name") or "exec-env-repository",
            "file_share_parent": request_data.get("file_share_path") or "skillset-repository",
            "file_share_path": f"{self.get_current_env()}-{request_data.get('id', '')}",
            "image_url": self.app_settings.ACR_URL
            + "/"
            + (request_data.get("image_name") or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}"),
            "image_name": request_data.get("image_name")
            or f"{self.get_current_env()}-skillset-{request_data.get('id', '')}",
        }
        await Skillset(user, self.to_dict(skillset_model)).action_on_environment(action=action)

        return {
            "message": f"{action} action on Environment is applied successfully.",
            "status": "success",
        }
