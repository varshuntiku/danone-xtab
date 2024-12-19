import json

from api.configs.settings import get_app_settings
from api.daos.llm_workbench.experiment_dao import LLMExperimentDao
from api.daos.llm_workbench.model_registry_dao import ModelRegistryDao
from api.dtos.llm_workbench.experiment_dto import (
    LLMExperimentCheckpointDTO,
    LLMExperimentCheckpointEvaluationResultDTO,
    LLMExperimentCheckpointEvaluationStatusDTO,
    LLMExperimentCreateDTO,
    LLMExperimentDTO,
    LLMExperimentResultDTO,
    LLMExperimentResultLossDTO,
    LLMExperimentStatusDTO,
)
from api.helpers.common_helper import nested_object_to_dict_converter
from api.middlewares.error_middleware import (
    AlreadyExistException,
    DoesNotExistException,
    GeneralException,
)
from api.schemas.llm_workbench.experiment_schema import LLMExperimentUpdateSchema
from api.serializers.llm_workbench.experiment_serializer import (
    LLMExperimentCheckpointSerializer,
    LLMExperimentCreateSerializer,
    LLMExperimentResultSerializer,
    LLMExperimentSerializer,
)
from api.services.utils.azure.fileshare_service import AzureFileShareService
from api.services.utils.llm_workbench.llm_workbench_event_utility_service import (
    LLMWorkbenchEventUtilityService,
)
from fastapi import status
from infra_manager import initialize
from infra_manager.core.k8.kube_connection import KubeConnection
from infra_manager.k8_manager.deployment_manager.deployment import Deployment


