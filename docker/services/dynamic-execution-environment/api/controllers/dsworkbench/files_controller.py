from api.controllers.base_controller import BaseController
from api.services.dsworkbench.files_service import FilesService


class FilesController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.files_service = FilesService()

    async def preview_file(self, user, request_data: dict) -> dict:
        response = await self.files_service.preview_file(user, request_data)
        return response
