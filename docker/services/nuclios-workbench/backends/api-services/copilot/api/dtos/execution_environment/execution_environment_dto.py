import json

from api.dtos.common_dto import CloudProviderDTO, ComputeConfigDTO


class InfraTypeDTO:
    """
    Data Tranformation Object for the Infra Type.
    """

    def __init__(self, infra_type):
        self.id = infra_type.id
        self.name = infra_type.name


class ExecutionEnvironmentDetailDTO:
    """
    Data Tranformation Object for the Execution Environment Detail.
    """

    def __init__(self, execution_environment):
        self.id = execution_environment.id
        self.name = execution_environment.name
        self.cloud_provider = (
            CloudProviderDTO(execution_environment.cloud_provider) if execution_environment.cloud_provider_id else None
        )
        self.infra_type = (
            InfraTypeDTO(execution_environment.infra_type) if execution_environment.infra_type_id else None
        )
        self.compute = ComputeConfigDTO(execution_environment.compute) if execution_environment.compute_id else None
        self.env_type = execution_environment.env_type
        self.env_category = execution_environment.env_category
        self.compute_type = execution_environment.compute_type
        self.run_time = execution_environment.run_time
        self.run_time_version = execution_environment.run_time_version
        self.endpoint = execution_environment.endpoint
        self.packages = json.loads(execution_environment.packages) if execution_environment.packages else []
        self.index_url = execution_environment.index_url if execution_environment.index_url else None
        self.status = execution_environment.status
        self.created_by = (
            str(execution_environment.created_by_user.email_address) if execution_environment.created_by_user else None
        )
        self.created_at = str(execution_environment.created_at)


class AppEnvMapDTO:
    def __init__(self, app_env_map):
        self.id = app_env_map.id
        self.app_id = app_env_map.app_id
        self.env_id = app_env_map.env_id


class ExecutionEnvironmentDTO:
    """
    Data Tranformation Object for the Execution Environment.
    """

    def __init__(self, execution_environment):
        self.id = execution_environment.id
        self.name = execution_environment.name
        self.cloud_provider = (
            execution_environment.cloud_provider.name if execution_environment.cloud_provider_id else None
        )
        self.cloud_provider_id = (
            execution_environment.cloud_provider_id if execution_environment.cloud_provider_id else None
        )
        self.infra_type = execution_environment.infra_type.name if execution_environment.infra_type_id else None
        self.infra_type_id = execution_environment.infra_type_id if execution_environment.infra_type_id else None
        self.compute = None
        if execution_environment.compute_id and execution_environment.compute:
            if hasattr(execution_environment.compute, "name"):
                self.compute = execution_environment.compute.name
            elif hasattr(execution_environment.compute, "sku"):
                self.compute = execution_environment.compute.sku
        self.compute_id = execution_environment.compute_id if execution_environment.compute_id else None
        self.env_type = execution_environment.env_type
        self.env_category = execution_environment.env_category
        self.compute_type = execution_environment.compute_type
        self.run_time = execution_environment.run_time
        self.run_time_version = execution_environment.run_time_version
        self.endpoint = execution_environment.endpoint
        self.status = execution_environment.status if execution_environment.status else ""
        self.created_by = (
            str(execution_environment.created_by_user.email_address) if execution_environment.created_by_user else ""
        )
        self.created_at = str(execution_environment.created_at)


class ExecutionEnvironmentDeploymentDTO:
    """
    Data Tranformation Object for the Execution Environment Deployment.
    """

    def __init__(self, execution_environment_deployment):
        self.id = execution_environment_deployment.id
        self.name = execution_environment_deployment.name
        self.env_id = execution_environment_deployment.env_id if execution_environment_deployment.env_id else None
        self.uuid = execution_environment_deployment.uuid
        self.namespace = execution_environment_deployment.namespace
        self.created_by = (
            str(execution_environment_deployment.created_by_user.email_address)
            if execution_environment_deployment.created_by_user
            else ""
        )
        self.created_at = str(execution_environment_deployment.created_at)
