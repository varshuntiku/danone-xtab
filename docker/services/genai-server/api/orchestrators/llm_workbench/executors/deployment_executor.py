import asyncio
import json
import logging

import httpx
from api.constants.llm_workbench.variables import LLMWORKBENCH_TRAINING_POOLS
from api.constants.variables import DeploymentType
from api.orchestrators.llm_workbench.executors.base_executor import (
    OrchestratorExecutionBase,
)


class EndStream:
    pass


class DeploymentExecutor(OrchestratorExecutionBase):
    """
    DeploymentExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, execution_model, model_registry, compute_config, checkpoint, type, deployed_model) -> None:
        self.deployed_model = deployed_model
        self.model_registry = model_registry
        self.compute_config = compute_config
        self.log_share_name = "train-repository"
        self.dataset_share_name = "dataset-repository"
        self.deployment_share_name = "deployment-repository"
        self.train_logs = []
        self.checkpoints = []
        super().__init__(user, execution_model, model_registry, checkpoint, type, deployed_model)

    def update_event_status(self, status, message=None, progress=None):
        event = self.llm_workbench_event.get_event(
            self.user, f"{self.deployed_model['id']}-{self.deployed_model['name']}"
        )

        if event is not False:
            event["status"] = status
            event["progress"] = progress
            if message is not None:
                event["message"] = message
        return event

    def get_config(self):
        # Generating config(Using existing objects and db tables data)
        config = {
            "model_name_or_path": self.model_registry["config"]["model_path"],
            "template": "default",
            "quantization_bit": 8,
            "CHATCOMPLETION_MODEL": True,
            "EMBEDDING_MODEL": False,
        }
        if self.deployed_model["deployment_type"] != DeploymentType.BASEMODEL.value:
            config["adapter_name_or_path"] = "/eval/"
        return json.dumps(config)

    def get_env_variables(self):
        return [
            {"name": "HF_TOKEN", "value": self.app_settings.HF_TOKEN},
        ]

    def create_fileshare_directory_and_upload_config(self):
        # Directory Creation
        if self.deployed_model["deployment_type"] == DeploymentType.EXPERIMENT.value:
            directory = f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/evaluate/".lower()
        elif self.deployed_model["deployment_type"] == DeploymentType.CHECKPOINT.value:
            directory = f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/{self.checkpoint['name']}/".lower()
        elif self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value:
            directory = (
                f"base-{self.deployed_model['name']}_{self.deployed_model['id']}_{self.model_registry['name']}/".lower()
            )
            # Create Directory in Deployment Repository
            self.create_fileshare_directory(self.deployment_share_name, directory)

        # Generate Config
        config = self.get_config()

        share_name = (
            self.deployment_share_name
            if self.deployed_model["deployment_type"] == DeploymentType.BASEMODEL.value
            else self.log_share_name
        )

        # Create Config and Upload
        self.upload_config_on_fileshare(config, share_name, directory, "deploy_config.json")

        logging.info(f"Fileshare Upload Success for deployment {self.deployed_model['name'].lower()}.")

    async def track_deployment(self):
        logging.info(f"Deployment Tracking has started -> {self.get_deployment_name()}")
        # wait for the deployment to complete
        deployment_completed = False
        max_loops = 10  # 5
        current_loop = 0
        while not deployment_completed and current_loop < max_loops:
            await asyncio.sleep(100)  # 600
            logging.info(f"Getting deployment Status Loop# {current_loop} for deployment {self.get_deployment_name()}")
            deployment_status = self.deployment_manager.track_deployment_status(
                deployment_name=self.get_deployment_name(),
                namespace=self.app_settings.DEPLOYMENT_NAMESPACE,
            )
            current_loop += 1
            if deployment_status.conditions[1].status == "True":
                deployment_completed = True
                self.handle_status_update("In-progress", message="Deployment is in-progress.", progress=70)

    async def perform_ping_test(self):
        # GET THE URL OF THE NEW LLM DEPLOYED
        ingress_details = self.ingress_manager.get_ingress_details(
            self.app_settings.INGRESS_SERVER_NAME, self.app_settings.DEPLOYMENT_NAMESPACE
        )
        logging.info("Ingress Object Created: %s", str(ingress_details))

        # Step 4: PING TEST GENAI_GATEWAY_BASE_URL

        base_url = self.app_settings.GENAI_GATEWAY_BASE_URL
        healthcheck_url = base_url + ingress_details.spec.rules[0].http.paths[-1].path[:-1]
        healthcheck_url_docs = base_url + ingress_details.spec.rules[0].http.paths[-1].path[:-1] + "docs"
        healthcheck_success_status = False

        max_loops = 30
        current_loop = 0

        async with httpx.AsyncClient(verify=self.app_settings.CERT_PATH) as client:
            while not healthcheck_success_status and current_loop < max_loops:
                logging.info(
                    f"For Loop# {current_loop}: Performing Health Check for {self.deployed_model['name']}-{self.deployed_model['id']} at URL: {healthcheck_url}"
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
                        progress=100,
                        endpoint=healthcheck_url,
                    )
                    logging.info(f"Successful Deployment -> {self.get_deployment_name()}.")
                    break
                else:
                    if current_loop == max_loops:
                        self.handle_status_update("Failed", message="Deployment Failed.", progress=90)
                await asyncio.sleep(30)  # 300

    async def execute_deployed_model(self):
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()

        # Get Nodepool
        self.nodepool = self.get_node_pool(
            {
                "nodepool_name": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
                "sku": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
            }
        )

        # Handle Fileshare and Upload Config
        self.create_fileshare_directory_and_upload_config()

        # Generate Volume Specs
        self.set_deployment_model_volume_mounts_and_spec()  # Data accessible by self.volume_mounts, self.volume_spec
        env_variables = self.get_env_variables()
        # Create a deployment
        self.intialize_deployment(
            LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
            self.app_settings.LLMWORKBENCH_DEPLOYMENT_IMAGE_URL,
            self.get_deployment_name(),
            f"{self.get_deployment_name()}-container",
            env=env_variables,
        )

        # Wait to intialize deployment completly
        await asyncio.sleep(60)

        # Track Deployment
        await self.track_deployment()

        # Setting Up Ingress
        self.setup_ingress(self.deployed_model)
        self.handle_status_update("In-progress", message="Ingress Setup successful. Warming Up", progress=80)

        await asyncio.sleep(150)  # 900
        self.handle_status_update("In-progress", message="Deployment is about to complete successfully.", progress=90)

        # Perform Ping Test
        await self.perform_ping_test()
