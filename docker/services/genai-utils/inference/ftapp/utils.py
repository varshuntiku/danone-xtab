import os

# def generate_shell_script(config):
#     # Construct script content using configuration values
#     script_content = (
#         f"CUDA_VISIBLE_DEVICES=0 python3 /code/ftapp/deploy.py "
#         f"--model_name_or_path {config['model_name_or_path']} "
#         f"--template {config['template']} "
#         f"--adapter_name_or_path {config['adapter_name_or_path']} " if 'adapter_name_or_path' in config else ""
#         f"--quantization_bit {config['quantization_bit']} " if 'quantization_bit' in config else ""
#         f"--quantization_type {config['BNB_4BIT_QUANT_TYPE']} "if 'BNB_4BIT_QUANT_TYPE' in config else ""
#         f"--output_dir abcd "
#     )

#     return script_content


def generate_shell_script(config):
    # Construct script content using configuration values
    script_content = (
        f"CUDA_VISIBLE_DEVICES=0 python3 /code/ftapp/deploy.py "
        f"--model_name_or_path {config['model_name_or_path']} "
        f"--template {config['template']} "
    )

    if "adapter_name_or_path" in config:
        script_content += f"--adapter_name_or_path {config['adapter_name_or_path']} "

    if "quantization_bit" in config:
        script_content += f"--quantization_bit {config['quantization_bit']} "

    if "BNB_4BIT_QUANT_TYPE" in config:
        script_content += f"--quantization_type {config['BNB_4BIT_QUANT_TYPE']} "

    # script_content += "--output_dir abcd"  # Always add this parameter

    return script_content


def deploy_sh(sh_file_path, config):
    script_content = generate_shell_script(config)
    print(sh_file_path)
    print(script_content)
    print(os.getcwd())
    try:
        # Writing the script content to the shell script file
        with open(sh_file_path, "w") as script_file:
            script_file.write(script_content)
        file_directory = os.path.dirname(sh_file_path)

        print("Shell script file created successfully at:", sh_file_path)
        print("Directory:", file_directory)
    except Exception as e:
        print("An error occurred while creating the shell script file:", e)