class LLMExperimentService:
    """
    Getting queryset from relevant DAO and selecting data which is necessary in DTO.
    """

    def __init__(self):
        self.log_share_name = "train-repository"
        self.llm_experiment_dao = LLMExperimentDao()
        self.model_registry_dao = ModelRegistryDao()
        self.llm_workbench_event = LLMWorkbenchEventUtilityService()

    def validate_llm_experiment_exist(self, experiment_id):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_by_id(experiment_id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="The LLMExperiment does not exist.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return llm_experiment

    def validate_create_llm_experiment(self, user, request_data):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_by_name(request_data["name"])
        if llm_experiment:
            raise AlreadyExistException(
                message="The LLMExperiment with name already exist.",
                status_code=status.HTTP_409_CONFLICT,
            )
        base_model = self.model_registry_dao.get_model_registry_by_id(request_data["base_model_id"])
        if not base_model:
            raise DoesNotExistException(
                message="The Base model trying to Finetune does not exists.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        return user, request_data

    def validate_update_llm_experiment(self, user, request_data):
        llm_experiment = self.validate_llm_experiment_exist(request_data["id"])

        if llm_experiment.name != request_data["name"]:
            raise GeneralException(
                message="Name is not matching with record.",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        return user, request_data, llm_experiment

    def get_paginated_llm_experiments(self, user, page, page_size, search):
        # Paginated Query and Total without pagination
        (
            llm_experiments,
            total_available_llm_experiments,
        ) = self.llm_experiment_dao.get_paginated_llm_experiments(user, page, page_size, search)
        # Converting into DTO objects
        transformed_llm_experiments = [LLMExperimentDTO(llm_experiment) for llm_experiment in llm_experiments]
        return transformed_llm_experiments, total_available_llm_experiments

    def get_llm_experiments(self, user, search):
        llm_experiments = self.llm_experiment_dao.get_llm_experiments(user, search)

        # Converting into DTO objects
        transformed_llm_experiments = [LLMExperimentDTO(llm_experiment) for llm_experiment in llm_experiments]
        return transformed_llm_experiments

    # Multiple Experiments(Only status for listing)
    def get_llm_experiments_status(self, user, ids):
        llm_experiments = self.llm_experiment_dao.get_llm_experiments_by_ids(ids)
        if llm_experiments:
            if len(llm_experiments) != len(ids):
                raise GeneralException(message="Invalid IDs!", status_code=status.HTTP_404_NOT_FOUND)
        else:
            raise GeneralException(message="Invalid IDs!", status_code=status.HTTP_404_NOT_FOUND)

        return [LLMExperimentStatusDTO(llm_experiment) for llm_experiment in llm_experiments]

    # Experiment Status with Train Logs
    def get_llm_experiments_train_logs(self, llm_experiment):
        if llm_experiment.status.lower() == "completed":
            experiment_result = self.llm_experiment_dao.get_llm_experiment_result_by_llm_experiment_id(
                llm_experiment.id
            )
            if experiment_result and experiment_result.train_loss is not None:
                logs = experiment_result.train_loss
                return json.loads(logs)
            else:
                return self.llm_experiment_dao.get_llm_experiment_train_logs_from_fileshare(
                    f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}"
                )
        else:
            return self.llm_experiment_dao.get_llm_experiment_train_logs_from_fileshare(
                f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}"
            )

    # Experiment Status with Checkpoint Logs
    def get_llm_experiments_checkpoint_logs(self, llm_experiment, experiment_settings):
        llm_experiment_checkpoints = self.llm_experiment_dao.get_llm_experiment_checkpoint_logs_from_fileshare(
            f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}"
        )

        updated_llm_experiment_checkpoints = []

        if llm_experiment_checkpoints is not None and len(llm_experiment_checkpoints) > 0:
            for checkpoint in llm_experiment_checkpoints:
                checkpoint["name"] = f"checkpoint-{checkpoint['current_steps']}"
                checkpoint["is_result_generated"] = False

                available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
                    "train-repository",
                    f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/".lower(),
                )
                for each in available_files_and_directories["data"]:
                    file_name = f"checkpoint_{int(checkpoint['current_steps']/experiment_settings.save_steps)}.csv"
                    if file_name in each.values():
                        checkpoint["is_result_generated"] = True

                updated_llm_experiment_checkpoints.append(checkpoint)

        return updated_llm_experiment_checkpoints

    def get_untrained_model_evaluation_availability(self, llm_experiment):
        is_checkpoint_evaluation_enabled = False
        available_files_and_directories = AzureFileShareService().get_available_directories_in_specific_path(
            "train-repository",
            f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/dataset/".lower(),
        )
        if available_files_and_directories["data"] is not None:
            for each in available_files_and_directories["data"]:
                file_name = "test_model_untrained_infer.csv"
                if file_name in each.values():
                    is_checkpoint_evaluation_enabled = True
                    break
        return is_checkpoint_evaluation_enabled

    def get_llm_experiments_status_by_id(self, user, id):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )

        return {
            "status": llm_experiment.status,
            "message": "Successful.",
            "logs": self.get_llm_experiments_train_logs(llm_experiment),
            "checkpoints": self.get_llm_experiments_checkpoint_logs(llm_experiment, llm_experiment.experiment_settings),
            "is_checkpoint_evaluation_enabled": self.get_untrained_model_evaluation_availability(llm_experiment),
        }

    def get_llm_experiment_checkpoints_evaluation_status(self, user, experiment_id):
        self.validate_llm_experiment_exist(experiment_id)

        llm_experiment_checkpoints = self.llm_experiment_dao.get_llm_experiment_checkpoints_by_llm_experiment_id(
            experiment_id
        )
        if not llm_experiment_checkpoints:
            raise DoesNotExistException(
                message="Experiment checkpoint does not exist, please send valid id and name.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        return [
            LLMExperimentCheckpointEvaluationStatusDTO(llm_experiment_checkpoint)
            for llm_experiment_checkpoint in llm_experiment_checkpoints
        ]

    def get_llm_experiment_checkpoint_evaluation_result(self, user, experiment_id, checkpoint_name):
        llm_experiment = self.validate_llm_experiment_exist(experiment_id)

        llm_experiment_checkpoint = self.llm_experiment_dao.get_llm_experiment_checkpoint_by_name(
            experiment_id, checkpoint_name
        )
        if not llm_experiment_checkpoint:
            raise DoesNotExistException(
                message="Experiment checkpoint does not exist, please send valid id and name.",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        data = []
        current_steps = checkpoint_name.split("-")[-1]
        if llm_experiment.status.lower() == "completed":
            llm_experiment_result = self.llm_experiment_dao.get_llm_experiment_result_by_llm_experiment_id(
                llm_experiment.id
            )
            transformed_llm_experiment_result = LLMExperimentResultLossDTO(llm_experiment_result)
            for loss in transformed_llm_experiment_result.train_loss:
                if loss.current_steps >= int(current_steps):
                    if data[-1].current_steps != int(current_steps):
                        data.append(loss)
                    break
                data.append(loss)
        else:
            training_log = AzureFileShareService().get_file_data_from_specific_path(
                "train-repository",
                f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/trainer_log_ui.jsonl".lower(),
            )
            duplicate_map = {}
            for log in training_log["data"]:
                if log["current_steps"] not in duplicate_map:
                    duplicate_map[log["current_steps"]] = True
                    if log["current_steps"] >= int(current_steps):
                        if data[-1]["current_steps"] != int(current_steps):
                            data.append(log)
                        break
                    data.append(log)

        transformed_llm_experiment_checkpoint = LLMExperimentCheckpointEvaluationResultDTO(llm_experiment_checkpoint)

        return {
            "eval_results": transformed_llm_experiment_checkpoint.eval_result,
            "error_metrics": transformed_llm_experiment_checkpoint.error_metrics,
            "train_loss": data,
        }

    def get_llm_experiment_result(self, user, id):
        llm_experiment = self.validate_llm_experiment_exist(id)

        if llm_experiment.status and llm_experiment.status.lower() != "completed":
            raise GeneralException(message="Experiment does not have result.", status_code=status.HTTP_404_NOT_FOUND)
        llm_experiment_result = self.llm_experiment_dao.get_llm_experiment_result_by_llm_experiment_id(id)
        if llm_experiment_result is None and llm_experiment.status.lower() == "completed":
            deep_dive = AzureFileShareService().get_csv_file_data_from_specific_path(
                "train-repository",
                f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/evaluate/checkpoint_metric_df.csv",
            )
            if deep_dive["status"] != "success":
                raise GeneralException(message="Error reading deep dive data", status_code=500)
            error_metrics = AzureFileShareService().get_file_data_from_specific_path(
                "train-repository",
                f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/evaluate/result.json",
            )
            # training_results  = AzureFileShareService().get_file_data_from_specific_path(
            #             'train-repository',
            #             f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/evaluate/final_model_sampled_train_results.csv"
            # )
            result = self.create_llm_experiment_result(
                user,
                {
                    "experiment_id": id,
                    "train_loss": json.dumps(self.get_llm_experiments_train_logs(llm_experiment)),
                    "checkpoint_log_path": f"{'train-repository'}/{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/checkpoint_log.jsonl",
                    "log_path": f"train-repository/{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}/trainer_log_ui.jsonl",
                    "error_metrics": json.dumps(error_metrics["data"]),
                    # "accuracy" : error_metrics['data'][0][keys[-1]],
                    "deep_dive": json.dumps(deep_dive["data"]),
                },
                serialize_data=True,
            )
            return LLMExperimentResultDTO(result)
        if llm_experiment_result is None and llm_experiment.status.lower() != "completed":
            raise DoesNotExistException(
                message="Experiment does not have result.", status_code=status.HTTP_404_NOT_FOUND
            )
        return LLMExperimentResultDTO(llm_experiment_result)

    def get_llm_experiment_detail(self, user, id, serialize_data=False):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )
        transformed_llm_experiment = LLMExperimentDTO(llm_experiment)
        if serialize_data:
            return dict(LLMExperimentCreateSerializer(**transformed_llm_experiment.__dict__))
        return transformed_llm_experiment

    def get_llm_experiment_training_result_by_id(self, user, id):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )
        folder_path = f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}".lower()
        file_path = f"{folder_path}/evaluate/final_model_sampled_train_results.csv"
        available_files = AzureFileShareService().get_csv_file_data_from_specific_path(
            self.log_share_name,
            file_path,
            ["prompt", "output", "Trained_model_result", "Unrained_model_result"],
            {
                "prompt": "instructions",
                "output": "actual_response",
                "Trained_model_result": "model_response",
                "Unrained_model_result": "untrained_response",
            },
        )

        if available_files["status"] != "success":
            raise DoesNotExistException(
                message="Training result does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )

        return available_files["data"]

    def get_llm_checkpoint_result_by_id(self, user, id, checkpoint_id, serialize_data=False):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )
        folder_path = f"{llm_experiment.name}_{llm_experiment.id}_{llm_experiment.model.name}".lower()
        checkpoint = checkpoint_id // llm_experiment.experiment_settings.save_steps
        file_path = f"{folder_path}/checkpoint_{checkpoint}.csv"
        available_files = AzureFileShareService().get_csv_file_data_from_specific_path(
            self.log_share_name,
            file_path,
            ["prompt", "output", "Trained_model_result", "Unrained_model_result"],
            {
                "prompt": "instructions",
                "output": "actual_response",
                "Trained_model_result": "model_response",
                "Unrained_model_result": "untrained_response",
            },
        )

        if available_files["status"] != "success":
            raise DoesNotExistException(
                message="Checkpoint does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )

        return available_files["data"]

    # Creat LLMExperiment
    def create_llm_experiment(self, user, request_data):
        # Validating request_data
        user, request_data = self.validate_create_llm_experiment(user, request_data)
        # Call to Dao for db entry
        created_llm_experiment = self.llm_experiment_dao.create_llm_experiment(user, request_data)
        transformed_llm_experiment = LLMExperimentCreateDTO(created_llm_experiment)

        # Create Event
        self.llm_workbench_event.create_event(
            user,
            transformed_llm_experiment.id,
            detail={"type": "finetune", "status": "Created", "message": "Experiment is created."},
            is_set=True,
        )
        return transformed_llm_experiment

    def create_llm_experiment_result(self, user, request_data, serialize_data=False):
        self.validate_llm_experiment_exist(request_data["experiment_id"])

        # Call to Dao for db entry
        llm_experiment_result = self.llm_experiment_dao.create_llm_experiment_result(user, request_data)
        transformed_llm_experiment_results = LLMExperimentResultDTO(llm_experiment_result)
        # if serialize_data:
        #     return dict(
        #         LLMExperimentResultSerializer(**(nested_object_to_dict_converter(transformed_llm_experiment_results)))
        #     )
        return transformed_llm_experiment_results

    def bulk_create_llm_experiment_checkpoint(self, user, request_data):
        self.validate_llm_experiment_exist(request_data["experiment_id"])

        # Call to Dao for db entry
        llm_experiment_result = self.llm_experiment_dao.bulk_create_llm_experiment_checkpoint(user, request_data)
        return llm_experiment_result

    def evaluate_experiment_checkpoint(self, user, experiment_id, checkpoint_name, serialize_data=False):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(experiment_id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )

        llm_experiment_checkpoint = self.llm_experiment_dao.get_llm_experiment_checkpoint_by_name(
            experiment_id, checkpoint_name
        )
        if not llm_experiment_checkpoint:
            raise DoesNotExistException(
                message="Experiment checkpoint does not exist, please send valid id and name.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        transformed_llm_experiment = LLMExperimentCreateDTO(llm_experiment)

        transformed_llm_experiment_checkpoint = LLMExperimentCheckpointDTO(llm_experiment_checkpoint)

        event = self.llm_workbench_event.get_event(None, experiment_id)

        if event is not False:
            new_checkpoints = []
            for each in event["checkpoints"]:
                if each["name"] == checkpoint_name:
                    each["checkpoint_evaluation_status"] = "Created"
                new_checkpoints.append(each)
            event["checkpoints"] = new_checkpoints
            self.llm_workbench_event.update_event(
                user,
                experiment_id,
                detail=event,
                is_set=True,
            )
        else:
            # Create Event
            self.llm_workbench_event.create_event(
                user,
                transformed_llm_experiment.id,
                detail={
                    "type": "finetune",
                    "status": transformed_llm_experiment.status,
                    "message": transformed_llm_experiment.status,
                    "checkpoints": self.get_llm_experiments_checkpoint_logs(
                        llm_experiment, llm_experiment.experiment_settings
                    ),
                    "is_checkpoint_evaluation_enabled": self.get_untrained_model_evaluation_availability(
                        llm_experiment
                    ),
                },
                is_set=True,
            )

        if serialize_data:
            return dict(
                LLMExperimentCreateSerializer(**nested_object_to_dict_converter(transformed_llm_experiment))
            ), dict(
                LLMExperimentCheckpointSerializer(
                    **(nested_object_to_dict_converter(transformed_llm_experiment_checkpoint))
                )
            )

        return transformed_llm_experiment, transformed_llm_experiment_checkpoint

    # Update Deployed Model
    def update_llm_experiment(self, user, request_data, serialize_data=False, validate_schema=False):
        if validate_schema:
            request_data = dict(LLMExperimentUpdateSchema(**request_data))
        # Validating request_data
        user, request_data, llm_experiment = self.validate_update_llm_experiment(user, request_data)

        updated_llm_experiment = self.llm_experiment_dao.update_llm_experiment(user, llm_experiment, request_data)
        transformed_llm_experiment = LLMExperimentDTO(updated_llm_experiment)

        if serialize_data:
            return dict(LLMExperimentSerializer(**(nested_object_to_dict_converter(transformed_llm_experiment))))
        return transformed_llm_experiment

    def update_llm_experiment_result(self, user, request_data, serialize_data=False):
        self.validate_llm_experiment_exist(request_data["experiment_id"])

        llm_experiment_result = self.llm_experiment_dao.get_llm_experiment_result_by_llm_experiment_id(
            request_data["experiment_id"]
        )
        if not llm_experiment_result:
            raise DoesNotExistException(
                message="Experiment result does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )

        # Call to Dao for db entry
        llm_experiment_result = self.llm_experiment_dao.update_llm_experiment_result(
            user, llm_experiment_result, request_data
        )
        transformed_llm_experiment_result = LLMExperimentResultDTO(llm_experiment_result)
        if serialize_data:
            return dict(
                LLMExperimentResultSerializer(**(nested_object_to_dict_converter(transformed_llm_experiment_result)))
            )
        return transformed_llm_experiment_result

    def update_llm_experiment_checkpoint(self, user, request_data, serialize_data=False):
        self.validate_llm_experiment_exist(request_data["experiment_id"])

        llm_experiment_checkpoint = self.llm_experiment_dao.get_llm_experiment_checkpoint_by_name(
            request_data["experiment_id"], request_data["name"]
        )
        if not llm_experiment_checkpoint:
            raise DoesNotExistException(
                message="Experiment checkpoint does not exist, please send valid id and name.",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # Call to Dao for db entry
        llm_experiment_checkpoint = self.llm_experiment_dao.update_llm_experiment_checkpoint(
            user, llm_experiment_checkpoint, request_data
        )
        transformed_llm_experiment_checkpoint = LLMExperimentCheckpointDTO(llm_experiment_checkpoint)
        if serialize_data:
            return dict(
                LLMExperimentCheckpointSerializer(
                    **(nested_object_to_dict_converter(transformed_llm_experiment_checkpoint))
                )
            )
        return transformed_llm_experiment_checkpoint

    def terminate_experiment_finetuning(self, user, id):
        llm_experiment = self.llm_experiment_dao.get_llm_experiment_detail_by_id(id)
        if not llm_experiment:
            raise DoesNotExistException(
                message="Experiment does not exist, please send valid id.", status_code=status.HTTP_404_NOT_FOUND
            )
        print(llm_experiment.name)
        # Delete deployment
        app_settings = get_app_settings()
        cloud_settings = {
            "AD_CLIENT_ID": app_settings.AD_CLIENT_ID,
            "AD_CLIENT_SECRET": app_settings.AD_CLIENT_SECRET,
            "TENANT_ID": app_settings.TENANT_ID,
            "RESOURCE_GROUP": app_settings.RESOURCE_GROUP,
            "CLUSTER_NAME": app_settings.CLUSTER_NAME,
            "SUBSCRIPTION_ID": app_settings.SUBSCRIPTION_ID,
        }
        initialize(
            is_cloud=True,
            cloud_provider="azure",
            cloud_settings=cloud_settings,
        )
        kube_connection = KubeConnection()
        deployment_manager = Deployment(kube_connection)
        try:
            deploy_status = deployment_manager.delete_deployment(llm_experiment.name, app_settings.FINETUNING_NAMESPACE)
            print(f"Delete Status: {deploy_status}")
        except Exception as e:
            print("Error ", e)
            raise GeneralException(
                message="Error occurred in deleting  deployment",
                status_code=status.HTTP_404_NOT_FOUND,
            )

        # #Update Events
        self.llm_workbench_event.update_event(
            user,
            llm_experiment.id,
            detail={"message": "Deployment process Terminated ", "status": "Terminated"},
            is_set=True,
        )

        self.update_llm_experiment(
            user,
            {"id": llm_experiment.id, "name": llm_experiment.name, "status": "Terminated"},
            serialize_data=True,
            validate_schema=True,
        )

        experiment = self.llm_workbench_event.get_event(user, llm_experiment.id)
        base_model = self.model_registry_dao.get_model_registry_by_id(llm_experiment.model_id)
        folder_path = f"{llm_experiment.name}_{llm_experiment.id}_{base_model.__dict__['name']}/".lower()
        log_share_name = "train-repository"

        # LLM Experiment result creation process (DB)
        if experiment:
            if "logs" in experiment:
                self.create_llm_experiment_result(
                    user,
                    {
                        "experiment_id": llm_experiment.id,
                        "train_loss": json.dumps(experiment["logs"]),
                        "checkpoint_log_path": f"{log_share_name}/{folder_path}/checkpoint_log.jsonl",
                        "log_path": f"{log_share_name}/{folder_path}/trainer_log_ui.jsonl",
                    },
                    serialize_data=True,
                )

            # LLM Experiment checkpoints creation (DB)
            if "checkpoints" in experiment:
                if len(experiment["checkpoints"]) > 0:
                    checkpoints_to_create = []
                    for each in experiment["checkpoints"]:
                        checkpoints_to_create.append(
                            {
                                "experiment_id": llm_experiment.id,
                                "name": each["name"],
                                "model_path": f"{log_share_name}/{folder_path}{each['name']}/training_args.bin",
                                "checkpoint_path": f"{log_share_name}/{folder_path}{each['name']}",
                                "train_result_path": f"{log_share_name}/{folder_path}{each['name'].replace('-', '_')}",
                                "eval_path": None,
                                "is_active": True,
                                "created_by": user["id"],
                            }
                        )

                    self.bulk_create_llm_experiment_checkpoint(
                        user, {"experiment_id": llm_experiment.id, "checkpoints": checkpoints_to_create}
                    )
