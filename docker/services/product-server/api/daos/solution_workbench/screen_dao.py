from api.models import AppScreen


class SolutionWorkbenchScreenDao:
    """
    Getting overview information for each screen.
    """

    def get_overview_details(self, request):
        return AppScreen.query.filter_by(
            id=request.view_args.get("screen_id"), app_id=request.view_args.get("app_id")
        ).first()
