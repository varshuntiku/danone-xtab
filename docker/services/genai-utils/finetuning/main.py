from app.utils import base_infer, generate_sh, load_config_from_json, split


def main():
    sh_file_path = "/train_script.sh"
    config_file_path = "/train/config.json"

    # Load configuration from JSON file
    config = load_config_from_json(config_file_path)

    # Retrieve dataset path from command-line arguments
    dataset_path = config["dataset_path"]

    # Split dataset based on configuration and fetch out checkpoint data
    split(dataset_path, test_size=config["val_size"])
    base_infer(config=config)

    # Generate shell script for training
    generate_sh(sh_file_path=sh_file_path, config=config)
    # generate_export_sh(exportsh_file_path=export_model_path, config=config)


if __name__ == "__main__":
    main()
