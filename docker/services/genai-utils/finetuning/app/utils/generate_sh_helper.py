import json
import os

from app.utils import Adapter


# Function to load configuration from a JSON file
def load_config_from_json(json_file):
    with open(json_file, "r") as file:
        config = json.load(file)
    return config


# Function to generate shell script content based on configuration
def generate_shell_script(config):
    # Get LORA target using Adapter module
    lora_target = Adapter.get_adapter(config["model_name_or_path"])

    # Construct script content using configuration values
    script_content = (
        f"CUDA_VISIBLE_DEVICES=0 python3 app/src/train_bash.py "
        f"--stage {config['stage']} "
        f"--model_name_or_path {config['model_name_or_path']} "
        f"--use_fast_tokenizer {config['use_fast_tokenizer']} "
        f"--do_train "
        f"--dataset_dir {config['dataset_dir']} "
        f"--dataset {config['dataset']} "
        f"--template {config['template'] if 'template' in config else 'default'} "
        f"--finetuning_type {config['finetuning_type']} "
        f"--lora_rank {config['lora_rank']} "
        f"--lora_target {','.join(lora_target)} "
        f"--output_dir {config['output_dir']} "
        f"--overwrite_output_dir {config['overwrite_output_dir']} "
        f"--overwrite_cache {config['overwrite_cache']} "
        f"--val_size {config['val_size']} "
        f"--per_device_train_batch_size {config['per_device_train_batch_size']} "
        f"--gradient_accumulation_steps {config['gradient_accumulation_steps']} "
        f"--lr_scheduler_type {config['lr_scheduler_type']} "
        f"--logging_steps {config['logging_steps']} "
        f"--save_steps {config['save_steps']} "
        f"--learning_rate {config['learning_rate']} "
        f"--num_train_epochs {config['num_train_epochs']} "
        f"--plot_loss "
        f"--do_eval {True} "
        f"--eval_steps {config['logging_steps']} "
        f"--evaluation_strategy steps "
        f"--bf16 {True} "
        if config.get("gpu_type") == "a100"
        else "" f"--save_safetensors {True} " f"--fp16 {True} "
        if config.get("gpu_type") == "t4"
        else ""
    )

    return script_content


def generate_eval_model(config):
    adapter_name = config["adapter_dir"]
    export_size = 2
    export_legacy_format = False
    save_directory = "./"
    script_content = (
        f"python3 app/src/eval_checkpoint.py "
        f"--model_name_or_path {config['model_name_or_path']} "
        f"--adapter_name_or_path {adapter_name} "
        f"--template {config['template']} "
        f"--finetuning_type {config['finetuning_type']} "
        f"--output_dir {save_directory} "
        f"--export_size {export_size} "
        f"--export_legacy_format {export_legacy_format} "
    )
    return script_content


# Function to generate shell script file
def generate_sh(sh_file_path, config):
    script_content = generate_shell_script(config)
    print(sh_file_path)
    print(script_content)
    try:
        # Writing the script content to the shell script file
        with open(sh_file_path, "w") as script_file:
            script_file.write(script_content)
        file_directory = os.path.dirname(sh_file_path)

        print("Shell script file created successfully at:", sh_file_path)
        print("Directory:", file_directory)
    except Exception as e:
        print("An error occurred while creating the shell script file:", e)


def generate_eval_sh(eval_file_path, config):
    script_content = generate_eval_model(config)
    try:
        with open(eval_file_path, "w") as script_file:
            script_file.write(script_content)
        file_directory = os.path.dirname(eval_file_path)

        print("Shell script file created successfully at:", eval_file_path)
        print("Directory:", file_directory)
    except Exception as e:
        print("An error occurred while creating the shell script file:", e)
