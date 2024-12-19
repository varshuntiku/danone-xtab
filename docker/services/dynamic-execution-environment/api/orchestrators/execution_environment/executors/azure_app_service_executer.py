import asyncio
import logging

import httpx
import requests
from api.configs.settings import get_app_settings
from api.constants.execution_environment.variables import (
    ExecutionEnvironmentComputeType,
)
from api.orchestrators.execution_environment.executors.base_executor import (
    OrchestratorExecutionBase,
)
from api.orchestrators.execution_environment.executors.execution_environment_executor import (
    ExecutionEnvironmentExecutor,
)
from api.services.utils.azure.fileshare_service import AzureFileShareService
from azure.identity import ClientSecretCredential, DefaultAzureCredential
from azure.mgmt.web import WebSiteManagementClient
from azure.storage.fileshare import ShareFileClient


class AzureAppServiceManager(OrchestratorExecutionBase):
    def __init__(self, subscription_id, resource_group, user, execution_model):
        super().__init__(user, execution_model)
        self.app_settings = get_app_settings()
        self.azure_file_share_service = AzureFileShareService()
        self.subscription_id = subscription_id
        self.resource_group = resource_group
        client_id = self.app_settings.AD_CLIENT_ID
        secret = self.app_settings.AD_CLIENT_SECRET
        tenant = self.app_settings.TENANT_ID
        self.file_share_name = "exec-env-repository"
        self.file_prefix = "execution_env_"
        if id and secret and tenant:
            self.credentials = ClientSecretCredential(tenant_id=tenant, client_id=client_id, client_secret=secret)
        else:
            self.credentials = DefaultAzureCredential()
        self.client = WebSiteManagementClient(self.credentials, self.subscription_id)
        self.execution_environment_executer = ExecutionEnvironmentExecutor(user, execution_model)
        self.location = self.app_settings.AZURE_APP_SERVICE_LOCATION

    def create_app_service_plan(self, plan_name):
        logging.info(f"Creating app service plan: {plan_name}")
        sku = self.execution_model["compute"]
        temp = sku["name"].split("_")
        service_plan = self.client.app_service_plans.begin_create_or_update(
            self.resource_group,
            plan_name,
            {
                "location": self.location,
                "sku": {
                    "name": temp[1],
                    "tier": temp[0],
                    "size": temp[1],
                    "capacity": sku["vcpu"],
                },
                "kind": "linux",
                "reserved": True,
                "type": "Microsoft.Web/serverfarms",
            },
        ).result()
        logging.info(f"App Service Plan Created: {plan_name}")
        return service_plan

    def create_web_app(self, app_name, plan_name):
        logging.info(f"Creating App Service: {app_name}")
        web_app = self.client.web_apps.begin_create_or_update(
            self.resource_group,
            app_name,
            {
                "location": self.location,
                "server_farm_id": f"/subscriptions/{self.subscription_id}/resourceGroups/{self.resource_group}/providers/Microsoft.Web/serverfarms/{plan_name}",
                "site_config": {
                    "linux_fx_version": "PYTHON|3.10",
                    "app_settings": [
                        {"name": "SCM_DO_BUILD_DURING_DEPLOYMENT", "value": "True"},
                        {"name": "PYTHON_VERSION", "value": "3.10"},
                        {"name": "AlwaysOn", "value": "true"},
                    ],
                    "app_command_line": "cd $APP_PATH & uvicorn api.main:app --host 0.0.0.0 --port 8000 --workers 10 --timeout-keep-alive 900",
                },
            },
        ).result()
        logging.info(f"App Service Created: {app_name}")
        return web_app

    async def create_zip_file_in_file_share(self):
        zip_file_path = await self.azure_file_share_service.zip_directory_in_fileshare(
            self.file_share_name,
            f"exec-envs/{self.env_fileshare_directory}",
            f"exec-envs/{self.env_fileshare_directory}.zip",
        )
        return zip_file_path

    async def upload_zip_file_from_file_share(self, app_name):
        zip_file_path = await self.create_zip_file_in_file_share()

        file_client = ShareFileClient.from_connection_string(
            self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            share_name=self.file_share_name,
            file_path=zip_file_path,
        )
        download_stream = file_client.download_file()
        response = requests.post(
            f"https://{app_name}.scm.azurewebsites.net/api/zipdeploy",
            data=download_stream.readall(),
            headers={
                "Authorization": f"Bearer {self.credentials.get_token('https://management.azure.com/.default').token}",
                "Content-Type": "application/octet-stream",
            },
            timeout=2000,
        )
        if response.status_code == 200:
            logging.info("Deployment successful.")
        else:
            logging.error(f"{response.raise_for_status()}")
            logging.info("Deployment failed.")

    async def poll_url_until_success(self, app_name):
        healthcheck_url = f"https://{app_name}.azurewebsites.net/"
        max_loops = 10
        current_loop = 0
        healthcheck_success_status = False

        async with httpx.AsyncClient() as client:
            while not healthcheck_success_status and current_loop < max_loops:
                logging.info(
                    f"For Loop# {current_loop}: Performing Health Check for {self.execution_environment_executer.fetch_exec_env_short_name_with_id()}-deployment at URL: {healthcheck_url}"
                )
                try:
                    response = await client.get(healthcheck_url, timeout=10)
                    logging.info(f"For Loop# {current_loop} Current Request Status: {response.status_code}")

                    if response.status_code == 200:
                        healthcheck_success_status = True
                        self.execution_environment_executer.handle_status_update(
                            "Completed",
                            message="Deployment Completed successfully.",
                            endpoint=f"{healthcheck_url.rstrip('/')}/execute",
                        )
                        logging.info(
                            f"Successful Deployment -> {self.execution_environment_executer.fetch_exec_env_short_name_with_id()}-deployment."
                        )
                        break
                except httpx.TimeoutException:
                    logging.warning(f"For Loop# {current_loop}: Request timed out.")
                current_loop += 1

                if current_loop >= max_loops:
                    logging.error("Maximum retry limit reached. Deployment failed.")
                    break

                logging.info(f"Retrying in 30 seconds... (Attempt {current_loop}/{max_loops})")
                await asyncio.sleep(30)

    async def execute_create_app_service(self):
        plan_name = self.app_settings.APP_SERVICE_PLAN_NAME
        dedicated_plan_name = f"{self.execution_environment_executer.fetch_exec_env_short_name_with_id()}-asp"
        app_name = self.execution_environment_executer.fetch_exec_env_short_name_with_id()
        self.execution_environment_executer.create_fileshare_directory_and_upload_config(type="create")
        self.handle_status_update("Generating Artifact", message="Generating Artifact.")

        # Create Dedicated App Service Plan if the compute type is Dedicated
        if self.execution_model.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
            plan_name = dedicated_plan_name
            self.create_app_service_plan(plan_name)
        self.create_web_app(app_name, plan_name)
        try:
            await self.upload_zip_file_from_file_share(app_name)
        except Exception as e:
            logging.info(f"Gateway Timeout: Deployment Still in Progress: {e}")
        await self.poll_url_until_success(app_name)

    async def execute_update_app_service(self):
        app_name = self.execution_environment_executer.fetch_exec_env_short_name_with_id()
        self.execution_environment_executer.create_fileshare_directory_and_upload_config(type="create")
        self.handle_status_update("Generating Artifact", message="Generating Artifact.")
        try:
            await self.upload_zip_file_from_file_share(app_name)
        except Exception as e:
            logging.info(f"Gateway Timeout: Deployment Still in Progress: {e}")
        self.restart_web_app(app_name)
        await self.poll_url_until_success(app_name)

    async def execute_delete_app_service(self):
        app_name = self.execution_environment_executer.fetch_exec_env_short_name_with_id()
        dedicated_plan_name = f"{self.execution_environment_executer.fetch_exec_env_short_name_with_id()}-asp"
        app_name = self.execution_environment_executer.fetch_exec_env_short_name_with_id()
        self.delete_web_app(app_name)
        if self.execution_model.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
            plan_name = dedicated_plan_name
            self.delete_app_service_plan(plan_name)

    def start_web_app(self, app_name):
        self.client.web_apps.start(self.resource_group, app_name)
        logging.info(f"App Service Started {app_name}")

    def stop_web_app(self, app_name):
        self.client.web_apps.stop(self.resource_group, app_name)
        return f"Web app {app_name} stopped."

    def restart_web_app(self, app_name):
        self.client.web_apps.restart(self.resource_group, app_name)
        logging.info(f"App Service Restarted {app_name}")

    def delete_web_app(self, app_name):
        self.client.web_apps.delete(self.resource_group, app_name)
        return logging.info(f"App Service {app_name} deleted.")

    def delete_app_service_plan(self, plan_name):
        self.client.app_service_plans.delete(self.resource_group, plan_name)
        return logging.info(f"App Service Plan {plan_name} deleted.")
