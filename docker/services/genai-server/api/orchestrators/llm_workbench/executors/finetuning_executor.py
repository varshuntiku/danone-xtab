import asyncio
import datetime
import json
import logging

from api.constants.llm_workbench.variables import LLMWORKBENCH_TRAINING_POOLS
from api.middlewares.error_middleware import GeneralException
from api.orchestrators.llm_workbench.executors.base_executor import (
    OrchestratorExecutionBase,
)
from api.orchestrators.llm_workbench.handlers import finetuning_orchestrator
from api.services.utils.azure.fileshare_service import AzureFileShareService
from infra_manager.core.cloud.azure.fileshare_service import FileShareService


class EndStream:
    pass


class FinetuneExecutor(OrchestratorExecutionBase):
    """
    FinetuneExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, execution_model, model_registry, compute_config, checkpoint, type) -> None:
        self.model_registry = model_registry
        self.compute_config = compute_config
        self.log_share_name = "train-repository"
        self.dataset_share_name = "dataset-repository"
        self.train_logs = []
        self.checkpoints = []
        super().__init__(user, execution_model, model_registry, checkpoint, type)

    def update_event_status(self, status, message=None):
        event = self.llm_workbench_event.get_event(self.user, self.execution_model["id"])

        if event is not False:
            event["status"] = status
            if message is not None:
                event["message"] = message
        return event

    def get_config(self):
        # Generating config(Using existing objects and db tables data)
        config = {
            "model_name_or_path": self.model_registry["config"]["model_path"]
            if "config" in self.model_registry
            else None,
            "lora_rank": self.execution_model["settings"]["lora_rank"] if "settings" in self.execution_model else None,
            "val_size": self.execution_model["test_size"],
            "per_device_train_batch_size": self.execution_model["batch_size"],
            "gradient_accumulation_steps": self.execution_model["settings"]["gradient_acc_steps"]
            if "settings" in self.execution_model
            else None,
            "lr_scheduler_type": self.execution_model["settings"]["lr_scheduler_type"]
            if "settings" in self.execution_model
            else None,
            "logging_steps": self.execution_model["settings"]["logging_steps"]
            if "settings" in self.execution_model
            else None,
            "learning_rate": self.execution_model["learning_rate"],
            "num_train_epochs": self.execution_model["epochs"],
            "dataset_path": f"/dataset/{self.execution_model['dataset']['file_path'].split('/')[-1]}"
            if "dataset" in self.execution_model
            else None,
            "finetuning_type": self.execution_model["settings"]["peft_method"]
            if "settings" in self.execution_model
            else None,
            "stage": "sft",
            "output_dir": "/train",
            "use_fast_tokenizer": True,
            "do_train": True,
            "dataset": "custom_data",
            "dataset_dir": "./app/data_for_fintune",
            "template": "default",
            "lora_target": ["q_proj", "k_proj", "v_proj", "o_proj"],
            "overwrite_output_dir": True,
            "overwrite_cache": True,
            "save_steps": self.execution_model["settings"]["save_steps"],
            "plot_loss": True,
            "bf16": True,
            "save_safetensors": True,
            "eval_metric": self.execution_model["error_metric_type"],
            "gpu_type": LLMWORKBENCH_TRAINING_POOLS[self.compute_config["name"]],
        }
        return json.dumps(config)

    def create_fileshare_directory_and_upload_config(self):
        # Directory Creation
        directory = (
            f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}".lower() + "/"
        )
        self.create_fileshare_directory(self.log_share_name, directory)

        # Create Sub Directory evaluate
        self.create_fileshare_directory(self.log_share_name, directory, "evaluate/")

        # Create Sub Directory dataset
        self.create_fileshare_directory(self.log_share_name, directory, "dataset/")

        # Generate Config
        config = self.get_config()

        # Create Config and Upload
        self.upload_config_on_fileshare(config, self.log_share_name, directory)

        # Create Trainer Log and Upload
        self.upload_trainer_log_file(self.log_share_name, directory)

        # Create Trainer Log UI and Upload
        self.upload_trainer_log_ui_file(self.log_share_name, directory)

        # Create Checkpoint Log and Upload
        self.upload_checkpoint_log_file(self.log_share_name, directory)

        logging.info(f"Fileshare Upload Success for deployment {self.execution_model['name'].lower()}.")
        return self.log_share_name, directory, config

    async def check_file_exist_with_time(self, folder_path, file_name="trainer_log.jsonl", time=250):
        is_file_exists = False
        start_time = datetime.datetime.now()

        while is_file_exists is False:
            logging.info(f"Looking for the file {file_name} in deployment {self.execution_model['name'].lower()}.")
            await asyncio.sleep(10)
            available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
                self.log_share_name, folder_path
            )
            for each in available_files_and_directories["data"]:
                if file_name in each.values():
                    is_file_exists = True
                    logging.info(f"{file_name} found in deployment {self.execution_model['name'].lower()}.")

            is_time_limit_exceed = (datetime.datetime.now() - start_time).seconds > time
            if is_time_limit_exceed:
                break

        return is_file_exists

    def check_checkpoint_csv(self, folder_path):
        final_checkpoints = []
        for index, checkpoint in enumerate(self.checkpoints):
            if checkpoint["is_result_generated"] is not True:
                file_name = (
                    f"checkpoint_{int(checkpoint['current_steps']/self.execution_model['settings']['save_steps'])}.csv"
                )
                logging.info(f"Looking for the file {file_name} in deployment {self.execution_model['name'].lower()}.")
                available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
                    self.log_share_name, folder_path
                )
                for each in available_files_and_directories["data"]:
                    if file_name in each.values():
                        checkpoint["is_result_generated"] = True
                        logging.info(f"{file_name} found in deployment {self.execution_model['name'].lower()}.")
            final_checkpoints.append(checkpoint)

        if len(final_checkpoints) > 0:
            self.checkpoints = final_checkpoints
            self.llm_workbench_event.update_event(
                self.user,
                self.execution_model["id"],
                detail={
                    "message": "Deployment is in progress.",
                    "status": "In-Progress",
                    "logs": self.train_logs,
                    "checkpoints": final_checkpoints,
                },
                is_set=True,
            )

    async def process_log_change(self, folder_path):
        logging.info("Trainer Log tracking has been started!")
        file_path = folder_path + "trainer_log_ui.jsonl"
        # Generator to catch each change
        async for change in self.track_changes_in_file("train_log", file_path):
            if isinstance(change, EndStream):
                logging.info("Received End of Stream, generator is done for Trainer Log!")
                break
            else:
                logging.info(f"Processing train log {change} at {datetime.datetime.now().time()}")

    async def process_checkpoint_change(self, folder_path):
        logging.info("Checkpoint Log tracking has been started!")
        file_path = folder_path + "checkpoint_log.jsonl"
        # Generator to catch each change
        async for change in self.track_changes_in_file("checkpoint_log", file_path):
            if isinstance(change, EndStream):
                logging.info("Received End of Stream, generator is done for Checkpoint Log!")
                break
            else:
                logging.info(f"Processing checkpoint log {change} at {datetime.datetime.now().time()}")
            # Check checkpoint csv is exist
            self.check_checkpoint_csv(
                folder_path,
            )

    async def track_changes_in_file(self, type, file_path):
        try:
            detector = FileShareService(
                self.app_settings.AZURE_FILE_SHARE_CONNECTION_STRING,
                self.log_share_name,
                file_path,
            )

            async for change in detector.watch_file_changes():
                logging.info(f"Detecting log and checkpoint change in {self.execution_model['name']}.")
                if change and len(change) > 0:
                    for each in change:
                        if type == "train_log":
                            self.train_logs.append(each)
                        else:
                            each["name"] = f"checkpoint-{each['current_steps']}"
                            each["is_result_generated"] = False
                            each["checkpoint_evaluation_status"] = "Not Initialized"
                            self.checkpoints.append(each)

                        # Adding type in change to identify
                        each["type"] = type

                    self.llm_workbench_event.update_event(
                        self.user,
                        self.execution_model["id"],
                        detail={
                            "message": "Deployment is in progress.",
                            "status": "In-Progress",
                            "logs": self.train_logs,
                            "checkpoints": self.checkpoints,
                        },
                        is_set=True,
                    )
                    if change[-1]["current_steps"] == change[-1]["total_steps"]:
                        yield change
                        yield EndStream()
                        detector.cancel_watching()

                    yield change

        except KeyboardInterrupt:
            detector.cancel_watching()
            logging.info("Stopping watching file changes watcher.")

        except Exception as e:
            detector.cancel_watching()
            logging.info(f"Stopping watching file changes watcher due to exception {e}.")

    async def process_checkpoint_result(self, folder_path, time):
        final_checkpoints = []
        for index, each in enumerate(self.checkpoints):
            if each["is_result_generated"] is not True:
                each["is_result_generated"] = await self.check_file_exist_with_time(
                    folder_path,
                    file_name=f"checkpoint_{int(each['current_steps']/self.execution_model['settings']['save_steps'])}.csv",
                    time=time,
                )

            final_checkpoints.append(each)
            self.llm_workbench_event.update_event(
                self.user,
                self.execution_model["id"],
                detail={
                    "message": "Deployment is in progress.",
                    "status": "In-Progress",
                    "logs": self.train_logs,
                    "checkpoints": final_checkpoints + self.checkpoints[index + 1 :],
                },
                is_set=True,
            )

        if len(final_checkpoints) > 0:
            self.checkpoints = final_checkpoints

    def get_deep_dive_data(self, folder_path):
        deep_dive = AzureFileShareService().get_csv_file_data_from_specific_path(
            self.log_share_name, f"{folder_path}evaluate/checkpoint_metric_df.csv"
        )
        if deep_dive["status"] != "success":
            raise GeneralException(message="Error reading deep dive data", status_code=500)
        return json.dumps(deep_dive["data"])

    def get_error_metrics(self, folder_path):
        error_metrics = AzureFileShareService().get_file_data_from_specific_path(
            self.log_share_name, f"{folder_path}evaluate/result.json"
        )
        if error_metrics["status"] != "success":
            raise GeneralException(message="Error reading error metrics", status_code=500)
        return json.dumps(error_metrics["data"])

    def get_accuracy(self, folder_path):
        error_metrics = json.loads(self.get_error_metrics(folder_path))
        keys = list(error_metrics[0].keys())
        return error_metrics[0][keys[-1]]

    async def post_process_logs_and_checkpoints(self, folder_path):
        # LLM Experiment Result Creation Process(DB)
        self.llm_experiments_service.create_llm_experiment_result(
            self.user,
            {
                "experiment_id": self.execution_model["id"],
                "train_loss": json.dumps(self.train_logs),
                "checkpoint_log_path": f"{self.log_share_name}/{folder_path}/checkpoint_log.jsonl",
                "log_path": f"{self.log_share_name}/{folder_path}/trainer_log_ui.jsonl",
                "error_metrics": self.get_error_metrics(folder_path),
                "accuracy": self.get_accuracy(folder_path),
                "deep_dive": self.get_deep_dive_data(folder_path),
                # "training_result" : None
            },
            serialize_data=True,
        )

        # LLM Experiment Checkpoint Creation Process(DB)
        if len(self.checkpoints) > 0:
            checkpoints_to_create = []
            for each in self.checkpoints:
                checkpoints_to_create.append(
                    {
                        "experiment_id": self.execution_model["id"],
                        "name": each["name"],
                        "model_path": f"{self.log_share_name}/{folder_path}{each['name']}/training_args.bin",
                        "checkpoint_path": f"{self.log_share_name}/{folder_path}{each['name']}",
                        "train_result_path": f"{self.log_share_name}/{folder_path}{each['name'].replace('-', '_')}",
                        "eval_path": None,
                        "is_active": True,
                        "created_by": self.user["id"],
                    }
                )

            self.llm_experiments_service.bulk_create_llm_experiment_checkpoint(
                self.user, {"experiment_id": self.execution_model["id"], "checkpoints": checkpoints_to_create}
            )

    async def read_logs_and_checkpoints(self):
        folder_path = (
            f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
        )

        try:
            await asyncio.gather(
                self.process_log_change(folder_path),
                self.process_checkpoint_change(folder_path),
            )

            await self.process_checkpoint_result(folder_path, 260)

            await self.check_file_exist_with_time(folder_path + "evaluate/", file_name="result.json", time=8000)

            await self.post_process_logs_and_checkpoints(folder_path)

            # Wait to complete the process
            await asyncio.sleep(10)

            # DB and Event Update
            self.handle_status_update(
                "Completed",
                message="Finetuning is completed.",
            )

        except Exception as e:
            logging.info(f"Issue occured reading logs and checkpoints which is {e}.")

    async def run_untrained_model_evaluation(self):
        # Orchstration Process
        await finetuning_orchestrator.UntraineModelEvaluationHandler(
            self.user, self.execution_model, self.model_registry, self.compute_config
        ).deploy_untrained_model_evaluation_runtime()

    async def execute_finetuning_model(self):
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()

        # Get Nodepool
        sku = self.compute_config["name"]
        self.nodepool = self.get_node_pool(
            {
                "nodepool_name": LLMWORKBENCH_TRAINING_POOLS[sku],
                "sku": sku,
            }
        )
        # Check Dataset Source Type to "nuclios"
        if self.execution_model["dataset"] is not None:
            if self.execution_model["dataset"]["source_type"] != "nuclios":
                # Raise Error using Event
                self.handle_status_update("Failed", message="Deployment initialization failed")
                raise GeneralException(message="Execution type mismatched!", status_code=500)

        # Create Fileshare and Upload Config
        self.create_fileshare_directory_and_upload_config()

        # Generate Volume Specs
        self.set_execution_model_volume_mounts_and_spec()  # Data accessible by self.volume_mounts, self.volume_spec

        # Create a deployment using Job
        self.intialize_deployment_using_job(
            LLMWORKBENCH_TRAINING_POOLS[sku],
            self.app_settings.LLMWORKBENCH_FINETUNE_IMAGE_URL,
            self.execution_model["name"].lower(),
            (f"{self.execution_model['name']}-{self.execution_model['id']}-container").lower(),
        )

        # Wait to intialize deployment completly
        await asyncio.sleep(60)

        # Check test_data.json
        await self.run_untrained_model_evaluation()

        # Read checkpoints and update status(databse and event)
        await self.read_logs_and_checkpoints()

        # Delete Deployment once it is completed
        # self.delete_deployment(self.execution_model["name"].lower(), self.app_settings.DEPLOYMENT_NAMESPACE)


class UntrainedModelEvaluationExecutor(OrchestratorExecutionBase):
    """
    UntrainedModelEvaluationExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, execution_model, model_registry, compute_config, checkpoint, type) -> None:
        self.model_registry = model_registry
        self.compute_config = compute_config
        self.log_share_name = "train-repository"
        self.dataset_share_name = "dataset-repository"
        super().__init__(user, execution_model, model_registry, checkpoint, type)

    def update_event_status(self, status, message=None):
        event = self.llm_workbench_event.get_event(self.user, self.execution_model["id"])

        if event is not False:
            event["is_checkpoint_evaluation_enabled"] = status.lower() == "completed"
        return event

    async def check_file_exist(self, folder_path, file_name="trainer_log.jsonl", time=None):
        is_file_exists = False
        if time is not None:
            start_time = datetime.datetime.now()

        while is_file_exists is False:
            logging.info(f"Looking for the file {file_name} in {self.execution_model['name'].lower()}-untrained-model.")
            await asyncio.sleep(10)
            available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
                self.log_share_name, folder_path
            )
            for each in available_files_and_directories["data"]:
                if file_name in each.values():
                    is_file_exists = True
                    logging.info(f"{file_name} found.")

            if time is not None:
                is_time_limit_exceed = (datetime.datetime.now() - start_time).seconds > time
                if is_time_limit_exceed:
                    break

        return is_file_exists

    async def execute_untrained_model_evaluation(self):
        folder_path = (
            f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
            + "dataset/"
        )

        # Read result file
        is_dataset_available = await self.check_file_exist(folder_path, "test_data.csv", time=600)

        if is_dataset_available:
            # Intializing Kube Config(Class Method)
            self.intialize_kube_connection()

            # Get Nodepool
            self.nodepool = self.get_node_pool(
                {
                    "nodepool_name": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
                    "sku": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
                }
            )

            # Generate Volume Specs
            self.set_untrained_model_evaluation_volume_mounts_and_spec()  # Data accessible by self.volume_mounts, self.volume_spec

            # Create a deployment using Job
            self.intialize_deployment_using_job(
                LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
                self.app_settings.LLMWORKBENCH_UNTRAINED_EVALUATION_IMAGE_URL,
                f"{self.execution_model['name']}-untrained-model".lower(),
                (f"{self.execution_model['name']}-{self.execution_model['id']}-untrained-model-container").lower(),
            )

            # Wait to intialize deployment completly
            await asyncio.sleep(60)

            folder_path = (
                f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
                + "dataset/"
            )

            # Read result file
            is_result_file_exist = await self.check_file_exist(folder_path, "test_model_untrained_infer.csv", time=6000)

            # Update Status
            self.handle_status_update("Completed" if is_result_file_exist else "Failed")

            # Delete Deployment once it is completed
            # self.delete_deployment(
            #     f"{self.execution_model['name']}-untrained-model".lower(), self.app_settings.DEPLOYMENT_NAMESPACE
            # )


