import logging
from typing import List

from api.constants.dashboards.dashboard_error_messages import DashboardErrors
from api.constants.dashboards.dashboard_success_messages import DashboardSuccess
from api.daos.apps.app_dao import AppDao
from api.daos.apps.screen_dao import ScreenDao
from api.daos.dashboards.dashboard_dao import DashboardDao
from api.daos.dashboards.function_dao import FunctionDao
from api.daos.dashboards.industry_dao import IndustryDao
from api.daos.users.app_users_dao import AppUsersDao
from api.dtos.dashboards.dashboard_dto import (
    CreateDashboardDTO,
    DashboardDTO,
    DashboardTemplateDTO,
)
from api.dtos.dashboards.function_dto import BaseFunctionDTO
from api.dtos.dashboards.industry_dto import AppDTO, IndustryDTO
from api.helpers.apps.app_helper import AppHelper
from api.middlewares.error_middleware import GeneralException
from api.schemas.dashboards.dashboard_schema import (
    AppsScreensResponseSchema,
    CreateDashboardResponseSchema,
    CreateUpdateDashboardSchema,
    DashboardHierarchyResponseSchema,
    UserAppsHierarchyResponseSchema,
)
from api.schemas.generic_schema import MessageResponseSchema
from api.services.base_service import BaseService
from api.utils.dashboards.dashboard import get_all_applications
from fastapi import status


