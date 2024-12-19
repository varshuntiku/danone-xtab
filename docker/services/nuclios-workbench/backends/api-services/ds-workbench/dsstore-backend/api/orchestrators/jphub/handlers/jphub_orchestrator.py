import asyncio
import concurrent.futures
import logging
from functools import partial

from api.orchestrators.jphub.executors.jphub_executor import JpHubExecutor


class JPHUBOrchestrator:
    def __init__(self, user, project_id) -> None:
        self.user = user
        self.project_id = project_id
        self.executor = JpHubExecutor(
            user,
            project_id,
        )

    def remove_jphub_pod_runtime_runtime_wrapper(self):
        logging.info("Execution for restart env has initialized.")
        asyncio.run(self.executor.remove_jphub_pod_runtime_ds_workbench())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception in JPhub {e}")
            executor.shutdown()

    async def remove_jphub_pod_runtime_runtime(self):
        try:
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.remove_jphub_pod_runtime_runtime_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
