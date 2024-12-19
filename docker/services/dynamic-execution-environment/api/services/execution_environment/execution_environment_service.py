import asyncio
import json
import re

from api.constants.execution_environment.variables import (  # HostingType,; InfraType,; CORE_PACKAGES,
    ApprovalStatus,
    ExecutionEnvironmentCategory,
    ExecutionEnvironmentType,
)
from api.daos.apps.app_dao import AppDao
from api.daos.execution_environment.execution_environment_dao import (
    ExecutionEnvironmentDao,
)
from api.dtos.execution_environment.execution_environment_dto import (
    AppEnvMapDTO,
    ExecutionEnvironmentDeploymentDTO,
    ExecutionEnvironmentDetailDTO,
    ExecutionEnvironmentDTO,
)
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
    MultipleException,
)
from api.schemas.execution_environment.execution_environment_schema import (
    ExecutionEnvironmentDeploymentSchema,
    ExecutionEnvironmentPackagesSchema,
)
from api.services.utils.execution_environment.execution_environment_event_utility_service import (
    ExecutionEnvironmentEventUtilityService,
)
from api.utils.execution_environment.k8_utils import fetch_deployment_logs

# from api.utils.execution_environment.execution_environment_utils import (
#     get_python_compatible_versions,
# )
from api.utils.package_validation_v2 import package_validation
from fastapi import status


