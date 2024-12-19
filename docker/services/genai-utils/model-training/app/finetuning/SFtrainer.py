import logging

import pandas as pd
from genai.finetuning.finetuning.trainer import NucliOsSequenceTrainer

from .evaluate_helper import evaluate


def sftrainer(
    model_path,
    train_method,
    lora_config_dict,
    quantization_dict,
    base_dir,
    train_dataset,
    val_dataset,
    test_dataset,
    epochs,
    gradient_accumulation_steps,
    per_device_train_batch_size,
    learning_rate,
    dataset_text_field,
    max_seq_length,
    **kwargs,
):
    output_dir = f"{base_dir}/results"
    logging_dir = f"{base_dir}/logs"
    adapter_path = f"{base_dir}/adapter"
    model_save_path = f"{base_dir}/model"
    eval_path = f"{base_dir}/model_result"

    train_obj = NucliOsSequenceTrainer(
        model_path=model_path,
        train_method=train_method,
        lora_config_dict=lora_config_dict,
        quantization_dict=quantization_dict,
    )

    training_arguments = train_obj.TrainingParams(
        output_dir=output_dir,
        evaluation_strategy=kwargs.get("evaluation_strategy", "steps"),
        eval_steps=kwargs.get("eval_steps", 100),
        epochs=epochs,
        per_device_train_batch_size=per_device_train_batch_size,
        gradient_accumulation_steps=gradient_accumulation_steps,
        optim=kwargs.get("optim", "paged_adamw_32bit"),
        save_steps=kwargs.get("save_steps", 100),
        logging_steps=kwargs.get("logging_steps", 100),
        learning_rate=learning_rate,
        fp16=kwargs.get("fp16", True),
        max_grad_norm=kwargs.get("max_grad_norm", 0.3),
        logging_dir=logging_dir,
        logging_strategy=kwargs.get("logging_strategy", "steps"),
        warmup_ratio=kwargs.get("warmup_ratio", 0.03),
        group_by_length=kwargs.get("group_by_length", True),
        lr_scheduler_type=kwargs.get("lr_scheduler_type", "linear"),
    )

    train_obj.train_model(
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        training_arguments=training_arguments,
        dataset_text_field=dataset_text_field,
        max_seq_length=max_seq_length,
    )

    training_logs = train_obj.training_logs()  # need to save training logs somewhere
    logging.info(training_logs)

    logging.info(train_obj.evaluate_model())

    train_obj.save_adapter(path=adapter_path)

    train_obj.save_merged_model(path_to_save=model_save_path, adapter_path=adapter_path)

    test_data = pd.DataFrame(test_dataset["test"])
    eval_response_df = train_obj.eval_test_dataset(eval_dataset=test_data)  # need to save this eval dataset somewhere

    eval_report = evaluate(eval_response_df)
    eval_report.to_csv(f"{eval_path}/result.csv", index=True)
