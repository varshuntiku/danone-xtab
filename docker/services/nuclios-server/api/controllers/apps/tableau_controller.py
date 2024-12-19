from api.controllers.base_controller import BaseController
from api.schemas.apps.tableau_schema import TableauSignInRequestSchema
from api.services.apps.tableau_service import TableauService


class TableauController(BaseController):
    def tableau_sign_in(self, request_data: TableauSignInRequestSchema):
        with TableauService() as tableau_service:
            response = tableau_service.tableau_sign_in(request_data)
            return response

    def get_workbooks(self, token: str, site_id: str, user_id: str):
        with TableauService() as tableau_service:
            response = tableau_service.get_workbooks(token, site_id, user_id)
            return response

    def get_views(self, token: str, site_id: str, workbook_id: str):
        with TableauService() as tableau_service:
            response = tableau_service.get_views(token, site_id, workbook_id)
            return response
