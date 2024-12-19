import asyncio
import concurrent.futures
import logging
from functools import partial

from api.orchestrators.llm_workbench.executors.deployment_executor import (
    DeploymentExecutor,
)
from api.services.llm_workbench.deployment_service import LLMDeploymentService
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)


class DeploymentHandler:
    def __init__(self, user, deployed_model) -> None:
        self.user = user
        self.deployed_model = deployed_model
        self.execution_model = deployed_model.pop("experiment")
        self.model_registry = deployed_model.pop("model")
        self.compute_config = (
            self.execution_model.pop("compute") if self.execution_model and "compute" in self.execution_model else None
        )
        self.checkpoint = deployed_model.pop("checkpoint")
        self.llm_deployment_service = LLMDeploymentService()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()
        self.executor = DeploymentExecutor(
            user,
            self.execution_model,
            self.model_registry,
            self.compute_config,
            checkpoint=self.checkpoint,
            type="deployment",
            deployed_model=self.deployed_model,
        )

    def update_deployed_model_status(self, status):
        # Update Deployment Model Status
        self.llm_deployment_service.update_llm_deployed_model(
            self.user,
            {
                "id": self.deployed_model["id"],
                "name": self.deployed_model["name"],
                "status": status,
            },
            serialize_data=True,
        )
        logging.info("Updated DB with execution status Initialized")

    def execute_deployed_model_wrapper(self):
        logging.info("Execution has initialized.")
        asyncio.run(self.executor.execute_deployed_model())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception in Deployment Model : {e}")
            executor.shutdown()

    async def deploy_model_runtime(self):
        try:
            logging.info("Intializations")
            self.update_deployed_model_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_deployed_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
