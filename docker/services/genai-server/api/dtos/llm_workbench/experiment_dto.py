import json

from api.dtos.llm_workbench.compute_config_dto import LLMComputeConfigDTO
from api.dtos.llm_workbench.data_registry_dto import DatasetDTO
from api.dtos.llm_workbench.model_registry_dto import ModelRegistryDTO


class LLMExperimentSettingDTO:
    """
    Data Tranformation Object for the LLMExperimentSettingDTO.
    """

    def __init__(self, llm_experiment_setting) -> None:
        self.id = llm_experiment_setting.id
        self.peft_method = llm_experiment_setting.peft_method
        self.quantization = llm_experiment_setting.quantization
        self.gradient_acc_steps = llm_experiment_setting.gradient_acc_steps
        self.logging_steps = llm_experiment_setting.logging_steps
        self.save_steps = llm_experiment_setting.save_steps
        self.lr_scheduler_type = llm_experiment_setting.lr_scheduler_type
        self.lora_alpha = llm_experiment_setting.lora_alpha
        self.lora_rank = llm_experiment_setting.lora_rank


class LLMExperimentDTO:
    """
    Data Tranformation Object for the Finetuned Models.
    """

    def __init__(self, llm_experiment):
        self.id = llm_experiment.id
        self.name = llm_experiment.name
        self.base_model_id = llm_experiment.model_id if llm_experiment.model_id else None
        self.base_model = llm_experiment.model.name if llm_experiment.model_id else None
        self.problem_type = llm_experiment.problem_type
        self.epochs = llm_experiment.epochs
        self.test_size = llm_experiment.test_size
        self.batch_size = llm_experiment.batch_size
        self.max_tokens = llm_experiment.max_tokens
        self.learning_rate = llm_experiment.learning_rate
        self.error_metric_type = llm_experiment.error_metric_type
        self.status = llm_experiment.status
        self.settings = (
            LLMExperimentSettingDTO(llm_experiment.experiment_settings)
            if llm_experiment.experiment_settings_id
            else None
        )
        self.dataset = DatasetDTO(llm_experiment.dataset) if llm_experiment.dataset_id else None
        self.compute = LLMComputeConfigDTO(llm_experiment.compute) if llm_experiment.compute else None
        self.created_by = str(llm_experiment.created_by_user.email_address)
        self.created_at = str(llm_experiment.created_at)


class LLMExperimentCreateDTO:
    """
    Data Tranformation Object for the LLMExperimentCreateDTO.
    """

    def __init__(self, llm_experiment):
        self.id = llm_experiment.id
        self.name = llm_experiment.name
        self.base_model_id = llm_experiment.model_id if llm_experiment.model_id else None
        self.base_model = ModelRegistryDTO(llm_experiment.model) if llm_experiment.model_id else None
        self.problem_type = llm_experiment.problem_type
        self.epochs = llm_experiment.epochs
        self.test_size = llm_experiment.test_size
        self.batch_size = llm_experiment.batch_size
        self.max_tokens = llm_experiment.max_tokens
        self.learning_rate = llm_experiment.learning_rate
        self.error_metric_type = llm_experiment.error_metric_type
        self.status = llm_experiment.status
        self.compute = LLMComputeConfigDTO(llm_experiment.compute) if llm_experiment.compute else None
        self.settings = (
            LLMExperimentSettingDTO(llm_experiment.experiment_settings)
            if llm_experiment.experiment_settings_id
            else None
        )
        self.dataset = DatasetDTO(llm_experiment.dataset) if llm_experiment.dataset_id else None
        self.created_by = str(llm_experiment.created_by_user.email_address)
        self.created_at = str(llm_experiment.created_at)


class LLMExperimentStatusDTO:
    """
    Data Tranformation Object for the LLMExperimentStatusDTO.
    """

    def __init__(self, llm_experiment):
        self.id = llm_experiment.id
        self.status = llm_experiment.status


class LLMExperimentCheckpointEvaluationStatusDTO:
    """
    Data Tranformation Object for the LLMExperimentCheckpointEvaluationStatusDTO.
    """

    def __init__(self, llm_experiment):
        self.id = llm_experiment.id
        self.name = llm_experiment.name
        self.status = llm_experiment.eval_status if llm_experiment.eval_status is not None else "Not Initialized"


class LLMExperimentCheckpointEvaluationResultDTO:
    """
    Data Tranformation Object for the LLMExperimentCheckpointEvaluationStatusDTO.
    """

    def __init__(self, llm_experiment):
        self.id = llm_experiment.id
        self.eval_result = json.loads(llm_experiment.eval_result) if llm_experiment.eval_result else []
        self.error_metrics = json.loads(llm_experiment.error_metrics) if llm_experiment.error_metrics else []