class CheckpointEvaluationExecutor(OrchestratorExecutionBase):
    """
    FinetuneExecutor is specific for the Finetuning Orchestration Execution Process.
    OrchestratorExecutionBase is inherited to have basic and common functionalities.
    """

    def __init__(self, user, execution_model, model_registry, compute_config, checkpoint, type) -> None:
        self.model_registry = model_registry
        self.compute_config = compute_config
        self.log_share_name = "train-repository"
        self.dataset_share_name = "dataset-repository"
        super().__init__(user, execution_model, model_registry, checkpoint, type)

    def update_event_status(self, status, message=None):
        event = self.llm_workbench_event.get_event(self.user, self.execution_model["id"])

        if event is not False:
            new_checkpoints = []
            for each in event["checkpoints"]:
                if each["name"] == self.checkpoint["name"]:
                    each["checkpoint_evaluation_status"] = status
                new_checkpoints.append(each)
            event["checkpoints"] = new_checkpoints
        return event

    def get_config(self):
        # Generating config(Using existing objects and db tables data)
        config = {
            "model_name_or_path": self.model_registry["config"]["model_path"]
            if "config" in self.model_registry
            else None,
            "lora_rank": self.execution_model["settings"]["lora_rank"] if "settings" in self.execution_model else None,
            "val_size": self.execution_model["test_size"],
            "per_device_train_batch_size": self.execution_model["batch_size"],
            "gradient_accumulation_steps": self.execution_model["settings"]["gradient_acc_steps"]
            if "settings" in self.execution_model
            else None,
            "lr_scheduler_type": self.execution_model["settings"]["lr_scheduler_type"]
            if "settings" in self.execution_model
            else None,
            "logging_steps": self.execution_model["settings"]["logging_steps"]
            if "settings" in self.execution_model
            else None,
            "learning_rate": self.execution_model["learning_rate"],
            "num_train_epochs": self.execution_model["epochs"],
            "dataset_path": "/dataset/test_data.json" if "dataset" in self.execution_model else None,
            "finetuning_type": self.execution_model["settings"]["peft_method"]
            if "settings" in self.execution_model
            else None,
            "stage": "sft",
            "output_dir": "/train",
            "use_fast_tokenizer": True,
            "do_train": True,
            "dataset": "custom_data",
            "dataset_dir": "./app/data_for_fintune",
            "template": "default",
            "lora_target": ["q_proj", "k_proj", "v_proj", "o_proj"],
            "overwrite_output_dir": True,
            "overwrite_cache": True,
            "save_steps": self.execution_model["settings"]["save_steps"],
            "plot_loss": True,
            "bf16": True,
            "save_safetensors": True,
            "eval_metric": self.execution_model["error_metric_type"],
            "adapter_dir": f"/train/{self.checkpoint['name']}",
        }
        return json.dumps(config)

    def create_fileshare_directory_and_upload_config(self):
        # Directory Creation
        directory = (
            f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
            + f"{self.checkpoint['name']}/"
        )

        # Generate Config
        config = self.get_config()

        # Create Config and Upload
        self.upload_config_on_fileshare(config, self.log_share_name, directory)

        logging.info("Fileshare Upload Success.")
        return self.log_share_name, directory, config

    async def check_file_exist(self, folder_path, file_name="trainer_log.jsonl", time=None):
        is_file_exists = False
        if time is not None:
            start_time = datetime.datetime.now()

        while is_file_exists is False:
            logging.info(
                f"Looking for the file {file_name} in deployment {self.execution_model['name']}-{self.checkpoint['name']}".lower()
            )
            await asyncio.sleep(10)
            available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
                self.log_share_name, folder_path
            )
            for each in available_files_and_directories["data"]:
                if file_name in each.values():
                    is_file_exists = True
                    logging.info(f"{file_name} found.")

            if time is not None:
                is_time_limit_exceed = (datetime.datetime.now() - start_time).seconds > time
                if is_time_limit_exceed:
                    break

        return is_file_exists

    def post_checkpoint_evaluation_process(self, folder_path):
        csv_file_path = folder_path + "checkpoint_metric_df.csv"
        json_file_path = folder_path + "result.json"

        csv_data = AzureFileShareService().get_csv_file_data_from_specific_path(self.log_share_name, csv_file_path)

        if csv_data["status"] != "success":
            # Update Status
            self.update_execution_model_status("Failed")
            raise GeneralException(message="Checkpoint evaluation csv data does not exist.", status_code=404)

        json_data = AzureFileShareService().get_file_data_from_specific_path(self.log_share_name, json_file_path)

        if json_data["status"] != "success":
            # Update Status
            self.update_execution_model_status("Failed")
            raise GeneralException(message="Checkpoint evaluation json data does not exist.", status_code=404)

        # LLM Experiment Result Creation Process(DB)
        self.llm_experiments_service.update_llm_experiment_checkpoint(
            self.user,
            {
                "experiment_id": self.execution_model["id"],
                "name": self.checkpoint["name"],
                "eval_path": csv_file_path,
                "eval_result": json.dumps(csv_data["data"]),
                "error_metrics_path": json_file_path,
                "error_metrics": json.dumps(json_data["data"]),
            },
            serialize_data=True,
        )

    async def execute_checkpoint_evaluation(self):
        # Intializing Kube Config(Class Method)
        self.intialize_kube_connection()

        # Get Nodepool
        self.nodepool = self.get_node_pool(
            {
                "nodepool_name": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
                "sku": LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
            },
        )

        # Create Fileshare and Upload Config
        self.create_fileshare_directory_and_upload_config()

        # Generate Volume Specs
        self.set_checkpoint_evaluation_volume_mounts_and_spec()  # Data accessible by self.volume_mounts, self.volume_spec

        # Create a deployment using Job
        self.intialize_deployment_using_job(
            LLMWORKBENCH_TRAINING_POOLS["NC4as_T4_v3"],
            self.app_settings.LLMWORKBENCH_EVALUATION_IMAGE_URL,
            f"{self.execution_model['name']}-{self.checkpoint['name']}".lower(),
            (
                f"{self.execution_model['name']}-{self.execution_model['id']}-{self.checkpoint['name']}-container"
            ).lower(),
        )

        # Wait to intialize deployment completly
        await asyncio.sleep(60)

        folder_path = (
            f"{self.execution_model['name']}_{self.execution_model['id']}_{self.model_registry['name']}/".lower()
            + f"{self.checkpoint['name']}/"
        )

        # Read result file
        is_result_file_exist = await self.check_file_exist(folder_path, "checkpoint_metric_df.csv", time=10800)

        if is_result_file_exist:
            # Post Process
            self.post_checkpoint_evaluation_process(folder_path)

        # Update Status
        self.handle_status_update(
            "Completed" if is_result_file_exist else "Failed",
        )

        # Delete Deployment once it is completed
        # self.delete_deployment(
        #     f"{self.execution_model['name']}-{self.checkpoint['name']}".lower(), self.app_settings.DEPLOYMENT_NAMESPACE
        # )
