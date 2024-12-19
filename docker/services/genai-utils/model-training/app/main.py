import logging

# from app.finetuning.evaluate import evaluate
from finetuning.SFtrainer import sftrainer
from utils.config import get_settings

from ...genai.finetuning.utils.dataset_loader import load_jsonl

config_path = "/finetune/config.json"
settings = get_settings(config_path)
logging.debug(settings)
tags_metadata = []


if __name__ == "__main__":
    base_dir = settings.BASE_OUTPUT_DIR
    train_dataset_path = f"{base_dir}/data/train.jsonl"
    val_dataset_path = f"{base_dir}/data/val.jsonl"
    test_dataset_path = f"{base_dir}/data/test.jsonl"

    train_dataset = load_jsonl(file_path=train_dataset_path, dataset_name="train")
    val_dataset = load_jsonl(file_path=val_dataset_path, dataset_name="validation")
    test_dataset = load_jsonl(file_path=test_dataset_path, dataset_name="test")

    lora_config_dict = {
        "lora_alpha": settings.LORA_ALPHA,
        "lora_dropout": settings.LORA_DROPOUT,
        "r": settings.LORA_R,
        "bias": settings.LORA_BIAS,
        "task_type": settings.LORA_TASK_TYPE,
    }

    quantization_dict = {
        "load_in_8bit": settings.LOAD_IN_8BIT,
        "load_in_4bit": settings.LOAD_IN_4BIT,
        "llm_int8_threshold": settings.LLM_INT8_THRESHOLD,
        "llm_int8_has_fp16_weight": settings.LLM_INT8_HAS_FP16_WEIGHTS,
        "bnb_4bit_quant_type": settings.BNB_4BIT_QUANT_TYPE,
        "bnb_4bit_use_double_quant": settings.BNB_4BIT_USE_DOUBLE_QUANT,
    }

    sftrainer(
        model_path=settings.MODEL_PATH,
        train_method=settings.TRAIN_METHOD,
        lora_config_dict=lora_config_dict,
        quantization_dict=quantization_dict,
        base_dir=base_dir,
        evaluation_strategy=settings.EVALUATION_STRATEGY,
        eval_steps=settings.EVAL_STEPS,
        epochs=settings.EPOCHS,
        per_device_train_batch_size=settings.BATCH_SIZE,
        gradient_accumulation_steps=settings.GRADIENT_ACCUMULATION_STEPS,
        optim=settings.OPTIMIZER,
        save_steps=settings.SAVE_STEPS,
        logging_steps=settings.LOGGING_STEPS,
        learning_rate=settings.LEARNING_RATE,
        fp16=settings.FP16,
        max_grad_norm=settings.MAX_GRAD_NORM,
        logging_strategy=settings.LOGGING_STRATEGY,
        warmup_ratio=settings.WARMUP_RATIO,
        group_by_length=settings.GROUP_BY_LENGTH,
        lr_scheduler_type=settings.LR_SCHEDULAR_TYPE,
        train_dataset=train_dataset,
        test_dataset=test_dataset,
        dataset_text_field=settings.DATASET_TEXT_FIELD,
        max_seq_length=settings.MAX_SEQ_LENGTH,
    )
