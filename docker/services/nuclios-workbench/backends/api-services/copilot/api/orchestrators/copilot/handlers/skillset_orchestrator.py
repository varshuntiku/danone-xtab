import asyncio
import concurrent.futures
import logging
from functools import partial

from api.orchestrators.copilot.executors.skillset_executor import SkillsetExecutor
from api.services.copilot.skillset_service import SkillsetService


class Skillset:
    def __init__(self, user, skillset_model) -> None:
        self.user = user
        self.skillset_model = skillset_model
        self.skillset_service = SkillsetService()
        self.executor = SkillsetExecutor(
            user,
            skillset_model,
        )

    def update_skillset_status(self, status):
        logging.info(status)
        logging.info("User object in handler")
        logging.info("Updated DB with execution status Initialized")

    def execute_create_skillset_model_wrapper(self):
        logging.info("Execution for new env has initialized.")
        asyncio.run(self.executor.execute_create_skillset_model())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            self.executor.update_copilot({}, "Failed", "")
            print(f"Handling exception in Execution Environment Model {self.skillset_model['name']} : {e}")
            executor.shutdown()

    async def create_skillset(self):
        try:
            logging.info("Intializations")
            self.update_skillset_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_create_skillset_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
            self.update_skillset_status("Failed")

    def execute_delete_skillset_model_wrapper(self):
        logging.info("Execution for new env has initialized.")
        asyncio.run(self.executor.execute_delete_skillset_model())

    async def delete_skillset(self):
        try:
            logging.info("Intializations")
            self.update_skillset_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_delete_skillset_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
            self.update_skillset_status("Failed")

    async def action_on_environment(self, action):
        try:
            logging.info("Taking action on Environment")
            replicas = 1
            if action == "stop":
                replicas = 0
            # asyncio.run(self.executor.scale_execution_environment(replicas))

            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()
            future = loop.run_in_executor(executor, self.executor.scale_environment, replicas)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
