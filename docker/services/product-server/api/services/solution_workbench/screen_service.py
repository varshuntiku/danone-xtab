from api.daos.solution_workbench.screen_dao import SolutionWorkbenchScreenDao
from api.dtos.solution_workbench.screen_dto import OverviewDTO


class SolutionWorkbenchScreenService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    List of Packages and Libraries are loaded from product_server/requirements.txt.
    """

    def __init__(self):
        self.solution_workbench_screen_dao = SolutionWorkbenchScreenDao()

    def get_overview_details(self, request):
        overview = self.solution_workbench_screen_dao.get_overview_details(request)
        transformed_overview = OverviewDTO(overview)

        return transformed_overview
