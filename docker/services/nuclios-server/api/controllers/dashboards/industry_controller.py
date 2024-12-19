from typing import Dict, List

from api.controllers.base_controller import BaseController
from api.dtos.dashboards.dashboard_dto import DashboardDTO
from api.schemas.dashboards.function_schema import FunctionSchema
from api.schemas.dashboards.industry_schema import (
    GetAppByIndustryResponseSchema,
    IndustryCreateRequestSchema,
    IndustrySchema,
)
from api.services.dashboards.industry_service import IndustryService
from fastapi import Request


class IndustryController(BaseController):
    def get_industries(self):
        with IndustryService() as industry_service:
            industries = industry_service.get_industries()
            return self.get_serialized_list(IndustrySchema, industries)

    def create_industry(self, user_id: int, request_data: IndustryCreateRequestSchema) -> dict:
        with IndustryService() as industry_service:
            industry = industry_service.create_industry(user_id, request_data)
            industry = self.get_serialized_data(IndustrySchema, industry)
            return {"message": "Industry Created Successfully", "industry_data": industry}

    def update_industry(self, user_id: int, industry_id: int, request_data: IndustryCreateRequestSchema) -> dict:
        with IndustryService() as industry_service:
            industry = industry_service.update_industry(user_id, industry_id, request_data)
            industry = self.get_serialized_data(IndustrySchema, industry)
            return {"message": "Updated successfully", "industry_data": industry}

    def delete_industry(self, user_id: int, industry_id: int) -> dict:
        with IndustryService() as industry_service:
            response = industry_service.delete_industry(user_id, industry_id)
            return response

    def get_dashboard_by_industry_id(self, industry_id: int) -> DashboardDTO | Dict:
        with IndustryService() as industry_service:
            dashboard = industry_service.get_dashboard_by_industry_id(industry_id)
            return dashboard

    def get_apps_by_industry_id(self, request: Request, industry: str) -> List[GetAppByIndustryResponseSchema]:
        with IndustryService() as industry_service:
            apps = industry_service.get_apps_by_industry_id(request, industry)
            return self.get_serialized_list(GetAppByIndustryResponseSchema, apps)

    def get_functions(self, industry_id: int) -> List[FunctionSchema]:
        with IndustryService() as industry_service:
            functions = industry_service.get_functions(industry_id)
            return self.get_serialized_list(FunctionSchema, functions)
