import json
from typing import Dict, List

from api.constants.dashboards.industry_error_messages import IndustryErrors
from api.daos.dashboards.function_dao import FunctionDao
from api.daos.dashboards.industry_dao import IndustryDao
from api.dtos.dashboards.dashboard_dto import DashboardDTO
from api.dtos.dashboards.function_dto import FunctionDTO
from api.dtos.dashboards.industry_dto import AppDTO, IndustryDTO
from api.helpers.apps.app_helper import AppHelper
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import Industry
from api.schemas.dashboards.industry_schema import IndustryCreateRequestSchema
from api.services.base_service import BaseService
from api.utils.app.app import sanitize_content
from fastapi import Request, status


class IndustryService(BaseService):
    def __init__(self):
        super().__init__()
        self.industry_dao = IndustryDao(self.db_session)
        self.function_dao = FunctionDao(self.db_session)
        self.app_helper = AppHelper(self.db_session)

    def get_industries(self) -> List[IndustryDTO]:
        industries: List[Industry] = self.industry_dao.get_industries()
        transformed_industries: List[IndustryDTO] = [IndustryDTO(industry) for industry in industries]
        return transformed_industries

    def create_industry(self, user_id: int, request_data: IndustryCreateRequestSchema) -> IndustryDTO:
        # Checking if an Industry with requested name already exists
        industry_name_exists: int = self.industry_dao.check_industry_by_name(request_data.industry_name)
        if industry_name_exists > 0:
            raise GeneralException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=IndustryErrors.INDUSTRY_NAME_ALREADY_EXISTS_ERROR.value,
            )

        new_industry: Industry = self.industry_dao.create_industry(user_id, request_data)
        new_industry: IndustryDTO = IndustryDTO(new_industry)
        return new_industry

    def update_industry(self, user_id: int, industry_id: int, request_data: IndustryCreateRequestSchema) -> IndustryDTO:
        # Checking if an Industry with requested id already exists
        industry_exists = self.industry_dao.check_industry_exist_by_id(industry_id)
        if industry_exists == 0:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": IndustryErrors.INDUSTRY_NOT_FOUND_ERROR.value},
            )

        # Checking if an Industry with requested name already exists
        industry_name_exists = self.industry_dao.check_industry_by_name_update(request_data.industry_name, industry_id)
        if industry_name_exists > 0:
            raise GeneralException(
                status.HTTP_400_BAD_REQUEST,
                message={"error": IndustryErrors.INDUSTRY_NAME_ALREADY_EXISTS_ERROR.value},
            )

        updated_industry: Industry = self.industry_dao.update_industry(user_id, industry_id, request_data)
        transformed_industry: IndustryDTO = IndustryDTO(updated_industry)
        return transformed_industry

    def delete_industry(self, user_id: int, industry_id: int) -> dict:
        # Checking if an Industry with requested id already exists
        industry_exists = self.industry_dao.check_industry_exist_by_id(industry_id)
        if industry_exists == 0:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": IndustryErrors.INDUSTRY_NOT_FOUND_ERROR.value},
            )

        self.industry_dao.delete_industry(user_id, industry_id)
        return {"message": " deleted successfully"}

    def get_dashboard_by_industry_id(self, industry_id: int) -> DashboardDTO | Dict:
        dashboard: DashboardDTO = self.industry_dao.get_dashboard_by_industry_id(industry_id)
        if not dashboard:
            return {"message": IndustryErrors.DASHBOARD_BY_INDUSTRY_ID_NOT_FOUND_ERROR.value}
        dashboard = DashboardDTO(dashboard)
        return dashboard

    def get_apps_by_industry_id(self, request: Request, industry: str) -> List[AppDTO]:
        check_industry_exists = self.industry_dao.check_industry_by_name(industry)
        if check_industry_exists == 0:
            raise GeneralException(
                message={"error": IndustryErrors.INDUSTRY_NOT_FOUND_ERROR.value},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        apps, user_app_ids = self.industry_dao.get_apps_by_industry_id(request.state.logged_in_email, industry)
        response = []
        if len(apps) == 0:
            return response
        for app in apps:
            app.industry = self.app_helper.industry_names(app.container_id)
            app.function = self.app_helper.function_names(app.container_id)

            app_access = False
            if request.state.platform_user.get("is_restricted_user", False):
                app_access = (
                    (app.id in user_app_ids) if json.loads(app.modules or "{}").get("user_mgmt", False) else True
                )
            else:
                app_access = True

            if app_access:
                response.append(AppDTO(app))

        return sanitize_content(response)

    def get_functions(self, industry_id: int) -> List:
        functions = self.function_dao.get_functions_by_industry_id(industry_id)

        functions_name_mapping = {fn.id: fn.function_name for fn in functions}
        transformed_functions = []

        industries_ids = [row[0] for row in self.industry_dao.get_all_industries_ids()]

        for fn in functions:
            parent_function_name = (
                functions_name_mapping.get(fn.parent_function_id) if getattr(fn, "parent_function_id") else None
            )
            transformed_functions.append(FunctionDTO(fn, parent_function_name, industries_ids))

        return transformed_functions
