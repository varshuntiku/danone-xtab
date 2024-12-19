import asyncio
import concurrent.futures
import logging
from functools import partial

from api.orchestrators.llm_workbench.executors.finetuning_executor import (
    CheckpointEvaluationExecutor,
    FinetuneExecutor,
    UntrainedModelEvaluationExecutor,
)
from api.services.llm_workbench.experiment_service import LLMExperimentService
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)


class FinetuneHandler:
    def __init__(self, user, execution_model, checkpoint=None) -> None:
        self.user = user
        self.execution_model = execution_model
        self.model_registry = execution_model.pop("base_model")
        self.compute_config = execution_model.pop("compute")
        self.checkpoint = checkpoint
        self.llm_experiments_service = LLMExperimentService()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()
        self.executor = FinetuneExecutor(
            user,
            execution_model,
            self.model_registry,
            self.compute_config,
            checkpoint=checkpoint,
            type="finetune",
        )

    def update_execution_model_status(self, status):
        # Update Execution Model Status
        updated_execution_model = self.llm_experiments_service.update_llm_experiment(
            self.user,
            {
                "id": self.execution_model["id"],
                "name": self.execution_model["name"],
                "status": status,
            },
            serialize_data=True,
            validate_schema=True,
        )
        logging.info("Updated DB with execution status Initialized")
        return updated_execution_model

    def execute_finetuneing_model_wrapper(self):
        logging.info("Execution has initialized.")
        asyncio.run(self.executor.execute_finetuning_model())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception in Finetuning Model : {e}")
            executor.shutdown()

    async def deploy_finetuning_runtime(self):
        try:
            logging.info("Intializations")
            self.update_execution_model_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_finetuneing_model_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)


class UntraineModelEvaluationHandler:
    def __init__(self, user, execution_model, model_registry, compute_config, checkpoint=None) -> None:
        self.user = user
        self.execution_model = execution_model
        self.model_registry = model_registry
        self.compute_config = compute_config
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()
        self.executor = UntrainedModelEvaluationExecutor(
            user,
            execution_model,
            self.model_registry,
            self.compute_config,
            checkpoint=checkpoint,
            type="untrained_evaluation",
        )

    def execute_untrained_model_evaluation_wrapper(self):
        logging.info("Untrained Model Evaluation has initialized.")
        asyncio.run(self.executor.execute_untrained_model_evaluation())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception for Untrained Model Evaluation : {e}")
            executor.shutdown()

    async def deploy_untrained_model_evaluation_runtime(self):
        try:
            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_untrained_model_evaluation_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)


class CheckpointEvaluationHandler:
    def __init__(self, user, execution_model, checkpoint) -> None:
        self.user = user
        self.execution_model = execution_model
        self.checkpoint = checkpoint
        self.model_registry = execution_model.pop("base_model")
        self.compute_config = execution_model.pop("compute")
        self.llm_experiments_service = LLMExperimentService()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()
        self.executor = CheckpointEvaluationExecutor(
            user,
            execution_model,
            self.model_registry,
            self.compute_config,
            checkpoint=checkpoint,
            type="checkpoint_evaluation",
        )

    def update_checkpoint_evaluation_status(self, status):
        # Update Checkpoint Evaluation Status
        updated_checkpoint = self.llm_experiments_service.update_llm_experiment_checkpoint(
            self.user,
            {
                "experiment_id": self.execution_model["id"],
                "name": self.checkpoint["name"],
                "eval_status": status,
            },
            serialize_data=True,
        )
        logging.info("Updated DB with evaluation status Initialized")
        return updated_checkpoint

    def execute_evaluation_process_wrapper(self):
        logging.info("Execution has initialized.")
        asyncio.run(self.executor.execute_checkpoint_evaluation())

    def handle_exception(self, executor, future):
        try:
            future.result()
        except Exception as e:
            print(f"Handling exception in Checkpoint Evaluation : {e}")
            executor.shutdown()

    async def deploy_checkpoint_evaluation_runtime(self):
        try:
            logging.info("Checkpoint Evaluation Initialized")
            self.update_checkpoint_evaluation_status("Initialized")

            # create an executor with Threadpool
            executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
            loop = asyncio.get_event_loop()

            # run the orchestration in a separate thread
            future = loop.run_in_executor(executor, self.execute_evaluation_process_wrapper)
            wrapped_handle_exception = partial(self.handle_exception, executor)
            # Callback to handle exception and stop execution
            future.add_done_callback(wrapped_handle_exception)

        except Exception as e:
            logging.debug(e)
