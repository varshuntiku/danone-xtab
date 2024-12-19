from api.controllers.base_controller import BaseController
from api.services.dsworkbench.jphub_service import JPHubJobService


class JPHubJobController(BaseController):
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.jphub_job_service = JPHubJobService()

    async def hard_reload(self, user, project_id: int) -> dict:
        response = await self.jphub_job_service.hard_reload(user, project_id)
        return response