class LLMExperimentErrorMetricDTO:
    """
    Data Tranformation Object for the LLMExperimentErrorMetricDTO.
    """

    def __init__(self, error_metrics):
        self.name = error_metrics["name"] if "name" in error_metrics else None
        self.untrained = error_metrics["untrained"]
        self.trained = error_metrics["trained"]


class LLMExperimentTrainLossDTO:
    """
    Data Tranformation Object for the LLMExperimentTrainLossDTO.
    """

    def __init__(self, train_loss):
        self.current_steps = train_loss["current_steps"]
        self.total_steps = train_loss["total_steps"]
        self.loss = train_loss["loss"]
        self.eval_loss = train_loss["eval_loss"]
        self.predict_loss = train_loss["predict_loss"]
        self.reward = train_loss["reward"]
        self.learning_rate = train_loss["learning_rate"]
        self.epoch = train_loss["epoch"]
        self.percentage = train_loss["percentage"]
        self.elapsed_time = train_loss["elapsed_time"]
        self.remaining_time = train_loss["remaining_time"]


class LLMExperimentDeepDiveDTO:
    """
    Data Tranformation Object for the LLMExperimentDeepDiveDTO.
    """

    def __init__(self, deep_dive):
        self.instruction = deep_dive["instruction"]
        # self.actual_response = deep_dive["actual_response"]
        self.Trained_model_result = deep_dive["Trained_model_result"]
        self.Untrained_model_result = deep_dive["Untrained_model_result"]
        self.input = deep_dive["input"]
        self.prompt = deep_dive["prompt"]
        self.data_source = deep_dive["data_source"] if "data_source" in deep_dive else None
        self.output = deep_dive["output"] if "output" in deep_dive else None


class LLMExperimentResultDTO:
    """
    Data Tranformation Object for the LLMExperimentResultDTO.
    """

    def __init__(self, llm_experiment_result):
        self.id = llm_experiment_result.id
        self.experiment_id = llm_experiment_result.experiment_id
        self.accuracy = llm_experiment_result.accuracy
        self.run_time = llm_experiment_result.run_time
        self.log_path = llm_experiment_result.log_path
        # self.training_result = ([train_result for train_result in json.loads(llm_experiment_result.training_result)] if llm_experiment_result.training_result else None)
        # self.error_metrics = (
        #     [
        #         LLMExperimentErrorMetricDTO(error_metric)
        #         for error_metric in json.loads(llm_experiment_result.error_metrics)
        #     ]
        #     if llm_experiment_result.error_metrics
        #     else None
        # )
        self.error_metrics = (
            [error_metric for error_metric in json.loads(llm_experiment_result.error_metrics)]
            if llm_experiment_result.error_metrics
            else None
        )
        self.train_loss = (
            [LLMExperimentTrainLossDTO(each) for each in json.loads(llm_experiment_result.train_loss)]
            if llm_experiment_result.train_loss
            else None
        )
        self.deep_dive = (
            [each for each in json.loads(llm_experiment_result.deep_dive)] if llm_experiment_result.deep_dive else None
        )
        self.is_active = llm_experiment_result.is_active


class LLMExperimentResultLossDTO:
    """
    Data Tranformation Object for the LLMExperimentResultDTO.
    """

    def __init__(self, llm_experiment_result):
        self.id = llm_experiment_result.id
        self.experiment_id = llm_experiment_result.experiment_id
        self.accuracy = llm_experiment_result.accuracy
        self.run_time = llm_experiment_result.run_time
        self.log_path = llm_experiment_result.log_path
        self.train_loss = (
            [LLMExperimentTrainLossDTO(each) for each in json.loads(llm_experiment_result.train_loss)]
            if llm_experiment_result.train_loss
            else None
        )
        self.is_active = llm_experiment_result.is_active


class LLMExperimentCheckpointDTO:
    """
    Data Tranformation Object for the LLMExperimentCheckpointDTO.
    """

    def __init__(self, checkpoint):
        self.id = checkpoint.id
        self.name = checkpoint.name
        self.model_path = checkpoint.model_path
        self.checkpoint_path = checkpoint.checkpoint_path
        self.train_result_path = checkpoint.train_result_path
        self.eval_path = checkpoint.eval_path
        self.error_metrics_path = checkpoint.error_metrics_path
        self.error_metrics = checkpoint.error_metrics
        self.experiment_id = checkpoint.experiment_id
        self.is_active = checkpoint.is_active
