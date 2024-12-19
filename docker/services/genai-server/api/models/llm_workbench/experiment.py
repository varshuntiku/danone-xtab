from api.databases.base_class import mapper_registry
from api.models.mixins import BaseModelMixin
from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship


@mapper_registry.mapped
class LLMExperimentSetting(BaseModelMixin):
    __tablename__ = "llm_experiment_setting"

    peft_method = Column(String(255), nullable=True)
    quantization = Column(Boolean, default=False)
    gradient_acc_steps = Column(Integer, nullable=True)
    logging_steps = Column(Integer, nullable=True)
    save_steps = Column(Integer, nullable=True)
    lr_scheduler_type = Column(String(255), nullable=True)
    lora_alpha = Column(Integer, nullable=True)
    lora_rank = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=False)

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMExperiment(BaseModelMixin):
    __tablename__ = "llm_experiment"

    name = Column(String(500))
    problem_type = Column(String(255), nullable=True)
    epochs = Column(Integer, nullable=True)
    test_size = Column(Float, nullable=True)
    batch_size = Column(Integer, nullable=True)
    max_tokens = Column(Integer, nullable=True)
    learning_rate = Column(Float, nullable=True)
    error_metric_type = Column(String(255), nullable=True)
    status = Column(String(255), nullable=True)
    experiment_settings_id = Column(Integer, ForeignKey("llm_experiment_setting.id"))
    experiment_settings = relationship("LLMExperimentSetting", backref="experiments")
    dataset_id = Column(Integer, ForeignKey("llm_data_registry.id"))
    dataset = relationship("LLMDataRegistry", backref="experiments")
    compute_id = Column(Integer, ForeignKey("llm_compute_config.id"))
    compute = relationship("LLMComputeConfig", backref="experiments")
    model_id = Column(Integer, ForeignKey("llm_model_registry.id"))
    model = relationship("LLMModelRegistry", backref="experiments")

    # __table_args__ = (UniqueConstraint("name", name="uq_supported_model_name"),)


@mapper_registry.mapped
class LLMExperimentResult(BaseModelMixin):
    __tablename__ = "llm_experiment_result"

    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_results")
    accuracy = Column(Float, nullable=True)
    run_time = Column(Integer, nullable=True)
    log_path = Column(String(500), nullable=True)
    error_metrics = Column(Text, nullable=True)  # list of string
    train_loss = Column(Text, nullable=True)  # list of string
    deep_dive = Column(Text, nullable=True)  # list of string
    checkpoint_log_path = Column(String(500), nullable=True)  # checkpoint_log.jsonl path
    is_active = Column(Boolean, default=False)
    # training_result = Column(Text,nullable=True)


@mapper_registry.mapped
class LLMExperimentCheckpoint(BaseModelMixin):
    __tablename__ = "llm_experiment_checkpoint"

    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_checkpoints")
    name = Column(String(255))
    model_path = Column(String(255), nullable=True)  # checkpoint args path
    checkpoint_path = Column(String(255), nullable=True)  # checkpoint folder path
    train_result_path = Column(String(255), nullable=True)  # checkpoint csv path
    error_metrics_path = Column(String(255), nullable=True)  # checkpoint json path
    eval_path = Column(String(255), nullable=True)
    eval_status = Column(String(255), nullable=True)
    eval_result = Column(Text, nullable=True)
    error_metrics = Column(Text, nullable=True)
    is_active = Column(Boolean, default=False)


@mapper_registry.mapped
class LLMExperimentRunTracer(BaseModelMixin):
    __tablename__ = "llm_experiment_run_tracer"

    experiment_id = Column(Integer, ForeignKey("llm_experiment.id"))
    experiment = relationship("LLMExperiment", backref="experiment_run_tracers")
    pod_name = Column(String(255))
    container_name = Column(String(255), nullable=True)
    pod_status = Column(String(255), nullable=True)
    namespace = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False)
