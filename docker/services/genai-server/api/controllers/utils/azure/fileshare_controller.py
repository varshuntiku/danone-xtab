import logging

from api.controllers.base_controller import BaseController
from api.services.utils.azure import fileshare_service
from fastapi import status


class AzureFileShareController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.azure_file_share_service = fileshare_service.AzureFileShareService()

    def upload_file_to_file_share(self, user, file, request_data) -> dict:
        response = {
            "message": "File upload failed.",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
        }
        try:
            # Creating Temporary File in Local.
            file_location = f"./{file.filename}"
            fileshare_service.create_local_file_reference_to_upload_file(file, file_location)

            # Uploading File to File Share.
            model_job = self.azure_file_share_service.upload_file_to_specific_path(
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
