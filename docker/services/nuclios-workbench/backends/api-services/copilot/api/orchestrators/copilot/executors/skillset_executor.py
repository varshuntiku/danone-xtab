import asyncio
import logging
from datetime import datetime

import httpx
from api.constants.execution_environment.variables import (  # HostingType,; InfraType,
    ExecutionEnvironmentComputeType,
    ExecutionEnvironmentServiceType,
)
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.copilot.executors.base_executor import OrchestratorExecutionBase
from api.services.copilot.skillset_service import SkillsetService
from infra_manager.core.cloud.azure.acr_manager import ACRManager
from infra_manager.core.cloud.azure.fileshare_service import FileShareService
from infra_manager.k8_manager.job_manager.job import Job
from infra_manager.utils.job_utils import generate_job_spec


class EndStream:
    pass


class SkillsetExecutor(OrchestratorExecutionBase):
    """
    ExecutionEnvironmentExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, skillset_model) -> None:
        self.train_logs = []
        self.checkpoints = []
        self.infra_fileshare_service = FileShareService(
            self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
            "exec-env-repository",
            None,
        )
        self.image_details = None
        self.job_name = None
        self.nodepool_name = (
            self.app_settings.COPILOT_NODEPOOL_NAME
            if self.app_settings.COPILOT_NODEPOOL_NAME
            else self.app_settings.NODEPOOL_NAME
        )
        self.default_nodepool_name = (
            self.app_settings.COPILOT_NODEPOOL_NAME
            if self.app_settings.COPILOT_NODEPOOL_NAME
            else self.app_settings.NODEPOOL_NAME
        )
        self.skillset_service = SkillsetService()
        self.service_name = ExecutionEnvironmentServiceType.CODE_EXECUTOR_SERVICE.value
        self.deployment_is_successful = False
        self.ingress_service_is_successful = False
        logging.info("User object in executor")
        super().__init__(user, skillset_model)

    def get_current_env(self):
        name = self.app_settings.APP_ENV
        all_envs = ["dev", "qa", "uat", "prod"]
        for env in all_envs:
            if env in name:
                return env
        return "dev"

    def fetch_exec_env_short_name(self):
        return str(self.get_current_env()) + "-skillset-" + str(self.skillset_model["id"])

    def fetch_skillset_short_name_with_id(self):
        return self.fetch_exec_env_short_name()

    def fetch_job_name(self):
        if self.job_name:
            return self.job_name
        self.job_name = self.fetch_skillset_short_name_with_id() + f"-{datetime.now().microsecond}"
        return self.job_name

    def fetch_node_pool_name(self):
        return self.fetch_skillset_short_name_with_id()

    def update_event_status(self, user, status, message=None, endpoint=None):
        return status

    def fetch_image_url(self):
        return self.skillset_model["image_url"]

    def create_job(self):
        # init job manager
        self.job_manager = Job(self.kube_connection)

        # annotations for managed identity
        additional_labels = [
            {
                "name": "aadpodidentity.k8s.io/azure-identity-binding",
                "value": "my-azure-identity-binding",
            }
            # ,
            # {
            #     "name": "compute",
            #     "value": self.nodepool_name,
            # }
        ]

        tolerations = []
        if self.nodepool_name != self.default_nodepool_name:
            additional_labels.append(
                {
                    "name": "compute",
                    "value": self.nodepool_name,
                }
            )
            tolerations = [{"key": self.nodepool_name, "operator": "Equal", "value": "true", "effect": "NoSchedule"}]

        # 3. generate job spec
        job_spec = generate_job_spec(
            job_name=self.fetch_job_name(),
            container_name=self.fetch_skillset_short_name_with_id(),
            image_url="gcr.io/kaniko-project/executor:latest",
            nodepool_name=self.nodepool_name,
            # self.nodepool_name,
            container_port=80,
            ttlSecondsAfterFinished=200,
            pv_spec={"volumes": self.volume_spec, "volume_mounts": self.volume_mounts},
            additional_labels=additional_labels,
            tolerations=tolerations,
        )

        args = [
            "--dockerfile=/workspace/Dockerfile",
            "--context=dir:///workspace/",
            f"--destination={self.fetch_image_url()}:latest",
        ]

        job_spec["spec"]["template"]["spec"]["containers"][0]["args"] = args

        logging.info(f"Job Specs => {job_spec}")

        # 4. create a new job
        job = self.job_manager.create_job(job_spec, self.app_settings.DEPLOYMENT_NAMESPACE)
        logging.info(f"Job => {job}")

    def update_copilot(self, user, status, endpoint=None):
        with httpx.Client(verify=self.app_settings.CERT_PATH) as client:
            url = self.skillset_model.get("copilot_url") or self.app_settings.COPILOT_SKILLSET_UPDATE_URL
            if url and status:
                response = client.put(
                    url,
                    json={
                        "items": [
                            {
                                "id": self.skillset_model.get("id"),
                                "deployment_status": status,
                                "info": {
                                    "access_url": self.skillset_model.get("endpoint") or endpoint,
                                },
                            }
                        ]
                    },
                )
                if response.status_code == 200:
                    return status

    def skillset_model_status(self, user, status, endpoint=None):
        # asyncio.run(self.update_copilot(user, status, endpoint))
        # run above function in a separate thread
        # self.update_copilot(user, status, endpoint)
        # asyncio.create_task(self.update_copilot(user, status, endpoint))
        return status

    async def monitor_job_creation(self, time=None):
        is_job_created = False
        if time is not None:
            start_time = datetime.now()

        while is_job_created is False:
            logging.info(f"Monitoring job creation for {self.fetch_job_name()}.")
            await asyncio.sleep(10)

            job_status = self.job_manager.get_job_status(
                job_name=self.fetch_job_name(),
                namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
            )
            if "status_code" not in job_status:
                is_job_created = True
                logging.info(f"Monitoring job creation for {self.fetch_job_name()} is completed.")

            if time is not None:
                is_time_limit_exceed = (datetime.now() - start_time).seconds > time
                if is_time_limit_exceed:
                    # Updating Status
                    self.handle_status_update("Failed", message="Job not found.")
                    raise GeneralException(message="Job not found.", status_code=500)

    async def monitor_job_status(self, time=None):
        status = "running"
        if time is not None:
            start_time = datetime.now()

        while status == "running":
            logging.info(f"Monitoring job status for {self.fetch_job_name()}.")
            await asyncio.sleep(10)

            job_status = self.job_manager.get_job_status(
                job_name=self.fetch_job_name(),
                namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
            )
            if "status_code" not in job_status and job_status["status"].lower() == "completed":
                status = "completed"
                self.get_job_details()
                self.get_image_details()
            elif job_status["status"].lower() == "failed":
                # Updating Status
                self.handle_status_update("Failed", message="Job deployment failed.")
                raise GeneralException(message="Job deployment failed.", status_code=500)

            if time is not None:
                is_time_limit_exceed = (datetime.now() - start_time).seconds > time
                if is_time_limit_exceed:
                    # Updating Status
                    self.handle_status_update("Failed", message="Job status check time is elapsed.")
                    raise GeneralException(message="Job status check time is elapsed.", status_code=500)

        logging.info(f"Job Status => {job_status}")

    def get_job_details(self):
        job_detail = self.job_manager.get_job_details(
            self.fetch_job_name(),
            namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
        )
        logging.info(f"Job Detail => {job_detail}.")

    def get_image_details(self):
        logging.info("Initializing ACR Manager.")
        acr_manager = ACRManager(registry_name=self.app_settings.ACR_NAME, endpoint=self.app_settings.ACR_URL)

        repo_name = self.skillset_model.get("image_name")
        tag_name = self.tag_name
        if self.service_name == ExecutionEnvironmentServiceType.JUPYTERHUB_USER_SERVICE.value:
            tag_name = "latest"
        # get image details
        self.image_details = acr_manager.get_image_details(repository_name=repo_name, tag_name=tag_name)
        logging.info(f"Image Details => {self.image_details}")

    def fetch_sku_from_compute(self):
        if "compute" in self.skillset_model and self.skillset_model["compute"]:
            if "sku" in self.skillset_model["compute"]:
                return self.skillset_model["compute"]["sku"]
            elif "name" in self.skillset_model["compute"]:
                return self.skillset_model["compute"]["name"]
        sku_details = self.skillset_service.get_compute_config_by_id(self.skillset_model["compute_id"])
        if sku_details and "sku" in sku_details and sku_details["sku"]:
            return sku_details["sku"]
        raise GeneralException(message="SKU not found.", status_code=500)

    async def create_dedicated_node_pool(self):
        nodepool_name = self.fetch_node_pool_name()
        return_type, nodepool = self.get_or_create_node_pool(
            {
                "nodepool_name": nodepool_name,
                "vm_size": self.fetch_sku_from_compute(),
                "node_taints": [f"{nodepool_name}=true:NoSchedule"],
                "node_labels": {"compute": nodepool_name},
            }
        )
        if return_type == "create":
            status_poller = self.track_node_pool_creation(nodepool)
            for status in status_poller:
                print(status)
                if status == "Failed":
                    self.handle_status_update("Failed", message="Node Pool Creation Failed.")
                    raise GeneralException(message="Node Pool Creation Failed.", status_code=500)
                elif status == "Succeeded":
                    self.handle_status_update(status, message="Node Pool Created Successfully.")
                    break
                else:
                    self.handle_status_update(status, message="Node Pool Creation " + str(status))

    async def create_job_and_monitor(self, type="create"):
        # Updating Status
        self.handle_status_update("Started build", message="Started build.")

        # Image Creation Generate Volume Specs
        self.set_skillset_model_volume_mounts_and_spec(
            is_image_creation=True
        )  # Data accessible by self.volume_mounts, self.volume_spec

        # Job Creation
        self.create_job()

        # # Wait to intialize job creation completly
        await asyncio.sleep(20)

        # Monitor Job Creation
        await self.monitor_job_creation(time=1000)

        # Monitor Job Status
        await self.monitor_job_status(time=2000)

    async def execute_create_skillset_model(self):
        logging.info("User object in executor create function")
        # Intializing Kube Config(Class Method)
        self.skillset_model["endpoint"] = (
            self.app_settings.GATEWAY_BASE_URL + f"/deployment/{self.fetch_skillset_short_name_with_id()}"
        )

        self.update_copilot(self.user, "Started", self.skillset_model.get("endpoint"))

        # upload the files to fileshare
        self.upload_files_to_fileshare()

        self.intialize_kube_connection()

        # Create Dedicated Node pool if the compute type is Dedicated
        if self.skillset_model.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
            await self.create_dedicated_node_pool()
            self.nodepool_name = self.fetch_node_pool_name()

        # Create Job and Monitor
        await self.create_job_and_monitor()

        # Updating Status
        self.handle_status_update("Created", message="Created.")
        await self.deploy_skillset()

        self.update_copilot(self.user, "Completed", self.skillset_model.get("endpoint"))

    async def track_deployment(self):
        logging.info(f"Deployment Tracking has started -> {self.fetch_skillset_short_name_with_id()}-deployment")
        # wait for the deployment to complete
        deployment_completed = False
        self.deployment_is_successful = False
        max_loops = 5  # 5
        current_loop = 0
        while not deployment_completed and current_loop < max_loops:
            logging.info(
                f"Getting deployment Status Loop# {current_loop} for deployment {self.fetch_skillset_short_name_with_id()}-deployment"
            )
            deployment_status = self.deployment_manager.track_deployment_status(
                deployment_name=f"{self.fetch_skillset_short_name_with_id()}-deployment",
                namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
            )
            current_loop += 1
            if deployment_status.conditions[1].status == "True":
                deployment_completed = True
                self.deployment_is_successful = True
                # self.handle_status_update("In-progress", message="Deployment is in-progress.", progress=70)
            await asyncio.sleep(35)  # 600

    async def perform_ping_test(self, type="create"):
        self.ingress_service_is_successful = False
        # PING TEST GATEWAY_BASE_URL
        if type == "create":
            base_url = self.app_settings.GATEWAY_BASE_URL
            healthcheck_url = base_url + f"/deployment/{self.fetch_skillset_short_name_with_id()}"
            healthcheck_url_docs = healthcheck_url + "/healthcheck"
            healthcheck_success_status = False
        else:
            healthcheck_url = self.skillset_model["endpoint"]
            healthcheck_url_docs = (
                healthcheck_url.rsplit("/", 1)[0] + "/" if healthcheck_url.endswith("/execute") else healthcheck_url
            )
            healthcheck_url = healthcheck_url_docs
            healthcheck_success_status = False

        max_loops = 30
        current_loop = 0

        async with httpx.AsyncClient(verify=self.app_settings.CERT_PATH) as client:
            while not healthcheck_success_status and current_loop < max_loops:
                logging.info(
                    f"For Loop# {current_loop}: Performing Health Check for {self.fetch_skillset_short_name_with_id()}-deployment at URL: {healthcheck_url}"
                )
                response = await client.get(healthcheck_url_docs)
                # response = await client.get(healthcheck_url, verify=False)
                logging.info(f"For Loop# {current_loop} Current Request Status {response.status_code}")
                current_loop += 1
                if response.status_code == 200:
                    healthcheck_success_status = True
                    self.handle_status_update(
                        "Completed",
                        message="Deployment Completed successfully.",
                        endpoint=f"{healthcheck_url.rstrip('/')}/execute",
                    )
                    logging.info(f"Successful Deployment -> {self.fetch_skillset_short_name_with_id()}-deployment.")
                    self.ingress_service_is_successful = True
                    break
                else:
                    if current_loop == max_loops:
                        # self.handle_status_update("Failed", message="Deployment Failed.", progress=90)
                        pass
                await asyncio.sleep(30)  # 300

    async def deploy_skillset(self):
        # Updating Status
        self.handle_status_update("Creating Environment", message="Creating Environment.")

        # Image Deployment Generate Volume Specs
        self.set_skillset_model_volume_mounts_and_spec()

        tolerations = []
        if self.nodepool_name != self.default_nodepool_name:
            tolerations = [{"key": self.nodepool_name, "operator": "Equal", "value": "true", "effect": "NoSchedule"}]

        self.intialize_deployment(
            self.nodepool_name,
            f"{self.fetch_image_url()}:latest",
            f"{self.fetch_skillset_short_name_with_id()}-deployment",
            f"{self.fetch_skillset_short_name_with_id()}-deployment-container",
            tolerations=tolerations,
        )

        # Wait to intialize deployment completly
        await asyncio.sleep(60)

        # Track Deployment
        await self.track_deployment()

        # Setting Up Ingress
        self.setup_ingress(self.fetch_skillset_short_name_with_id())

        await asyncio.sleep(60)  # 900

        # Perform Ping Test
        await self.perform_ping_test()

    async def execute_delete_skillset_model(self):
        logging.info("User object in executor delete function")
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()
        self.skillset_model["endpoint"] = (
            self.app_settings.GATEWAY_BASE_URL + f"/deployment/{self.fetch_skillset_short_name_with_id()}"
        )

        try:
            # Deleting Deployment
            self.delete_deployment(
                f"{self.fetch_skillset_short_name_with_id()}-deployment",
                self.app_settings.DEPLOYMENT_NAMESPACE,
            )
        except Exception as e:
            logging.info(f"Error while deleting deployment => {e}")

        try:
            exec_env_short_name = self.fetch_skillset_short_name_with_id()
            # removing the service
            self.delete_k8_service(exec_env_short_name, self.app_settings.DEPLOYMENT_NAMESPACE)
            # removing the ingress
            self.remove_ingres_path(exec_env_short_name, self.app_settings.DEPLOYMENT_NAMESPACE)
        except Exception as e:
            logging.info(f"Error while deleting service and ingress => {e}")

        try:
            # Deleting acr image
            self.delete_acr_image()
        except Exception as e:
            logging.info(f"Error while deleting acr image => {e}")

        # if self.skillset_model.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
        #     try:
        #         # Deleting node pool
        #         self.delete_node_pool(
        #             self.fetch_node_pool_name(),
        #         )
        #     except Exception as e:
        #         logging.info(f"Error while deleting node pool => {e}")

    def delete_acr_image(self, ds_workbench=False):
        try:
            acr_manager = ACRManager(registry_name=self.app_settings.ACR_NAME, endpoint=self.app_settings.ACR_URL)
            repo_name = self.fetch_skillset_short_name_with_id()
            tag_name = self.tag_name
            if ds_workbench:
                repo_name = str(self.skillset_model["endpoint"]).rsplit("/", 2)[1]
                tag_name = "latest"
            acr_manager.delete_tag(repository_name=repo_name, tag_name=tag_name)
        except Exception as e:
            logging.info(f"Error while deleting acr image => {e}")

    def scale_environment(self, replicas):
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()
        try:
            if self.skillset_model.get("compute_type") == ExecutionEnvironmentComputeType.DEDICATED.value:
                self.nodepool_name = self.fetch_node_pool_name()
            tolerations = []
            if self.nodepool_name != self.default_nodepool_name:
                tolerations = [
                    {"key": self.nodepool_name, "operator": "Equal", "value": "true", "effect": "NoSchedule"}
                ]

            # Scaling Deployment
            self.scale_deployment(
                self.nodepool_name,
                f"{self.fetch_image_url()}:latest",
                f"{self.fetch_skillset_short_name_with_id()}-deployment",
                f"{self.fetch_skillset_short_name_with_id()}-deployment-container",
                tolerations=tolerations,
                replicas=replicas,
            )
            if replicas == 0:
                self.handle_status_update("Stopped", message="Environment Stopped.")
            else:
                self.handle_status_update("Running", message="Environment Running.")

        except Exception as e:
            logging.info(f"Error while scaling deployment => {e}")
