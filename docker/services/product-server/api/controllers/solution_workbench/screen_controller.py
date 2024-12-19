from api.errors.request_validation_error import RequestValidatonError
from api.serializers.solution_workbench.screen_serializer import OverviewSerializer
from api.services.solution_workbench.screen_service import (
    SolutionWorkbenchScreenService,
)
from flask import jsonify


class SolutionWorkbenchScreenController:
    """
    Returning valid response.
    Getting data from DTOs and serializing it in desired format.
    """

    def __init__(self) -> None:
        self.solution_workbench_screen_service = SolutionWorkbenchScreenService()

    def get_overview_details(self, request):
        try:
            overview = self.solution_workbench_screen_service.get_overview_details(request)
            serializer = OverviewSerializer(overview)
            return jsonify(serializer.serialized_data), 200

        except RequestValidatonError as validation_error:
            return (
                jsonify(validation_error.serialize_error()),
                validation_error.status_code,
            )
