import logging

from api.configs.settings import get_app_settings
from api.controllers.base_controller import BaseController
from api.services.dsworkbench.solutionbp_service import SolutionBlueprintService
from api.services.utils.azure import fileshare_service
from fastapi import status


class AzureFileShareController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.azure_file_share_service = fileshare_service.AzureFileShareService()
        self.solution_bp_service = SolutionBlueprintService()
        self.settings = get_app_settings()
        self.response = None

    async def upload_file_to_file_share(self, user, file, request_data) -> dict:
        response = {
            "message": "File upload failed.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            # Creating Temporary File in Local.
            file_location = f"./{file.filename}"
            fileshare_service.create_local_file_reference_to_upload_file(file, file_location)

            # Uploading File to File Share.
            model_job = await self.azure_file_share_service.upload_file_to_specific_path(
                request_data["share_name"],
                request_data["server_file_path"],
                file_location,
            )

            # Deleting Temporary File
            fileshare_service.delete_local_file_reference_to_upload_file(file_location)

            if model_job["status"] == "success":
                response["message"] = "File uploaded successfully."
                response["status_code"] = status.HTTP_200_OK
                return response
            return response
        except Exception as e:
            logging.debug(e)
            return response

    def get_available_directories_in_specific_path(self, share_name, directory_path):
        response = {
            "data": [],
            "message": "Fetching the list of directories failed.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            model_job = self.azure_file_share_service.get_available_directories_in_specific_path(
                share_name, directory_path
            )
            if model_job["status"] == "success":
                for index, data in enumerate(model_job["data"]):
                    response["data"].append({"name": data["name"], "id": (index + 1)})
                response["message"] = "Fetching the list of directories is successfully."
                response["status_code"] = status.HTTP_200_OK
            return response
        except Exception as e:
            logging.debug(e)
            return response
