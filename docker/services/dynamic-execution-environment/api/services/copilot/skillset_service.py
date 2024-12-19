import asyncio
import json
import re

from api.constants.execution_environment.variables import (  # HostingType,; InfraType,; CORE_PACKAGES,
    ExecutionEnvironmentCategory,
    ExecutionEnvironmentType,
)
from api.daos.apps.app_dao import AppDao
from api.daos.execution_environment.execution_environment_dao import (
    ExecutionEnvironmentDao,
)
from api.dtos.execution_environment.execution_environment_dto import (
    ExecutionEnvironmentDetailDTO,
    ExecutionEnvironmentDTO,
)
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
    MultipleException,
)
from api.schemas.copilot.skillset_schema import ExecutionEnvironmentPackagesSchema
from api.services.utils.execution_environment.execution_environment_event_utility_service import (
    ExecutionEnvironmentEventUtilityService,
)

# from api.utils.execution_environment.execution_environment_utils import (
#     get_python_compatible_versions,
# )
from api.utils.package_validation_v2 import package_validation
from fastapi import status


class SkillsetService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.log_share_name = "train-repository"
        self.execution_environment_dao = ExecutionEnvironmentDao()
        self.app_dao = AppDao()
        self.execution_environment_event = ExecutionEnvironmentEventUtilityService()

    def get_compute_config_by_id(self, sku_id):
        sku_details = self.execution_environment_dao.get_compute_config_by_id(sku_id)
        return sku_details

    def validate_execution_environment_exist(self, execution_environment_id):
        execution_environment = self.execution_environment_dao.get_execution_environment_by_id(execution_environment_id)
        if not execution_environment:
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return execution_environment

    def format_packages(self, packages):
        formatted_packages = []
        for package in packages:
            formatted_packages.append(
                {"name": str(package["name"]).strip(), "version": str(package["version"]).strip()}
            )
        return formatted_packages

    def validate_packages(self, user, request_data):
        request_data = json.loads(
            json.dumps(
                ExecutionEnvironmentPackagesSchema(**request_data),
                default=lambda o: o.__dict__,
            )
        )
        request_data["packages"] = self.format_packages(request_data["packages"])
        response = package_validation(
            request_data["run_time_version"],
            request_data["packages"],
            index_url=request_data["index_url"] if request_data["index_url"] else None,
        )
        errors = response.get("errors", [])
        if errors:
            raise MultipleException(
                message="Validation Error, check errors for mode detals.",
                status_code=status.HTTP_400_BAD_REQUEST,
                errors=errors,
            )
        return request_data["packages"]

    def validate_create_execution_environment(self, user, request_data):
        if not re.fullmatch(r"[a-z0-9]([-a-z0-9]*[a-z0-9])", request_data["name"]):
            raise GeneralException(
                message="must consist of lower case alphanumeric characters or '-', and must start and end with an alphanumeric character.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if not request_data["name"]:
            raise GeneralException(
                message="Name is required.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        execution_environment = self.execution_environment_dao.get_execution_environment_by_name(request_data["name"])
        if execution_environment:
            raise AlreadyExistException(
                message="The Execution Environment with name already exist.",
                status_code=status.HTTP_409_CONFLICT,
            )

        if request_data["env_type"] == ExecutionEnvironmentType.DEFAULT.value:
            is_default_env_exist = len(self.execution_environment_dao.get_default_execution_environment()) > 1
            if is_default_env_exist:
                raise AlreadyExistException(
                    message="The Default Execution Environment already exists.",
                    status_code=status.HTTP_409_CONFLICT,
                )

        if request_data["env_category"] == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            is_custom_env_exist = len(
                self.execution_environment_dao.get_execution_environments(
                    {}, "", "", request_data["env_category"], request_data["project_id"]
                )
            )
            if is_custom_env_exist:
                raise AlreadyExistException(
                    message="The DS Workbench Execution Environment already exists for this Project.",
                    status_code=status.HTTP_409_CONFLICT,
                )

        cloud_provider = self.execution_environment_dao.get_cloud_provider_by_id(request_data["cloud_provider_id"])
        if not cloud_provider:
            raise DoesNotExistException(
                message="The selected Cloud Provider does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if "compute_id" in request_data and request_data["compute_id"]:
            cloud_provider = self.execution_environment_dao.get_compute_config_by_id(request_data["compute_id"])
            if not cloud_provider:
                raise DoesNotExistException(
                    message="The selected Cloud Compute config does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )

        infra_type = self.execution_environment_dao.get_infra_type_by_name(request_data.pop("infra_type"))
        if not infra_type:
            raise DoesNotExistException(
                message="The selected Infra Type does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        request_data["infra_type"] = infra_type

        # validating index url
        pattern = r"(https?://.+)/(simple|pypi|index)/?"
        if request_data["index_url"] and not re.match(pattern, str(request_data["index_url"]).strip()):
            raise DoesNotExistException(
                message="The selected index url does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        # Validating Packages
        request_data["packages"] = self.validate_packages(user, request_data)
        return user, request_data

    def validate_update_execution_environment(self, user, id, request_data):
        execution_environment = self.validate_execution_environment_exist(id)

        if execution_environment.name != request_data["name"]:
            raise GeneralException(
                message="Name is not matching with record.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        if "infra_type" in request_data:
            infra_type = self.execution_environment_dao.get_infra_type_by_name(request_data.pop("infra_type"))
            if not infra_type:
                raise DoesNotExistException(
                    message="The selected Infra Type does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
            request_data["infra_type"] = infra_type

        if "packages" in request_data and request_data["packages"]:
            # Validating Packages
            request_data["packages"] = self.validate_packages(user, request_data)

        if "index_url" in request_data and request_data["index_url"]:
            # validating index url
            pattern = r"(https?://.+)/(simple|pypi|index)/?"
            if request_data["index_url"] and not re.match(pattern, str(request_data["index_url"]).strip()):
                raise DoesNotExistException(
                    message="The selected index url does not exist.",
                    status_code=status.HTTP_404_NOT_FOUND,
                )
        return user, execution_environment, request_data

    def get_paginated_execution_environments(self, user, page, page_size, search, env_type, env_category, project_id):
        # Paginated Query and Total without pagination
        (
            execution_environments,
            total_available_execution_environments,
        ) = self.execution_environment_dao.get_paginated_execution_environments(
            user, page, page_size, search, env_type, env_category, project_id
        )
        # Converting into DTO objects
        transformed_execution_environments = [
            ExecutionEnvironmentDetailDTO(execution_environment) for execution_environment in execution_environments
        ]
        return transformed_execution_environments, total_available_execution_environments

    def get_execution_environments(self, user, search, env_type, env_category, project_id):
        execution_environments = self.execution_environment_dao.get_execution_environments(
            user, search, env_type, env_category, project_id
        )
        # Converting into DTO objects
        transformed_execution_environments = [
            ExecutionEnvironmentDetailDTO(execution_environment) for execution_environment in execution_environments
        ]
        return transformed_execution_environments

    def get_execution_environment_by_id(self, user, id):
        execution_environment = self.execution_environment_dao.get_execution_environment_by_id(id)

        if not execution_environment:
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        transformed_execution_environment = ExecutionEnvironmentDTO(execution_environment)
        return transformed_execution_environment

    async def get_stream_execution_environment_status_via_db(self, user, id):
        while True:
            await asyncio.sleep(10)
            response = {"status": "eoc", "message": "End of connection.", "endpoint": None}

            execution_environment = self.execution_environment_dao.get_execution_environment_by_id(id)

            if execution_environment:
                transformed_execution_environment = ExecutionEnvironmentDTO(execution_environment)
                response = {
                    "status": transformed_execution_environment.status,
                    "message": transformed_execution_environment.status,
                    "endpoint": transformed_execution_environment.endpoint,
                }
            yield f"data: {json.dumps(response)}\n\n"
            if response["status"].lower() in ["failed", "completed", "running"]:
                break

    # Creat Execution Environment
    def create_execution_environment(self, user, request_data):
        # Validating request_data
        user, request_data = self.validate_create_execution_environment(user, request_data)

        project_id = None
        if request_data["env_category"] == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            project_id = request_data.pop("project_id", None)
            if not project_id:
                raise GeneralException(
                    message="Project ID is required for DS Workbench Execution Environment.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
        else:
            request_data.pop("project_id", None)

        # Call to Dao for db entry
        created_execution_environment = self.execution_environment_dao.create_execution_environment(user, request_data)
        if project_id:
            # Linking Project with Execution Environment
            self.execution_environment_dao.link_project_env(
                user,
                {
                    "project_id": project_id,
                    "env_id": created_execution_environment.id,
                },
            )
        transformed_execution_environment = ExecutionEnvironmentDetailDTO(created_execution_environment)
        return transformed_execution_environment