class DashboardService(BaseService):
    def __init__(self):
        super().__init__()
        self.dashboard_dao = DashboardDao(self.db_session)
        self.industry_dao = IndustryDao(self.db_session)
        self.function_dao = FunctionDao(self.db_session)
        self.app_helper = AppHelper(self.db_session)
        self.app_dao = AppDao(self.db_session)
        self.screen_dao = ScreenDao(self.db_session)
        self.app_users_dao = AppUsersDao(self.db_session)

    def get_dashboards(self) -> List[DashboardDTO]:
        dashboards = self.dashboard_dao.get_dashboards()
        return [DashboardDTO(dashboard) for dashboard in dashboards]

    def create_dashboard(
        self, user_id: int, request_data: CreateUpdateDashboardSchema
    ) -> CreateDashboardResponseSchema:
        dashboard = self.dashboard_dao.create_dashboard(
            dashboard_name=getattr(request_data, "name", None),
            dashboard_icon=getattr(request_data, "icon", None),
            dashboard_order=getattr(request_data, "order", None),
            root_industry_id=getattr(request_data, "root", None),
            dashboard_url=getattr(request_data, "url", None),
            dashboard_template_id=getattr(request_data, "template", None),
            created_by=user_id,
        )
        return {"status": "success", "dashboard_data": CreateDashboardDTO(dashboard)}

    def update_dashboard(
        self, user_id: int, dashboard_id: int, request_data: CreateUpdateDashboardSchema
    ) -> MessageResponseSchema:
        dashboard = self.dashboard_dao.get_dashboard_by_id(dashboard_id)

        if not dashboard:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardErrors.DASHBOARD_NOT_FOUND_ERROR.value},
            )

        self.dashboard_dao.update_dashboard(
            dashboard=dashboard,
            dashboard_name=getattr(request_data, "name", None),
            dashboard_icon=getattr(request_data, "icon", None),
            dashboard_order=getattr(request_data, "order", None),
            root_industry_id=getattr(request_data, "root", None),
            dashboard_url=getattr(request_data, "url", None),
            dashboard_template_id=getattr(request_data, "template", None),
            updated_by=user_id,
        )
        return {"message": DashboardSuccess.DASHBOARD_UPDATE_SUCCESS.value}

    def delete_dashboard(self, user_id: int, dashboard_id: int) -> MessageResponseSchema:
        dashboard = self.dashboard_dao.get_dashboard_by_id(dashboard_id)

        if not dashboard:
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardErrors.DASHBOARD_NOT_FOUND_ERROR.value},
            )

        self.dashboard_dao.delete_dashboard(
            dashboard=dashboard,
            deleted_by=user_id,
        )
        return {"message": DashboardSuccess.DASHBOARD_DELETE_SUCCESS.value}

    def get_dashboard_templates(self) -> List[DashboardTemplateDTO]:
        dashboard_templates = self.dashboard_dao.get_dashboard_templates()
        return [DashboardTemplateDTO(template) for template in dashboard_templates]

    def get_dashboard_details(self, dashboard_id: int, dashboard_url: str) -> DashboardDTO | MessageResponseSchema:
        if dashboard_id:
            dashboard_with_template = self.dashboard_dao.get_dashboard_with_template_by_id(dashboard_id)
        elif dashboard_url:
            dashboard_with_template = self.dashboard_dao.get_dashboard_with_template_by_url(dashboard_url)

        if dashboard_with_template:
            return DashboardDTO(dashboard_with_template[0], dashboard_with_template[1])
        return {"message": DashboardErrors.DASHBOARD_NOT_EXIST_ERROR.value}

    def get_dashboard_hierarchy(self, dashboard_id: int) -> DashboardHierarchyResponseSchema:
        try:
            dashboard = self.dashboard_dao.get_dashboard_by_id(dashboard_id)
            root_id = 0

            if not dashboard:
                raise GeneralException(
                    status.HTTP_404_NOT_FOUND,
                    message={"error": DashboardErrors.DASHBOARD_NOT_FOUND_ERROR.value},
                )

            root_id = dashboard.root_industry_id
            node_counter = 1

            def get_formatted_nodes(data, type, nodes):
                def formatter(dict):
                    nonlocal node_counter
                    formatted_dict = {
                        "id": dict.id,
                        "node_id": node_counter,
                        "type": type,
                        "color": dict.color,
                        "description": dict.description,
                    }
                    node_counter += 1
                    if type == "industry":
                        formatted_dict["label"] = dict.industry_name
                        formatted_dict["parent_industry_id"] = dict.parent_industry_id
                        formatted_dict["logo_name"] = dict.logo_name
                    else:
                        formatted_dict["label"] = dict.function_name
                        formatted_dict["parent_industry_id"] = dict.industry_id
                        formatted_dict["parent_function_id"] = dict.parent_function_id
                        formatted_dict["logo_name"] = dict.logo_name

                    if type != "application":
                        formatted_dict["level"] = dict.level
                    return formatted_dict

                data_nodes = [formatter(obj) for obj in data]
                nodes.extend(data_nodes)
                return

            nodes = []
            industries = self.industry_dao.get_all_industries(root_id)
            functions = self.function_dao.get_all_functions(industries)
            # for formatting nodes
            get_formatted_nodes(industries, "industry", nodes)
            get_formatted_nodes(functions, "function", nodes)
            # for formatting and also querying applications
            get_all_applications(industries, functions, nodes, node_counter, app_environments=["prod"])
            return {"result": nodes}
        except Exception as e:
            logging.exception(e)
            raise GeneralException(
                status.HTTP_404_NOT_FOUND,
                message={"error": DashboardErrors.DASHBOARD_HIERARCHY_ERROR.value},
            )

    def get_apps_and_screens(self, function_id: int) -> AppsScreensResponseSchema:
        result = self.app_dao.get_all_apps_by_function_id(function_id)
        apps = []
        for app in result:
            apps.append(
                {
                    "id": app[1],
                    "type": "application",
                    "label": app[2],
                    "parent_industry_id": app[3],
                    "parent_function_id": app[4],
                    "color": app[5],
                    "description": app[6],
                }
            )
        app_ids = []
        for app in apps:
            app_ids.append(app.get("id"))
        screens_list = self.screen_dao.get_app_screens_by_app_ids(app_ids)
        screens = []
        for screen in screens_list:
            screens.append(
                {
                    "id": screen[1],
                    "type": "screens",
                    "screen_index": screen[2],
                    "label": screen[3],
                    "app_id": screen[4],
                    "marked": screen[5],
                }
            )
        return {"applications": apps, "screens": screens}

    def get_user_apps_hierarchy(self, logged_in_email: str) -> UserAppsHierarchyResponseSchema:
        app_list = self.app_users_dao.get_all_apps_by_email(logged_in_email)
        for row in app_list:
            row.App.industry = self.app_helper.industry_names(row.App.container_id)
            row.App.function = self.app_helper.function_names(row.App.container_id)

        apps = [AppDTO(row.App).__dict__ for row in app_list]
        container_ids = [app["container_id"] for app in apps]
        container_mappings = self.app_dao.get_container_mappings_by_container_ids(container_ids)

        industry_ids = list(set([container_mapping.industry_id for container_mapping in container_mappings]))
        function_ids = list(set([container_mapping.function_id for container_mapping in container_mappings]))

        industries = [IndustryDTO(row).__dict__ for row in self.industry_dao.get_industries_by_ids(industry_ids)]
        functions = [BaseFunctionDTO(row).__dict__ for row in self.function_dao.get_functions_by_ids(function_ids)]

        industry_fun = [
            (container_mapping.industry_id, container_mapping.function_id) for container_mapping in container_mappings
        ]

        functions = [row for row in functions if (row["industry_id"], row["function_id"]) in industry_fun]

        return {"apps": apps, "industries": industries, "functions": functions}