class ExecutionEnvironmentService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.log_share_name = "train-repository"
        self.execution_environment_dao = ExecutionEnvironmentDao()
        self.app_dao = AppDao()
        self.execution_environment_event = ExecutionEnvironmentEventUtilityService()

    # def execution_environment_dao(self, func_name, *args, **kwargs):
    #     with ExecutionEnvironmentDao() as dao:
    #         func = getattr(dao, func_name)
    #         return func(*args, **kwargs)

    # def get_execution_environments(self, user, search, approval_status):
    #     execution_environments = self.execution_environment_dao(
    #         "get_execution_environments", user, search, approval_status
    #     )

    #     # Converting into DTO objects
    #     transformed_execution_environments = [
    #         ExecutionEnvironmentDetailDTO(execution_environment)
    #         for execution_environment in execution_environments
    #     ]
    #     return transformed_execution_environments

    def get_compute_config_by_id(self, sku_id):
        sku_details = self.execution_environment_dao.get_compute_config_by_id(sku_id)
        return sku_details

    def fetch_logs(self, deployment_name, namespace=None):
        return fetch_deployment_logs(deployment_name=deployment_name, namespace=namespace)

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

    def get_paginated_execution_environments(
        self, user, page, page_size, search, env_type, env_category, project_id, approval_status
    ):
        # Paginated Query and Total without pagination
        (
            execution_environments,
            total_available_execution_environments,
        ) = self.execution_environment_dao.get_paginated_execution_environments(
            user, page, page_size, search, env_type, env_category, project_id, approval_status
        )
        # Converting into DTO objects
        transformed_execution_environments = [
            ExecutionEnvironmentDetailDTO(execution_environment) for execution_environment in execution_environments
        ]
        return transformed_execution_environments, total_available_execution_environments

    def get_execution_environments(self, user, search, env_type, env_category, project_id, approval_status):
        execution_environments = self.execution_environment_dao.get_execution_environments(
            user, search, env_type, env_category, project_id, approval_status
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
            try:
                # trying to expire all the objects, so that we can get the latest data
                self.execution_environment_dao.db_session.expire_all()
            except Exception as e:
                print("Error in db session expire", str(e))

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

    def get_execution_environment_detail(self, user, id):
        execution_environment = self.execution_environment_dao.get_execution_environment_detail(id)

        if not execution_environment:
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        transformed_execution_environment = ExecutionEnvironmentDetailDTO(execution_environment)
        return transformed_execution_environment

    def get_execution_environment_id_by_app_id(self, user, id, default_env, fetch_execution_environment_details):
        execution_environment = self.execution_environment_dao.get_execution_environment_id_by_app_id(id)

        if not execution_environment:
            if default_env:
                default_execution_environment = self.execution_environment_dao.get_default_execution_environment()
                return (
                    ExecutionEnvironmentDetailDTO(default_execution_environment[0])
                    if default_execution_environment
                    else {}
                )
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        elif fetch_execution_environment_details:
            execution_environment_details = self.execution_environment_dao.get_execution_environment_detail(
                execution_environment.env_id
            )
            transformed_execution_environment = ExecutionEnvironmentDetailDTO(execution_environment_details)
            return transformed_execution_environment

        # transformed_execution_environment = AppEnvMapDTO(execution_environment)
        return execution_environment

    def get_execution_environment_deployment_by_env_id(self, user, id):
        execution_environment_deployment = (
            self.execution_environment_dao.get_execution_environment_deployment_by_env_id(id)
        )

        if not execution_environment_deployment:
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        transformed_execution_environment_deployment = ExecutionEnvironmentDeploymentDTO(
            execution_environment_deployment
        )
        return transformed_execution_environment_deployment

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

    def validate_app_env_mapping(self, user, request_data, validate_for_app_only=False):
        app_count = self.app_dao.check_app_by_id(request_data["app_id"])
        if not app_count:
            raise DoesNotExistException(
                message="The selected App does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        if validate_for_app_only:
            return user, request_data, None

        execution_environment = self.execution_environment_dao.get_execution_environment_by_id(request_data["env_id"])
        if not execution_environment:
            raise AlreadyExistException(
                message="Selected Execution Environment doesn't exist or you don't have permission to use.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if execution_environment.env_type == ExecutionEnvironmentType.DEFAULT.value:
            return user, request_data, execution_environment
        return user, request_data, None

    def link_app_env(self, user, request_data):
        # Validating request_data
        delete_app_env_mapping = False
        if request_data.get("env_id") in [None, 0, -1]:
            delete_app_env_mapping = True
        user, request_data, execution_environment = self.validate_app_env_mapping(
            user, request_data, validate_for_app_only=delete_app_env_mapping
        )
        if execution_environment:
            app_env_map = self.execution_environment_dao.delete_linked_app_env(user, request_data.get("app_id"))
            return {"id": 0, "app_id": request_data["app_id"], "env_id": request_data["env_id"]}
        if delete_app_env_mapping:
            app_env_map = self.execution_environment_dao.delete_linked_app_env(user, request_data.get("app_id"))
            return {"id": 0, "app_id": request_data["app_id"], "env_id": -1}

        app_env_map = self.execution_environment_dao.link_app_env(user, request_data)

        return AppEnvMapDTO(app_env_map)

    def create_execution_environment_deployment(self, user, request_data, validate_schema=False):
        if validate_schema:
            request_data = dict(ExecutionEnvironmentDeploymentSchema(**request_data))
        # Call to Dao for db entry
        created_execution_environment_deployment = (
            self.execution_environment_dao.create_execution_environment_deployment(user, request_data)
        )
        transformed_execution_environment_deployment = ExecutionEnvironmentDeploymentDTO(
            created_execution_environment_deployment
        )
        return transformed_execution_environment_deployment

    def update_execution_environment(self, user, id, request_data, serialize_data=False):
        # Validating request_data
        user, execution_environment, request_data = self.validate_update_execution_environment(user, id, request_data)
        # Call to Dao for db entry
        updated_execution_environment = self.execution_environment_dao.update_execution_environment(
            user, execution_environment, request_data
        )
        transformed_execution_environment = ExecutionEnvironmentDetailDTO(updated_execution_environment)
        # if serialize_data:
        #     return dict(execution_environment_serializer.ExecutionEnvironmentSerializer(**transformed_execution_environment.__dict__))
        return transformed_execution_environment

    def update_execution_environment_deployment(self, user, id, request_data, validate_schema=False):
        if validate_schema:
            request_data = dict(ExecutionEnvironmentDeploymentSchema(**request_data))

        execution_environment_deployment = (
            self.execution_environment_dao.get_execution_environment_deployment_by_env_id(id)
        )
        if not execution_environment_deployment:
            raise DoesNotExistException(
                message="The Execution Environment Deployment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        # Call to Dao for db entry
        updated_execution_environment_deployment = (
            self.execution_environment_dao.update_execution_environment_deployment(
                user, execution_environment_deployment, request_data
            )
        )
        transformed_execution_environment_deployment = ExecutionEnvironmentDeploymentDTO(
            updated_execution_environment_deployment
        )
        return transformed_execution_environment_deployment

    def delete_execution_environment(self, user, id, delete_from_orchestrator=False):
        execution_environment = self.execution_environment_dao.get_execution_environment_by_id(id)
        if not execution_environment:
            raise DoesNotExistException(
                message="The Deployement Model does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        if execution_environment.env_type == ExecutionEnvironmentType.DEFAULT.value:
            is_backup_env_available = False
            default_execution_environments_ = self.execution_environment_dao.get_default_execution_environment()
            # default_execution_environments = [
            #     ExecutionEnvironmentDetailDTO(default_execution_environment)
            #     for default_execution_environment in default_execution_environments_
            # ]
            # for default_execution_environment in default_execution_environments:
            #     if default_execution_environment.id != id:
            #         is_backup_env_available = True
            #         break
            if len(default_execution_environments_) > 1:
                is_backup_env_available = True
            if not is_backup_env_available:
                raise GeneralException(
                    message="Default Execution Environment cannot be deleted without backup.",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )

        execution_environment_apps = self.execution_environment_dao.get_apps_by_execution_environment_id(user, id)
        if execution_environment_apps:
            raise GeneralException(
                message="Execution Environment is already assigned to App, deletion cannot be processed.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        # delete the project and env link
        if execution_environment.env_category == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            self.execution_environment_dao.delete_linked_project_env(user, id)

        # Delete Deployed Model
        soft_deleted_execution_environment = self.execution_environment_dao.delete_execution_environment(
            user, execution_environment
        )
        transformed_execution_environment = ExecutionEnvironmentDetailDTO(soft_deleted_execution_environment)
        return transformed_execution_environment

    def action_execution_environment(self, user, id, request_data=None):
        # Call to Dao for db entry
        execution_environment = self.execution_environment_dao.get_execution_environment_by_id(id)
        if not execution_environment:
            raise DoesNotExistException(
                message="The Execution Environment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        approval_status = self.execution_environment_dao.get_approval_status(id)
        if not request_data and approval_status and approval_status.approval_status == ApprovalStatus.PENDING.value:
            raise AlreadyExistException(
                message="This execution environment is already in Pending.",
                status_code=status.HTTP_409_CONFLICT,
            )
        if request_data and approval_status and approval_status.approval_status == request_data["action_type"]:
            raise AlreadyExistException(
                message=f"This execution environment is already {request_data['action_type']}",
                status_code=status.HTTP_409_CONFLICT,
            )
        self.execution_environment_dao.update_approval_status(
            user, id, execution_environment=execution_environment, request_data=request_data
        )
        transformed_execution_environment = ExecutionEnvironmentDetailDTO(execution_environment)
        return transformed_execution_environment

    async def get_stream_project_execution_environment_status_via_db(self, project_id):
        try:
            max_loops = 2000
            loop_count = 0
            while loop_count < max_loops:
                try:
                    # trying to expire all the objects, so that we can get the latest data
                    self.execution_environment_dao.db_session.expire_all()
                except Exception as e:
                    print("Error in db session expire", str(e))
                execution_environments = self.execution_environment_dao.get_execution_environments(
                    request=None, search=None, env_type=None, env_category=None, project_id=project_id
                )
                if not execution_environments:
                    response = {
                        "status": "no_environment",
                        "message": "No execution environment available.",
                        "endpoint": None,
                    }
                    yield f"data: {json.dumps(response)}\n\n"
                    return
                transformed_execution_environment = ExecutionEnvironmentDetailDTO(execution_environments[-1])

                response = {
                    "status": transformed_execution_environment.status,
                    "message": transformed_execution_environment.status,
                    "endpoint": transformed_execution_environment.endpoint,
                }
                yield f"data: {json.dumps(response)}\n\n"
                if transformed_execution_environment.status.lower() in ["failed", "completed", "running"]:
                    break
                loop_count += 1
                await asyncio.sleep(10)
            if loop_count >= max_loops:
                yield f"data: {json.dumps({'status': 'max_loops_reached', 'message': 'Maximum loop count reached.', 'endpoint': None,})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'status': 'error', 'message': str(e), 'endpoint': None})}\n\n"
