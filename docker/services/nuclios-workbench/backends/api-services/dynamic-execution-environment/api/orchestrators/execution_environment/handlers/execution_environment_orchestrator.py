import asyncio
import concurrent.futures
import logging
from functools import partial

from api.constants.execution_environment.variables import ExecutionEnvironmentCategory
from api.orchestrators.execution_environment.executors.execution_environment_executor import (
    ExecutionEnvironmentExecutor,
)
from api.services.execution_environment.execution_environment_service import (
    ExecutionEnvironmentService,
)
from api.services.utils.execution_environment.execution_environment_event_utility_service import (
    ExecutionEnvironmentEventUtilityService,
)


class ExecutionEnvironment:
    def __init__(self, user, execution_model) -> None:
        self.user = user
        self.execution_model = execution_model
        self.execution_environment_event = ExecutionEnvironmentEventUtilityService()
        self.execution_environment_service = ExecutionEnvironmentService()
        self.executor = ExecutionEnvironmentExecutor(
            user,
            execution_model,
        )

    def update_execution_model_status(self, status):
        logging.info("User object in handler")
        # Update Execution Model Status
        self.execution_environment_service.update_execution_environment(
            self.user,
            self.execution_model["id"],
            {
                "id": self.execution_model["id"],
                "name": self.execution_model["name"],
                "status": status,
            },
            serialize_data=True,
        )
        self.execution_environment_event.update_event(
            self.user,
            self.execution_model["id"],
            detail={"message": "Initialized", "status": status},
            is_set=True,
        )
        logging.info("Updated DB with execution status Initialized")

    def execute_create_execution_environment_model_wrapper(self):
        logging.info("Execution for new env has initialized.")
        if self.execution_model.get("env_category") == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            asyncio.run(self.executor.execute_create_execution_environment_ds_workbench_model())
        else:
            asyncio.run(self.executor.execute_create_execution_environment_model())

    def execute_update_execution_environment_model_wrapper(self):
        logging.info("Execution for update env has initialized.")
        if self.execution_model.get("env_category") == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            asyncio.run(self.executor.execute_update_execution_environment_ds_workbench_model())
        else:
            asyncio.run(self.executor.execute_update_execution_environment_model())

    def execute_delete_execution_environment_model_wrapper(self):
        logging.info("Execution for delete env has initialized.")
        if self.execution_model.get("env_category") == ExecutionEnvironmentCategory.DS_WORKBENCH.value:
            asyncio.run(self.executor.execute_delete_execution_environment_ds_workbench())
        else:
            asyncio.run(self.executor.execute_delete_execution_environment_model())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception in Execution Environment Model {self.execution_model['name']} : {e}")
            executor.shutdown()

    async def deploy_execution_environment_runtime(self):
        try:
            logging.info("Intializations")
            self.update_execution_model_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_create_execution_environment_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)

    async def deploy_updated_execution_environment_runtime(self):
        try:
            logging.info("Intializations")
            self.update_execution_model_status("Initialized Update")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_update_execution_environment_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)

    async def deploy_delete_execution_environment_runtime(self):
        try:
            logging.info("Intializations")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_delete_execution_environment_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)

    async def action_on_execution_environment(self, action):
        try:
            logging.info("Taking action on Execution Environment")
            replicas = 1
            if action == "stop":
                replicas = 0
            # asyncio.run(self.executor.scale_execution_environment(replicas))

            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()
            future = loop.run_in_executor(executor, self.executor.scale_execution_environment, replicas)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
